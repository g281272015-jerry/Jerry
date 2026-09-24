export const aigcIntro = {
  eyebrow: "09 — MOTION",
  titleEn: "MOTION LIBRARY",
  titleCn: "动态影像作品",
  tag: "MOTION / SHORT FILM / VISUAL EXPERIMENT",
  note: ["ARCHIVE", "MOVING IMAGE", "YOUR PRACTICE"],
};

export const aigcVideos = Array.from({ length: 6 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const videoSrc = publicAsset("/placeholders/videos/motion-study.mp4");
  return {
    id: `video-${number}`,
    titleEn: `MOTION STUDY ${number}`,
    titleCn: `动态作品示例 ${number}`,
    duration: "00:04",
    tags: ["MOTION", "VISUAL", "EXPERIMENT"],
    cover: publicAsset("/placeholders/square-01.svg"),
    disc: publicAsset(`/placeholders/square-0${(index % 2) + 1}.svg`),
    poster: publicAsset("/placeholders/poster-video.svg"),
    video: videoSrc,
    videoSrc,
  };
});
import { publicAsset } from "../utils/publicAsset.js";
