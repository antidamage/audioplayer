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
  it("uses one normalized story segment per primary language without duplicates", async () => {
    const params = await generateStaticParams();
    const uniqueParams = new Set(params.map((param) => JSON.stringify(param)));

    expect(params).toContainEqual({
      StoryName: "BikeRace",
      PrimaryLanguage: "EnglishNZ",
      SecondaryLanguage: "Maori",
    });
    expect(params).toContainEqual({
      StoryName: "Garainbicicletta",
      PrimaryLanguage: "Italian",
      SecondaryLanguage: "EnglishNZ",
    });
    expect(params).not.toContainEqual({
      StoryName: "Bike Race",
      PrimaryLanguage: "EnglishNZ",
      SecondaryLanguage: "Maori",
    });
    expect(params).not.toContainEqual({
      StoryName: "Gara in bicicletta",
      PrimaryLanguage: "Italian",
      SecondaryLanguage: "EnglishNZ",
    });
    expect(params).not.toContainEqual({
      StoryName: "Reihipaihikara",
      PrimaryLanguage: "English-NZ",
      SecondaryLanguage: "Maori",
    });
    expect(uniqueParams.size).toBe(params.length);
  });
});

describe("Page", () => {
  beforeEach(() => {
    notFound.mockClear();
  });

  it("normalizes languages and resolves the story from the primary-language URL segment", () => {
    const page = Page({
      params: {
        StoryName: "Garainbicicletta",
        PrimaryLanguage: "Italian",
        SecondaryLanguage: "English_NZ",
      },
    });

    expect(notFound).not.toHaveBeenCalled();
    expect(page).toMatchObject({
      props: {
        params: {
          StoryName: "BikeRace",
          PrimaryLanguage: "Italian",
          SecondaryLanguage: "English-NZ",
        },
      },
      type: "mock-audio-player",
    });
  });

  it("calls notFound for invalid route params", () => {
    expect(() =>
      Page({
        params: {
          StoryName: "UnknownStory",
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
          StoryName: "BikeRace",
          PrimaryLanguage: "EnglishNZ",
          SecondaryLanguage: "Italian",
        },
      }),
    ).toThrow("NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("calls notFound for long-form story names with spaces", () => {
    expect(() =>
      Page({
        params: {
          StoryName: "Gara in bicicletta",
          PrimaryLanguage: "Italian",
          SecondaryLanguage: "English-NZ",
        },
      }),
    ).toThrow("NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
