// Headless render harness entry — expanded in Phase 1 to render a template at
// a given (aspect, t) into an offscreen-sized canvas and signal readiness to
// Playwright. For now it just marks the page ready so the multi-page build has
// a valid entry.
declare global {
  interface Window {
    __jimaHarnessReady?: boolean;
  }
}

window.__jimaHarnessReady = true;

export {};
