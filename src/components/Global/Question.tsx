/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateQuestionAnswerMutation } from "@/redux/api/question";
import { CourseContents } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button"; // Assuming you have a Button component
import { Textarea } from "../ui/textarea";

interface QuestionProps {
  contents: CourseContents;
}

export default function Question({ contents }: QuestionProps) {
  const [createAnswer, { isLoading }] = useCreateQuestionAnswerMutation();
  const [answerText, setAnswerText] = useState<string>("");


  const handleSubmit = async () => {
    if (!answerText.trim()) {
      toast.warning("Please write an answer before submitting.");
      return;
    }

    const id = "submit";
    try {
      toast.loading("Submitting answer...", {
        id,
      });

      await createAnswer({
        questionId: contents?.courseQuestions?.id,
        answer: answerText,
      }).unwrap();

      setAnswerText("");
      toast.success("Answer submitted successfully!", {
        id,
      });
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to submit answer. Please try again.",
        {
          id,
        },
      );
    }
  };

  // ✅ If user already answered, show their submitted answer with status
  if (contents?.hasAnswered) {
    const isCorrect = contents?.courseQuestions?.answer?.isCorrectAnswer;
    const providedAnswer =
      contents?.courseQuestions?.answer?.providedAnswer || "No answer found.";

    let statusText = "";
    let statusColor = "";

    if (isCorrect === true) {
      statusText = "✅ Correct Answer";
      statusColor = "text-green-600";
    } else if (isCorrect === false) {
      statusText = "❌ Wrong Answer";
      statusColor = "text-red-600";
    } else {
      statusText = "⏳ Pending Review";
      statusColor = "text-yellow-600";
    }

    return (
      <div className="p-4">
        <h1 className="text-lg font-medium text-black md:text-xl">
          {contents?.courseQuestions?.question}
        </h1>

        <div className="mt-4">
          <Textarea
            value={providedAnswer}
            disabled
            rows={8}
            className="cursor-not-allowed resize-none bg-[#F1EFFF] text-gray-700 md:h-[100px]"
          />
        </div>

        <div className="mt-3">
          <p className={`font-medium ${statusColor}`}>{statusText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div>
        <h1 className="text-lg font-medium text-black md:text-xl">
          {contents?.courseQuestions?.question}
        </h1>
      </div>

      <div className="mt-4">
        <Textarea
          id="questionText"
          placeholder="Write your answer here..."
          rows={8}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="resize-none bg-[#F1EFFF] md:h-[100px]"
        />
      </div>

      <div className="mt-4">
        <Button disabled={isLoading} onClick={handleSubmit}>
          {!isLoading ? "Submit Answer" : "Submitting..."}
        </Button>
      </div>
    </div>
  );
}
