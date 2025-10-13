import { QuizOptions } from "./course.type";

export type QuizAnswerGroup = {
    groupKey: string;
    userId: string;
    quizId: string;
    courseId: string;
    userName: string;
    userProfile: string | null;
    courseContentId: string;
    courseContentTitle: string;
    courseTitle: string;
    mark: 'Not Marked All' | number;
    totalAnswers: number;
    correctAnswers: 'Not Marked All' | number;
};

export type QuizAnswerInstructor = {
    quizId: string;
    index: number;
    isAnswered: boolean;
    answerId: string;
    question: string;
    userAnswer: string;
    type: "MULTIPLE_CHOICE" | "WRITE_ANSWER";
    isLocked: boolean;
    correctAnswer: string;
    isRight: boolean;
    options: QuizOptions
};

export type QuizAnswersData = {
    isAllAnswered: boolean;
    isAllMarked: boolean;
    total: number,
    correct: number,
    incorrect: number,
    markPercent: number,
    answers: QuizAnswerInstructor[];
};