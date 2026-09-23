import { useEffect, useState } from "react";
import { isMuted, toggleMuted, unlockAudio, playClick } from "../utils/soundEngine";
import "./SoundToggle.css";

/**
 * 导航栏上的"音效开关"按钮
 * ------------------------------------------------------------
 * 不用 emoji(喇叭图标之类的),用几根跳动的小竖条做成一个简单的
 * 均衡器图案,风格上跟网站整体的极简/工业感更搭。点一下切换开关,
 * 状态会记住(下次打开网页还是原来的状态)。
 */
export default function SoundToggle() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  function handleClick() {
    unlockAudio();
    const nextMuted = toggleMuted();
    setMutedState(nextMuted);
    if (!nextMuted) playClick();
  }

  return (
    <button
      type="button"
      className={`sound-toggle mono-label${muted ? " is-muted" : ""}`}
      onClick={handleClick}
      aria-pressed={!muted}
      aria-label={muted ? "打开全站音效" : "关闭全站音效"}
    >
      <span className="sound-toggle-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="sound-toggle-label">SOUND {muted ? "OFF" : "ON"}</span>
    </button>
  );
}
