import { motion } from "framer-motion";
import { illustrations } from "../data/illustrationData";
import { deferredImageProps } from "../utils/mediaPriority";
import "./IllustrationMasonry.css";

/**
 * Illustration —— 单容器竖向滚动（图二版式）
 * ------------------------------------------------------------
 * 16 张 graphics 全部铺在一个固定高度的容器里,竖向 overflow-y:auto
 * 就能滚到看到底,不用点开看详情、不用 Lightbox。
 * 排布用 CSS columns(masonry):图片保留各自原始比例,
 * 浏览器自动把它们"塞"到最短的那一列,不会留大片空白。
 *
 * 想直接看到所有图、同时又不破坏图片比例的场景,这一版比网格更合适。
 */
export default function IllustrationMasonry() {
  return (
    <section id="illustration" className="section">
      <div className="container">
        <div className="section-eyebrow">
          <span className="dot" />
          06 — ILLUSTRATION
        </div>
        <h2 className="section-title">
          Illustration
          <span className="cjk">图形与插画绘制设计 · 在容器内上下滚动浏览全部作品</span>
        </h2>

        <div className="illustration-stage glass">
          <div className="illustration-masonry-scroll">
            <div className="masonry">
              {illustrations.map((item, i) => (
                <motion.figure
                  key={item.id}
                  className="masonry-item"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.5) }}
                >
                  <span className="masonry-thumb">
                    <img src={item.image} alt={item.title} loading="lazy" {...deferredImageProps} />
                  </span>
                  <figcaption className="masonry-caption">
                    <span className="masonry-caption-en mono-label">{item.titleEn}</span>
                    <span className="masonry-caption-cjk">{item.title}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}