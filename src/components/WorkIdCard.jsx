import { motion } from "framer-motion";
import { deferredImageProps } from "../utils/mediaPriority";
import "./WorkIdCard.css";

/**
 * 工卡照片 —— "PERSONNEL ARCHIVE" 工作证版式
 * ------------------------------------------------------------
 * 整张卡片由这几层组成(从上到下):
 * 1. 顶部深色贴纸条:左边 PERSONNEL ARCHIVE + 小地球图标,
 *    右边 ID.20260823 这种编号。
 * 2. 中间是一张用户的照片(profile/01.jpg),四周带一圈细描边
 *    和一个金属夹子的样式。
 * 3. 下面是大字姓名 + 中文姓名 + 角色小字 + 地点 + 右侧条码 +
 *    右侧小字"DESIGN RESEARCH CREATIVE AND MORE"。
 *
 * 没有彗星扫光/3D 倾斜那种交互效果,就是一张静止的"档案照片"。
 */
export default function WorkIdCard({
  src,
  alt,
  nameEn,
  nameCn,
  role,
  roleCn,
  location,
  idCode,
}) {
  return (
    <motion.div
      className="work-id-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="work-id-card-top">
        <div className="work-id-card-top-left">
          <span className="work-id-globe" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.2" />
              <ellipse cx="10" cy="10" rx="3.4" ry="8" stroke="currentColor" strokeWidth="1" />
              <path d="M2 10H18" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
          <span className="work-id-card-top-label">PERSONNEL</span>
          <span className="work-id-card-top-label">ARCHIVE</span>
        </div>
        <div className="work-id-card-top-right mono-label">
          ID.{idCode}
        </div>
      </div>

      <div className="work-id-card-body">
        <span className="work-id-card-clip" aria-hidden="true" />
        <span className="work-id-card-frame frame-corner top-left" />
        <span className="work-id-card-frame frame-corner top-right" />
        <span className="work-id-card-frame frame-corner bottom-left" />
        <span className="work-id-card-frame frame-corner bottom-right" />
        <img
          className="work-id-card-photo"
          src={src}
          alt={alt}
          draggable={false}
          {...deferredImageProps}
        />
      </div>

      <div className="work-id-card-foot">
        <div className="work-id-card-foot-main">
          <div className="work-id-card-name">
            {nameEn} <span className="work-id-card-name-cn">/ {nameCn}</span>
          </div>
          <div className="work-id-card-role mono-label">{role}</div>
          {roleCn && <div className="work-id-card-role-cn">{roleCn}</div>}

          <div className="work-id-card-foot-row">
            <span className="work-id-card-location">
              <span className="work-id-card-pin" aria-hidden="true">
                <svg viewBox="0 0 12 16" fill="none">
                  <path
                    d="M6 1c-2.76 0-5 2.13-5 4.76 0 3.6 5 9.24 5 9.24s5-5.64 5-9.24C11 3.13 8.76 1 6 1Zm0 6.7a1.95 1.95 0 1 1 0-3.9 1.95 1.95 0 0 1 0 3.9Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              {location}
            </span>
            <div className="work-id-card-barcodes" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="work-id-bar" data-i={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="work-id-card-foot-side mono-label">
          DESIGN
          <br />
          RESEARCH
          <br />
          CREATIVE
          <br />
          AND MORE
        </div>
      </div>

      <span className="work-id-card-arrow" aria-hidden="true">↗</span>
    </motion.div>
  );
}