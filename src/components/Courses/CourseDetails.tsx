"use client";

import Container from "../Global/Container";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { BookOpen, BookText, User } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Title from "../Global/Title";
import Subtitle from "../Global/Subtitle";
import { FaBookmark } from "react-icons/fa";
import TopTitle from "../Global/TopTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import courseImg from "@/assets/articles.jpg";
import Loading from "../Global/Loading";
import {
  countTreeContents,
  filterPublishedTree,
  findContentContext,
  flattenCourseTree,
} from "@/lib/course-tree";
import CourseCurriculumTree from "../CourseLesson/CourseCurriculumTree";

export default function CourseDetails({ slug }: { slug: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading } = useGetCourseByIdQuery(slug);

  const courseDetails = data?.data;
  const treeItems = useMemo(
    () => filterPublishedTree(courseDetails?.items),
    [courseDetails?.items],
  );
  const flatContents = useMemo(
    () => flattenCourseTree(treeItems, { publishedOnly: true }),
    [treeItems],
  );

  const lessonsHref = useMemo(() => {
    if (!courseDetails?.id) return "#";
    const first = flatContents[0];
    if (!first) return `/course-details/${courseDetails.id}/lessons`;
    const ctx = findContentContext(treeItems, first.id);
    const params = new URLSearchParams();
    if (ctx?.semesterId) params.set("semester", ctx.semesterId);
    if (ctx?.chapterId) params.set("chapter", ctx.chapterId);
    params.set("content", first.id);
    return `/course-details/${courseDetails.id}/lessons?${params.toString()}`;
  }, [courseDetails?.id, flatContents, treeItems]);

  if (isLoading) {
    return <Loading />;
  }

  const lessonCount = flatContents.length || courseDetails?.courseContents?.length || 0;
  const quizCount = countTreeContents(treeItems, { type: "QUIZ" });

  return (
    <Container className="py-20">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 rounded-4xl border border-[#F0F2F5] p-4 lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={
                courseDetails?.thumbnail
                  ? courseDetails.thumbnail
                  : courseImg
              }
              alt={courseDetails?.title || "Course"}
              fill
              className="object-cover"
              unoptimized={Boolean(courseDetails?.thumbnail)}
            />
          </div>

          <div className="space-y-4">
            <Title>{courseDetails?.title}</Title>
            <Subtitle>{courseDetails?.instructor?.fullName}</Subtitle>

            <div className="grid grid-cols-2 gap-3 rounded-md border border-[#F0F2F5] bg-[#FAFAFA] p-3">
              <Button
                variant={activeTab === "overview" ? "default" : "outline"}
                onClick={() => setActiveTab("overview")}
              >
                <FaBookmark />
                Overview
              </Button>
              <Button
                variant={activeTab === "curriculum" ? "default" : "outline"}
                onClick={() => setActiveTab("curriculum")}
              >
                <BookText />
                Curriculum
              </Button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="px-4">
              <TopTitle hideLine className="pb-4">
                Description
              </TopTitle>
              <div className="space-y-6 leading-relaxed text-gray-700">
                <Subtitle>{courseDetails?.description}</Subtitle>
              </div>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="mt-2 space-y-2 px-2">
              <CourseCurriculumTree
                items={treeItems}
                interactive={false}
                onSelectContent={(content) => {
                  if (!courseDetails?.id) return;
                  const ctx = findContentContext(treeItems, content.id);
                  const params = new URLSearchParams();
                  if (ctx?.semesterId) params.set("semester", ctx.semesterId);
                  if (ctx?.chapterId) params.set("chapter", ctx.chapterId);
                  params.set("content", content.id);
                  router.push(
                    `/course-details/${courseDetails.id}/lessons?${params.toString()}`,
                  );
                }}
              />
              {treeItems.length > 0 && (
                <div className="pt-4">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={lessonsHref}>Start Learning</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card
            style={{ boxShadow: "4px 5px 11px 0px rgba(0, 0, 0, 0.05)" }}
            className="sticky top-24 border-none pt-0 shadow-none"
          >
            <CardContent className="p-3">
              <div className="space-y-4 p-6">
                <h3 className="mb-4 font-bold text-gray-900">
                  This Course Includes:
                </h3>

                <div className="space-y-3">
                  <div className="flex gap-1.5">
                    <User className="mt-0.5 h-4 w-4 text-gray-500" />
                    <div className="flex gap-1">
                      <p className="text-sm font-medium text-gray-900">
                        Instructor:
                      </p>
                      <p className="text-sm text-gray-600">
                        {courseDetails?.instructor?.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <BookOpen className="mt-0.5 h-4 w-4 text-gray-500" />
                    <div className="flex gap-1">
                      <p className="text-sm font-medium text-gray-900">
                        Lessons:
                      </p>
                      <p className="text-sm text-gray-600">{lessonCount}</p>
                    </div>
                  </div>

                  {quizCount > 0 && (
                    <div className="flex gap-1.5">
                      <BookText className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div className="flex gap-1">
                        <p className="text-sm font-medium text-gray-900">
                          Assessments:
                        </p>
                        <p className="text-sm text-gray-600">{quizCount}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Link href={lessonsHref}>
                <Button className="w-full">See Contents</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
