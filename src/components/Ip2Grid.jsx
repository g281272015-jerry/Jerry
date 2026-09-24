import { useState } from "react";
import { publicAsset } from "../utils/publicAsset.js";
import AccordionGallery from "./AccordionGallery";
import FashionDetail from "./FashionDetail";
import "./Ip2Grid.css";

/**
 * IP Works —— 第二辑 · AccordionGallery 书架式手风琴
 * ------------------------------------------------------------
 * 从 ip2/ 里取出最后 11 张图（ip2_26 ~ ip2_36）作为 11 个独立 IP 案例，
 * 标题按你之前截图里那 11 个项目的中英名字来填。
 *
 * 复用 AccordionGallery 横向手风琴（和上面 IP & GOODS 是同一套代码），
 * 鼠标移到哪一本，哪一本就展开成完整封面；点一下弹 FashionDetail 详情。
 */

const ip2Asset = (number) =>
  publicAsset(`/portfolio/ip2/ip2_${String(number).padStart(2, "0")}.jpg`);

// 11 个项目 —— 按图一里的标题填写，按 ip2_26 → 01、ip2_27 → 02 ... 顺次对应
const ip2Projects = [
  { id: "ip2-01", index: "01", title: "ZENLESS ZONE ZERO", titleCn: "《绝区零》联名周边", cover: ip2Asset(26) },
  { id: "ip2-02", index: "02", title: "DREAMSCAPE UMBRELLA", titleCn: "《超级梦境》联名伞具", cover: ip2Asset(27) },
  { id: "ip2-03", index: "03", title: "JOJO'S BIZARRE ADVENTURE", titleCn: "JOJO 联名企划", cover: ip2Asset(28) },
  { id: "ip2-04", index: "04", title: "THE KING'S AVATAR", titleCn: "《全职高手》联名企划", cover: ip2Asset(29) },
  { id: "ip2-05", index: "05", title: "DEMON SLAYER", titleCn: "鬼灭之刃", cover: ip2Asset(30) },
  { id: "ip2-06", index: "06", title: "SHINOBU ACRYLIC STAND", titleCn: "胡蝶忍双插亚克力立牌", cover: ip2Asset(31) },
  { id: "ip2-07", index: "07", title: "MITSURI BADGE SERIES", titleCn: "蜜璃衍生徽章", cover: ip2Asset(32) },
  { id: "ip2-08", index: "08", title: "MITSURI ACRYLIC STAND", titleCn: "蜜璃衍生亚克力立牌", cover: ip2Asset(33) },
  { id: "ip2-09", index: "09", title: "E-CNY MASCOT PLUSH", titleCn: "数字人民市吉祥物衍生", cover: ip2Asset(34) },
  { id: "ip2-10", index: "10", title: "STICKER & CARD SERIES", titleCn: "角色贴纸小卡套装设计", cover: ip2Asset(35) },
  { id: "ip2-11", index: "11", title: "OBANAI X MITSURI HEART BADGE", titleCn: "恋小贴纸双卡套装设计", cover: ip2Asset(36) },
].map((p) => ({
  ...p,
  tag: "IP / VISUAL",
  images: [],
  desc: `${p.titleCn} —— IP 衍生与商品开发案例。`,
}));

export default function Ip2Grid() {
  const [opened, setOpened] = useState(null);

  const items = ip2Projects.map((p) => ({
    image: p.cover,
    label: `${p.index} ${p.title}`,
    alt: p.titleCn,
    spineIndex: p.index,
    spineTitleCn: p.titleCn,
    spineTitleEn: p.title,
  }));

  return (
    <section id="ip2" className="section">
      <div className="container">
        <div className="section-eyebrow">
          <span className="dot" />
          05 — IP WORKS / TRACK
        </div>
        <h2 className="section-title">
          IP Works
          <span className="cjk">IP衍生与商品开发 · 第二辑 · 最后 11 张 · 鼠标移过去看封面,点一下看详情</span>
        </h2>

        <div className="ip-accordion-wrap">
          <AccordionGallery
            items={items}
            orientation="horizontal"
            defaultIndex={4}
            height={560}
            gap={7}
            radius={14}
            expandRatio={0.28}
            accentColor="#ff6d28"
            overlayColor="var(--bg)"
            textColor="var(--text)"
            spineLabels
            className="ip-accordion"
            onSelect={(i) => setOpened(ip2Projects[i])}
          />
        </div>
      </div>

      <FashionDetail item={opened} onClose={() => setOpened(null)} />
    </section>
  );
}