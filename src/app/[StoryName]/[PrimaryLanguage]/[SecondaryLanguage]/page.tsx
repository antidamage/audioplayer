import { notFound } from 'next/navigation';

import AudioPlayer from './AudioPlayer';
import {
  type AudioPlayerRouteParams,
  AvailableAudioRoutes,
  getLanguageByKey,
  getLanguageAliases,
  getStoryAliasesForLanguage,
  hasAvailableAudioRoute,
  isStoryAliasValidForLanguage,
  resolveLanguageKey,
  resolveStoryKey,
} from './audioPlayerData';

export async function generateStaticParams(): Promise<AudioPlayerRouteParams[]> {
  const params: AudioPlayerRouteParams[] = [];

  for (const route of AvailableAudioRoutes) {
    const storyAliases = getStoryAliasesForLanguage(route.storyKey, route.primaryLanguage);
    const primaryAliases = getLanguageAliases(route.primaryLanguage);
    const secondaryAliases = getLanguageAliases(route.secondaryLanguage);

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

  return params;
}

export default function Page({ params }: { params: AudioPlayerRouteParams }) {
  const storyName = resolveStoryKey(params.StoryName);
  const primaryLanguage = resolveLanguageKey(params.PrimaryLanguage);
  const secondaryLanguage = resolveLanguageKey(params.SecondaryLanguage);
  const primaryLanguageShortName = primaryLanguage
    ? getLanguageByKey(primaryLanguage)?.shortName
    : undefined;

  if (
    !storyName ||
    !primaryLanguage ||
    !secondaryLanguage ||
    !isStoryAliasValidForLanguage(params.StoryName, storyName, primaryLanguageShortName) ||
    !hasAvailableAudioRoute(storyName, primaryLanguage, secondaryLanguage)
  ) {
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
