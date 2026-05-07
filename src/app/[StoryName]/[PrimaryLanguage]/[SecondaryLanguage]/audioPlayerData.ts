// PRODUCTION QR-CODE DATA CONTRACT
// This file maps printed book QR-code URL fragments to internal audio filenames.
// Do not generate route combinations from language/story metadata, do not add
// friendly aliases, and do not localize story URL segments from secondary
// languages. The supported public URLs are intentionally hard-coded in
// page.test.tsx and must stay compatible with already-printed books.
import availableAudioRoutes from "./availableAudioRoutes.json";

export interface AudioPlayerRouteParams {
  StoryName: string;
  PrimaryLanguage: string;
  SecondaryLanguage: string;
}

export interface Language {
  key: string;
  shortName: string;
  display: string;
  staticParams: string[];
}

export interface BookName {
  language: string;
  display: string;
}

export interface AvailableAudioRoute {
  storyKey: string;
  primaryLanguage: string;
  secondaryLanguage: string;
}

export type BookNames = Record<string, BookName[]>;

// Printed QR-code contract: do not rename, "clean up", localize, or add
// alternate generated URL language fragments here. These exact fragments are
// printed in books: English-NZ, Spanish-US, Maori, Mandarin, Italian, French.
// shortName is only for internal audio filenames.
export const LanguageMap: Language[] = [
  { key: "English-NZ", shortName: "EnglishNZ", display: "English NZ", staticParams: ["English-NZ"] },
  { key: "Mandarin", shortName: "Mandarin", display: "Mandarin", staticParams: ["Mandarin"] },
  { key: "French", shortName: "French", display: "French", staticParams: ["French"] },
  { key: "Spanish-US", shortName: "SpanishUS", display: "Spanish (Latin America)", staticParams: ["Spanish-US"] },
  { key: "Maori", shortName: "Maori", display: "Te Reo Maori", staticParams: ["Maori"] },
  { key: "Italian", shortName: "Italian", display: "Italian", staticParams: ["Italian"] },
];

export const BookNamesLocalised: BookNames = {
  "Art": [
    { language: "EnglishNZ", display: "Art" },
    { language: "Maori", display: "Toi" },
    { language: "Mandarin", display: "艺术" },
    { language: "French", display: "L'art" },
    { language: "SpanishUS", display: "Arte" },
  ],

  "Band": [
    { language: "EnglishNZ", display: "Band" },
    { language: "Maori", display: "Pēne" },
    { language: "Mandarin", display: "乐队" },
    { language: "French", display: "Le groupe" },
    { language: "SpanishUS", display: "Banda" },
  ],

  "BikeRace": [
    { language: "EnglishNZ", display: "Bike Race" },
    { language: "Maori", display: "Reihi paihikara" },
    { language: "Mandarin", display: "自行车比赛" },
    { language: "French", display: "La course de vélo" },
    { language: "SpanishUS", display: "Carrera de bicicletas" },
    { language: "Italian", display: "Gara in bicicletta" },
  ],

  "Count": [
    { language: "EnglishNZ", display: "Count" },
    { language: "Maori", display: "Kaute" },
    { language: "Mandarin", display: "数数" },
    { language: "French", display: "Compter" },
    { language: "SpanishUS", display: "Contar" },
  ],

  "Dance": [
    { language: "EnglishNZ", display: "Dance" },
    { language: "Maori", display: "Kanikani" },
    { language: "Mandarin", display: "跳舞" },
    { language: "French", display: "La danse" },
    { language: "SpanishUS", display: "Bailar" },
  ],

  "KakapoDisco": [
    { language: "EnglishNZ", display: "Kākāpō Disco" },
    { language: "Maori", display: "Kanikani o ngā Kākāpō" },
    { language: "Mandarin", display: "卡卡波迪斯科在哪里" },
    { language: "French", display: "La discothèque de Kākāpō" },
    { language: "SpanishUS", display: "La Disco De Kākāpō" },
  ],

  "Opposites": [
    { language: "EnglishNZ", display: "Opposites" },
    { language: "Maori", display: "Ngā tauaro" },
    { language: "Mandarin", display: "反义词" },
    { language: "French", display: "Les contraires" },
    { language: "SpanishUS", display: "Opuestos" },
  ],

  "Party": [
    { language: "EnglishNZ", display: "Party" },
    { language: "Maori", display: "Pāti" },
    { language: "Mandarin", display: "宴会" },
    { language: "French", display: "La fête" },
    { language: "SpanishUS", display: "Fiesta" },
    { language: "Italian", display: "Festa" },
  ],

  "Play": [
    { language: "EnglishNZ", display: "Play" },
    { language: "Maori", display: "Tākaro" },
    { language: "Mandarin", display: "玩" },
    { language: "French", display: "Jouer" },
    { language: "SpanishUS", display: "Jugar" },
  ],

  "TreasureHunt": [
    { language: "EnglishNZ", display: "Treasure Hunt" },
    { language: "Maori", display: "Kimi taonga" },
    { language: "Mandarin", display: "寻宝" },
    { language: "French", display: "Chasse au trésor" },
    { language: "SpanishUS", display: "Búsqueda del tesoro" },
  ]
};

export const AvailableAudioRoutes: AvailableAudioRoute[] =
  availableAudioRoutes as AvailableAudioRoute[];

// Availability contract:
// - EnglishNZ is the primary language for every story, with all other shipped
//   languages as secondary languages.
// - Italian is a primary language only for BikeRace and Party, with EnglishNZ
//   as the only secondary language.
// This contract must stay as explicit hard-coded data in availableAudioRoutes;
// do not replace it with generated matrix logic. No other primary language
// routes should be added unless the printed QR-code and audio-file contracts
// are deliberately changed together. The page smoke tests intentionally keep
// a separate hard-coded printed URL list so accidental route generation changes
// cannot bless themselves by changing this manifest alone.

function getAvailableAudioRouteId(
  storyKey: string,
  primaryLanguage: string,
  secondaryLanguage: string,
): string {
  return `${storyKey}::${primaryLanguage}::${secondaryLanguage}`;
}

const AvailableAudioRouteSet = new Set(
  AvailableAudioRoutes.map((route) =>
    getAvailableAudioRouteId(route.storyKey, route.primaryLanguage, route.secondaryLanguage),
  ),
);

function toRouteSegment(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s'\u2019_-]+/g, "");
}

function normaliseRouteSegment(value: string): string {
  return toRouteSegment(value).toLowerCase();
}

export function getLanguageByKey(key: string): Language | undefined {
  return LanguageMap.find((language) => language.key === key);
}

export function getLanguageAliases(shortName: string): string[] {
  return LanguageMap.find((language) => language.shortName === shortName)?.staticParams ?? [];
}

export function getLanguageRouteParam(shortName: string): string | undefined {
  return LanguageMap.find((language) => language.shortName === shortName)?.staticParams[0];
}

export function resolveLanguageKey(input: string): string | undefined {
  return LanguageMap.find((language) => language.staticParams.includes(input) || language.key === input)?.key;
}

export function getStoryName(storyKey: string, languageShortName?: string): BookName | undefined {
  if (!languageShortName) {
    return undefined;
  }

  return BookNamesLocalised[storyKey]?.find((storyName) => storyName.language === languageShortName);
}

export function getStoryUrlSegment(
  storyKey: string,
  languageShortName?: string,
): string {
  // Printed QR-code contract: the story URL segment is derived from the
  // primary language only. Never use the secondary language to localize this
  // segment. English primary routes must keep the stable story key.
  if (languageShortName === "EnglishNZ") {
    return storyKey;
  }

  return toRouteSegment(getStoryName(storyKey, languageShortName)?.display ?? storyKey);
}

export function resolveStoryKeyForLanguageSegment(
  input: string,
  languageShortName?: string,
): string | undefined {
  if (!languageShortName) {
    return undefined;
  }

  const target = normaliseRouteSegment(input);

  for (const storyKey of Object.keys(BookNamesLocalised)) {
    if (normaliseRouteSegment(getStoryUrlSegment(storyKey, languageShortName)) === target) {
      return storyKey;
    }
  }

  return undefined;
}

export function hasAvailableAudioRoute(
  storyKey: string,
  primaryLanguageKey: string,
  secondaryLanguageKey: string,
): boolean {
  const primaryLanguage = getLanguageByKey(primaryLanguageKey)?.shortName;
  const secondaryLanguage = getLanguageByKey(secondaryLanguageKey)?.shortName;

  if (!primaryLanguage || !secondaryLanguage) {
    return false;
  }

  return AvailableAudioRouteSet.has(
    getAvailableAudioRouteId(storyKey, primaryLanguage, secondaryLanguage),
  );
}

export function getAudioUrlForRoute(
  storyKey: string,
  primaryLanguageKey: string,
  secondaryLanguageKey: string,
): string | undefined {
  const primaryLanguage = getLanguageByKey(primaryLanguageKey)?.shortName;
  const secondaryLanguage = getLanguageByKey(secondaryLanguageKey)?.shortName;

  if (!primaryLanguage || !secondaryLanguage) {
    return undefined;
  }

  return `https://content.poppyandbuddy.com/audio/${storyKey}_${primaryLanguage}_${secondaryLanguage}.mp3`;
}
