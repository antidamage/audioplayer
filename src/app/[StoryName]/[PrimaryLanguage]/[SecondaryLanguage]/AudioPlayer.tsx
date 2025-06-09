'use client';
import { useState, useRef, useEffect } from 'react';
import localFont from "next/font/local";
import { Flex, Button, Slider } from "@radix-ui/themes";
import { PlayIcon, PauseIcon, ReloadIcon } from "@radix-ui/react-icons"

import "./../../../AudioPlayer.css";

export const dynamicParams = false;

const gotham = localFont({
  src: "../../../../../public/f/Gotham-Rounded-Bold.woff2",
  variable: "--font-gotham",
  weight: "800",
});

interface AudioPlayerProps {
  StoryName: string,
  PrimaryLanguage: string,
  SecondaryLanguage: string
}

interface Language {
  key: string,
  shortName: string,
  display: string,
  staticParams: string[]
}

interface BookName {
  language: string,
  display: string
}

interface BookNames {
  [key: string]: BookName[]
}

type StaticParam = {
  primary: string;
  secondary: string;
  storyName: string;
};

const LanguageMap: Language[] = [
  { key: "English-NZ", shortName: "EnglishNZ", display: "English NZ", staticParams: ["English-NZ", "EnglishNZ", "English_NZ"] },
  { key: "Mandarin", shortName: "Mandarin", display: "Mandarin", staticParams: ["Mandarin", "Simplified-Chinese", "SimplifiedChinese", "Simplified_Chinese"] },
  { key: "French", shortName: "French", display: "French", staticParams: ["French"] },
  { key: "Spanish-US", shortName: "SpanishUS", display: "Spanish (Latin America)", staticParams: ["Spanish-US", "SpanishUS", "Spanish_US"] },
  { key: "Maori", shortName: "Maori", display: "Te Reo Māori", staticParams: ["Maori", "Te Reo Maori", "Te-Reo-Maori", "TeReoMaori", "Te_Reo_Maori"] },
];

const BookNamesLocalised: BookNames = {
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

function getAliasesForKey(key: string): string[] {
  return LanguageMap.find(lang => lang.key === key)?.staticParams ?? [];
}

export async function generateStaticParams(): Promise<StaticParam[]> {
  const params: StaticParam[] = [];
  for (const storyName in BookNamesLocalised) {
    const langs = BookNamesLocalised[storyName].map(entry => entry.language);
    for (const primaryKey of langs) {
      for (const secondaryKey of langs) {
        if (primaryKey !== secondaryKey) {
          const primaryAliases = getAliasesForKey(primaryKey);
          const secondaryAliases = getAliasesForKey(secondaryKey);
          if (!primaryAliases.length || !secondaryAliases.length) continue;
          for (const primary of primaryAliases) {
            for (const secondary of secondaryAliases) {
              params.push({
                primary,
                secondary,
                storyName,
              });
            }
          }
        }
      }
    }
  }
  return params;
}

export default function AudioPlayer({ params }: { params: AudioPlayerProps }) {
  const { StoryName, PrimaryLanguage, SecondaryLanguage }: AudioPlayerProps = params;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [maxProgress, setMaxProgress] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const PrimaryLanguages: Language | undefined = LanguageMap.find(lang => lang.key === PrimaryLanguage);
  const SecondaryLanguages: Language | undefined = LanguageMap.find(lang => lang.key === SecondaryLanguage);
  const PrimaryStoryName: BookName | undefined = BookNamesLocalised[StoryName]?.find(book => book.language === PrimaryLanguages?.shortName);
  const SecondaryStoryName: BookName | undefined = BookNamesLocalised[StoryName]?.find(book => book.language === SecondaryLanguages?.shortName);

  const CoverURL = "/img/cover/Cover" + StoryName + ".png";

  useEffect(() => {
    let intervalHandle: NodeJS.Timeout;

    if (audioRef.current) {
      setMaxProgress(audioRef.current.duration);
    }
    if (playing) {
      intervalHandle = setInterval(updateTimeline, 100);
    }
    return () => clearInterval(intervalHandle)
  }, [playing, seeking]);

  const updateTimeline = () => {
    if (audioRef.current && playing && !seeking) {
      setProgress([audioRef.current.currentTime]);
    }
  }

  const playToggle = () => {
    if (!playing && audioRef.current) {
      playStart();
    } else if (playing && audioRef.current) {
      playStop();
    }
  }

  const playStart = () => {
    setPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = progress[0];
      audioRef.current.play();
    }
  }

  const playStop = () => {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }

  const skip = (amount: number) => {
    // Skip the amount
    if (audioRef.current) {
      audioRef.current.currentTime = audioRef.current.currentTime + amount;
    }
  }

  const seek = (value: number[]) => {
    setSeeking(true);
    setProgress(value);
  }

  const seekDone = (value: number[]) => {
    setSeeking(false);
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value);
    }
  }

  return (<>
    <div className="w-screen">
      <div className="sm:w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 h-screen content-center ml-auto mr-auto p-10">

        {/* <div className="text-black font-bold text-lg">
          <span className="invisible 7xs:visible mr-3">7xs</span>
          <span className="invisible 6xs:visible mr-3">6xs</span>
          <span className="invisible 5xs:visible mr-3">5xs</span>
          <span className="invisible 4xs:visible mr-3">4xs</span>
          <span className="invisible 3xs:visible mr-3">3xs</span>
          <span className="invisible 2xs:visible mr-3">2xs</span>
          <span className="invisible xs:visible mr-3">xs</span>
          <span className="invisible sm:visible mr-3">sm</span>
          <span className="invisible md:visible mr-3">md</span>
          <span className="invisible lg:visible mr-3">lg</span>
          <span className="invisible xl:visible mr-3">xl</span>
          <span className="invisible 2xl:visible mr-3">2xl</span>
          <span className="invisible 3xl:visible mr-3">3xl</span>
          <span className="invisible 4xl:visible mr-3">4xl</span>
          <span className="invisible 5xl:visible mr-3">5xl</span>
          <span className="invisible 6xl:visible mr-3">6xl</span>
          <span className="invisible 7xl:visible mr-3">7xl</span>
        </div> */}

        <div className="w-10/12 aspect-square ml-auto mr-auto items-start bg-contain bg-no-repeat bg-center shadow-2xl"
          style={{ backgroundImage: `url(${CoverURL})` }}>

          <div className="w-6/6 h-1/6 mb-4"></div>

          <div className={`${gotham.className}
                antialiased

                
                text-3xl

                landscape:text-coverlandscape
                portrait:text-coverportrait

                //.title

                // 7xl:text-8xl
                // 6xl:text-7xl
                // 5xl:text-6xl
                // 4xl:text-5xl
                // 3xl:text-4xl
                // 2xl:text-3xl
                // xl:text-3xl
                // lg:text-3xl
                // md:text-3xl
                // sm:text-4xl
                // xs:text-3xl
                // 2xs:text-3xl
                // 3xs:text-lg
                // 4xs:text-sm
                // 5xs:text-sm
                // 6xs:text-sm
                // 7xs:text-sm

                [line-height:_1.0]

                font-bold
                text-white
                text-center
                content-center
                drop-shadow-lg
                ml-10
                mr-10
                h-1/6
                [text-shadow:_.05em_.05em_1px_rgb(0_0_0_/_80%)]`}>
            {PrimaryStoryName?.display} / {SecondaryStoryName?.display}</div>
        </div>
        <div className={`${gotham.className} antialiased text-lg text-slate-600 dark:text-white content-center text-center items-center p-5`}>{PrimaryLanguages?.display} / {SecondaryLanguages?.display}</div>
        <Flex direction="column" gap="0">
          <div className="flex justify-between">
            <Button radius="full" className="flex-none w-14 h-14 ml-10 mt-2 border-solid border-2 border-teal-400" onClick={() => { skip(-10) }}>
              <ReloadIcon className="flex-none w-11 h-11 scale-x-[-1] text-teal-200" />
              <div className="absolute text-center font-bold text-xs text-teal-200">10</div>
            </Button>

            <Button radius="full" className="flex-none w-16 h-16 border-solid border-2 border-teal-400" onClick={playToggle}>
              {playing && <PauseIcon className="flex-none w-8 h-8" />}
              {!playing && <PlayIcon className="flex-none w-8 h-8" />}
            </Button>

            <Button radius="full" className="flex-none w-14 h-14 mr-10 mt-2 border-solid border-2 border-teal-400" onClick={() => { skip(10) }}>
              <ReloadIcon className="flex-none w-11 h-11 text-teal-200" />
              <div className="absolute text-center mr-1 font-bold text-xs text-teal-200">10</div>
            </Button>
          </div>

          <Slider
            value={progress}
            defaultValue={progress}
            max={maxProgress} step={1}

            onValueChange={seek}
            onValueCommit={seekDone}

            className="scale-[130%] mt-10 flex basis-full grow ml-10 mr-10"
            size="3" color="teal" variant="soft" radius="full"
          />

          <audio className="hidden" ref={audioRef} src={`https://content.poppyandbuddy.com/audio/${StoryName}_${PrimaryLanguages?.shortName}_${SecondaryLanguages?.shortName}.mp3`}>
            Sorry, your browser does not support audio playback.
          </audio >

        </Flex >
      </div >
    </div >
  </>);
}