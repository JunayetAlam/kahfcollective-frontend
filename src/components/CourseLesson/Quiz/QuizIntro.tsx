import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseContents, UserRoleEnum } from "@/types";
import { ClipboardList } from "lucide-react";

interface QuizIntroProps {
  contents: CourseContents;
  totalQuestions: number;
  onSkip: () => void;
  onStart: () => void;
  role: UserRoleEnum | undefined;
}

export default function QuizIntro({
  contents,
  totalQuestions,
  onSkip,
  onStart,
  role,
}: QuizIntroProps) {
  return (
    <Card className="mx-auto w-full max-w-xl border-border/70 py-8 text-center shadow-sm">
      <CardHeader className="space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ClipboardList className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Assessment
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {contents.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mx-auto grid max-w-sm grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-border/60 bg-secondary/20 px-4 py-3">
            <p className="text-muted-foreground">Questions</p>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {totalQuestions}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/20 px-4 py-3">
            <p className="text-muted-foreground">Total marks</p>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {totalQuestions}
            </p>
          </div>
        </div>
        <div
          className={`grid w-full gap-3 pt-2 ${role === "USER" ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {role === "USER" && (
            <Button size="lg" onClick={onSkip} variant="outline" className="w-full">
              Skip Assessment
            </Button>
          )}
          <Button size="lg" onClick={onStart} className="w-full">
            {role === "USER" ? "Start Assessment" : "See Question"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
