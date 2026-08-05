import { Semester } from "@/types";
import { baseApi } from "./baseApi";

const semesterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSemester: builder.mutation({
      query: (body: { courseId: string; name: string }) => ({
        url: `/semesters`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateSemester: builder.mutation({
      query: ({ id, name }: { id: string; name: string }) => ({
        url: `/semesters/${id}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["Courses"],
    }),
    changeSemesterIndex: builder.mutation({
      query: ({ id, newIndex }: { id: string; newIndex: number }) => ({
        url: `/semesters/${id}/change-index`,
        method: "PATCH",
        body: { newIndex },
      }),
      invalidatesTags: ["Courses"],
    }),
    toggleDeleteSemester: builder.mutation({
      query: (id: string) => ({
        url: `/semesters/${id}/toggle-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Courses"],
    }),
    getSemestersByCourse: builder.query({
      query: (courseId: string) => ({
        url: `/semesters/course/${courseId}`,
        method: "GET",
      }),
      transformResponse: (response) =>
        (response as { data: Semester[] }).data,
      providesTags: ["Courses"],
    }),
  }),
});

export const {
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
  useChangeSemesterIndexMutation,
  useToggleDeleteSemesterMutation,
  useGetSemestersByCourseQuery,
} = semesterApi;
