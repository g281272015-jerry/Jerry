import { motion } from "framer-motion";
import { siteInfo, sections } from "../data/siteConfig";
import SoundToggle from "./SoundToggle";
import "./Nav.css";

/**
 * 顶部导航栏
 * ------------------------------------------------------------
 * 固定在页面顶部,玻璃质感背景。点击链接会平滑滚动到对应模块
 * (用的是 html { scroll-behavior: smooth } + 锚点 <a href="#id">)。
 */
export default function Nav() {
  const navSections = sections.filter(
    (s) => s.enabled && s.id !== "hero" && s.id !== "outro"
  );

  return (
    <header className="nav-bar glass-strong">
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          <span className="nav-logo-mark">{siteInfo.shortTag}</span>
          <span className="nav-logo-text mono-label">{siteInfo.titleEn}</span>
        </a>

        <nav className="nav-links">
          {navSections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="nav-link mono-label">
              {s.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <SoundToggle />
          <motion.a
            href="#outro"
            className="btn btn-solid nav-contact"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 14 }}
          >
            Contact
            <span aria-hidden>↗</span>
          </motion.a>
        </div>
      </div>
    </header>
  );
}
