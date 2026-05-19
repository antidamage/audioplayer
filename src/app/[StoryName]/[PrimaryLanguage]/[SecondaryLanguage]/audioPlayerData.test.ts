import { describe, expect, it } from "vitest";

import {
  AvailableAudioRoutes,
  BookNamesLocalised,
  getLanguageAliases,
  getLanguageByKey,
  getLanguageRouteParam,
  getStoryName,
  getStoryUrlSegment,
  hasAvailableAudioRoute,
  LanguageMap,
  resolveLanguageKey,
  resolveStoryKeyForLanguageSegment,
} from "./audioPlayerData";

function routeId(route: {
  storyKey: string;
  primaryLanguage: string;
  secondaryLanguage: string;
}): string {
  return `${route.storyKey}::${route.primaryLanguage}::${route.secondaryLanguage}`;
}

const EXPECTED_AUDIO_ROUTE_IDS = [
  "Art::EnglishNZ::French",
  "Art::EnglishNZ::Mandarin",
  "Art::EnglishNZ::Maori",
  "Art::EnglishNZ::SpanishUS",
  "Art::EnglishNZ::Italian",
  "Band::EnglishNZ::French",
  "Band::EnglishNZ::Mandarin",
  "Band::EnglishNZ::Maori",
  "Band::EnglishNZ::SpanishUS",
  "Band::EnglishNZ::Italian",
  "BikeRace::EnglishNZ::French",
  "BikeRace::EnglishNZ::Mandarin",
  "BikeRace::EnglishNZ::Maori",
  "BikeRace::EnglishNZ::SpanishUS",
  "BikeRace::EnglishNZ::Italian",
  "BikeRace::Italian::EnglishNZ",
  "Count::EnglishNZ::French",
  "Count::EnglishNZ::Mandarin",
  "Count::EnglishNZ::Maori",
  "Count::EnglishNZ::SpanishUS",
  "Count::EnglishNZ::Italian",
  "Dance::EnglishNZ::French",
  "Dance::EnglishNZ::Mandarin",
  "Dance::EnglishNZ::Maori",
  "Dance::EnglishNZ::SpanishUS",
  "Dance::EnglishNZ::Italian",
  "KakapoDisco::EnglishNZ::French",
  "KakapoDisco::EnglishNZ::Mandarin",
  "KakapoDisco::EnglishNZ::Maori",
  "KakapoDisco::EnglishNZ::SpanishUS",
  "KakapoDisco::EnglishNZ::Italian",
  "Opposites::EnglishNZ::French",
  "Opposites::EnglishNZ::Mandarin",
  "Opposites::EnglishNZ::Maori",
  "Opposites::EnglishNZ::SpanishUS",
  "Opposites::EnglishNZ::Italian",
  "Party::EnglishNZ::French",
  "Party::EnglishNZ::Mandarin",
  "Party::EnglishNZ::Maori",
  "Party::EnglishNZ::SpanishUS",
  "Party::EnglishNZ::Italian",
  "Party::Italian::EnglishNZ",
  "Play::EnglishNZ::French",
  "Play::EnglishNZ::Mandarin",
  "Play::EnglishNZ::Maori",
  "Play::EnglishNZ::SpanishUS",
  "Play::EnglishNZ::Italian",
  "TreasureHunt::EnglishNZ::French",
  "TreasureHunt::EnglishNZ::Mandarin",
  "TreasureHunt::EnglishNZ::Maori",
  "TreasureHunt::EnglishNZ::SpanishUS",
  "TreasureHunt::EnglishNZ::Italian",
];

describe("audioPlayerData language helpers", () => {
  it("returns configured metadata for a canonical language key", () => {
    expect(getLanguageByKey("English-NZ")).toMatchObject({
      shortName: "EnglishNZ",
      display: "English NZ",
    });
  });

  it("returns route aliases for a language short name", () => {
    expect(getLanguageAliases("EnglishNZ")).toEqual(["English-NZ"]);
    expect(getLanguageAliases("Mandarin")).toEqual(["Mandarin", "Simplified-Chinese"]);
    expect(getLanguageAliases("SpanishUS")).toEqual(["Spanish-US"]);
    expect(getLanguageAliases("Unknown")).toEqual([]);
  });

  it("resolves supported language aliases to canonical keys", () => {
    expect(resolveLanguageKey("English-NZ")).toBe("English-NZ");
    expect(resolveLanguageKey("Simplified-Chinese")).toBe("Mandarin");
    expect(resolveLanguageKey("Spanish-US")).toBe("Spanish-US");
    expect(resolveLanguageKey("German")).toBeUndefined();
  });

  it("keeps the printed QR-code language fragments stable", () => {
    expect(new Set(LanguageMap.map((language) => language.staticParams[0]))).toEqual(new Set([
      "English-NZ",
      "Spanish-US",
      "Maori",
      "Mandarin",
      "Italian",
      "French",
    ]));
    expect(LanguageMap.find((language) => language.shortName === "Mandarin")?.staticParams).toEqual([
      "Mandarin",
      "Simplified-Chinese",
    ]);
    expect(getLanguageRouteParam("Mandarin")).toBe("Mandarin");
    expect(getLanguageRouteParam("SpanishUS")).toBe("Spanish-US");
  });
});

describe("audioPlayerData story helpers", () => {
  it("returns localized story names for valid story-language pairs", () => {
    expect(getStoryName("Dance", "French")).toEqual({
      language: "French",
      display: "La danse",
    });
    expect(getStoryName("KakapoDisco", "EnglishNZ")).toEqual({
      language: "EnglishNZ",
      display: "Kākāpō Disco",
    });
    expect(getStoryName("KakapoDisco", "SpanishUS")).toEqual({
      language: "SpanishUS",
      display: "La Disco De Kākāpō",
    });
    expect(getStoryName("Dance")).toBeUndefined();
    expect(getStoryName("Dance", "Italian")).toBeUndefined();
  });

  it("does not contain mojibake in any language or title display string", () => {
    const suspiciousPattern = /Ã|Â|Ä|Å|â€|Ë|œ|�/;
    const displayValues = [
      ...LanguageMap.map((language) => language.display),
      ...Object.values(BookNamesLocalised).flat().map((bookName) => bookName.display),
    ];

    for (const value of displayValues) {
      expect(value).not.toMatch(suspiciousPattern);
    }
  });

  it("creates one URL segment per primary language", () => {
    expect(getStoryUrlSegment("BikeRace", "EnglishNZ")).toBe("BikeRace");
    expect(getStoryUrlSegment("KakapoDisco", "EnglishNZ")).toBe("KakapoDisco");
    expect(getStoryUrlSegment("BikeRace", "Italian")).toBe("Garainbicicletta");
    expect(getStoryUrlSegment("Party", "Italian")).toBe("Festa");
  });

  it("resolves story keys from primary-language URL segments", () => {
    expect(resolveStoryKeyForLanguageSegment("BikeRace", "EnglishNZ")).toBe("BikeRace");
    expect(resolveStoryKeyForLanguageSegment("KakapoDisco", "EnglishNZ")).toBe(
      "KakapoDisco",
    );
    expect(resolveStoryKeyForLanguageSegment("Garainbicicletta", "Italian")).toBe(
      "BikeRace",
    );
    expect(resolveStoryKeyForLanguageSegment("BikeRace", "Italian")).toBeUndefined();
    expect(resolveStoryKeyForLanguageSegment("UnknownStory", "EnglishNZ")).toBeUndefined();
  });

  it("matches only route combinations backed by an audio file", () => {
    expect(hasAvailableAudioRoute("Art", "English-NZ", "French")).toBe(true);
    expect(hasAvailableAudioRoute("BikeRace", "Italian", "English-NZ")).toBe(true);
    expect(hasAvailableAudioRoute("Party", "English-NZ", "Italian")).toBe(true);
    expect(hasAvailableAudioRoute("BikeRace", "Italian", "Spanish-US")).toBe(false);
    expect(hasAvailableAudioRoute("Art", "French", "English-NZ")).toBe(false);
    expect(hasAvailableAudioRoute("Art", "Italian", "English-NZ")).toBe(false);
  });

  it("matches the explicit shipped audio route list", () => {
    expect(AvailableAudioRoutes.map(routeId)).toEqual(EXPECTED_AUDIO_ROUTE_IDS);
  });
});
