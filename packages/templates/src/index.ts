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
// v1.7 pack — overlays/lower-thirds, intros, and more text/social/product/stat.
import { barRace } from "./bar-race/index";
import { channelIntro } from "./channel-intro/index";
import { clapIntro } from "./clap-intro/index";
import { countdownIntro } from "./countdown-intro/index";
import { ctaBar } from "./cta-bar/index";
import { discountBurst } from "./discount-burst/index";
import { eventLineup } from "./event-lineup/index";
import { featureTags } from "./feature-tags/index";
import { followersCount } from "./followers-count/index";
import { hashtagPop } from "./hashtag-pop/index";
import { highlightSweep } from "./highlight-sweep/index";
import { limitedStock } from "./limited-stock/index";
import { logoGridReveal } from "./logo-grid-reveal/index";
import { logoLines } from "./logo-lines/index";
import { lowerThird } from "./lower-third/index";
import { mentionTag } from "./mention-tag/index";
import { milestoneCounter } from "./milestone-counter/index";
import { nameTag } from "./name-tag/index";
import { neonSign } from "./neon-sign/index";
import { newDrop } from "./new-drop/index";
import { outlineFill } from "./outline-fill/index";
import { percentFill } from "./percent-fill/index";
import { priceSlash } from "./price-slash/index";
import { progressRing } from "./progress-ring/index";
import { quoteCards } from "./quote-cards/index";
import { ratingBars } from "./rating-bars/index";
import { shippingBadge } from "./shipping-badge/index";
import { speechPop } from "./speech-pop/index";
import { statCallout } from "./stat-callout/index";
import { storyPoll } from "./story-poll/index";
import { subtitleBar } from "./subtitle-bar/index";
import { swipeUp } from "./swipe-up/index";
import { testimonialSlide } from "./testimonial-slide/index";
import { topicBug } from "./topic-bug/index";
import { stampText } from "./stamp-text/index";
import { rotatingHeadline } from "./rotating-headline/index";
import { gradientText } from "./gradient-text/index";
import { splitFlap } from "./split-flap/index";
import { underlineGrow } from "./underline-grow/index";
import { thankYou } from "./thank-you/index";
import { logoRevealMask } from "./logo-reveal-mask/index";
import { introBars } from "./intro-bars/index";
import { stickerPop } from "./sticker-pop/index";
import { endScreen } from "./end-screen/index";
// Social expansion (v1.7.2).
import { profileCard } from "./profile-card/index";
import { shareRepost } from "./share-repost/index";
import { storyQuiz } from "./story-quiz/index";
import { qaBox } from "./qa-box/index";
import { emojiFloat } from "./emoji-float/index";
import { dmChat } from "./dm-chat/index";
import { linkInBio } from "./link-in-bio/index";
import { verifiedPop } from "./verified-pop/index";
import { giveaway } from "./giveaway/index";
import { trendingNow } from "./trending-now/index";
// Reference-style pack (v1.8.1).
import { commentThread } from "./comment-thread/index";
import { chatConvo } from "./chat-convo/index";
import { searchType } from "./search-type/index";
import { retroTv } from "./retro-tv/index";
import { watermarkDrop } from "./watermark-drop/index";
// v1.9 pack — 5 new templates per gallery section (Backgrounds removed).
import { blurFocus } from "./blur-focus/index";
import { maskWipe } from "./mask-wipe/index";
import { stretchIn } from "./stretch-in/index";
import { typeCursor } from "./type-cursor/index";
import { tapeHighlight } from "./tape-highlight/index";
import { cornerTag } from "./corner-tag/index";
import { newsLowerThird } from "./news-lower-third/index";
import { progressOverlay } from "./progress-overlay/index";
import { sideLabel } from "./side-label/index";
import { locationTag } from "./location-tag/index";
import { reactionBar } from "./reaction-bar/index";
import { storyProgress } from "./story-progress/index";
import { duetSplit } from "./duet-split/index";
import { replySticker } from "./reply-sticker/index";
import { pollResults } from "./poll-results/index";
import { specCallouts } from "./spec-callouts/index";
import { swatchSwitch } from "./swatch-switch/index";
import { addToCart } from "./add-to-cart/index";
import { bundleStack } from "./bundle-stack/index";
import { dealCountdown } from "./deal-countdown/index";
import { appScreens } from "./app-screens/index";
import { photoFan } from "./photo-fan/index";
import { featureRotator } from "./feature-rotator/index";
import { browserWindow } from "./browser-window/index";
import { photoDevelop } from "./photo-develop/index";
import { donutChart } from "./donut-chart/index";
import { lineGraph } from "./line-graph/index";
import { processArrows } from "./process-arrows/index";
import { prosCons } from "./pros-cons/index";
import { kpiTiles } from "./kpi-tiles/index";
import { quoteMark } from "./quote-mark/index";
import { logoDraw } from "./logo-draw/index";
import { ratingReveal } from "./rating-reveal/index";
import { brandLockup } from "./brand-lockup/index";
import { signatureSign } from "./signature-sign/index";
import { filmCountdown } from "./film-countdown/index";
import { irisOpen } from "./iris-open/index";
import { glitchIntro } from "./glitch-intro/index";
import { zoomPunch } from "./zoom-punch/index";
import { blindsOpen } from "./blinds-open/index";
import { ticketStub } from "./ticket-stub/index";
import { boardingPass } from "./boarding-pass/index";
import { mapRoute } from "./map-route/index";
import { calendarFlip } from "./calendar-flip/index";
import { passportStamp } from "./passport-stamp/index";

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
  // v1.7 pack — Overlays & lower-thirds
  lowerThird,
  nameTag,
  subtitleBar,
  ctaBar,
  topicBug,
  statCallout,
  speechPop,
  // Openers (intros)
  channelIntro,
  countdownIntro,
  logoLines,
  neonSign,
  clapIntro,
  introBars,
  // Text
  highlightSweep,
  outlineFill,
  stampText,
  rotatingHeadline,
  gradientText,
  splitFlap,
  underlineGrow,
  // Social
  storyPoll,
  hashtagPop,
  followersCount,
  swipeUp,
  mentionTag,
  stickerPop,
  // Product & promo
  discountBurst,
  newDrop,
  priceSlash,
  featureTags,
  limitedStock,
  shippingBadge,
  // Data & stats
  progressRing,
  barRace,
  percentFill,
  ratingBars,
  milestoneCounter,
  // Testimonial / brand / event
  quoteCards,
  logoGridReveal,
  testimonialSlide,
  eventLineup,
  thankYou,
  logoRevealMask,
  endScreen,
  // Social expansion (v1.7.2).
  profileCard,
  shareRepost,
  storyQuiz,
  qaBox,
  emojiFloat,
  dmChat,
  linkInBio,
  verifiedPop,
  giveaway,
  trendingNow,
  // Reference-style pack (v1.8.1).
  commentThread,
  chatConvo,
  searchType,
  retroTv,
  watermarkDrop,
  // v1.9 pack — 5 new templates per gallery section.
  // Text & titles
  blurFocus,
  maskWipe,
  stretchIn,
  typeCursor,
  tapeHighlight,
  // Overlays & lower-thirds
  cornerTag,
  newsLowerThird,
  progressOverlay,
  sideLabel,
  locationTag,
  // Social
  reactionBar,
  storyProgress,
  duetSplit,
  replySticker,
  pollResults,
  // Product & ads
  specCallouts,
  swatchSwitch,
  addToCart,
  bundleStack,
  dealCountdown,
  // Showcase
  appScreens,
  photoFan,
  featureRotator,
  browserWindow,
  photoDevelop,
  // Explainers & data
  donutChart,
  lineGraph,
  processArrows,
  prosCons,
  kpiTiles,
  // Brand & quotes
  quoteMark,
  logoDraw,
  ratingReveal,
  brandLockup,
  signatureSign,
  // Openers
  filmCountdown,
  irisOpen,
  glitchIntro,
  zoomPunch,
  blindsOpen,
  // Events & travel
  ticketStub,
  boardingPass,
  mapRoute,
  calendarFlip,
  passportStamp,
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}
