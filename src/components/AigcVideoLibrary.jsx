import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { aigcIntro, aigcVideos } from "../data/aigcVideoData";
import { siteInfo } from "../data/siteConfig";
import { deferredImageProps, deferredVideoProps } from "../utils/mediaPriority";
import "./AigcVideoLibrary.css";

// 播放器右上角"放大"按钮的图标:四个角的小折线,点一下放大,
// 再点一下(这时候图标换成叉号)退出放大模式。
function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4H5a1 1 0 0 0-1 1v4" />
      <path d="M15 4h4a1 1 0 0 1 1 1v4" />
      <path d="M9 20H5a1 1 0 0 1-1-1v-4" />
      <path d="M15 20h4a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/**
 * AIGC 视频库 —— "CD 唱片架 + 右侧播放器" 板块
 * ------------------------------------------------------------
 * 左边 6 张CD,点哪张哪张就被选中(会有红色发光边框),
 * 同时圆盘开始转动、右边播放器切换成这一条的内容并开始播放;
 * 右边暂停按钮点一下,圆盘就停止转动,再点一下继续转。
 *
 * 演示数据带有本地占位视频(videoSrc 有值),右边播放区会使用
 * <video>:点封面上的播放键/圆盘,就切换到那一条并开始播放。
 * 如果某一条 videoSrc 是空字符串,就退回到"封面图 + 模拟进度"
 * 的占位效果,不会报错。
 */

function parseDuration(str) {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + s;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AigcVideoLibrary() {
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // 播放器是否处于"放大居中"模式:true 的时候,播放器跳到网页
  // 正中间放大显示,左边的CD架变成竖排一列、整体虚焦(模糊+变暗)。
  const [isExpanded, setIsExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(1);
  const [mutedVolume, setMutedVolume] = useState(0);
  const tickRef = useRef(null);
  const videoRef = useRef(null);

  const current = aigcVideos[selected];
  const hasVideo = Boolean(current.videoSrc);
  const durationSeconds = parseDuration(current.duration);

  function selectVideo(index) {
    setSelected(index);
    setElapsed(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying((p) => !p);
  }

  // 没有视频文件的条目,退回到计时器模拟进度条
  useEffect(() => {
    if (hasVideo || !isPlaying) return;
    tickRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= durationSeconds) {
          setIsPlaying(false);
          return durationSeconds;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [hasVideo, isPlaying, durationSeconds]);

  // 视频存在时:isPlaying 变化会同步控制 <video> 播放/暂停
  useEffect(() => {
    if (!hasVideo) return;
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      el.play().catch(() => setIsPlaying(false));
    } else {
      el.pause();
    }
  }, [hasVideo, isPlaying, selected]);

  useEffect(() => {
    setElapsed(0);
  }, [selected]);

  // 音量同步到 <video>;没有视频的条目会安全跳过
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume, selected]);

  function goRelative(delta) {
    const next = (selected + delta + aigcVideos.length) % aigcVideos.length;
    selectVideo(next);
  }

  function handleSeek(e) {
    const next = Number(e.target.value);
    setElapsed(next);
    if (hasVideo && videoRef.current) videoRef.current.currentTime = next;
  }

  function toggleMute() {
    if (volume > 0) {
      setMutedVolume(volume);
      setVolume(0);
    } else {
      setVolume(mutedVolume || 1);
    }
  }

  const progressPct = durationSeconds ? Math.min(100, (elapsed / durationSeconds) * 100) : 0;
  const remaining = Math.max(0, durationSeconds - elapsed);

  return (
    <section id="media" className="section aigc-section">
      <div className="container">
        <div className="aigc-header">
          <div>
            <div className="section-eyebrow">
              <span className="dot" />
              {aigcIntro.eyebrow}
            </div>
            <h2 className="section-title">
              {aigcIntro.titleEn}
              <span className="cjk">{aigcIntro.titleCn}</span>
            </h2>
            <div className="mono-label aigc-tag">{aigcIntro.tag}</div>
          </div>
          <div className="mono-label aigc-note">
            {aigcIntro.note.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>

        <div className="aigc-layout">
          {/* 播放器放大的时候,这一列整体虚焦(模糊 + 变暗、竖着排成
              一列、间距拉均匀),把视觉重心让给中间放大的播放器;
              自己选中的那张、或者鼠标移上去的那张会恢复清晰,
              还是可以正常点击切换。 */}
          <div className={`aigc-grid${isExpanded ? " is-unfocused" : ""}`}>
            {aigcVideos.map((v, i) => {
              const isSelected = i === selected;
              const spinning = isSelected && isPlaying;
              return (
                <motion.button
                  key={v.id}
                  className={`aigc-disc${isSelected ? " is-selected" : ""}`}
                  onClick={() => selectVideo(i)}
                  whileHover={{ y: -14, rotate: 3, scale: 1.04 }}
                  whileTap={{ scale: 0.97, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  style={{ transformOrigin: "50% 100%" }}
                >
                  <span className="aigc-disc-case">
                    <img className="aigc-disc-case-bg" src={v.cover} alt="" aria-hidden="true" {...deferredImageProps} />
                    <motion.img
                      className="aigc-disc-spin"
                      src={v.disc}
                      alt={`${v.titleEn} cover`}
                      {...deferredImageProps}
                      animate={spinning ? { rotate: 360 } : { rotate: 0 }}
                      transition={
                        spinning
                          ? { repeat: Infinity, ease: "linear", duration: 4 }
                          : { duration: 0.4 }
                      }
                    />
                  </span>
                  <span className="aigc-disc-id mono-label">{v.id}</span>
                  <span className="aigc-disc-info">
                    <span className="aigc-disc-title">{v.titleEn}</span>
                    <span className="aigc-disc-duration mono-label">{v.duration}</span>
                  </span>
                  <span className="mono-label aigc-disc-tags">{v.tags.join(" / ")}</span>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            layout
            transition={{ type: "spring", stiffness: 220, damping: 30 }}
            className={`aigc-player glass${isExpanded ? " is-expanded" : ""}`}
          >
            <div className="aigc-player-head">
              <span className="mono-label">SELECTED MOTION {current.id.replace("V-", "")}</span>
              <span className="mono-label aigc-player-tags">{current.tags.join(" / ")}</span>
            </div>

            <div className="aigc-player-screen-wrap">
              <button className="aigc-player-screen" onClick={togglePlay} aria-label="播放 / 暂停">
                {hasVideo ? (
                  <video
                    key={current.id}
                    ref={videoRef}
                    src={current.videoSrc}
                    poster={current.poster || current.cover}
                    playsInline
                    {...deferredVideoProps}
                    onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
                    onEnded={() => {
                      setIsPlaying(false);
                      setElapsed(durationSeconds);
                    }}
                  />
                ) : (
                  <img src={current.poster || current.cover} alt={current.titleEn} {...deferredImageProps} />
                )}
                {!isPlaying && (
                  <span className="aigc-player-playhint">
                    <span className="aigc-play-triangle" />
                  </span>
                )}
              </button>
              <button
                type="button"
                className="aigc-expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded((v) => !v);
                }}
                aria-label={isExpanded ? "退出放大模式" : "居中放大播放"}
              >
                {isExpanded ? <CloseIcon /> : <ExpandIcon />}
              </button>
            </div>

            <div className="aigc-player-deck">
              <div className="aigc-scrub-row">
                <span className="mono-label aigc-scrub-time">{formatTime(elapsed)}</span>
                <input
                  className="aigc-scrub-input"
                  type="range"
                  min={0}
                  max={durationSeconds || 0}
                  step={0.1}
                  value={Math.min(elapsed, durationSeconds || 0)}
                  onChange={handleSeek}
                  style={{ "--pct": `${progressPct}%` }}
                  aria-label="播放进度"
                />
                <span className="mono-label aigc-scrub-time aigc-scrub-time-remaining">
                  -{formatTime(remaining)}
                </span>
              </div>

              <div className="aigc-player-buttons">
                <button aria-label="上一条" onClick={() => goRelative(-1)}>
                  <span className="aigc-icon-prev" />
                </button>
                <button className="aigc-player-toggle" aria-label="播放 / 暂停" onClick={togglePlay}>
                  {isPlaying ? <span className="aigc-icon-pause" /> : <span className="aigc-icon-play" />}
                </button>
                <button aria-label="下一条" onClick={() => goRelative(1)}>
                  <span className="aigc-icon-next" />
                </button>
              </div>

              <div className="aigc-volume-row">
                <button className="aigc-icon-btn" aria-label="静音" onClick={toggleMute}>
                  <span className="aigc-icon-speaker" />
                </button>
                <input
                  className="aigc-volume-input"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  style={{ "--pct": `${volume * 100}%` }}
                  aria-label="音量"
                />
                <button className="aigc-icon-btn" aria-label="音量最大" onClick={() => setVolume(1)}>
                  <span className="aigc-icon-speaker aigc-icon-speaker--loud" />
                </button>
              </div>
            </div>

            <div className="aigc-player-footer">
              <div>
                <div className="aigc-player-title">{current.titleEn}</div>
                <div className="mono-label aigc-player-subtags">{current.tags.join(" / ")}</div>
              </div>
              <a href="#work" className="btn btn-solid aigc-player-cta">
                PLAY PROJECT
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </motion.div>

          {/* 放大模式的深色蒙层,盖住整个页面,点一下蒙层也能退出放大 */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="aigc-expand-backdrop"
                className="aigc-expand-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsExpanded(false)}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="aigc-footer mono-label">
          <span>{aigcVideos.length} WORKS IN THIS COLLECTION</span>
          <span>{siteInfo.nameEn} — MOTION WORKS</span>
          <span>2024 — 2026</span>
        </div>
      </div>
    </section>
  );
}
