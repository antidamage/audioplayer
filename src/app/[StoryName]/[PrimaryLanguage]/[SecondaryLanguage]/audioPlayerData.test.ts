import { describe, expect, it } from "vitest";

import {
  getLanguageAliases,
  getLanguageByKey,
  getStoryName,
  getStoryUrlSegment,
  hasAvailableAudioRoute,
  resolveLanguageKey,
  resolveStoryKeyForLanguageSegment,
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
  it("returns localized story names for valid story-language pairs", () => {
    expect(getStoryName("Dance", "French")).toEqual({
      language: "French",
      display: "La danse",
    });
    expect(getStoryName("Dance")).toBeUndefined();
    expect(getStoryName("Dance", "Italian")).toBeUndefined();
  });

  it("creates one URL segment per primary language", () => {
    expect(getStoryUrlSegment("BikeRace", "EnglishNZ")).toBe("BikeRace");
    expect(getStoryUrlSegment("BikeRace", "Italian")).toBe("Garainbicicletta");
    expect(getStoryUrlSegment("Party", "Italian")).toBe("Festa");
  });

  it("resolves story keys from primary-language URL segments", () => {
    expect(resolveStoryKeyForLanguageSegment("BikeRace", "EnglishNZ")).toBe("BikeRace");
    expect(resolveStoryKeyForLanguageSegment("Garainbicicletta", "Italian")).toBe(
      "BikeRace",
    );
    expect(resolveStoryKeyForLanguageSegment("BikeRace", "Italian")).toBeUndefined();
    expect(resolveStoryKeyForLanguageSegment("UnknownStory", "EnglishNZ")).toBeUndefined();
  });

  it("matches only route combinations backed by an audio file", () => {
    expect(hasAvailableAudioRoute("Art", "English-NZ", "French")).toBe(true);
    expect(hasAvailableAudioRoute("BikeRace", "Italian", "English-NZ")).toBe(true);
    expect(hasAvailableAudioRoute("Art", "French", "English-NZ")).toBe(false);
    expect(hasAvailableAudioRoute("Party", "English-NZ", "Italian")).toBe(false);
  });
});
