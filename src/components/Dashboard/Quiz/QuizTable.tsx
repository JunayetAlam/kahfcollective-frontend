"use client"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function QuizTable() {
    const quizData = [
        {
            student: "Ahmed Khan",
            course: "Principles Of Adab",
            quiz: "Quiz 1: Intro to Adab",
            score: "85%",
        },
        {
            student: "Ahmed Khan",
            course: "Principles Of Adab",
            quiz: "Quiz 1: Intro to Adab",
            score: "85%",
        },
        {
            student: "Ahmed Khan",
            course: "Principles Of Adab",
            quiz: "Quiz 1: Intro to Adab",
            score: "85%",
        },
        {
            student: "Ahmed Khan",
            course: "Principles Of Adab",
            quiz: "Quiz 1: Intro to Adab",
            score: "85%",
        },
        {
            student: "Ahmed Khan",
            course: "Principles Of Adab",
            quiz: "Quiz 1: Intro to Adab",
            score: "85%",
        },
        {
            student: "Ahmed Khan",
            course: "Principles Of Adab",
            quiz: "Quiz 1: Intro to Adab",
            score: "85%",
        },
    ]

    return (
        <div>
            <div>
                <h2 className="text-xl font-semibold">Quiz Performance</h2>
                <p className="text-sm text-muted-foreground">
                    Review quiz scores for your students across all courses
                </p>
            </div>

            <div className="rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Students</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Quiz</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quizData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.student}</TableCell>
                                <TableCell>{row.course}</TableCell>
                                <TableCell>{row.quiz}</TableCell>
                                <TableCell className="text-right font-medium">
                                    <Button variant={"outline"} > {row.score}</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
