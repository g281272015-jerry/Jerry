import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../data/profileData";
import FloatingDock from "./FloatingDock";
import WorkIdCard from "./WorkIdCard";
import "./About.css";

/**
 * 个人经历模块 —— 改成"工卡照片 + 档案文件夹列表"的新排版
 * ------------------------------------------------------------
 * 左边是合成好的工卡照片(整张图,已经把你的照片拼进模板里了)。
 * 右边:大标题 PROFILE & EXPERIENCE,下面是一段引用式的简介文字,
 * 再下面是一条条"EXPERIENCE 01/02/03..."的档案列表,点一条就在它
 * 下方展开详情(重点项目 / 角色 / 关键词 / 缩略图),不再用弹窗。
 * 最下面是一整条常用软件工具栏(真实 App 图标,鼠标靠近放大,
 * 点一下常亮选中并带光泽描边)。
 */
export default function About() {
  const [openIndex, setOpenIndex] = useState(0);

  function toggle(i) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section id="about" className="section profile-section">
      <div className="container profile-grid">
        <motion.div
          className="profile-card-col"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <WorkIdCard
            src={profile.avatarCard}
            alt={`${profile.nameEn} ${profile.nameCn}`}
            nameEn={profile.nameEn}
            nameCn={profile.nameCn}
            role={profile.roleEn}
            roleCn={profile.roleCn}
            location={profile.location}
            idCode={profile.idCode}
          />
          <div className="profile-card-caption mono-label">
            ARCHIVE
            <br />
            FOR A BRIGHTER
            <br />
            TOMORROW
          </div>

          <div className="profile-quote-row">
            <span className="profile-quote-bracket" aria-hidden="true">
              [
            </span>
            <div className="profile-quote-text">
              <p className="profile-quote-en">{profile.introEn}</p>
            </div>
          </div>
        </motion.div>

        <div className="profile-info-col">
          <div className="profile-header-row">
            <div>
              <div className="section-eyebrow">
                <span className="dot" />
                03 — PROFILE
              </div>
              <h2 className="profile-title">
                PROFILE <span className="accent">&amp; EXPERIENCE</span>
              </h2>
              <div className="profile-title-cn">个人简介与工作经历</div>
            </div>
            <div className="profile-corner-note mono-label">
              DESIGN
              <br />A MORE HUMAN
              <br />FUTURE
            </div>
          </div>

          <div className="mono-label file-cabinet-hint">工作经历 / 点击展开完整内容 ↓</div>

          <div className="exp-list">
            {profile.timeline.map((t, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={t.year}
                  className={`exp-item${isOpen ? " is-open" : ""}`}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <button className="exp-row" onClick={() => toggle(i)} aria-expanded={isOpen}>
                    <span className="exp-row-top">
                      <span className="exp-dots" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className={`exp-switch${isOpen ? " is-on" : ""}`} aria-hidden="true">
                        <i />
                      </span>
                      <span className="exp-title-block">
                        <span className="exp-company-name">{t.company}</span>
                        <span className="exp-role-inline mono-label">{t.role}</span>
                      </span>
                      <span className="exp-year mono-label">{t.year}</span>
                      <span className="exp-plus" aria-hidden="true">
                        {isOpen ? "–" : "+"}
                      </span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="exp-detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="exp-detail-inner">
                          <div className="exp-detail-col exp-detail-projects-col">
                            <span className="mono-label exp-detail-heading">KEY PROJECTS</span>
                            <div className="exp-detail-scroll">
                              {t.keyProjects.map((p) => (
                                <span key={p} className="exp-detail-line">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="exp-detail-col exp-detail-role-keywords-col">
                            <div className="exp-detail-role-block">
                              <span className="mono-label exp-detail-heading">ROLE</span>
                              <span className="exp-detail-line">{t.roleEn}</span>
                              <span className="exp-detail-line exp-detail-company">{t.company}</span>
                            </div>
                            <div className="exp-detail-keywords-block">
                              <span className="mono-label exp-detail-heading">KEYWORDS</span>
                              <div className="exp-keywords">
                                {t.keywords.map((k) => (
                                  <span key={k} className="exp-keyword-tag mono-label">
                                    {k}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="exp-detail-thumb">
                            <img src={t.logo} alt={t.company} loading="lazy" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container profile-tools-row">
        <span className="mono-label profile-tools-label">
          TOOLS &amp; SOFTWARE
          <br />
          常用工具
        </span>
        <FloatingDock items={profile.tools} />
        <span className="mono-label profile-tools-note">
          TOOLS
          <br />
          EMPOWER
          <br />
          CREATIVITY
        </span>
      </div>
    </section>
  );
}
