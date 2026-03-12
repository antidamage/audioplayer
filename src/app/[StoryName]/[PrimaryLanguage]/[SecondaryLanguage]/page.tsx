import { notFound } from 'next/navigation';

import AudioPlayer from './AudioPlayer';
import {
  type AudioPlayerRouteParams,
  BookNamesLocalised,
  getLanguageAliases,
  getStoryAliases,
  resolveLanguageKey,
  resolveStoryKey,
} from './audioPlayerData';

export async function generateStaticParams(): Promise<AudioPlayerRouteParams[]> {
  const params: AudioPlayerRouteParams[] = [];

  for (const storyName in BookNamesLocalised) {
    const languages = BookNamesLocalised[storyName].map((entry) => entry.language);
    const storyAliases = getStoryAliases(storyName);

    for (const primaryLanguage of languages) {
      for (const secondaryLanguage of languages) {
        if (primaryLanguage === secondaryLanguage) {
          continue;
        }

        const primaryAliases = getLanguageAliases(primaryLanguage);
        const secondaryAliases = getLanguageAliases(secondaryLanguage);

        for (const storyAlias of storyAliases) {
          for (const primaryAlias of primaryAliases) {
            for (const secondaryAlias of secondaryAliases) {
              params.push({
                StoryName: storyAlias,
                PrimaryLanguage: primaryAlias,
                SecondaryLanguage: secondaryAlias,
              });
            }
          }
        }
      }
    }
  }

  return params;
}

export default function Page({ params }: { params: AudioPlayerRouteParams }) {
  const storyName = resolveStoryKey(params.StoryName);
  const primaryLanguage = resolveLanguageKey(params.PrimaryLanguage);
  const secondaryLanguage = resolveLanguageKey(params.SecondaryLanguage);

  if (!storyName || !primaryLanguage || !secondaryLanguage) {
    notFound();
  }

  return (
    <AudioPlayer
      params={{
        StoryName: storyName,
        PrimaryLanguage: primaryLanguage,
        SecondaryLanguage: secondaryLanguage,
      }}
    />
  );
}
