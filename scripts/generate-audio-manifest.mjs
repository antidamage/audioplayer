import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const sourceDirectory =
  process.env.AUDIO_SOURCE_DIR ?? "Y:\\Poppy & Buddy\\AudioPlayer\\web\\public\\audio";
const outputPath = path.join(
  repoRoot,
  "src",
  "app",
  "[StoryName]",
  "[PrimaryLanguage]",
  "[SecondaryLanguage]",
  "availableAudioRoutes.json",
);

function parseAudioFileName(fileName) {
  if (!fileName.endsWith(".mp3")) {
    return null;
  }

  const stem = fileName.slice(0, -4);
  const lastSeparator = stem.lastIndexOf("_");
  const secondLastSeparator = stem.lastIndexOf("_", lastSeparator - 1);

  if (lastSeparator === -1 || secondLastSeparator === -1) {
    throw new Error(`Unsupported audio file name format: ${fileName}`);
  }

  return {
    storyKey: stem.slice(0, secondLastSeparator),
    primaryLanguage: stem.slice(secondLastSeparator + 1, lastSeparator),
    secondaryLanguage: stem.slice(lastSeparator + 1),
  };
}

const manifest = readdirSync(sourceDirectory)
  .map(parseAudioFileName)
  .filter(Boolean)
  .sort((left, right) => {
    return (
      left.storyKey.localeCompare(right.storyKey) ||
      left.primaryLanguage.localeCompare(right.primaryLanguage) ||
      left.secondaryLanguage.localeCompare(right.secondaryLanguage)
    );
  });

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Wrote ${manifest.length} audio route entries to ${outputPath}`);
