/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";

const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (formData: FormData) => ({
        url: `/courses`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Courses"],
    }),
    toggleCompleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `/courses/${id}/toggle-complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Courses"],
    }),
    toggleStatusOfForum: builder.mutation({
      query: (id: string) => ({
        url: `/courses/toggle-status/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Courses"],
    }),
    toggleDeleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `/courses/${id}/toggle-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Courses"],
    }),
    toggleEnrollCourse: builder.mutation({
      query: (body) => ({
        url: `/courses/enroll`,
        method: "POST",
        body
      }),
      invalidatesTags: ["Courses", "User"],
    }),
    updateCourse: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),
    getCourseById: builder.query({
      query: (id: string) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<Course>) => ({
        data: response.data,
      }),
      providesTags: ["Courses"],
    }),
    deleteCourseById: builder.mutation({
      query: (id: string) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
    toggleAssignCourseToGroup: builder.mutation({
      query: (body) => ({
        url: `/courses/assign-course-to-group`,
        method: "POST",
        body
      }),
      invalidatesTags: ["Courses", "Group"],
    }),
    getEnrolledStudents: builder.query({
      query: (id: string) => ({
        url: `/courses/enrolled-students/${id}`,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
    getAllCourses: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args)
          args.forEach((item) =>
            params.append(item.name, item.value as string),
          );
        return { url: "/courses", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<Course[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Courses"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
  useDeleteCourseByIdMutation,
  useGetAllCoursesQuery,
  useToggleStatusOfForumMutation,
  useGetEnrolledStudentsQuery,
  useToggleCompleteCourseMutation,
  useToggleDeleteCourseMutation,
  useToggleEnrollCourseMutation,
  useToggleAssignCourseToGroupMutation
} = courseApi;
