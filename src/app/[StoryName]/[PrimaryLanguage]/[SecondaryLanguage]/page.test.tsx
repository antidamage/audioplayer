// PRODUCTION QR-CODE SMOKE CONTRACT
// The printed QR URL list below is deliberately hard-coded. Do not derive it
// from the manifest, language map, story names, or generated static params.
// These tests exist because generated/optimized URL logic has broken production
// QR codes before.
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
import {
  type AudioPlayerRouteParams,
  getAudioUrlForRoute,
} from "./audioPlayerData";

function paramsFromPrintedUrl(path: string): AudioPlayerRouteParams {
  const [StoryName, PrimaryLanguage, SecondaryLanguage] = path
    .replace(/^\/|\/$/g, "")
    .split("/");

  return {
    StoryName,
    PrimaryLanguage,
    SecondaryLanguage,
  };
}

function printedUrlFromParams(params: AudioPlayerRouteParams): string {
  return `/${params.StoryName}/${params.PrimaryLanguage}/${params.SecondaryLanguage}/`;
}

function audioParamsFromPage(page: unknown): AudioPlayerRouteParams {
  return (page as { props: { params: AudioPlayerRouteParams } }).props.params;
}

function renderPage(params: AudioPlayerRouteParams) {
  return Page({ params: Promise.resolve(params) });
}

// Production compatibility contract: this is the hard-coded list of printed
// QR-code URLs that must continue to resolve. Do not derive this list from
// LanguageMap, BookNamesLocalised, or availableAudioRoutes.json; it exists to
// catch accidental changes in route-generation logic and manifest data.
const EXPECTED_PRINTED_QR_URLS = [
  {
    path: "/Art/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Art_EnglishNZ_French.mp3",
  },
  {
    path: "/Art/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Art_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/Art/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Art_EnglishNZ_Maori.mp3",
  },
  {
    path: "/Art/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Art_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/Art/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Art_EnglishNZ_Italian.mp3",
  },
  {
    path: "/Band/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Band_EnglishNZ_French.mp3",
  },
  {
    path: "/Band/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Band_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/Band/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Band_EnglishNZ_Maori.mp3",
  },
  {
    path: "/Band/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Band_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/Band/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Band_EnglishNZ_Italian.mp3",
  },
  {
    path: "/BikeRace/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/BikeRace_EnglishNZ_French.mp3",
  },
  {
    path: "/BikeRace/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/BikeRace_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/BikeRace/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/BikeRace_EnglishNZ_Maori.mp3",
  },
  {
    path: "/BikeRace/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/BikeRace_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/BikeRace/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/BikeRace_EnglishNZ_Italian.mp3",
  },
  {
    path: "/Garainbicicletta/Italian/English-NZ/",
    audioUrl: "https://content.poppyandbuddy.com/audio/BikeRace_Italian_EnglishNZ.mp3",
  },
  {
    path: "/Count/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Count_EnglishNZ_French.mp3",
  },
  {
    path: "/Count/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Count_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/Count/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Count_EnglishNZ_Maori.mp3",
  },
  {
    path: "/Count/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Count_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/Count/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Count_EnglishNZ_Italian.mp3",
  },
  {
    path: "/Dance/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Dance_EnglishNZ_French.mp3",
  },
  {
    path: "/Dance/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Dance_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/Dance/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Dance_EnglishNZ_Maori.mp3",
  },
  {
    path: "/Dance/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Dance_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/Dance/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Dance_EnglishNZ_Italian.mp3",
  },
  {
    path: "/KakapoDisco/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/KakapoDisco_EnglishNZ_French.mp3",
  },
  {
    path: "/KakapoDisco/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/KakapoDisco_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/KakapoDisco/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/KakapoDisco_EnglishNZ_Maori.mp3",
  },
  {
    path: "/KakapoDisco/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/KakapoDisco_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/KakapoDisco/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/KakapoDisco_EnglishNZ_Italian.mp3",
  },
  {
    path: "/Opposites/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Opposites_EnglishNZ_French.mp3",
  },
  {
    path: "/Opposites/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Opposites_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/Opposites/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Opposites_EnglishNZ_Maori.mp3",
  },
  {
    path: "/Opposites/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Opposites_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/Opposites/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Opposites_EnglishNZ_Italian.mp3",
  },
  {
    path: "/Party/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Party_EnglishNZ_French.mp3",
  },
  {
    path: "/Party/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Party_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/Party/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Party_EnglishNZ_Maori.mp3",
  },
  {
    path: "/Party/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Party_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/Party/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Party_EnglishNZ_Italian.mp3",
  },
  {
    path: "/Festa/Italian/English-NZ/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Party_Italian_EnglishNZ.mp3",
  },
  {
    path: "/Play/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Play_EnglishNZ_French.mp3",
  },
  {
    path: "/Play/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Play_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/Play/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Play_EnglishNZ_Maori.mp3",
  },
  {
    path: "/Play/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Play_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/Play/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/Play_EnglishNZ_Italian.mp3",
  },
  {
    path: "/TreasureHunt/English-NZ/French/",
    audioUrl: "https://content.poppyandbuddy.com/audio/TreasureHunt_EnglishNZ_French.mp3",
  },
  {
    path: "/TreasureHunt/English-NZ/Mandarin/",
    audioUrl: "https://content.poppyandbuddy.com/audio/TreasureHunt_EnglishNZ_Mandarin.mp3",
  },
  {
    path: "/TreasureHunt/English-NZ/Maori/",
    audioUrl: "https://content.poppyandbuddy.com/audio/TreasureHunt_EnglishNZ_Maori.mp3",
  },
  {
    path: "/TreasureHunt/English-NZ/Spanish-US/",
    audioUrl: "https://content.poppyandbuddy.com/audio/TreasureHunt_EnglishNZ_SpanishUS.mp3",
  },
  {
    path: "/TreasureHunt/English-NZ/Italian/",
    audioUrl: "https://content.poppyandbuddy.com/audio/TreasureHunt_EnglishNZ_Italian.mp3",
  },
] as const;

describe("generateStaticParams", () => {
  it("uses one normalized story segment per primary language without duplicates", async () => {
    const params = await generateStaticParams();
    const uniqueParams = new Set(params.map((param) => JSON.stringify(param)));

    expect(params).toContainEqual({
      StoryName: "BikeRace",
      PrimaryLanguage: "English-NZ",
      SecondaryLanguage: "Maori",
    });
    expect(params).toContainEqual({
      StoryName: "KakapoDisco",
      PrimaryLanguage: "English-NZ",
      SecondaryLanguage: "Spanish-US",
    });
    expect(params).toContainEqual({
      StoryName: "Garainbicicletta",
      PrimaryLanguage: "Italian",
      SecondaryLanguage: "English-NZ",
    });
    expect(params).not.toContainEqual({
      StoryName: "Bike Race",
      PrimaryLanguage: "English-NZ",
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

  it("generates exactly the hard-coded printed QR URL set", async () => {
    const generatedParams = await generateStaticParams();
    const generatedUrls = generatedParams.map(printedUrlFromParams).sort();
    const expectedUrls = EXPECTED_PRINTED_QR_URLS
      .map((printedUrl) => printedUrl.path)
      .sort();

    expect(generatedUrls).toEqual(expectedUrls);
  });

  it("handles every hard-coded printed QR URL and maps it to the expected audio file", async () => {
    for (const printedUrl of EXPECTED_PRINTED_QR_URLS) {
      const params = paramsFromPrintedUrl(printedUrl.path);

      notFound.mockClear();

      const page = await renderPage(params);
      const audioParams = audioParamsFromPage(page);

      expect(notFound, printedUrl.path).not.toHaveBeenCalled();
      expect(getAudioUrlForRoute(
        audioParams.StoryName,
        audioParams.PrimaryLanguage,
        audioParams.SecondaryLanguage,
      )).toBe(printedUrl.audioUrl);
    }
  });
});

describe("Page", () => {
  beforeEach(() => {
    notFound.mockClear();
  });

  it("normalizes languages and resolves the story from the primary-language URL segment", async () => {
    const page = await renderPage({
        StoryName: "Garainbicicletta",
        PrimaryLanguage: "Italian",
        SecondaryLanguage: "English-NZ",
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

  it("accepts printed English-primary KakapoDisco QR URLs", async () => {
    const page = await renderPage({
        StoryName: "KakapoDisco",
        PrimaryLanguage: "English-NZ",
        SecondaryLanguage: "Spanish-US",
    });

    expect(notFound).not.toHaveBeenCalled();
    expect(page).toMatchObject({
      props: {
        params: {
          StoryName: "KakapoDisco",
          PrimaryLanguage: "English-NZ",
          SecondaryLanguage: "Spanish-US",
        },
      },
      type: "mock-audio-player",
    });
  });

  it("calls notFound for invalid route params", async () => {
    await expect(
      renderPage({
          StoryName: "UnknownStory",
          PrimaryLanguage: "EnglishNZ",
          SecondaryLanguage: "Spanish_US",
      }),
    ).rejects.toThrow("NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("calls notFound for resolved params without a backing audio file", async () => {
    await expect(
      renderPage({
          StoryName: "Art",
          PrimaryLanguage: "Italian",
          SecondaryLanguage: "English-NZ",
      }),
    ).rejects.toThrow("NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("calls notFound for long-form story names with spaces", async () => {
    await expect(
      renderPage({
          StoryName: "Gara in bicicletta",
          PrimaryLanguage: "Italian",
          SecondaryLanguage: "English-NZ",
      }),
    ).rejects.toThrow("NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
