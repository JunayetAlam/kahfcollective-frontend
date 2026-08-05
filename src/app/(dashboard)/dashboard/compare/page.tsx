"use client";

import Loading from "@/components/Global/Loading";
import { StudentCompareBoard } from "@/components/Performance/Charts/StudentCompareBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLazyCompareStudentsQuery } from "@/redux/api/analyticsApi";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CompareStudentsPage() {
  const searchParams = useSearchParams();
  const [userA, setUserA] = useState(searchParams.get("userA") || "");
  const [userB, setUserB] = useState(searchParams.get("userB") || "");
  const [courseId, setCourseId] = useState(searchParams.get("courseId") || "");
  const [trigger, { data, isFetching, isError }] = useLazyCompareStudentsQuery();

  useEffect(() => {
    const a = searchParams.get("userA");
    const b = searchParams.get("userB");
    const c = searchParams.get("courseId");
    if (a) setUserA(a);
    if (b) setUserB(b);
    if (c) setCourseId(c);
    if (a && b) {
      trigger({
        userA: a,
        userB: b,
        courseId: c || undefined,
      });
    }
  }, [searchParams, trigger]);

  const handleCompare = async () => {
    if (!userA || !userB) {
      toast.error("Enter both student user IDs");
      return;
    }
    try {
      await trigger({
        userA,
        userB,
        courseId: courseId || undefined,
      }).unwrap();
    } catch {
      toast.error("Comparison failed");
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div>
        <p className="text-sm font-medium text-[var(--perf-3)]">Compare</p>
        <h1 className="text-2xl font-semibold sm:text-3xl">Student comparison</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare two students globally or within a course.
        </p>
      </div>

      <div className="grid max-w-3xl gap-4 rounded-xl border border-border/70 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="userA">Student A ID</Label>
          <Input
            id="userA"
            value={userA}
            onChange={(e) => setUserA(e.target.value)}
            placeholder="Mongo user id"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userB">Student B ID</Label>
          <Input
            id="userB"
            value={userB}
            onChange={(e) => setUserB(e.target.value)}
            placeholder="Mongo user id"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="courseId">Course ID (optional)</Label>
          <Input
            id="courseId"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="Leave empty for global average"
          />
        </div>
        <Button className="sm:col-span-2" onClick={handleCompare} disabled={isFetching}>
          {isFetching ? "Comparing…" : "Compare students"}
        </Button>
      </div>

      {isFetching && !data && <Loading />}
      {isError && (
        <p className="text-sm text-destructive">Could not load comparison.</p>
      )}
      {data && <StudentCompareBoard data={data} />}
    </div>
  );
}
