import { publicAsset } from "../utils/publicAsset.js";

const projects = [
  ["brand", "实践经历", "PRACTICE EXPERIENCE", "品牌 / 交互 / AIGC", "/portfolio/mulu/mulu_01.jpg"],
  ["brand", "品牌设计", "BRAND IDENTITY", "系统 / 包装 / 传播", "/portfolio/mulu/mulu_02.jpg"],
  ["brand", "UI 设计", "UI & DIGITAL EXPERIENCE", "产品 / 体验 / 界面", "/portfolio/mulu/mulu_03.jpg"],
  ["ip", "IP 衍生设计", "IP & GOODS", "IP / 衍生品 / 包装", "/portfolio/mulu/mulu_04.jpg"],
  ["illustration", "图形与插画档案", "GRAPHIC DESIGN ARCHIVE", "标志 / 图案 / 插画", "/portfolio/mulu/mulu_05.jpg"],
];

export const overviewItems = projects.map(([target, titleCn, titleEn, tag, image], index) => ({
  id: `overview-${String(index + 1).padStart(2, "0")}`,
  target,
  index: String(index + 1).padStart(2, "0"),
  titleEn,
  titleCn,
  tone: index % 2 ? "dark" : "light",
  tagLines: tag.split(" / "),
  sideCaption: ["RESEARCH", "DESIGN", "DELIVER"],
  coords: ["30.5728° N", "104.0668° E"],
  footerTag: tag,
  image: publicAsset(image),
  cardImage: publicAsset(image),
}));
