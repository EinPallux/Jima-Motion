import { describe, it, expect } from "vitest";
import { ENGINE_VERSION } from "./index";

describe("@jima/engine", () => {
  it("exposes a version string", () => {
    expect(ENGINE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
