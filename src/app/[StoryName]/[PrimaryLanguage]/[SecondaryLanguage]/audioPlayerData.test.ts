import { describe, expect, it } from "vitest";

import {
  getLanguageAliases,
  getLanguageByKey,
  getStoryAliases,
  getStoryAliasesForLanguage,
  getStoryName,
  hasAvailableAudioRoute,
  isStoryAliasValidForLanguage,
  resolveLanguageKey,
  resolveStoryKey,
} from "./audioPlayerData";

describe("audioPlayerData language helpers", () => {
  it("returns configured metadata for a canonical language key", () => {
    expect(getLanguageByKey("English-NZ")).toMatchObject({
      shortName: "EnglishNZ",
      display: "English NZ",
    });
  });

  it("returns route aliases for a language short name", () => {
    expect(getLanguageAliases("EnglishNZ")).toEqual([
      "English-NZ",
      "EnglishNZ",
      "English_NZ",
    ]);
    expect(getLanguageAliases("Unknown")).toEqual([]);
  });

  it("resolves supported language aliases to canonical keys", () => {
    expect(resolveLanguageKey("EnglishNZ")).toBe("English-NZ");
    expect(resolveLanguageKey("Spanish_US")).toBe("Spanish-US");
    expect(resolveLanguageKey("German")).toBeUndefined();
  });
});

describe("audioPlayerData story helpers", () => {
  it("returns unique story aliases including localized display names", () => {
    expect(getStoryAliases("Art").filter((alias) => alias === "Art")).toHaveLength(1);
    expect(getStoryAliases("TreasureHunt")).toContain("Treasure Hunt");
  });

  it("limits route story aliases to the canonical key and primary language title", () => {
    expect(getStoryAliasesForLanguage("Art", "EnglishNZ")).toEqual(["Art"]);
    expect(getStoryAliasesForLanguage("Art", "Maori")).toEqual(["Art", "Toi"]);
    expect(getStoryAliasesForLanguage("BikeRace", "Italian")).toEqual([
      "BikeRace",
      "Gara in bicicletta",
    ]);
  });

  it("resolves story keys from route-friendly and localized aliases", () => {
    expect(resolveStoryKey("Treasure Hunt")).toBe("TreasureHunt");
    expect(resolveStoryKey("Treasure-Hunt")).toBe("TreasureHunt");
    expect(resolveStoryKey("Bike_Race")).toBe("BikeRace");
    expect(resolveStoryKey("Banda")).toBe("Band");
    expect(resolveStoryKey("le-groupe")).toBe("Band");
    expect(resolveStoryKey("Unknown Story")).toBeUndefined();
  });

  it("returns localized story names for valid story-language pairs", () => {
    expect(getStoryName("Dance", "French")).toEqual({
      language: "French",
      display: "La danse",
    });
    expect(getStoryName("Dance")).toBeUndefined();
    expect(getStoryName("Dance", "Italian")).toBeUndefined();
  });

  it("matches only route combinations backed by an audio file", () => {
    expect(hasAvailableAudioRoute("Art", "English-NZ", "French")).toBe(true);
    expect(hasAvailableAudioRoute("BikeRace", "Italian", "English-NZ")).toBe(true);
    expect(hasAvailableAudioRoute("Art", "French", "English-NZ")).toBe(false);
    expect(hasAvailableAudioRoute("Party", "English-NZ", "Italian")).toBe(false);
  });

  it("accepts story aliases only when they match the primary language", () => {
    expect(isStoryAliasValidForLanguage("Art", "Art", "EnglishNZ")).toBe(true);
    expect(isStoryAliasValidForLanguage("Toi", "Art", "EnglishNZ")).toBe(false);
    expect(isStoryAliasValidForLanguage("Toi", "Art", "Maori")).toBe(true);
    expect(isStoryAliasValidForLanguage("Gara-in-bicicletta", "BikeRace", "Italian")).toBe(
      true,
    );
  });
});
