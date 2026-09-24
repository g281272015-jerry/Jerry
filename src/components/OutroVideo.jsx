import { useEffect, useRef, useState } from "react";
import { contactInfo } from "../data/contactData";
import { placeholderImage } from "../utils/placeholder";
import { deferredVideoProps } from "../utils/mediaPriority";
import { observeDeferredVideo } from "../utils/deferredVideoLoad";
import { publicAsset } from "../utils/publicAsset";
import "./OutroVideo.css";

// 视频还没加载出来之前,先用这张垫底,画面不会空白
const posterFallback = placeholderImage({
  title: "SIGN OFF",
  sub: "REPLACE THIS OUTRO MEDIA",
  accent: "#ff3c20",
  width: 1920,
  height: 1080,
});

/**
 * 全网站的"结尾场景" —— 放在最下面、联系方式模块前面。
 * ------------------------------------------------------------
 * 呼应开头 Hero 的动态影像:这里播放模板的结尾演示视频。
 * 使用"鼠标滚轮滑动播放":这一屏被拉长成好几屏高,
 * 视频本身固定(sticky)贴在屏幕上不动,画面播放进度直接跟着
 * 你滚动的距离走——往下滚就正常往前播,往上滚就倒着播放,
 * 松开鼠标停在哪里,画面就定格在哪一帧。滚到底(播完)的瞬间,
 * 设备屏幕上弹出可点击的联系按钮。
 *
 * 注意:按钮是网页里真实的 <a> 标签,不是画在视频里的,
 * 所以能真的点击跳转;按钮本身也去掉了实心背景,不会挡住
 * 视频画面里举着平板的手。
 */

// 视频原始尺寸(1920x1080)
const VIDEO_NATIVE_W = 1920;
const VIDEO_NATIVE_H = 1080;

// 平板屏幕在原始画面里的位置(比例,0~1)——如果以后换了一版新的
// 结尾视频,平板位置变了,改这四个数字就行
const TABLET_SCREEN = { left: 0.302, right: 0.755, top: 0.109, bottom: 0.611 };

// 按钮实际显示的范围要比平板屏幕稍微收进去一点,留出一圈安全边距,
// 避免正好盖住画面里手指/边框的位置(数值越大收得越多,0.06 = 收进 6%)
const SCREEN_INSET = 0.06;

// 按钮不是"滚到最后一帧才唰地跳出来",而是从滚动进度到 REVEAL_START
// 开始,一路跟着滚动条平滑地淡入放大,到 REVEAL_END(=1,也就是最后
// 一帧)完全显示——这样就不会有一大截"平板黑屏、什么都没有"的空档,
// 出现的过程也是跟手跟着滚动走的,不会显得突然。想让按钮更早/更晚
// 出现,调小/调大 REVEAL_START 就行。
const REVEAL_START = 0.68;
const REVEAL_END = 1;

// 视频用的是 object-fit:cover,这里手动算一遍 cover 的缩放/裁切规则,
// 这样才能让叠在上面的按钮永远精确对准视频画面里平板屏幕的位置,
// 不管窗口宽高怎么变都不会错位。
function computeCoverRect(containerW, containerH) {
  if (!containerW || !containerH) return null;
  const scale = Math.max(containerW / VIDEO_NATIVE_W, containerH / VIDEO_NATIVE_H);
  const renderedW = VIDEO_NATIVE_W * scale;
  const renderedH = VIDEO_NATIVE_H * scale;
  const offsetX = (containerW - renderedW) / 2;
  const offsetY = (containerH - renderedH) / 2;
  return { scale, offsetX, offsetY };
}

export default function OutroVideo() {
  const videoRef = useRef(null);
  const stickyRef = useRef(null);
  const regionRef = useRef(null);
  const deviceUiRef = useRef(null);

  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const mailLink =
    contactInfo.links.find((link) => link.label === "MAIL") || contactInfo.links[0];

  // 核心逻辑:滚轮滑动播放。
  // 这一屏(.outro-region)在 CSS 里被拉高到好几倍屏幕高度,
  // 视频本身用 position:sticky 贴住不动。滚动条在这一段区域里
  // 滚了多少比例,就直接把视频的播放进度设成同样的比例——
  // 往下滚 progress 变大(正常往前播),往上滚 progress 变小
  // (倒着播放),完全跟着鼠标滚轮走,不再是自动播放。
  //
  // 按钮的显示/隐藏也是在这同一个滚动回调里直接改 DOM 的 style
  // (不走 React state),这样滚动的时候不会每一帧都触发 React
  // 重新渲染,画面会顺滑很多,不容易卡。
  useEffect(() => {
    const video = videoRef.current;
    const region = regionRef.current;
    if (!video || !region) return;

    const stopDeferredLoadObserver = observeDeferredVideo({
      target: region,
      video,
    });

    let duration = video.duration || 0;
    function handleLoadedMetadata() {
      duration = video.duration || 0;
      // 用户可能通过 CONTACT 直接跳到结尾。元数据到达后立刻同步一次
      // 当前滚动位置，避免还要再滚一下才看到正确的视频画面。
      updateFromScroll();
    }
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    let ticking = false;
    function updateFromScroll() {
      ticking = false;
      if (!duration) return;
      const rect = region.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;
      const scrolledIntoRegion = -rect.top;
      const progress = Math.min(Math.max(scrolledIntoRegion / scrollableDistance, 0), 1);
      const targetTime = progress * duration;
      // 视频现在整段都是关键帧,seek 到任意时间点都很快,滚动
      // 才不会卡顿(如果浏览器支持 fastSeek,优先用它,更顺滑)。
      if (typeof video.fastSeek === "function") {
        video.fastSeek(targetTime);
      } else {
        video.currentTime = targetTime;
      }

      // 按钮的淡入淡出直接跟滚动进度挂钩,从 REVEAL_START 一路平滑
      // 过渡到 REVEAL_END,而不是到最后一刻才突然出现。
      const reveal = Math.min(
        Math.max((progress - REVEAL_START) / (REVEAL_END - REVEAL_START), 0),
        1
      );
      const uiEl = deviceUiRef.current;
      if (uiEl) {
        uiEl.style.opacity = String(reveal);
        uiEl.style.transform = `scale(${0.94 + 0.06 * reveal})`;
        uiEl.style.pointerEvents = reveal > 0.05 ? "auto" : "none";
      }
    }

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateFromScroll);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    // 进页面先算一次,保证初始画面(第一帧)、按钮状态都是对的
    updateFromScroll();

    return () => {
      stopDeferredLoadObserver();
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    function measure() {
      setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const coverRect = computeCoverRect(containerSize.w, containerSize.h);
  let deviceUiStyle = null;
  if (coverRect) {
    // 在原本的平板屏幕范围基础上,四周再往里收一点(SCREEN_INSET),
    // 让按钮离屏幕边缘/手指握着的地方留出安全距离。
    const screenW = TABLET_SCREEN.right - TABLET_SCREEN.left;
    const screenH = TABLET_SCREEN.bottom - TABLET_SCREEN.top;
    const insetLeft = TABLET_SCREEN.left + screenW * SCREEN_INSET;
    const insetRight = TABLET_SCREEN.right - screenW * SCREEN_INSET;
    const insetTop = TABLET_SCREEN.top + screenH * SCREEN_INSET;
    const insetBottom = TABLET_SCREEN.bottom - screenH * SCREEN_INSET;

    const left = coverRect.offsetX + insetLeft * VIDEO_NATIVE_W * coverRect.scale;
    const top = coverRect.offsetY + insetTop * VIDEO_NATIVE_H * coverRect.scale;
    const width = (insetRight - insetLeft) * VIDEO_NATIVE_W * coverRect.scale;
    const height = (insetBottom - insetTop) * VIDEO_NATIVE_H * coverRect.scale;
    const fitsOnScreen =
      left >= -4 && top >= -4 && left + width <= containerSize.w + 4 && width >= 240;
    if (fitsOnScreen) {
      deviceUiStyle = { left, top, width, height };
    }
  }

  return (
    <section id="outro" className="outro-region" ref={regionRef}>
      <div className="outro-sticky" ref={stickyRef}>
        <div
          className="outro-poster"
          style={{ backgroundImage: `url(${posterFallback})` }}
        />
        <video
          ref={videoRef}
          className="outro-video"
          muted
          playsInline
          {...deferredVideoProps}
        >
          <source src={publicAsset("/placeholders/videos/outro-loop.mp4")} type="video/mp4" />
        </video>

        {deviceUiStyle && (
          <div
            ref={deviceUiRef}
            className="outro-device-ui"
            style={{ ...deviceUiStyle, opacity: 1, pointerEvents: "auto" }}
          >
            <div className="outro-device-ui-eyebrow mono-label">CONTACT</div>
            {/* 参考图里的排版:前面几个字正常大小,后面的重点词直接
                放大一大截、变红,不是简单地"同样大小只是变个颜色"。
                下面再补一行小字说明(contactInfo.subCn)。这段文字是
                写死拆开的,以后如果改了这句话,记得同步改这里的拆分。 */}
            <div className="outro-device-ui-headline">
              一起做点<span className="outro-device-ui-accent">特别的设计</span>
            </div>
            <p className="outro-device-ui-sub">{contactInfo.subCn}</p>
            <div className="outro-device-ui-rows">
              {contactInfo.rows.map((row) => (
                <a
                  key={row.label}
                  href={row.href || "#outro"}
                  className="outro-device-ui-row"
                  // row.download 有值的话(比如"简历 CV"这一条)就是真的
                  // 文件下载链接,加上 download 属性,点击直接存文件到本地,
                  // 不会跳转/打开新标签页。
                  {...(row.download ? { download: row.download } : {})}
                >
                  <span className="mono-label">{row.label}</span>
                  <span className="outro-device-ui-value">{row.value}</span>
                </a>
              ))}
            </div>
            <a href={mailLink?.href || "#outro"} className="outro-device-ui-cta">
              START A CONVERSATION
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}

        <div className="outro-vignette" />

        <div className="outro-content container">
          <div className="outro-eyebrow mono-label">
            <span className="dot" aria-hidden="true" />
            10 — SIGN OFF / 全片结尾
          </div>
          <h2 className="outro-headline">
            {contactInfo.headlineEn}
            <br />
            {contactInfo.headlineEn2}
          </h2>
          <p className="outro-headline-cn">{contactInfo.headlineCn}</p>
        </div>
      </div>
    </section>
  );
}
