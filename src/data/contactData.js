import { publicAsset } from "../utils/publicAsset.js";

const links = [
  { label: "MAIL", value: "hello@example.com", href: "mailto:hello@example.com" },
  { label: "PHONE", value: "YOUR PHONE", href: "tel:000" },
];

const downloads = [
  {
    label: "CV",
    value: "设计简历 / PDF",
    href: publicAsset("/portfolio/myself/cv.pdf"),
    download: "cv.pdf",
  },
  {
    label: "WORKS",
    value: "作品集 / PDF",
    href: publicAsset("/portfolio/myself/portfolio.pdf"),
    download: "portfolio.pdf",
  },
];

export const contactInfo = {
  headlineEn: "LET'S BUILD",
  headlineEn2: "A DISTINCT BRAND.",
  headlineCn: "一起把好想法做成有记忆点的体验。",
  subCn: "欢迎联系品牌视觉、交互体验与 AIGC 视觉内容相关机会。",
  links,
  rows: [...links, ...downloads],
  downloads,
};
