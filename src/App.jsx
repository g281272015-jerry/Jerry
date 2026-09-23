import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import GlowCursor from "./components/GlowCursor";
import SoundManager from "./components/SoundManager";
import IntroScreen from "./components/IntroScreen";
import Hero from "./components/Hero";
import About from "./components/About";
import FeaturedOverview from "./components/FeaturedOverview";
import IpSlider from "./components/IpSlider";
import Ip2Grid from "./components/Ip2Grid";
import IllustrationMasonry from "./components/IllustrationMasonry";
import BrandGrid from "./components/BrandGrid";
import FashionTabs from "./components/FashionTabs";
import CharacterBuild from "./components/CharacterBuild";
import AigcVideoLibrary from "./components/AigcVideoLibrary";
import OutroVideo from "./components/OutroVideo";
import SiteFooter from "./components/SiteFooter";
import AiPager from "./components/AiPager";
import { hasEntered, shouldMountSiteContent } from "./utils/introGate";
import { sections } from "./data/siteConfig";

const COMPONENT_MAP = {
  hero: Hero,
  work: FeaturedOverview,
  about: About,
  ip: IpSlider,
  ip2: Ip2Grid,
  illustration: IllustrationMasonry,
  brand: BrandGrid,
  fashion: FashionTabs,
  "character-build": CharacterBuild,
  media: AigcVideoLibrary,
  outro: OutroVideo,
};

function jumpToTopInstantly() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export default function App() {
  const [entered, setEntered] = useState(() => hasEntered());

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return undefined;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    jumpToTopInstantly();
  }, []);

  useEffect(() => {
    if (entered) return undefined;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [entered]);

  if (!shouldMountSiteContent(entered)) {
    return <IntroScreen onDismiss={() => setEntered(true)} />;
  }

  return (
    <>
      <GlowCursor />
      <SoundManager />
      <Nav />
      <main>
        {sections.map(({ id, enabled }) => {
          const Component = COMPONENT_MAP[id];
          return enabled && Component ? <Component key={id} /> : null;
        })}
      </main>
      <SiteFooter />
      <AiPager />
    </>
  );
}
