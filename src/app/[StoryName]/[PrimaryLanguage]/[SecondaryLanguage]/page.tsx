'use client';
import { useState, useRef, useEffect } from 'react';
import localFont from "next/font/local";
import Image from "next/image";
import { Flex, Button, Slider } from "@radix-ui/themes";
import { PlayIcon, PauseIcon, ReloadIcon } from "@radix-ui/react-icons"

import "./../../../AudioPlayer.css";

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
  display: string
}

interface BookName {
  language: string,
  display: string
}

interface BookNames {
  [key: string]: BookName[]
}

const LanguageMap: Language[] = [
  { key: "English-NZ", shortName: "EnglishNZ", display: "English NZ" },
  { key: "Mandarin", shortName: "Mandarin", display: "Mandarin" },
  { key: "French", shortName: "French", display: "French" },
  { key: "Spanish-US", shortName: "SpanishUS", display: "Spanish (Latin America)" },
  { key: "Maori", shortName: "Maori", display: "Te Reo Māori" },
];

const ValidBooks = [
  "Art",
  "BikeRace",
  "Band",
  "Count",
  "Dance",
  "KakapoDisco",
  "Opposites",
  "Party",
  "Play",
  "TreasureHunt"
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
    { language: "EnglishNZ", display: "Counting" },
    { language: "Maori", display: "Reihi paihikara" },
    { language: "Mandarin", display: "自行车比赛" },
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
    let intervalHandle: any;

    if (audioRef.current) {
      setMaxProgress(audioRef.current.duration);
      console.log("Max progress: " + audioRef.current.duration);
    }
    if (playing) {
      intervalHandle = setInterval(updateTimeline, 100);
      console.log("Starting timeline update");
    }
    return () => clearInterval(intervalHandle)
  }, [playing, seeking, progress]);

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
    console.log("skipping " + amount);
    if (audioRef.current) {
      audioRef.current.currentTime = audioRef.current.currentTime + amount;
    }
  }

  const seek = (value: number[]) => {
    setSeeking(true);
    setProgress(value);
    console.log("value changed: " + value);
  }

  const seekDone = (value: number[]) => {
    console.log("value committed: " + value[0]);
    setSeeking(false);
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value);
      console.log("currenTime: " + value);
    }
  }

  return (<>
    <div className="w-screen">
      <div className="sm:w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 h-screen content-center ml-auto mr-auto p-10">

        <div className="w-10/12 aspect-square ml-auto mr-auto items-start bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${CoverURL})` }}>

          <div className="w-6/6 h-1/6 mb-4"></div>

          <div className={`${gotham.className}
                antialiased
                object-scale-down 
                text-4xl
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
        <div className={`${gotham.className} antialiased text-lg text-white content-center text-center items-center p-5`}>{PrimaryLanguages?.display} / {SecondaryLanguages?.display}</div>
        <Flex direction="column" gap="0">
          <div className="flex justify-between">
            <Button radius="full" className="flex-none w-12 h-12 scale-x-[-1] ml-10 mt-2" onClick={() => { skip(-10) }}>
              <ReloadIcon className="flex-none w-8 h-8" />
            </Button>

            <Button radius="full" className="flex-none w-16 h-16" onClick={playToggle}>
              {playing && <PauseIcon className="flex-none w-8 h-8" />}
              {!playing && <PlayIcon className="flex-none w-8 h-8" />}
            </Button>

            <Button radius="full" className="flex-none w-12 h-12 mr-10 mt-2" onClick={() => { skip(10) }}>
              <ReloadIcon className="flex-none w-8 h-8" />
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