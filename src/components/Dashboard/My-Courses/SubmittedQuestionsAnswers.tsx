"use client";

import { Pagination } from "@/components/Global/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetQuestionsSubmitsForCurrentInstructorQuery,
  useUpdateContentStatusMutation,
} from "@/redux/api/courseContent";
import { SubmittedQuestion, TQueryParam } from "@/types";
import { formatDate } from "date-fns";
import { useSearchParams } from "next/navigation";
import { FaXmark } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { toast } from "sonner";

function SubmittedQuestionsAnswers() {
  const searchParams = useSearchParams();

  const page = searchParams?.get("page") || "";
  const role = searchParams?.get("role") || "";
  const searchTerm = searchParams?.get("searchTerm") || "";
  const status = searchParams?.get("status") || "";

  const queryFilter: TQueryParam[] = [
    { name: "page", value: page },
    { name: "role", value: role },
    { name: "searchTerm", value: searchTerm },
    { name: "status", value: status },
  ].filter((item) => item.value);

  const { data } = useGetQuestionsSubmitsForCurrentInstructorQuery(queryFilter);

  const questions = (data?.data ?? []) as SubmittedQuestion[];
  const totalPages = data?.meta?.totalPage ?? 0;
  return (
    <div>
      <Card>
        <CardContent className="space-y-3">
          <CardTitle>Submitted Answers</CardTitle>
          <CardDescription>List of all submitted answers</CardDescription>
        </CardContent>
        <CardContent className="px-0">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground w-[100px] pl-5">
                  User
                </TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Provided Answer</TableHead>
                <TableHead className="">Answered At</TableHead>
                <TableHead className="">Status</TableHead>
                <TableHead className="pr-5">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions?.map((question) => (
                <SingleQuestion question={question} key={question.id} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Pagination totalPages={totalPages} />
        </CardFooter>
      </Card>
    </div>
  );
}

export default SubmittedQuestionsAnswers;

const SingleQuestion = ({ question }: { question: SubmittedQuestion }) => {
  const [changeStatus, { isLoading }] = useUpdateContentStatusMutation();

  const handleStatusChange = async (status: true | false) => {
    try {
      const res = await changeStatus({
        answerId: question.id,
        isCorrect: status,
      }).unwrap();

      console.log(res);

      toast.success(res.message);
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  return (
    <TableRow className="">
      <TableCell className="pl-5">{question.user.fullName}</TableCell>

      <TableCell className="max-w-[40rem] truncate">
        {question.question.question}
      </TableCell>

      <TableCell className="max-w-[40rem] truncate">
        {question.providedAnswer}
      </TableCell>

      <TableCell className="pr-5">
        {formatDate(question.createdAt, "dd MM yy HH:mm")}
      </TableCell>

      <TableCell className="pr-5">
        <Badge
          className={` ${
            question.isCorrectAnswer === undefined ||
            question.isCorrectAnswer === null
              ? "bg-yellow-500 text-white" // Pending
              : question.isCorrectAnswer
                ? "bg-green-500 text-white" // Correct
                : "bg-red-500 text-white" // Wrong
          } `}
        >
          {question.isCorrectAnswer === undefined ||
          question.isCorrectAnswer === null
            ? "Pending"
            : question.isCorrectAnswer
              ? "Correct"
              : "Wrong"}
        </Badge>
      </TableCell>

      <TableCell className="space-x-2 pr-5">
        <Button
          onClick={() => {
            handleStatusChange(true);
          }}
          disabled={isLoading}
          size={"icon"}
          className="border border-green-500/5 bg-green-500/5 text-green-500 hover:bg-green-400/20 hover:text-green-400"
        >
          <TiTick />
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => {
            handleStatusChange(false);
          }}
          size={"icon"}
          className="border border-red-500/5 bg-red-500/5 text-red-500 hover:bg-red-400/20 hover:text-red-400"
        >
          <FaXmark />
        </Button>
      </TableCell>
    </TableRow>
  );
};
