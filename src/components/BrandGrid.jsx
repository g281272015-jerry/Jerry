import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { brandCategories } from "../data/brandProjects";
import { deferredImageProps } from "../utils/mediaPriority";
import "./BrandGrid.css";

export default function BrandGrid() {
  const [activeId, setActiveId] = useState(brandCategories[0]?.id);
  const active = useMemo(
    () => brandCategories.find((category) => category.id === activeId) || brandCategories[0],
    [activeId]
  );

  useEffect(() => {
    document.getElementById(`brand-panel-${activeId}`)?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeId]);

  if (!active) return null;

  const totalCategories = brandCategories.length;
  const totalCount = String(totalCategories).padStart(2, "0");

  return (
    <section id="brand" className="section brand-section">
      <div className="container">
        <div className="section-eyebrow"><span className="dot" />07 — SELECTED ARCHIVE</div>
        <div className="brand-heading">
          <h2 className="section-title">Brand &amp; Visual Archive<span className="cjk">品牌与视觉设计档案</span></h2>
          <p>从真实业务到品牌系统、数字体验与平面表达。每一组图像均以原始比例呈现。</p>
        </div>

        <div className="brand-explorer glass">
          <nav className="brand-category-nav" aria-label="品牌作品分类">
            <span className="mono-label brand-nav-kicker">DISCIPLINES / {totalCount}</span>
            {brandCategories.map((category) => {
              const selected = category.id === active.id;
              return (
                <button key={category.id} type="button" onClick={() => setActiveId(category.id)} className={selected ? "is-active" : ""} aria-current={selected ? "page" : undefined}>
                  <span className="mono-label brand-category-index">{category.index}</span>
                  <span className="brand-category-title">{category.title}</span>
                  <span className="brand-category-cn">{category.titleCn}</span>
                  <span className="brand-category-count mono-label">{String(category.images.length).padStart(2, "0")}</span>
                </button>
              );
            })}
          </nav>

          <div id={`brand-panel-${active.id}`} className="brand-gallery-panel">
            <header className="brand-gallery-head">
              <div>
                <span className="mono-label brand-gallery-index">{active.index} / {totalCount}</span>
                <h3>{active.title}<span>{active.titleCn}</span></h3>
              </div>
              <div className="brand-gallery-meta">
                <p>{active.note}</p>
                <div>{active.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
              </div>
            </header>

            <motion.div key={active.id} className="brand-gallery" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.035 } } }}>
              {active.images.map((image, index) => (
                <motion.figure key={image.src} className="brand-gallery-item" variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                  <div className="brand-gallery-media"><img src={image.src} alt={`${active.titleCn}：${image.label}`} {...deferredImageProps} /></div>
                  <figcaption><span className="mono-label">{String(index + 1).padStart(2, "0")}</span><span>{image.label}</span></figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
