import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { siteInfo } from "../data/siteConfig";
import { profile } from "../data/profileData";
import { placeholderImage } from "../utils/placeholder";
import { onEnter } from "../utils/introGate";
import { priorityVideoProps } from "../utils/mediaPriority";
import { publicAsset } from "../utils/publicAsset";
import "./Hero.css";

// 视频还没加载出来之前,先用这张垫底,画面不会空白
const posterFallback = placeholderImage({
  title: "HERO VIDEO",
  sub: "REPLACE WITH YOUR VIDEO",
  width: 1920,
  height: 1080,
});

// 视频完整播完一遍之后,不整段重新跳回开头(那样会很突兀),
// 而是只在最后 3 秒之间来回循环——画面看起来更顺滑、不会"跳一下"。
const LOOP_TAIL_SECONDS = 3;

const roleList = [
  "Brand Visual 品牌视觉",
  "Interaction Design 交互设计",
  "AI Visual AI视觉",
  "Graphic & IP 图形与IP设计",
];

/**
 * 打字机效果的时间轴
 * ------------------------------------------------------------
 * 标题全部使用真实文字,统一走"一个字一个字敲出来"的逻辑。
 *
 * 四段内容按顺序一次排开,总共分成 TOTAL_TYPE_UNITS 份,平均分配
 * 到视频第一遍播放的总时长里——这样不管视频是几秒钟,打字都会
 * 刚好在视频播完第一遍的时候敲完最后一个字。
 */
const PORTFOLIO_TEXT = "Portfolio";
const TAG1_TEXT = "2026 SELECTED WORKS 精选作品";
const NAME_TEXT = siteInfo.nameEn;
const TAG2_TEXT = `${siteInfo.nameCn} · 个人作品集`;
const TOTAL_TYPE_UNITS =
  PORTFOLIO_TEXT.length + TAG1_TEXT.length + NAME_TEXT.length + TAG2_TEXT.length;

// 如果视频时长一直读不到(网络慢之类的情况),打字机就用这个默认
// 总时长兜底,不会一直卡在等待、什么都不显示。
const FALLBACK_DURATION_SECONDS = 8;
// 每一步之间最短间隔,防止视频特别短的时候打字快到肉眼看不清。
const MIN_STEP_MS = 16;
// 打字整体速度倍率——2 就是比"跟视频时长严格同步"快一倍敲完,
// 想再调快/调慢,改这一个数字就行。
const TYPE_SPEED_MULTIPLIER = 2;

export default function Hero() {
  const videoRef = useRef(null);
  const typingStartedRef = useRef(false);
  const typingTimerRef = useRef(null);

  const [revealedUnits, setRevealedUnits] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function startTyping() {
      if (typingStartedRef.current) return;
      typingStartedRef.current = true;

      const duration =
        video.duration && Number.isFinite(video.duration)
          ? video.duration
          : FALLBACK_DURATION_SECONDS;

      // 留一点点提前量(0.3秒),让最后一个字刚好在视频播完前敲完,
      // 而不是卡在视频最后一帧那一瞬间才出现,观感更从容一点;
      // 再除以 TYPE_SPEED_MULTIPLIER 让整体节奏更快。
      const totalMs = Math.max(
        (duration * 1000 - 300) / TYPE_SPEED_MULTIPLIER,
        TOTAL_TYPE_UNITS * MIN_STEP_MS
      );
      const stepMs = Math.max(totalMs / TOTAL_TYPE_UNITS, MIN_STEP_MS);

      let unit = 0;
      function tick() {
        unit += 1;
        setRevealedUnits(unit);
        if (unit < TOTAL_TYPE_UNITS) {
          typingTimerRef.current = setTimeout(tick, stepMs);
        }
      }
      typingTimerRef.current = setTimeout(tick, stepMs);
    }

    function handleTimeUpdate() {
      if (!video.duration) return;
      if (video.currentTime >= video.duration - 0.15) {
        video.currentTime = Math.max(video.duration - LOOP_TAIL_SECONDS, 0);
        video.play().catch(() => {});
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate);

    // 视频真正开始播放、打字机真正开始敲字,都要等到开屏动画
    // (IntroScreen)播完/用户点了 START 之后才触发——不然用户还在
    // 看开屏动画的时候,这些效果已经在背后偷偷播完了,等真正看到
    // 首页时反而什么都错过了。如果用户打开页面时开屏动画已经放过
    // 一次了(hasEntered() 为真),onEnter 会立刻执行,效果不受影响。
    const unsubscribe = onEnter(() => {
      video.play().catch(() => {});
      startTyping();
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      unsubscribe();
      clearTimeout(typingTimerRef.current);
      typingStartedRef.current = false;
    };
  }, []);

  const portfolioRevealed = Math.max(
    0,
    Math.min(revealedUnits, PORTFOLIO_TEXT.length)
  );
  const tag1Revealed = Math.max(
    0,
    Math.min(revealedUnits - PORTFOLIO_TEXT.length, TAG1_TEXT.length)
  );
  const nameRevealed = Math.max(
    0,
    Math.min(revealedUnits - PORTFOLIO_TEXT.length - TAG1_TEXT.length, NAME_TEXT.length)
  );
  const tag2Revealed = Math.max(
    0,
    Math.min(
      revealedUnits - PORTFOLIO_TEXT.length - TAG1_TEXT.length - NAME_TEXT.length,
      TAG2_TEXT.length
    )
  );
  const typingDone = revealedUnits >= TOTAL_TYPE_UNITS;

  let cursorAfter = "portfolio";
  if (revealedUnits >= PORTFOLIO_TEXT.length) cursorAfter = "tag1";
  if (revealedUnits >= PORTFOLIO_TEXT.length + TAG1_TEXT.length) cursorAfter = "name";
  if (revealedUnits >= PORTFOLIO_TEXT.length + TAG1_TEXT.length + NAME_TEXT.length)
    cursorAfter = "tag2";

  return (
    <section id="hero" className="hero-region">
      <div className="hero-sticky">
        <div
          className="hero-poster"
          style={{ backgroundImage: `url(${posterFallback})` }}
        />

        {/* 模板视频由开屏结束事件触发,让视频和打字机从同一刻开始。 */}
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          {...priorityVideoProps}
        >
          <source src={publicAsset("/placeholders/videos/02.mp4")} type="video/mp4" />
        </video>

        <div className="hero-vignette" />

        <div className="hero-content container">
          <div className="hero-title-block">
            <div className="hero-title-row">
              {/* 真文字逐字显现,方便使用者直接替换姓名与标题。 */}
              <span className="hero-title-word accent hero-title-portfolio">
                {PORTFOLIO_TEXT.slice(0, portfolioRevealed)}
                {cursorAfter === "portfolio" && !typingDone && (
                  <span className="hero-type-cursor" aria-hidden="true" />
                )}
              </span>
            </div>
            <div className="hero-cjk-tag">
              {TAG1_TEXT.slice(0, tag1Revealed)}
              {cursorAfter === "tag1" && !typingDone && (
                <span className="hero-type-cursor" aria-hidden="true" />
              )}
            </div>

            <div className="hero-title-row">
              <span className="hero-title-word plain">
                {NAME_TEXT.slice(0, nameRevealed)}
                {cursorAfter === "name" && !typingDone && (
                  <span className="hero-type-cursor" aria-hidden="true" />
                )}
              </span>
            </div>
            <div className="hero-cjk-tag">
              {TAG2_TEXT.slice(0, tag2Revealed)}
              {cursorAfter === "tag2" && !typingDone && (
                <span className="hero-type-cursor" aria-hidden="true" />
              )}
            </div>

            <ul className="hero-roles">
              {roleList.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>

            <motion.div
              className="hero-designby glass"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
            >
              <span className="mono-label">Design by</span>
              <strong>
                {siteInfo.nameEn} {siteInfo.nameCn}
              </strong>
            </motion.div>
          </div>

          <div className="hero-bottom-row">
            <div className="hero-contacts mono-label">
              {profile.contacts.map((c) => (
                <span key={c.label}>
                  {c.label} — {c.value}
                </span>
              ))}
            </div>

            <div className="hero-scroll-indicator">
              <span className="mono-label">SCROLL DOWN / 向下滑动</span>
              <span className="hero-scroll-arrow">↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
