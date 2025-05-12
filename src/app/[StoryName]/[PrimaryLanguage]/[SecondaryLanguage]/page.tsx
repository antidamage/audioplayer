import AudioPlayer from './AudioPlayer';

interface AudioPlayerProps {
    StoryName: string;
    PrimaryLanguage: string;
    SecondaryLanguage: string;
}

interface BookName {
    language: string;
    display: string;
}

interface BookNames {
    [key: string]: BookName[];
}

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

export async function generateStaticParams() {
    const params = [];

    for (const storyName in BookNamesLocalised) {
        const langs = BookNamesLocalised[storyName].map(entry => entry.language);

        for (const primary of langs) {
            for (const secondary of langs) {
                if (primary !== secondary) {
                    params.push({
                        StoryName: storyName,
                        PrimaryLanguage: primary,
                        SecondaryLanguage: secondary,
                    });
                }
            }
        }
    }
    return params;
}

export default function Page({ params }: { params: AudioPlayerProps }) {
    return <AudioPlayer params={params} />;
}
