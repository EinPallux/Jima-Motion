// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

/**
 * Determinism guard (CLAUDE.md hard rule 6, TECHNICAL_ARCHITECTURE.md §6.1):
 * engine + templates must be pure f(t, values, aspect, seed). No wall-clock,
 * no unseeded randomness. Also enforces the GSAP ban (ADR-001) everywhere.
 */
const determinismRules = {
  "no-restricted-properties": [
    "error",
    { object: "Date", property: "now", message: "Determinism: use the seeded/injected clock, not Date.now (TECHNICAL_ARCHITECTURE.md §6.1)." },
    { object: "Math", property: "random", message: "Determinism: use the seeded RNG from template context, not Math.random." },
    { object: "performance", property: "now", message: "Determinism: time comes from the frame index / injected clock, not performance.now." },
  ],
  "no-restricted-syntax": [
    "error",
    { selector: "NewExpression[callee.name='Date'][arguments.length=0]", message: "Determinism: argless `new Date()` reads the wall clock. Pass an explicit timestamp." },
  ],
};

const noGsap = {
  "no-restricted-imports": [
    "error",
    { patterns: [{ group: ["gsap", "gsap/*"], message: "GSAP is banned (ADR-001): its post-Webflow license forbids no-code animation tools like Jima." }] },
  ],
};

export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "**/*.tsbuildinfo", "playwright-report/**", "test-results/**", "**/.vercel/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...noGsap,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    },
  },
  {
    // The determinism guard applies only to the pure packages.
    files: ["packages/engine/**/*.ts", "packages/templates/**/*.ts"],
    ignores: ["**/*.test.ts", "**/*.bench.ts"],
    rules: determinismRules,
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "tests/**/*.ts"],
    languageOptions: { globals: { ...globals.node } },
  },
);
