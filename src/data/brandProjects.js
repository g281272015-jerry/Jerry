import { publicAsset } from "../utils/publicAsset.js";

const brandAsset = (folder, file) => publicAsset(`/portfolio/brand/${folder}/${file}`);
const ip1Asset = (number) =>
  publicAsset(`/portfolio/ip1/ip_${String(number).padStart(2, "0")}.jpg`);
const ip2Asset = (number) =>
  publicAsset(`/portfolio/ip2/ip2_${String(number).padStart(2, "0")}.jpg`);

const files = (folder, list) =>
  list.map(([file, label, ratio = "landscape"]) => ({
    src: brandAsset(folder, file),
    label,
    ratio,
  }));

export const brandCategories = [
  {
    id: "practice",
    index: "01",
    title: "PRACTICE EXPERIENCE",
    titleCn: "实践经历",
    note: "Selected work produced across brand, interaction and campaign contexts.",
    tags: ["INTERACTION", "CAMPAIGN", "AIGC"],
    images: files("brand1", [
      ["portrait-01.jpg", "实践经历总览", "portrait"],
      ["portrait-02.jpg", "项目实践 01"], ["portrait-03.jpg", "项目实践 02"],
      ["portrait-04.jpg", "项目实践 03"], ["portrait-05.jpg", "项目实践 04"],
      ["portrait-06.jpg", "项目实践 05"],
    ]),
  },
  {
    id: "identity",
    index: "02",
    title: "BRAND IDENTITY",
    titleCn: "品牌设计",
    note: "Identity systems, packaging, campaign language and commercial visual direction.",
    tags: ["IDENTITY", "SYSTEM", "PACKAGING"],
    images: files("brand2", Array.from({ length: 13 }, (_, i) => [
      `brand2_${String(i + 1).padStart(2, "0")}.jpg`, `品牌视觉 ${String(i + 1).padStart(2, "0")}`,
    ])),
  },
  {
    id: "ui",
    index: "03",
    title: "UI & DIGITAL EXPERIENCE",
    titleCn: "UI 设计",
    note: "Interface explorations and digital product screens, presented in their original proportions.",
    tags: ["UI/UX", "PRODUCT", "INTERACTION"],
    images: files("brand3", [
      ["brand3_01.jpg", "UI 设计 01"], ["brand3_02.jpg", "UI 设计 02", "portrait"], ["brand3_03.jpg", "UI 设计 03", "wide"],
      ["brand3_04.jpg", "UI 设计 04"], ["brand3_05.jpg", "UI 设计 05", "portrait"], ["brand3_06.jpg", "UI 设计 06", "wide"],
      ["brand3_07.jpg", "UI 设计 07"], ["brand3_08.jpg", "UI 设计 08", "wide"],
      ["brand3_09.jpg", "UI 设计完整流程", "long"], ["brand3_10.jpg", "UI 设计 10"],
    ]),
  },
  {
    id: "poster",
    index: "04",
    title: "POSTER DESIGN",
    titleCn: "海报设计",
    note: "Poster-led visual studies for editorial, campaign and cultural communication.",
    tags: ["POSTER", "TYPOGRAPHY", "ART DIRECTION"],
    images: files("brand4", [
      ["brand4_01.jpg", "海报设计 01"], ["brand4_02.jpg", "海报设计 02", "portrait"],
      ["brand4_03.jpg", "海报设计 03"],
    ]),
  },
  // —— IP1 ——
  // ip1/ 9 张图全部作为 BRAND ARCHIVE 里的一个分类展示
  {
    id: "ip1-archive",
    index: "05",
    title: "IP & GOODS",
    titleCn: "IP 衍生与商品开发 · 9 个独立案例",
    note: "Chosen IP licensing and merchandise projects, presented in shelf order.",
    tags: ["IP LICENSING", "GOODS", "PACKAGING"],
    images: Array.from({ length: 9 }, (_, index) => {
      const number = index + 1;
      return {
        src: ip1Asset(number),
        label: `IP WORKS ${String(number).padStart(2, "0")}`,
        ratio: "landscape",
      };
    }),
  },
  // —— IP2 ——
  // ip2/ 文件夹里所有 36 张图全部展开,按文件名顺序铺开,
  // 一行一张完整展示,不裁剪。标签先用编号占位,等你给真实名字再覆盖。
  {
    id: "ip2-archive",
    index: "06",
    title: "IP WORKS / VOL.2",
    titleCn: "IP 衍生 · 第二辑 · 全部 36 张",
    note: "Selected licensing collages, stand designs and full archive (36 张,按文件名顺序展示)。",
    tags: ["LICENSING", "STAND", "GOODS"],
    images: Array.from({ length: 36 }, (_, index) => {
      const number = index + 1;
      return {
        src: ip2Asset(number),
        label: `IP2 ${String(number).padStart(2, "0")}`,
        ratio: "landscape",
      };
    }),
  },
];