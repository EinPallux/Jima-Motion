import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "../landing/Navbar";
import { Hero } from "../landing/Hero";
import { HowItWorks, WhyFree, Features } from "../landing/Sections";
import { Faq } from "../landing/Faq";
import { FinalCta } from "../landing/FinalCta";
import { Footer } from "../landing/Footer";

// Engine-backed sections load their own chunk (Pixi) after first paint.
const TemplateRail = lazy(() => import("../landing/TemplateRail").then((m) => ({ default: m.TemplateRail })));
const GalleryTeaser = lazy(() => import("../landing/GalleryTeaser").then((m) => ({ default: m.GalleryTeaser })));

export default function Landing() {
  // Scroll to a fragment on load (e.g. arriving at "/#templates" from a legal
  // page). This is a pure client-render SPA, so the browser's native fragment
  // scroll fires before React paints — and some target sections are lazy — so
  // we retry until the element mounts.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#top") return;
    let tries = 0;
    let raf = 0;
    const tryScroll = () => {
      let el: Element | null = null;
      try {
        el = document.querySelector(hash);
      } catch {
        return; // malformed selector — give up
      }
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      } else if (tries++ < 40) {
        raf = window.setTimeout(tryScroll, 100); // up to ~4s for lazy sections
      }
    };
    tryScroll();
    return () => window.clearTimeout(raf);
  }, []);

  return (
    <div id="top" className="bg-paper">
      <Navbar />
      <Hero />
      <Suspense fallback={<RailSkeleton />}>
        <TemplateRail />
      </Suspense>
      <HowItWorks />
      <WhyFree />
      <Features />
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <GalleryTeaser />
      </Suspense>
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

function RailSkeleton() {
  return <div className="py-16" aria-hidden />;
}
