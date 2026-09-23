# 李嘉瑞作品集网站 - 内容维护说明

网站框架已按你的简历与作品集重组为：品牌视觉项目、潮玩 IP、图形与 Logo 探索、个人经历和联系方式。所有可维护的文字都集中在 `src/data/`，无需进入组件修改。

## 文字在哪里改

| 需要修改的内容 | 文件 |
| --- | --- |
| 姓名、职业定位、栏目开关 | `src/data/siteConfig.js` |
| 个人介绍、工作经历、工具、首页联系信息 | `src/data/profileData.js` |
| 首页项目目录卡片 | `src/data/overviewData.js` |
| 品牌项目名称、标签与图片地址 | `src/data/brandProjects.js` |
| 潮玩 IP 项目 | `src/data/ipProjects.js` |
| 图形、插画、Logo 作品 | `src/data/illustrationData.js` |
| 页尾联系文案与电话、邮箱 | `src/data/contactData.js` |
| 首页四项能力标签 | `src/components/Hero.jsx` |

## 图片应该放在哪里

请新建并使用以下目录。建议导出 WebP 或 JPG，单张控制在 2500px 宽、1-2MB 内。

```
public/
  portfolio/
    brand/           # 每个品牌项目的封面、详情长图
    ip/              # IP 角色、周边和包装
    graphics/        # Logo、插画、图形作品
    profile/         # 头像或个人照片
    video/           # 首页或项目视频（可选）
```

目前各数据文件仍引用模板占位图，因此页面结构可以先正常浏览。替换图片时，将图片放入上面的目录，再将数据中的：

```js
publicAsset("/placeholders/portrait-01.svg")
```

改成例如：

```js
publicAsset("/portfolio/brand/yibin-tea-cover.webp")
```

品牌项目推荐每项准备 3 张：`项目名-cover.webp`（横版封面）、`项目名-thumb.webp`（竖版缩略图）、`项目名-detail.webp`（纵向完整项目长图）。

## 已建立的项目顺序

1. 古蜀新匠 × 荣耀品牌联名
2. 宜宾早茶品牌视觉系统
3. 七鲜私厨品牌 VI 手册
4. 宿迁年菜电商视觉系列
5. DTC 校园电商与社群孵化项目
6. 恰恰潮玩 IP 及衍生品

建议首页先完整展示前 4 个项目；其余作为补充项目，以免招聘方在首屏后遇到信息密度过高的问题。
