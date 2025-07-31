import { CourseCardType, Module } from "@/types";

export const courses: CourseCardType[] = [
    {
        id: "course1",
        title: "Foundations of Islamic Faith (Aqeedah)",
        rating: 4.5,
        instructor: "Sheikh Yusuf",
        instructorProfile: 'https://images.unsplash.com/photo-1703144407913-4eee60a89b00?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        lessons: 8,
        image: "https://images.unsplash.com/photo-1577561426384-62154a1e9457?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "course2",
        title: "Tafsir of Juz Amma",
        rating: 4.8,
        instructor: "Ustadh Kareem",
        instructorProfile: 'https://plus.unsplash.com/premium_photo-1681491915180-9f08ef6b43db?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        lessons: 12,
        image: "https://plus.unsplash.com/premium_photo-1679760773927-238b275cca96?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "course3",
        title: "Arabic Grammar for Beginners",
        rating: 4.7,
        instructor: "Dr. Amina Hassan",
        instructorProfile: 'https://images.unsplash.com/photo-1581294958576-36903fe82ed4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        lessons: 15,
        image: "https://images.unsplash.com/photo-1624357824434-27d181804b20?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "course4",
        title: "Life of Prophet Muhammad (Sīrah)",
        rating: 4.9,
        instructor: "Imam Ahmad",
        instructorProfile: 'https://plus.unsplash.com/premium_photo-1726750803918-4081ab5e7168?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        lessons: 10,
        image: "https://images.unsplash.com/photo-1570732092255-b401f836f11c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "course5",
        title: "Daily Duʿās & Supplications",
        rating: 4.6,
        instructor: "Sister Layla",
        instructorProfile: 'https://images.unsplash.com/photo-1590323007493-7e4cc5943d2b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        lessons: 20,
        image: "https://images.unsplash.com/photo-1651309736651-c90a9b6ffe58?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "course6",
        title: "Introduction to Ḥadīth Studies",
        rating: 4.4,
        instructor: "Mufti Rahman",
        instructorProfile: 'https://images.unsplash.com/photo-1703144407913-4eee60a89b00?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        lessons: 14,
        image: "https://plus.unsplash.com/premium_photo-1678483063222-b9cbc116b371?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
];


export const courseModules: Module[] = [
  {
    id: "module-1",
    name: "Module 1: Introduction to Tawheed",
    courseCount: 3,
    items: [
      { id: "item-1-1", type: "video", title: "Mentor Introduction", duration: "3 minutes" },
      { id: "item-1-2", type: "video", title: "Tawheed ar-Rububiyyah", duration: "5 minutes" },
      { id: "item-1-3", type: "document", title: "Tawheed ar-Rububiyyah Notes", duration: "10 Questions" },
      { id: "item-1-4", type: "quiz", title: "Quiz: Introduction Check", duration: "5 Questions" },
    ],
  },
  {
    id: "module-2",
    name: "Module 2: Deeper Understanding",
    courseCount: 4,
    items: [
      { id: "item-2-1", type: "video", title: "Deep Dive into Tawheed", duration: "20 minutes" },
      { id: "item-2-2", type: "video", title: "Tawheed and its Branches", duration: "19 minutes" },
      { id: "item-2-3", type: "document", title: "Supplementary Reading", duration: "7 Questions" },
      { id: "item-2-4", type: "quiz", title: "Quiz: Deeper Understanding", duration: "10 Questions" },
    ],
  },
  {
    id: "module-3",
    name: "Module 3: Practical Applications",
    courseCount: 5,
    items: [
      { id: "item-3-1", type: "video", title: "Applying Tawheed in Life", duration: "15 minutes" },
      { id: "item-3-2", type: "document", title: "Practical Examples", duration: "5 Questions" },
      { id: "item-3-3", type: "quiz", title: "Quiz: Practical Knowledge", duration: "8 Questions" },
    ],
  },
  {
    id: "module-4",
    name: "Module 4: Final Assessment",
    courseCount: 5,
    items: [
      { id: "item-4-1", type: "video", title: "Final Review", duration: "15 minutes" },
      { id: "item-4-2", type: "document", title: "Final Notes", duration: "5 Questions" },
      { id: "item-4-3", type: "quiz", title: "Final Quiz", duration: "20 Questions" },
    ],
  },
];

