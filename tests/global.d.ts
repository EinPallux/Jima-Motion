// Shared browser-context globals set by the render harness (apps/web/harness).
export {};

declare global {
  interface Window {
    __jimaHarnessReady?: boolean;
  }
}
