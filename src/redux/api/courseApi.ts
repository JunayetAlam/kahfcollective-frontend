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
    toggleStatusOfForum: builder.mutation({
      query: (id: string) => ({
        url: `/courses/toggle-status/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Courses"],
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
      providesTags: ["Courses"],
    }),
    deleteCourseById: builder.mutation({
      query: (id: string) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
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
  useToggleStatusOfForumMutation
} = courseApi;
