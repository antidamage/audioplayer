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

export const LanguageMap: Language[] = [
  { key: "English-NZ", shortName: "EnglishNZ", display: "English NZ", staticParams: ["English-NZ", "EnglishNZ", "English_NZ"] },
  { key: "Mandarin", shortName: "Mandarin", display: "Mandarin", staticParams: ["Mandarin", "Simplified-Chinese", "SimplifiedChinese", "Simplified_Chinese"] },
  { key: "French", shortName: "French", display: "French", staticParams: ["French"] },
  { key: "Spanish-US", shortName: "SpanishUS", display: "Spanish (Latin America)", staticParams: ["Spanish-US", "SpanishUS", "Spanish_US"] },
  { key: "Maori", shortName: "Maori", display: "Te Reo MÄori", staticParams: ["Maori", "Te Reo Maori", "Te-Reo-Maori", "TeReoMaori", "Te_Reo_Maori"] },
  { key: "Italian", shortName: "Italian", display: "Italian", staticParams: ["Italian"] },
];

export const BookNamesLocalised: BookNames = {
  "Art": [
    { language: "EnglishNZ", display: "Art" },
    { language: "Maori", display: "Toi" },
    { language: "Mandarin", display: "è‰ºæœ¯" },
    { language: "French", display: "Lâ€™art" },
    { language: "SpanishUS", display: "Arte" },
  ],

  "Band": [
    { language: "EnglishNZ", display: "Band" },
    { language: "Maori", display: "PÄ“ne" },
    { language: "Mandarin", display: "ä¹é˜Ÿ" },
    { language: "French", display: "Le groupe" },
    { language: "SpanishUS", display: "Banda" },
  ],

  "BikeRace": [
    { language: "EnglishNZ", display: "Bike Race" },
    { language: "Maori", display: "Reihi paihikara" },
    { language: "Mandarin", display: "è‡ªè¡Œè½¦æ¯”èµ›" },
    { language: "French", display: "La course de vÃ©lo" },
    { language: "SpanishUS", display: "Carrera de bicicletas" },
    { language: "Italian", display: "Gara in bicicletta" },
  ],

  "Count": [
    { language: "EnglishNZ", display: "Count" },
    { language: "Maori", display: "Kaute" },
    { language: "Mandarin", display: "æ•°æ•°" },
    { language: "French", display: "Compter" },
    { language: "SpanishUS", display: "Contar" },
  ],

  "Dance": [
    { language: "EnglishNZ", display: "Dance" },
    { language: "Maori", display: "Kanikani" },
    { language: "Mandarin", display: "è·³èˆž" },
    { language: "French", display: "La danse" },
    { language: "SpanishUS", display: "Bailar" },
  ],

  "KakapoDisco": [
    { language: "EnglishNZ", display: "KÄkÄpÅ Disco" },
    { language: "Maori", display: "Kanikani o ngÄ KÄkÄpÅ" },
    { language: "Mandarin", display: "å¡å¡æ³¢è¿ªæ–¯ç§‘åœ¨å“ªé‡Œ" },
    { language: "French", display: "La discothÃ¨que de KÄkÄpÅ" },
    { language: "SpanishUS", display: "La Disco De KÄkÄpÅ" },
  ],

  "Opposites": [
    { language: "EnglishNZ", display: "Opposites" },
    { language: "Maori", display: "NgÄ tauaro" },
    { language: "Mandarin", display: "åä¹‰è¯" },
    { language: "French", display: "Les contraires" },
    { language: "SpanishUS", display: "Opuestos" },
  ],

  "Party": [
    { language: "EnglishNZ", display: "Party" },
    { language: "Maori", display: "PÄti" },
    { language: "Mandarin", display: "å®´ä¼š" },
    { language: "French", display: "La fÃªte" },
    { language: "SpanishUS", display: "Fiesta" },
    { language: "Italian", display: "Festa" },
  ],

  "Play": [
    { language: "EnglishNZ", display: "Play" },
    { language: "Maori", display: "TÄkaro" },
    { language: "Mandarin", display: "çŽ©" },
    { language: "French", display: "Jouer" },
    { language: "SpanishUS", display: "Jugar" },
  ],

  "TreasureHunt": [
    { language: "EnglishNZ", display: "Treasure Hunt" },
    { language: "Maori", display: "Kimi taonga" },
    { language: "Mandarin", display: "å¯»å®" },
    { language: "French", display: "Chasse au trÃ©sor" },
    { language: "SpanishUS", display: "BÃºsqueda del tesoro" },
  ]
};

export const AvailableAudioRoutes: AvailableAudioRoute[] =
  availableAudioRoutes as AvailableAudioRoute[];

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
