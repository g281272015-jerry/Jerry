import { publicAsset } from "../utils/publicAsset.js";

const companyLogo = (file) => publicAsset(`/portfolio/profile/${file}`);

// 5 个 zxcvb 图按时间从新到旧依次分配给 5 段工作经历
const logoByOrder = ["b.png", "c.png", "v.png", "x.png", "z.png"];

export const profile = {
  avatarCard: publicAsset("/portfolio/profile/01.jpg"),
  nameEn: "JERRY",
  nameCn: "Jerry",
  idCode: "00000000",
  roleEn: "BRAND VISUAL · INTERACTION DESIGNER",
  roleCn: "品牌视觉 · 交互设计师",
  location: "成都 / CHENGDU, CHINA",
  introEn: "Brand visual and interaction designer working across identity, campaign systems and AI-assisted visual production. I turn local culture and product stories into clear, memorable digital experiences.",
  introCn: "专注品牌视觉与交互设计，擅长将地域文化、产品叙事与数字体验转化为清晰、有记忆点的视觉系统。",
  contacts: [
    { label: "MAIL", value: "hello@example.com" },
    { label: "BASE", value: "成都 / CHENGDU" },
    { label: "STATUS", value: "OPEN TO WORK" },
  ],
  timeline: [
    {
      year: "2025.11 — 2026.03",
      role: "交互设计实习生  京东零售",
      roleEn: "INTERACTION DESIGN INTERN",
      company: "北京京东世纪贸易有限公司",
      logo: companyLogo(logoByOrder[0]),
      desc: "围绕京东零售的工具、店铺与全渠道品牌输出交互与视觉方案。",
      keyProjects: [
        "【智能工具与设计资产】基于品牌 VI 规范，利用即梦、内部 AI 制图软件协同搭建 AI 复用设计组件库（包含字体、图标与场景模板），提炼团队 AI 工作流 SOP，将同类设计交付周期缩短 30%，设计通过率达 97%+",
        "【店铺体验与数据驱动】负责七鲜私厨等电商店铺视觉与交互体系重构，搭建首焦、分类导航及详情页模板；通过体验优化带动店铺访客停留时长提升 35%，页面跳转率提升 28%",
        "【全渠道品牌全案统筹】作为唯一主负责人完成\"宿迁黄河猪头肉\"全渠道品牌升级，输出 80+ 套全案物料及统一 VI 标准；覆盖线上及线下 20+ 商超，助力线上曝光量提升 60%，线下销量环比增长 35%",
        "【全链路包装营销赋能】协同完成 15 款核心食品包装落地与线上线下视觉联动；高效承接 90+ 运营需求（交付达标率 100%），因突出产出获部门优秀评级",
      ],
      keywords: ["INTERACTION", "AIGC", "DESIGN SYSTEM"],
    },
    {
      year: "2025.06 — 2025.09",
      role: "游戏场景设计实习生  设计实习生",
      roleEn: "GAME SCENE DESIGN INTERN",
      company: "金羿（北京）网络科技有限公司",
      logo: companyLogo(logoByOrder[1]),
      desc: "聚焦 AIGC 游戏美术工作流与场景资产生命周期管理。",
      keyProjects: [
        "【生成式场景视觉排版】结合 Liblib 工具与相关游戏美术风格（夏日/赛博朋克等），探索 AIGC 场景高效出图工作流；负责场景元素布局与色彩层级调优，落地 100+ 游戏场景与 50+ 关卡视觉方案",
        "【设计资产与规范沉淀】负责游戏素材精细化处理（筛选/抠图/修图 1000+ 张），建立规范化游戏场景素材资产库",
        "【用户体验与数据反哺】收集并分析玩家场景反馈，针对视觉杂乱与层级问题完成 50+ 次深度迭代，优化后场景满意度 +35%，玩家平均停留时长 +20%，方案 100% 按时交付至测试版本",
      ],
      keywords: ["AIGC", "GAME ART", "ITERATION"],
    },
    {
      year: "2024.01 — 2024.08",
      role: "海外广告设计实习生",
      roleEn: "OVERSEAS AD DESIGN INTERN",
      company: "易点天下网络科技有限公司",
      logo: companyLogo(logoByOrder[2]),
      desc: "围绕海外社交媒体广告创意、AIGC 素材生产与整合营销输出开展设计工作。",
      keyProjects: ["Facebook / Google / TikTok 广告视觉", "A/B 测试与 CTA 版式迭代", "Banner、落地页与短视频素材"],
      keywords: ["CAMPAIGN", "SOCIAL", "PERFORMANCE"],
    },
    {
      year: "2023.06 — 2023.10",
      role: "交互设计实习生",
      roleEn: "INTERACTION DESIGN INTERN",
      company: "成都熙普生物科技",
      logo: companyLogo(logoByOrder[3]),
      desc: "聚焦生物科技产品的品牌视觉、官网体验与营销物料设计。",
      keyProjects: [
        "【品牌全案与组件沉淀】完成 20+ 款生物科技产品包装/标签设计及线上线下营销物料；通过 Figma 构建可复用组件库",
        "【官网搭建与体验优化】基于代码知识协助搭建品牌官方网站系统；优化电商页面视觉，主动拍摄相关宣传视频增流",
      ],
      keywords: [],
    },
    {
      year: "2023.02 — 2023.05",
      role: "视觉设计与课程研发组长",
      roleEn: "VISUAL DESIGN & COURSE LEAD",
      company: "四川风暴手绘教育咨询有限责任公司",
      logo: companyLogo(logoByOrder[4]),
      desc: "主导品牌视觉重构升级，沉淀课程研发方法论与教学 SOP。",
      keyProjects: [
        "【品牌视觉重构升级】主导宣传海报及品牌标识升级，结合年轻化审美重构 Slogan 与 Logo 设计规范，提振品牌视觉辨识度",
        "【课程研发与方法沉淀】总结设计思维与排版法则，制作 50+ 套高质量课程 ppt 模板；研究标准 Logo 设计教学 SOP，帮助学员作品平均提分 50%",
      ],
      keywords: [],
    },
  ],
  tools: [
    { name: "Figma", icon: publicAsset("/portfolio/icon/icon_01.png") },
    { name: "Illustrator", icon: publicAsset("/portfolio/icon/icon_02.png") },
    { name: "Photoshop", icon: publicAsset("/portfolio/icon/icon_03.png") },
    { name: "Premiere", icon: publicAsset("/portfolio/icon/icon_04.png") },
    { name: "3ds Max", icon: publicAsset("/portfolio/icon/icon_05.png") },
    { name: "AI Tools", icon: publicAsset("/portfolio/icon/icon_06.png") },
    { name: "Adobe Express", icon: publicAsset("/portfolio/icon/icon_07.png") },
    { name: "Lightroom", icon: publicAsset("/portfolio/icon/icon_08.png") },
    { name: "Midjourney", icon: publicAsset("/portfolio/icon/icon_09.png") },
    { name: "Notion", icon: publicAsset("/portfolio/icon/icon_10.png") },
    { name: "Figma Canvas", icon: publicAsset("/portfolio/icon/icon_11.png") },
  ],
};
