"use client"
import { Pagination } from "@/components/Global/Pagination"
import TableSkeleton from "@/components/Global/TableSkeleton"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useGetAllQuizAnswersQuery } from "@/redux/api/ansQuizApi"
import { TQueryParam } from "@/types"
import { useSearchParams } from "next/navigation"
import SingleQuizRow from "./SingleQuizRow"

export default function QuizTable() {
    const args: TQueryParam[] = []
    const searchParams = useSearchParams();
    const page = searchParams.get('page') || '';
    if (page) args.push({ name: 'page', value: page })
    const { data, isLoading } = useGetAllQuizAnswersQuery(args);
    if (isLoading) {
        return <TableSkeleton headers={['Students', 'Course', 'Assessment', 'Score', 'Action']} />
    }
    const quizData = data?.data || [];


    return (
        <div>
            <div>
                <h2 className="text-xl font-semibold">Assessment Performance</h2>
                <p className="text-sm text-muted-foreground">
                    Review Assessment scores for your students across all courses
                </p>
            </div>

            <div className="rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Students</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Assessment</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody colSpan={5}>
                        {quizData.map((row) => (
                            <SingleQuizRow key={row.groupKey} quizAnswer={row} />
                        ))}
                    </TableBody>
                </Table>

                <Pagination totalPages={data?.meta?.totalPage || 0} />
            </div>
        </div>
    )
}
