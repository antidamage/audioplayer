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
  { key: "Maori", shortName: "Maori", display: "Te Reo Māori", staticParams: ["Maori", "Te Reo Maori", "Te-Reo-Maori", "TeReoMaori", "Te_Reo_Maori"] },
  { key: "Italian", shortName: "Italian", display: "Italian", staticParams: ["Italian"] },
];

export const BookNamesLocalised: BookNames = {
  "Art": [
    { language: "EnglishNZ", display: "Art" },
    { language: "Maori", display: "Toi" },
    { language: "Mandarin", display: "艺术" },
    { language: "French", display: "L’art" },
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

function normaliseRouteSegment(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s'’_-]+/g, "")
    .toLowerCase();
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

export function getStoryAliases(storyKey: string): string[] {
  const storyNames = BookNamesLocalised[storyKey] ?? [];
  return Array.from(new Set([storyKey, ...storyNames.map((storyName) => storyName.display)]));
}

export function getStoryAliasesForLanguage(
  storyKey: string,
  languageShortName?: string,
): string[] {
  const storyName = getStoryName(storyKey, languageShortName);

  return Array.from(new Set([storyKey, ...(storyName ? [storyName.display] : [])]));
}

export function resolveStoryKey(input: string): string | undefined {
  if (BookNamesLocalised[input]) {
    return input;
  }

  const target = normaliseRouteSegment(input);

  for (const [storyKey, storyNames] of Object.entries(BookNamesLocalised)) {
    if (normaliseRouteSegment(storyKey) === target) {
      return storyKey;
    }

    if (storyNames.some((storyName) => normaliseRouteSegment(storyName.display) === target)) {
      return storyKey;
    }
  }

  return undefined;
}

export function getStoryName(storyKey: string, languageShortName?: string): BookName | undefined {
  if (!languageShortName) {
    return undefined;
  }

  return BookNamesLocalised[storyKey]?.find((storyName) => storyName.language === languageShortName);
}

export function isStoryAliasValidForLanguage(
  input: string,
  storyKey: string,
  languageShortName?: string,
): boolean {
  const target = normaliseRouteSegment(input);

  return getStoryAliasesForLanguage(storyKey, languageShortName).some(
    (storyAlias) => normaliseRouteSegment(storyAlias) === target,
  );
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
