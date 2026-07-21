// @jima/templates — the launch template registry.
// Consumers (gallery, Studio routes, poster generation, golden tests) iterate
// this array — adding a template is one entry here plus its folder.

import type { TemplateDefinition } from "@jima/engine";
import { kineticHeadline } from "./kinetic-headline/index";
import { slideReveal } from "./slide-reveal/index";
import { glowPromo } from "./glow-promo/index";
import { productPop } from "./product-pop/index";
import { typewriter } from "./typewriter/index";
import { kenBurns } from "./ken-burns/index";
import { bigNumber } from "./big-number/index";
import { quoteSpotlight } from "./quote-spotlight/index";
import { logoSting } from "./logo-sting/index";
import { saveTheDate } from "./save-the-date/index";
import { tipsStack } from "./tips-stack/index";
import { splitDuo } from "./split-duo/index";
import { iconPop } from "./icon-pop/index";
import { subscribeBell } from "./subscribe-bell/index";
import { specialOffer } from "./special-offer/index";
import { kineticType } from "./kinetic-type/index";
import { keynoteReveal } from "./keynote-reveal/index";
import { wordSwap } from "./word-swap/index";
import { markerHighlight } from "./marker-highlight/index";
import { youtubeFrame } from "./youtube-frame/index";
import { reelFrame } from "./reel-frame/index";
import { notificationPop } from "./notification-pop/index";
import { likeSpark } from "./like-spark/index";
import { tiktokFollow } from "./tiktok-follow/index";
import { doubleTapHeart } from "./double-tap-heart/index";
import { commentDrop } from "./comment-drop/index";
import { travelPostcard } from "./travel-postcard/index";
import { locationPin } from "./location-pin/index";
import { flashSale } from "./flash-sale/index";
import { couponReveal } from "./coupon-reveal/index";
import { statBars } from "./stat-bars/index";
import { iconGrid } from "./icon-grid/index";
import { badgeStamp } from "./badge-stamp/index";
import { folderOpen } from "./folder-open/index";
import { cardCascade } from "./card-cascade/index";
import { photoGrid } from "./photo-grid/index";
import { polaroidStack } from "./polaroid-stack/index";
import { beforeAfterSlider } from "./before-after-slider/index";
import { carouselCover } from "./carousel-cover/index";
import { teamGrid } from "./team-grid/index";
import { testimonialWall } from "./testimonial-wall/index";
import { featureSpotlight } from "./feature-spotlight/index";
import { imageReveal } from "./image-reveal/index";
import { splitShowcase } from "./split-showcase/index";
import { mockupTilt } from "./mockup-tilt/index";
import { productCarousel } from "./product-carousel/index";
import { product360 } from "./product-360/index";
import { colorVariants } from "./color-variants/index";
import { productLineup } from "./product-lineup/index";
import { bundleOffer } from "./bundle-offer/index";
import { productDetail } from "./product-detail/index";
import { unboxReveal } from "./unbox-reveal/index";
import { sizeCompare } from "./size-compare/index";
import { productReview } from "./product-review/index";
import { shopGrid } from "./shop-grid/index";
import { fadeCascade } from "./fade-cascade/index";
import { letterReveal } from "./letter-reveal/index";
import { lineRise } from "./line-rise/index";
import { focusIn } from "./focus-in/index";
import { sideSlide } from "./side-slide/index";
import { scaleIn } from "./scale-in/index";
import { flipWords } from "./flip-words/index";
import { dropLetters } from "./drop-letters/index";
import { curtainWipe } from "./curtain-wipe/index";
import { stackedBuild } from "./stacked-build/index";
import { shineText } from "./shine-text/index";
import { splitReveal } from "./split-reveal/index";
import { waveText } from "./wave-text/index";
import { bounceIn } from "./bounce-in/index";
import { pushIn } from "./push-in/index";
import { textScramble } from "./text-scramble/index";
import { emphasisLine } from "./emphasis-line/index";
import { spacingExpand } from "./spacing-expand/index";
import { messageRotator } from "./message-rotator/index";
import { boxWipe } from "./box-wipe/index";
import { stepFlow } from "./step-flow/index";
import { timelineFlow } from "./timeline-flow/index";
import { beforeAfter } from "./before-after/index";
import { comparisonVs } from "./comparison-vs/index";
import { featureCallouts } from "./feature-callouts/index";
import { productShowcase } from "./product-showcase/index";
import { galleryStrip } from "./gallery-strip/index";
import { featureGrid } from "./feature-grid/index";
import { deviceMockup } from "./device-mockup/index";
import { reviewStars } from "./review-stars/index";
import { productHero } from "./product-hero/index";
import { priceCard } from "./price-card/index";
import { newArrival } from "./new-arrival/index";
import { specList } from "./spec-list/index";
import { revealSpotlight } from "./reveal-spotlight/index";
import { threeStats } from "./three-stats/index";
import { logoWall } from "./logo-wall/index";
import { countdownTimer } from "./countdown-timer/index";
import { ctaEndcard } from "./cta-endcard/index";
import { saleBanner } from "./sale-banner/index";

// Ordered for the gallery (roughly by how commonly social managers reach for them).
export const templates: TemplateDefinition[] = [
  kineticHeadline,
  keynoteReveal,
  specialOffer,
  fadeCascade,
  subscribeBell,
  reelFrame,
  bigNumber,
  letterReveal,
  youtubeFrame,
  glowPromo,
  flipWords,
  iconPop,
  quoteSpotlight,
  flashSale,
  shineText,
  tiktokFollow,
  doubleTapHeart,
  kineticType,
  scaleIn,
  productPop,
  statBars,
  travelPostcard,
  lineRise,
  likeSpark,
  markerHighlight,
  notificationPop,
  bounceIn,
  commentDrop,
  slideReveal,
  focusIn,
  typewriter,
  textScramble,
  iconGrid,
  couponReveal,
  wordSwap,
  sideSlide,
  locationPin,
  cardCascade,
  curtainWipe,
  folderOpen,
  emphasisLine,
  kenBurns,
  spacingExpand,
  saveTheDate,
  badgeStamp,
  waveText,
  messageRotator,
  tipsStack,
  splitReveal,
  dropLetters,
  splitDuo,
  pushIn,
  stackedBuild,
  boxWipe,
  logoSting,
  // Explainer / showcase / product / ad pack.
  stepFlow,
  timelineFlow,
  beforeAfter,
  comparisonVs,
  featureCallouts,
  productShowcase,
  galleryStrip,
  featureGrid,
  deviceMockup,
  reviewStars,
  productHero,
  priceCard,
  newArrival,
  specList,
  revealSpotlight,
  threeStats,
  logoWall,
  countdownTimer,
  ctaEndcard,
  saleBanner,
  photoGrid,
  polaroidStack,
  beforeAfterSlider,
  carouselCover,
  teamGrid,
  testimonialWall,
  featureSpotlight,
  imageReveal,
  splitShowcase,
  mockupTilt,
  productCarousel,
  product360,
  colorVariants,
  productLineup,
  bundleOffer,
  productDetail,
  unboxReveal,
  sizeCompare,
  productReview,
  shopGrid,
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}
