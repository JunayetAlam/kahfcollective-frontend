import { TMeta, TQueryParam, TResponseRedux } from "@/types";
import { NormalContent } from "@/types/normal-content.type";
import { baseApi } from "./baseApi";

const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNewContent: builder.mutation({
      query: (FormData) => ({
        url: `/contents`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Contents"],
    }),
    updateContent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/course-contents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Contents"],
    }),
    getContentById: builder.query({
      query: (id) => ({
        url: `/contents/${id}`,
        method: "GET",
      }),
      providesTags: ["Contents"],
    }),
    deleteContentById: builder.mutation({
      query: (id) => ({
        url: `/contents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contents"],
    }),
    getAllContents: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args)
          args.forEach((item) =>
            params.append(item.name, item.value as string),
          );
        return { url: "/contents", method: "GET", params };
      },
      transformResponse: (
        response: TResponseRedux<NormalContent[]>,
      ): { data: NormalContent[]; meta?: TMeta } => ({
        data: (response.data as any).data || [],
        meta: response.meta,
      }),
      providesTags: ["Contents"],
    }),
  }),
});

export const {
  useCreateNewContentMutation,
  useGetAllContentsQuery,
  useGetContentByIdQuery,
  // useUpdateContentMutation,
  useDeleteContentByIdMutation,
} = contentApi;
