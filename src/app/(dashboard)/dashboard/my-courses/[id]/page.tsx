import CourseManageDetails from "@/components/Dashboard/My-Courses/CourseManageDetails";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CourseManageDetails courseId={id} />;
}
