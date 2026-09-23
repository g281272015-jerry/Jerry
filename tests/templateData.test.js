import assert from "node:assert/strict";
import test from "node:test";
import { siteInfo, sections } from "../src/data/siteConfig.js";
import { profile } from "../src/data/profileData.js";
import { contactInfo } from "../src/data/contactData.js";
import { overviewItems } from "../src/data/overviewData.js";
import { ipProjects } from "../src/data/ipProjects.js";
import { illustrations } from "../src/data/illustrationData.js";
import { brandProjects } from "../src/data/brandProjects.js";
import { fashionCategories } from "../src/data/fashionData.js";
import { characterProjects } from "../src/data/characterBuildData.js";
import { aigcVideos } from "../src/data/aigcVideoData.js";

test("identity and downloads are safe defaults", () => {
  assert.equal(siteInfo.nameEn, "YOUR NAME");
  assert.equal(siteInfo.nameCn, "你的名字");
  assert.equal(profile.nameEn, "YOUR NAME");
  assert.deepEqual(contactInfo.downloads, []);
  assert.equal(contactInfo.links[0].href, "mailto:hello@example.com");
});

test("all sections and demo collections remain represented", () => {
  assert.deepEqual(sections.map(({ id }) => id), [
    "hero", "work", "about", "ip", "illustration", "brand",
    "fashion", "character-build", "media", "outro",
  ]);
  for (const collection of [overviewItems, ipProjects, illustrations, brandProjects, characterProjects, aigcVideos]) {
    assert.ok(collection.length >= 3);
    assert.equal(new Set(collection.map(({ id }) => id)).size, collection.length);
  }
  assert.ok(fashionCategories.length >= 4);
});

test("every public demo asset uses the generated placeholder namespace", () => {
  const json = JSON.stringify({ overviewItems, ipProjects, illustrations, brandProjects, fashionCategories, characterProjects, aigcVideos });
  const paths = [...json.matchAll(/"(\/[^"?]+\.(?:svg|png|jpe?g|webp|mp4|mov|pdf))"/gi)].map((match) => match[1]);
  assert.ok(paths.length > 20);
  assert.ok(paths.every((value) => value.startsWith("/placeholders/")));
});
