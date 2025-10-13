import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { QuizAnswerGroup } from '@/types';
import React from 'react';
import Mark from './Mark';

export default function SingleQuizRow({ quizAnswer }: { quizAnswer: QuizAnswerGroup }) {
    return (
        <TableRow>
            <TableCell>{quizAnswer.userName}</TableCell>
            <TableCell>{quizAnswer.courseTitle}</TableCell>
            <TableCell>{quizAnswer.courseContentTitle}</TableCell>
            <TableCell>
                <Button className="cursor-default" variant={"outline"} > {typeof quizAnswer.mark === 'number' ? `${quizAnswer.mark}%` : quizAnswer.mark}</Button>
            </TableCell>
            <TableCell >
                <Mark quizAnswer={quizAnswer} />
            </TableCell>
        </TableRow>
    );
}