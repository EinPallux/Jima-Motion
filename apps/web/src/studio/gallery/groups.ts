// Use-case groups for the gallery. Templates carry a fine-grained `category`;
// the gallery presents them in these broader, browsable sections (in order).
export interface TemplateGroup {
  id: string;
  label: string;
  blurb: string;
  categories: string[];
}

export const GROUPS: TemplateGroup[] = [
  { id: "text", label: "Text & titles", blurb: "Kinetic type, headlines, quotes-as-titles", categories: ["statement", "announcement"] },
  { id: "social", label: "Social", blurb: "Likes, follows, subscribes, Reels & platform UI", categories: ["social"] },
  { id: "product", label: "Product & ads", blurb: "Product reveals, offers, sales, CTAs", categories: ["product", "promo"] },
  { id: "showcase", label: "Showcase", blurb: "Galleries, features, device mockups, photos", categories: ["showcase", "photo", "tech"] },
  { id: "explain", label: "Explainers & data", blurb: "Steps, timelines, comparisons, stats", categories: ["educational", "comparison", "stat"] },
  { id: "brand", label: "Brand & quotes", blurb: "Logos, badges, end cards, testimonials", categories: ["brand", "testimonial"] },
  { id: "events", label: "Events & travel", blurb: "Save-the-dates, locations, trips", categories: ["event", "travel"] },
];

const OTHER: TemplateGroup = { id: "other", label: "More", blurb: "", categories: [] };

const BY_CATEGORY = new Map<string, TemplateGroup>();
for (const g of GROUPS) for (const c of g.categories) BY_CATEGORY.set(c, g);

export function groupOf(category: string): TemplateGroup {
  return BY_CATEGORY.get(category) ?? OTHER;
}
