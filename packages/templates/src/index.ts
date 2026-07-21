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

// Ordered for the gallery (roughly by how commonly social managers reach for them).
export const templates: TemplateDefinition[] = [
  kineticHeadline,
  keynoteReveal,
  fadeCascade,
  letterReveal,
  lineRise,
  focusIn,
  sideSlide,
  scaleIn,
  flipWords,
  dropLetters,
  curtainWipe,
  stackedBuild,
  shineText,
  splitReveal,
  waveText,
  bounceIn,
  specialOffer,
  subscribeBell,
  reelFrame,
  bigNumber,
  glowPromo,
  youtubeFrame,
  iconPop,
  quoteSpotlight,
  flashSale,
  tiktokFollow,
  doubleTapHeart,
  kineticType,
  productPop,
  statBars,
  travelPostcard,
  likeSpark,
  markerHighlight,
  notificationPop,
  commentDrop,
  slideReveal,
  typewriter,
  iconGrid,
  couponReveal,
  wordSwap,
  locationPin,
  cardCascade,
  folderOpen,
  kenBurns,
  saveTheDate,
  badgeStamp,
  tipsStack,
  splitDuo,
  logoSting,
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}
