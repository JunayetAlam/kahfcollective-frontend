import { TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";
import { Class } from "@/types/class.type";

const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Class
    createClass: builder.mutation({
      query: (data) => ({
        url: "/groups",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),

    // Get All Classes (public)
    getAllClasses: builder.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) args.forEach((item) => params.append(item.name, item.value as string));
        return { url: "/groups", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<Class[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Class"],
    }),

    // Get All Classes (admin only)
    getAllClassesAdmin: builder.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) args.forEach((item) => params.append(item.name, item.value as string));
        return { url: "/groups/admin", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<Class[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Class"],
    }),

    // Get Class by ID
    getClassById: builder.query({
      query: (id: string) => ({ url: `/groups/${id}`, method: "GET" }),
      transformResponse: (response: TResponseRedux<Class>) => ({ data: response.data }),
      providesTags: (result, error, id) => [{ type: "Class", id }],
    }),

    // Get Class by ID (admin only)
    getClassByIdAdmin: builder.query({
      query: (id: string) => ({ url: `/groups/admin/${id}`, method: "GET" }),
      transformResponse: (response: TResponseRedux<Class>) => ({ data: response.data }),
      providesTags: (result, error, id) => [{ type: "Class", id }],
    }),

    // Toggle Assign Class
    toggleAssignClass: builder.mutation({
      query: (data) => ({
        url: `/groups/toggle-group`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User", "Class"],
    }),

    // Update Class
    updateClass: builder.mutation({
      query: ({ id, data }) => ({
        url: `/groups/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Class", { type: "Class", id }],
    }),

    // Toggle Delete Class
    toggleDeleteClass: builder.mutation({
      query: (id: string) => ({
        url: `/groups/${id}/toggle-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useCreateClassMutation,
  useGetAllClassesQuery,
  useGetAllClassesAdminQuery,
  useGetClassByIdQuery,
  useGetClassByIdAdminQuery,
  useToggleAssignClassMutation,
  useUpdateClassMutation,
  useToggleDeleteClassMutation,
} = classApi;
