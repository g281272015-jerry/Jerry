import { publicAsset } from "../utils/publicAsset.js";

const graphic = (number) =>
  publicAsset(`/portfolio/graphics/graphic_${String(number).padStart(2, "0")}.png`);

// 16 张 graphics 全部展开;标题先用占位,你可以直接在下面数组里
// 替换每张图的中/英文标题,顺序也对应 graphic_01 ~ graphic_16。
const illustrationsList = [
  ["文化采集图形", "CULTURAL GRAPHIC STUDY"],
  ["早茶标志与辅助图形", "TEA IDENTITY"],
  ["IP 角色表情与贴纸", "CHARACTER GRAPHICS"],
  ["品牌图形语言实验", "BRAND GRAPHIC EXPLORATION"],
  ["品牌视觉版式探索", "EDITORIAL VISUAL STUDY"],
  ["图形设计完整档案", "GRAPHIC DESIGN ARCHIVE"],
  ["图形实验 07", "GRAPHIC STUDY 07"],
  ["图形实验 08", "GRAPHIC STUDY 08"],
  ["图形实验 09", "GRAPHIC STUDY 09"],
  ["图形实验 10", "GRAPHIC STUDY 10"],
  ["图形实验 11", "GRAPHIC STUDY 11"],
  ["图形实验 12", "GRAPHIC STUDY 12"],
  ["图形实验 13", "GRAPHIC STUDY 13"],
  ["图形实验 14", "GRAPHIC STUDY 14"],
  ["图形实验 15", "GRAPHIC STUDY 15"],
  ["图形实验 16", "GRAPHIC STUDY 16"],
];

export const illustrations = illustrationsList.map(([title, titleEn], index) => ({
  id: `illustration-${String(index + 1).padStart(2, "0")}`,
  title,
  titleEn,
  image: graphic(index + 1),
  extraImages: [],
}));