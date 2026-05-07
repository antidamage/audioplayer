// PRODUCTION QR-CODE ROUTE CONTRACT
// This route is reached by already-printed book QR codes. Do not optimize,
// rename, infer, localize from secondary language, or otherwise reshape these
// URLs. Any change here must preserve the hard-coded URL list in page.test.tsx
// and the explicit route manifest in availableAudioRoutes.json.
import { notFound } from 'next/navigation';

import AudioPlayer from './AudioPlayer';
import {
  type AudioPlayerRouteParams,
  AvailableAudioRoutes,
  getLanguageByKey,
  getLanguageAliases,
  getStoryUrlSegment,
  hasAvailableAudioRoute,
  resolveLanguageKey,
  resolveStoryKeyForLanguageSegment,
} from './audioPlayerData';

export async function generateStaticParams(): Promise<AudioPlayerRouteParams[]> {
  const params: AudioPlayerRouteParams[] = [];

  for (const route of AvailableAudioRoutes) {
    // Printed QR-code production contract:
    // - Do not synthesize a language/story matrix here.
    // - Do not expand "friendly" aliases here.
    // - Do not localize StoryName from SecondaryLanguage.
    // Static params are only the hard-coded routes in availableAudioRoutes.json.
    // The smoke tests compare this output against a hard-coded printed QR URL
    // list. If a printed URL changes, books already in the world can break.
    const storySegment = getStoryUrlSegment(route.storyKey, route.primaryLanguage);
    const primaryAliases = getLanguageAliases(route.primaryLanguage);
    const secondaryAliases = getLanguageAliases(route.secondaryLanguage);

    for (const primaryAlias of primaryAliases) {
      for (const secondaryAlias of secondaryAliases) {
        params.push({
          StoryName: storySegment,
          PrimaryLanguage: primaryAlias,
          SecondaryLanguage: secondaryAlias,
        });
      }
    }
  }

  return params;
}

export default function Page({ params }: { params: AudioPlayerRouteParams }) {
  const primaryLanguage = resolveLanguageKey(params.PrimaryLanguage);
  const secondaryLanguage = resolveLanguageKey(params.SecondaryLanguage);
  const primaryLanguageShortName = primaryLanguage
    ? getLanguageByKey(primaryLanguage)?.shortName
    : undefined;
  const storyName = resolveStoryKeyForLanguageSegment(
    params.StoryName,
    primaryLanguageShortName,
  );
  const expectedStorySegment = storyName
    ? getStoryUrlSegment(storyName, primaryLanguageShortName)
    : undefined;

  if (
    !storyName ||
    !primaryLanguage ||
    !secondaryLanguage ||
    !primaryLanguageShortName ||
    params.StoryName !== expectedStorySegment ||
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
