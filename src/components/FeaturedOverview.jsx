import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { overviewItems } from "../data/overviewData";
import { deferredImageProps } from "../utils/mediaPriority";
import { publicAsset } from "../utils/publicAsset";
import "./FeaturedOverview.css";

/**
 * 系统目录模块(index / 系统目录)—— "扇形抽牌 / 转盘放大" 效果
 * ------------------------------------------------------------
 * 左上角是一个很大的 "INDEX" 标题 + "/ SYSTEM DIRECTORY" 说明;
 * 右上角是一小块像杂志角标一样的文字说明(手写体标语 + 品牌信息);
 * 中间是完整的 5 张"票根卡片"(编号、标题、真实图片、标签、
 * 底部分类,信息全都在)。
 *
 * 平时(没有鼠标悬停):就已经是"中间那张最大、越往两边越小"的
 * 扇形——不是所有牌都一样大,而是天生就有近大远小的透视感,
 * 像现实里摊开的一手扑克牌。
 *
 * 鼠标移到(或键盘聚焦到)哪一张:
 * - "谁最大"这件事会从中间那张切换到被选中的这张:它会摆正、
 *   真正移动到最中间的位置,并且再多放大 10%(有一种"转盘对焦
 *   放大"的特效感);
 * - 其他几张仍然按同一套"离被选中的牌隔了几张"的规则依次变小、
 *   转得更斜、往后退——只是圆心从"中间那张"换成了"被选中的
 *   那张",所以平时的样子和悬停后的样子是同一套逻辑,只是圆心
 *   不一样,不会有"平时和悬停判若两个效果"的割裂感;
 * - 也可以直接按住鼠标左右拖动,整手牌会跟着手指/鼠标滑动
 *   (拖动之后松手不会误触发跳转,真的"点一下没拖动"才会跳转)。
 *
 * 这些位置全部用 framer-motion 的 spring 动画算出来,不是瞬间
 * 跳过去,所以感觉是"滑过去"而不是"抽动一下"。
 * 手机屏幕太窄摆不下扇形,会自动改回原来那种竖着排一列的样子
 * (看 CSS 里 960px 那个响应式断点)。
 * 最下面是一整条页脚说明文字。
 */
const HOVER_LIFT = -84; // 被悬停的牌往上弹出多少(px)
const DRAG_LIMIT = 260; // 左右能拖动的最大距离(px)

// "中间大、两边依次变小"效果的几个参数:不管是平时(圆心固定
// 在正中间那张)还是鼠标悬停(圆心换成被选中那张),都用同一套
// 规则算位置/角度/大小——离圆心隔了几张(distance),就挪多远、
// 转多斜、缩多少,隔得越远差别越明显,做出"扑克牌抽卡"的层次感。
const FOCUS_SCALE = 1.1; // 鼠标真的悬停在某张上时,那张再多放大到 1.1 倍(放大 10%)
const FOCUS_STEP_X = 168; // 离圆心每隔一张,水平方向多挪多少(px)
const FOCUS_STEP_Y = 14; // 离圆心每隔一张,往后退多少(px)
const FOCUS_STEP_ROTATE = 10; // 离圆心每隔一张,角度多斜多少(度),基础再加10°起步
// 注意:紧挨着中间的那一张(隔 1 张)不要一下子缩小太多,不然
// 中间到旁边这一步"掉"得太猛,扇形看起来有棱有角;隔得越远
// 再加大缩小幅度,这样整体过渡更圆润、更像一手自然摊开的牌。
// 下标就是"隔了几张"(absDistance):[中间自己, 隔1张, 隔2张, ...]。
const FOCUS_SCALE_DELTAS = [0, 0.08, 0.26, 0.4, 0.5];
const FOCUS_MIN_SCALE = 0.55; // 最外侧的牌最小缩到多少倍

// 之前弹簧太"快",鼠标刚划过去卡片就已经滑走了,很难精准点中
// 自己想要的那张——把 stiffness(弹簧硬度)调低、mass(重量感)
// 调高,让整个滑动过程明显变慢、更沉稳,给手一点反应时间。
const SPRING = { type: "spring", stiffness: 120, damping: 26, mass: 1.3 };

export default function FeaturedOverview() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dragX, setDragX] = useState(0);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startOffset: 0,
    moved: false,
    captured: false,
    pointerId: null,
    target: null,
  });

  const mid = (overviewItems.length - 1) / 2;

  function getCardAnimate(i) {
    const isHovering = hoveredIndex !== null;
    // 平时圆心固定在正中间那张(mid);鼠标悬停后,圆心换成被
    // 选中的那张——除了这一点,平时和悬停用的是完全同一套算法。
    const focusIndex = isHovering ? hoveredIndex : mid;
    const distance = i - focusIndex;
    const absDistance = Math.abs(distance);
    // 只有真的悬停在某张牌上,那张才会"再多放大 10%、往上弹出";
    // 平时中间那张保持原大小就好,不会看起来像已经被选中了。
    const baseScale = isHovering ? FOCUS_SCALE : 1;
    const liftY = isHovering ? HOVER_LIFT : 0;

    if (distance === 0) {
      return { x: dragX, y: liftY, rotate: 0, scale: baseScale, zIndex: 100 };
    }

    const dir = distance > 0 ? 1 : -1;
    const delta =
      FOCUS_SCALE_DELTAS[absDistance] ??
      FOCUS_SCALE_DELTAS[FOCUS_SCALE_DELTAS.length - 1] + (absDistance - (FOCUS_SCALE_DELTAS.length - 1)) * 0.12;
    const scale = Math.max(FOCUS_MIN_SCALE, baseScale - delta);
    return {
      x: dragX + dir * absDistance * FOCUS_STEP_X,
      y: absDistance * FOCUS_STEP_Y,
      rotate: dir * (FOCUS_STEP_ROTATE * 0.6 + absDistance * FOCUS_STEP_ROTATE),
      scale,
      zIndex: 100 - absDistance,
    };
  }

  // 之前这里一按下(哪怕只是想点一下,没打算拖)就立刻
  // setPointerCapture,把这次交互"抢"到了最外层的 .directory-fan
  // 上——结果卡片(<a> 标签)自己的点击跳转反而经常触发不了,
  // 这就是"点卡片没反应"的真正原因。现在改成"真的挪动超过一点
  // 距离,才算开始拖、才去抢这个 pointer capture";只是单纯点一下
  // 松手,从头到尾都不会进入"拖动"状态,点击自然能正常生效。
  const DRAG_THRESHOLD = 6; // 超过这个像素才算真的在拖,而不是手抖

  function handlePointerDown(e) {
    dragRef.current.dragging = true;
    dragRef.current.moved = false;
    dragRef.current.captured = false;
    dragRef.current.startX = e.clientX;
    dragRef.current.startOffset = dragX;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.target = e.currentTarget;
  }

  function handlePointerMove(e) {
    if (!dragRef.current.dragging) return;
    const delta = e.clientX - dragRef.current.startX;
    if (Math.abs(delta) > DRAG_THRESHOLD) {
      dragRef.current.moved = true;
      // 只有真的开始拖了,才去抢 pointer capture,不影响正常点击。
      if (!dragRef.current.captured) {
        dragRef.current.captured = true;
        dragRef.current.target?.setPointerCapture?.(dragRef.current.pointerId);
      }
    }
    if (!dragRef.current.moved) return;
    const next = Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, dragRef.current.startOffset + delta));
    setDragX(next);
  }

  function handlePointerUp() {
    if (dragRef.current.captured && dragRef.current.target) {
      dragRef.current.target.releasePointerCapture?.(dragRef.current.pointerId);
    }
    dragRef.current.dragging = false;
    dragRef.current.captured = false;
  }

  function handleCardClick(e, target) {
    // 刚刚是拖动手势,不是真的点击——拦下这次跳转,不然一松手会
    // 顺带"点到"底下那张卡。
    if (dragRef.current.moved) {
      e.preventDefault();
      return;
    }
    // 真的是点击:自己用 JS 平滑滚动过去,不依赖浏览器原生的锚点
    // 跳转(锚点跳转在个别浏览器 + pointer capture 混在一起时不够
    // 可靠),这样点击跳转这件事更稳。
    e.preventDefault();
    const section = document.getElementById(target);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      id="work"
      className="section directory-section"
      style={{ "--directory-image": `url(${publicAsset("/placeholders/landscape-01.svg")})` }}
    >
      {/* 上一个模块(首屏视频)结尾是接近全黑的画面,这个模块一开始
          就是带图案的深红背景图,两块颜色/明暗直接拼在一起,交界处
          会看到一条很明显的分界线——加一条"从纯黑慢慢淡出"的
          渐变,盖在背景图最上面,把两个模块的颜色自然接起来。 */}
      <div className="directory-top-fade" aria-hidden="true" />
      <div className="directory-noise" aria-hidden="true" />
      <div className="container directory-container">
        <div className="directory-topbar">
          <div className="directory-title-block">
            <div className="directory-title-row">
              <h2 className="directory-mega-title">INDEX</h2>
              <div className="directory-subtitle">
                <span className="directory-subtitle-cn">系统目录</span>
                <span className="mono-label">/ SYSTEM DIRECTORY</span>
                <span className="mono-label directory-subtitle-sub">PORTFOLIO NAVIGATION 2026</span>
              </div>
            </div>
            <div className="directory-tabs mono-label">
              <span className="directory-dot is-on" />
              <span className="directory-dot is-on" />
              <span className="directory-dot" />
              <span>ART / DESIGN / AI / FASHION / IDEAS</span>
            </div>
          </div>

          <div className="directory-info-block">
            <div className="directory-scribble">
              Good design
              <br />
              better tomorrow
            </div>
            <div className="directory-info-mono mono-label">
              VISUALIZE IDEAS
              <br />
              FOR A BRIGHTER
              <br />
              TOMORROW
            </div>
            <div className="directory-info-divider" />
            <div className="directory-info-brand">
              <span className="mono-label">
                CREATIVE
                <br />
                PORTFOLIO
                <br />
                2026
              </span>
              <svg className="directory-globe" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.4" />
                <ellipse cx="16" cy="16" rx="5.5" ry="13" stroke="currentColor" strokeWidth="1.2" />
                <path d="M3 16H29" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 9H27" stroke="currentColor" strokeWidth="1" />
                <path d="M5 23H27" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <div className="directory-info-list mono-label">
              IDEA
              <br />
              VISUAL
              <br />
              PRODUCT
              <br />
              CULTURE
            </div>
          </div>
        </div>

        <motion.div
          className="directory-fan"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            dragRef.current.dragging = false;
            setHoveredIndex(null);
          }}
        >
          {overviewItems.map((item, i) => {
            const anim = getCardAnimate(i);
            return (
              // 注意: .ticket-card-slot 自己有 transform(translateX),
              // 这会在 CSS 里创建一个新的"层叠上下文",把子元素的
              // z-index 关在这个上下文里面——如果 z-index 只写在里面
              // 的卡片上,浏览器还是会按 DOM 先后顺序来叠(后面的卡永远
              // 盖住前面的卡),鼠标移上去也顶不到最前面。所以 z-index
              // 必须写在 slot 这一层,才能真正控制"谁盖住谁"。
              <div key={item.id} className="ticket-card-slot" style={{ zIndex: anim.zIndex }}>
                {/* 卡片内容直接用你给的那张完整票根截图本身
                    (item.cardImage),不再用代码重新画一遍编号/标题/
                    标签这些——避免代码画出来的效果跟你要的对不上。 */}
                <motion.a
                  href={`#${item.target}`}
                  className={`ticket-card tone-${item.tone}`}
                  animate={{ x: anim.x, y: anim.y, rotate: anim.rotate, scale: anim.scale }}
                  transition={SPRING}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onFocus={() => setHoveredIndex(i)}
                  onBlur={() => setHoveredIndex((prev) => (prev === i ? null : prev))}
                  onClick={(e) => handleCardClick(e, item.target)}
                >
                  <img
                    className="ticket-card-image"
                    src={item.cardImage}
                    alt={`${item.titleEn} / ${item.titleCn}`}
                    draggable={false}
                    {...deferredImageProps}
                  />
                </motion.a>
              </div>
            );
          })}
        </motion.div>

        {/* 圆形数字按钮(1-5):位置永远固定不动,不会像卡片那样
            悬停时跑掉——如果实在点不准某张卡,直接点这里对应的
            数字也能跳到同一个板块,鼠标移上去还会让扇形里对应的
            那张卡跟着放大预览一下。 */}
        <div className="directory-fan-nav">
          {overviewItems.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.target}`}
              className={`directory-fan-dot${hoveredIndex === i ? " is-active" : ""}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onFocus={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex((prev) => (prev === i ? null : prev))}
              onBlur={() => setHoveredIndex((prev) => (prev === i ? null : prev))}
            >
              {i + 1}
            </a>
          ))}
        </div>

        <div className="mono-label directory-fan-hint">
          按住鼠标左右拖动 / 移到卡片上让它弹出摆正 · 点击进入对应板块
        </div>

        <div className="directory-bottombar mono-label">
          <div className="directory-bottom-left">
            <span>
              A VISUAL ARCHIVE
              <br />
              OF CURIOSITY
              <br />
              AND CREATION.
            </span>
            <div className="directory-barcode-small" aria-hidden="true" />
            <span>IDEAS TRAVEL FURTHER.</span>
          </div>
          <div className="directory-bottom-center">
            <span className="directory-hr" />
            KEEP EXPLORING / · KEEP CREATING
            <span className="directory-hr" />
          </div>
          <div className="directory-bottom-right">
            <span>
              DESIGN CONNECTS
              <br />
              WORLDS.
            </span>
            <span>+ 2026 PORTFOLIO</span>
          </div>
        </div>
      </div>
    </section>
  );
}
