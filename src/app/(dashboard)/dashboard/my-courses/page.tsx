import A_TopData from "@/components/Dashboard/A_TopData";
import MyCoursesList from "@/components/Dashboard/My-Courses/MyCoursesList";
import SubmittedQuestionsAnswers from "@/components/Dashboard/My-Courses/SubmittedQuestionsAnswers";

export default function page() {
  return (
    <div className="space-y-6">
      <A_TopData />
      <SubmittedQuestionsAnswers />
      <MyCoursesList />
    </div>
  );
}
