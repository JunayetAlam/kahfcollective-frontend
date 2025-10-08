/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseContents } from "@/types";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button"; // Assuming you have a Button component
import { useCreateQuestionAnswerMutation } from "@/redux/api/question";
import { toast } from "sonner";

interface QuestionProps {
  contents: CourseContents;
}

export default function Question({ contents }: QuestionProps) {
  const [createAnswer] = useCreateQuestionAnswerMutation();
  const [answerText, setAnswerText] = useState<string>("");

  const handleSubmit = async () => {
    if (!answerText.trim()) {
      alert("Please write an answer before submitting.");
      return;
    }

    try {
      await createAnswer({
        questionId: contents.id, 
        answer: answerText,
      }).unwrap(); 

  
      setAnswerText("");
      toast.success("Answer submitted successfully!");
    } catch (error : any) {
      toast.error(error?.data?.message || "Failed to submit answer. Please try again.");
    }
  };

  console.log("this is the question", contents);

  return (
    <div className="p-4">
      <div>
        <h1 className="md:text-xl text-lg font-medium text-black">{contents.title}</h1>
      </div>

      <div className="mt-4">
        <Textarea
          id="questionText"
          placeholder="Write your answer here..."
          rows={8}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="resize-none md:h-[100px] bg-[#F1EFFF]"
        />
      </div>

      <div className="mt-4">
        <Button onClick={handleSubmit} >
          Submit Answer
        </Button>
      </div>
    </div>
  );
}