// Self-hosted OFL fonts, loaded app-wide AND by the render harness so the engine's
// document.fonts.load always finds the faces (no fallback on first paint).
// The extra families (Archivo…Outfit) power the Studio's headline font picker;
// weights 400–700 are loaded for every swappable family so any template weight
// resolves. Imported by both apps/web/src/main.tsx and apps/web/harness/main.ts.

// Parkinsans — the UI/layout typeface (variable, weights 300–800). Drives all
// app chrome (landing + Studio) via --font-display / --font-sans.
import "@fontsource-variable/parkinsans";
// Space Grotesk — default template display font (headline picker default).
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
// Inter — body role, and selectable as a headline/body font (needs 700 too).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
// Fraunces — serif (also selectable as a headline font).
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
// JetBrains Mono — mono (also selectable).
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
// Selectable headline fonts.
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
// Parkinsans — STATIC instances (family "Parkinsans"). Deliberately separate from
// the variable import above (family "Parkinsans Variable"): a canvas `font`
// string cannot express variable-font axes, so rendering template text at a
// given weight needs real static faces or it silently falls back (CLAUDE.md
// pitfalls). The variable face keeps driving app chrome; these serve the engine.
import "@fontsource/parkinsans/400.css";
import "@fontsource/parkinsans/500.css";
import "@fontsource/parkinsans/600.css";
import "@fontsource/parkinsans/700.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
