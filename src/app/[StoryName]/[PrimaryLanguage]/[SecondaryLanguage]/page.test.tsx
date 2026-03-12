import { beforeEach, describe, expect, it, vi } from "vitest";

const { notFound } = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound,
}));

vi.mock("./AudioPlayer", () => ({
  default: "mock-audio-player",
}));

import Page, { generateStaticParams } from "./page";

describe("generateStaticParams", () => {
  it("includes known route aliases without generating duplicates", async () => {
    const params = await generateStaticParams();
    const uniqueParams = new Set(params.map((param) => JSON.stringify(param)));

    expect(params).toContainEqual({
      StoryName: "KakapoDisco",
      PrimaryLanguage: "English-NZ",
      SecondaryLanguage: "Maori",
    });
    expect(params).toContainEqual({
      StoryName: "Gara in bicicletta",
      PrimaryLanguage: "Italian",
      SecondaryLanguage: "EnglishNZ",
    });
    expect(params).not.toContainEqual({
      StoryName: "Bike Race",
      PrimaryLanguage: "Italian",
      SecondaryLanguage: "EnglishNZ",
    });
    expect(params).not.toContainEqual({
      StoryName: "Toi",
      PrimaryLanguage: "English-NZ",
      SecondaryLanguage: "Maori",
    });
    expect(params).toContainEqual({
      StoryName: "Festa",
      PrimaryLanguage: "Italian",
      SecondaryLanguage: "English-NZ",
    });
    expect(params).not.toContainEqual({
      StoryName: "Art",
      PrimaryLanguage: "French",
      SecondaryLanguage: "English-NZ",
    });
    expect(params).not.toContainEqual({
      StoryName: "Party",
      PrimaryLanguage: "English-NZ",
      SecondaryLanguage: "Italian",
    });
    expect(uniqueParams.size).toBe(params.length);
  });
});

describe("Page", () => {
  beforeEach(() => {
    notFound.mockClear();
  });

  it("normalizes route params before rendering the audio player", () => {
    const page = Page({
      params: {
        StoryName: "Treasure Hunt",
        PrimaryLanguage: "EnglishNZ",
        SecondaryLanguage: "Spanish_US",
      },
    });

    expect(notFound).not.toHaveBeenCalled();
    expect(page).toMatchObject({
      props: {
        params: {
          StoryName: "TreasureHunt",
          PrimaryLanguage: "English-NZ",
          SecondaryLanguage: "Spanish-US",
        },
      },
      type: "mock-audio-player",
    });
  });

  it("calls notFound for invalid route params", () => {
    expect(() =>
      Page({
        params: {
          StoryName: "Unknown Story",
          PrimaryLanguage: "EnglishNZ",
          SecondaryLanguage: "Spanish_US",
        },
      }),
    ).toThrow("NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("calls notFound for resolved params without a backing audio file", () => {
    expect(() =>
      Page({
        params: {
          StoryName: "Art",
          PrimaryLanguage: "French",
          SecondaryLanguage: "EnglishNZ",
        },
      }),
    ).toThrow("NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("calls notFound for story aliases that do not match the primary language", () => {
    expect(() =>
      Page({
        params: {
          StoryName: "Toi",
          PrimaryLanguage: "English-NZ",
          SecondaryLanguage: "Maori",
        },
      }),
    ).toThrow("NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
