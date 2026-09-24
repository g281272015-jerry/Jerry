import { publicAsset } from "../utils/publicAsset.js";

const ip1 = (number) =>
  publicAsset(`/portfolio/ip1/ip_${String(number).padStart(2, "0")}.jpg`);

// IP1 —— 9 张图全部展开在同一根 AccordionGallery 书架轨道上。
// 标题先用占位（IP WORKS / IP 作品），要换真实名字直接改下面数组。
export const ipProjects = Array.from({ length: 9 }, (_, index) => {
  const number = index + 1;
  return {
    id: `ip1-${String(number).padStart(2, "0")}`,
    index: String(number).padStart(2, "0"),
    title: `IP WORKS ${String(number).padStart(2, "0")}`,
    titleCn: `IP 作品 ${String(number).padStart(2, "0")}`,
    tag: "IP / VISUAL",
    cover: ip1(number),
    images: [],
    desc: "IP 衍生与商品开发案例。",
  };
});