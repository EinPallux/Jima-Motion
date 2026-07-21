import { lazy, Suspense } from "react";
import { Navbar } from "../landing/Navbar";
import { Hero } from "../landing/Hero";
import { HowItWorks, WhyFree, Features } from "../landing/Sections";
import { Faq } from "../landing/Faq";
import { Footer } from "../landing/Footer";

// Engine-backed sections load their own chunk (Pixi) after first paint.
const TemplateRail = lazy(() => import("../landing/TemplateRail").then((m) => ({ default: m.TemplateRail })));
const GalleryTeaser = lazy(() => import("../landing/GalleryTeaser").then((m) => ({ default: m.GalleryTeaser })));

export default function Landing() {
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
      <Footer />
    </div>
  );
}

function RailSkeleton() {
  return <div className="py-16" aria-hidden />;
}
