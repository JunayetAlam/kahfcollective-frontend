import { TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";

const courseContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createVideoCourseContent: builder.mutation({
      query: (formData: FormData) => ({
        url: `/course-contents/video`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    createQuizContent: builder.mutation({
      query: (formData: FormData) => ({
        url: `/course-contents/quiz`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    updateContent: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/course-contents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CourseContents"],
    }),
    getContentById: builder.query({
      query: (id: string) => ({
        url: `/course-contents/${id}`,
        method: "GET",
      }),
      providesTags: ["CourseContents"],
    }),
    deleteContentById: builder.mutation({
      query: (id: string) => ({
        url: `/course-contents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CourseContents"],
    }),
    getAllContents: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args)
          args.forEach((item) =>
            params.append(item.name, item.value as string),
          );
        return { url: "/course-contents", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["CourseContents"],
    }),
  }),
});

export const {
  useCreateVideoCourseContentMutation,
  useUpdateContentMutation,
  useGetContentByIdQuery,
  useDeleteContentByIdMutation,
  useGetAllContentsQuery,
  useCreateQuizContentMutation,
} = courseContentApi;
