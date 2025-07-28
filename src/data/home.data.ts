import fiqah from '@/assets/explore/fiqh.png'
import hadith from '@/assets/explore/hadith.png'
import aqueedah from '@/assets/explore/aqeedah.png'
import seerah from '@/assets/explore/seerah.png'
import tafsir from '@/assets/explore/tafsir.png'

export const courseCategories = [
    {
        id: "fiqh-sharia",
        title: "Fiqh & Sharia",
        courses: 27,
        icon: fiqah,
        ownClass: 'bg-[#CCE5FD]'
    },
    {
        id: "aqeedah",
        title: "Aqeedah",
        courses: 13,
        icon: aqueedah,
        ownClass: 'bg-[#FBE7A7]'
    },
    {
        id: "tafsir-quran",
        title: "Tafsir & Quran",
        courses: 20,
        icon: tafsir,
        ownClass: 'bg-[#FDD0DE]'
    },
    {
        id: "seerah",
        title: "Seerah",
        courses: 5,
        icon: seerah,
        ownClass: 'bg-[#D1F4DB]'
    },
    {
        id: "hadith",
        title: "Hadith",
        courses: 10,
        icon: hadith,
        ownClass: 'bg-[#C3EEFD]'
    },
];
