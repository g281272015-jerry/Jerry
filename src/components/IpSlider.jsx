import { useState } from "react";
import { ipProjects } from "../data/ipProjects";
import AccordionGallery from "./AccordionGallery";
import FashionDetail from "./FashionDetail";
import "./IpSlider.css";

/**
 * IP & GOODS —— AccordionGallery 书架式手风琴
 * ------------------------------------------------------------
 * 9 个 IP 案例排成一排，平时看起来像书架上一本本立着的书，只露出很窄的"书脊"。
 * 鼠标移到哪一本，哪一本就展开、变成完整的封面（在展开的这本上点一下，
 * 才会弹出详情页，翻看这个项目里完整的一组图片）。
 *
 * 这个"书架"效果直接复用了本站已有的 AccordionGallery 组件
 * （原本是 chacha-character / chacha-goods / chacha-world 三个项目），
 * 现在用 9 张 ip1 图片作为 9 个独立案例展示。
 */
export default function IpSlider() {
  const [opened, setOpened] = useState(null);

  const items = ipProjects.map((p) => ({
    image: p.cover,
    label: `${p.index} ${p.title}`,
    alt: p.titleCn,
    spineIndex: p.index,
    spineTitleCn: p.titleCn,
    spineTitleEn: p.title,
  }));

  return (
    <section id="ip" className="section">
      <div className="container">
        <div className="section-eyebrow">
          <span className="dot" />
          04 — IP &amp; GOODS
        </div>
        <h2 className="section-title">
          IP &amp; Goods
          <span className="cjk">IP衍生与商品开发 · 鼠标移过去看封面,点一下看详情</span>
        </h2>

        <div className="ip-accordion-wrap">
          <AccordionGallery
            items={items}
            orientation="horizontal"
            defaultIndex={0}
            height={560}
            gap={7}
            radius={14}
            expandRatio={0.28}
            accentColor="#ff6d28"
            overlayColor="var(--bg)"
            textColor="var(--text)"
            spineLabels
            className="ip-accordion"
            onSelect={(i) => setOpened(ipProjects[i])}
          />
        </div>
      </div>

      <FashionDetail item={opened} onClose={() => setOpened(null)} />
    </section>
  );
}