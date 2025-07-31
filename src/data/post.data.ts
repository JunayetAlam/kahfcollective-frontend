import { CommentType, PostType } from "@/types";
import user1 from '@/assets/user1.jpg'
import user2 from '@/assets/user2.png'
import user3 from '@/assets/user3.jpg'
export const posts: PostType[] = [
    {
        author: "Nouman Ali Khan",
        authorProfile: user2.src,
        timeAgo: "2 hours ago",
        content:
            "Exploring the deeper spiritual dimensions of Ramadan and how it transforms the Muslim soul through self-discipline, empathy, and spiritual purification.",
        likes: 150,
        comments: 200,
    },
    {
        author: "Junayet",
        timeAgo: "5 hours ago",
        authorProfile: user1.src,
        content:
            "The power of sincere du'a during hardship and how it connects us to Allah’s mercy and wisdom.",
        likes: 220,
        comments: 180,
    },
    {
        author: "Mufti Menk",
        timeAgo: "1 day ago",
        authorProfile: user3.src,
        content:
            "Tips for maintaining spiritual consistency after Ramadan: practical ways to stay connected with the Qur’an and regular prayer.",
        likes: 310,
        comments: 275,
    },
];



export const comments: CommentType[] = [
    {
        id: "1",
        username: "Junayet",
        userAvatarUrl: user1.src,
        comment: "This article was very insightful. JazakAllah khair for sharing!"
    },
    {
        id: "2",
        username: "Mufti Menk",
        userAvatarUrl: user3.src,
        comment: "I learned a lot from this post. May Allah reward you!"
    },
    {
        id: "3",
        username: 'Nouman ali khan',
        userAvatarUrl: user2.src,
        comment: "Such an important topic. Thank you for highlighting it!"
    }
];
