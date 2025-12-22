import { TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";
import { Group } from "@/types/groups.type";

const groupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Group
    createGroup: builder.mutation({
      query: (data) => ({
        url: "/groups",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),

    // Get All Groups (public)
    getAllGroups: builder.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) args.forEach((item) => params.append(item.name, item.value as string));
        return { url: "/groups", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<Group[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Group"],
    }),

    // Get All Groups (admin only)
    getAllGroupsAdmin: builder.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) args.forEach((item) => params.append(item.name, item.value as string));
        return { url: "/groups/admin", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<Group[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Group"],
    }),

    // Get Group by ID
    getGroupById: builder.query({
      query: (id: string) => ({ url: `/groups/${id}`, method: "GET" }),
      transformResponse: (response: TResponseRedux<Group>) => ({ data: response.data }),
      providesTags: (result, error, id) => [{ type: "Group", id }],
    }),

    // Get Group by ID (admin only)
    getGroupByIdAdmin: builder.query({
      query: (id: string) => ({ url: `/groups/admin/${id}`, method: "GET" }),
      transformResponse: (response: TResponseRedux<Group>) => ({ data: response.data }),
      providesTags: (result, error, id) => [{ type: "Group", id }],
    }),

    // Toggle Assign Group
    toggleAssignGroup: builder.mutation({
      query: (data) => ({
        url: `/groups/toggle-group`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User", "Group"],
    }),

    // Update Group
    updateGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `/groups/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Group", { type: "Group", id }],
    }),

    // Toggle Delete Group
    toggleDeleteGroup: builder.mutation({
      query: (id: string) => ({
        url: `/groups/${id}/toggle-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGetAllGroupsQuery,
  useGetAllGroupsAdminQuery,
  useGetGroupByIdQuery,
  useGetGroupByIdAdminQuery,
  useToggleAssignGroupMutation,
  useUpdateGroupMutation,
  useToggleDeleteGroupMutation,
} = groupApi;
