import { useEffect } from "react";
import { playClick, playToggleSwitch } from "../utils/soundEngine";

/**
 * 全站点击音效
 * ------------------------------------------------------------
 * 不用给网站里每一个按钮/链接单独接一遍音效,这里在最外层统一
 * 监听一次点击事件,点到什么类型的元素就放对应的声音就行:
 * - 经历板块那种手风琴开关(.exp-row)——放一个稍微清脆一点的切换音
 * - 其它按钮 / 链接——放普通的"游戏按键"点击音
 * 这个组件本身不渲染任何东西,只是挂一个全局监听。
 */
export default function SoundManager() {
  useEffect(() => {
    function handleClick(event) {
      const toggle = event.target.closest(".exp-row");
      if (toggle) {
        playToggleSwitch();
        return;
      }
      const clickable = event.target.closest("a, button");
      if (clickable) {
        playClick();
      }
    }

    // 用捕获阶段监听,这样就算某个按钮内部代码里调用了
    // stopPropagation,声音也还是能正常放出来
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
