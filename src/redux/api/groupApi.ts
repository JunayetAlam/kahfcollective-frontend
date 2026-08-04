import { Group, TQueryParam, TResponseRedux, User } from "@/types";
import { baseApi } from "./baseApi";

const groupApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create Study Circles Group
        createCircleGroup: builder.mutation({
            query: (groupData: Partial<Group>) => ({
                url: "/forums/circle",
                method: "POST",
                body: groupData,
            }),
            invalidatesTags: ["Group"],
        }),

        // Create Location Based Group
        createLocationGroup: builder.mutation({
            query: (groupData) => ({
                url: "/forums/location",
                method: "POST",
                body: groupData,
            }),
            invalidatesTags: ["Group"],
        }),

        // Join Group
        joinGroup: builder.mutation({
            query: (forumId: string) => ({
                url: `/forums/join/${forumId}`,
                method: "POST",
            }),
            invalidatesTags: ["Group", "User"],
        }),

        // Get all groups (with optional query params)
        getAllGroups: builder.query({
            query: (args?: TQueryParam[]) => {
                const params = new URLSearchParams();
                args?.forEach((item) => params.append(item.name, item.value as string));
                return { url: "/forums", method: "GET", params };
            },
            transformResponse: (response: TResponseRedux<Group[]>) => ({
                data: response.data,
                meta: response.meta,
            }),
            providesTags: ["Group"],
        }),

        // Get single group
        getSingleGroup: builder.query({
            query: (id: string) => ({ url: `/forums/${id}`, method: "GET" }),
            transformResponse: (response: TResponseRedux<Group>) => ({
                data: response.data,
            }),
            providesTags: (result, error, id) => [{ type: "Group", id }],
        }),

        // Get all users connected to a group
        getAllConnectedUserToGroup: builder.query({
            query: ({ forumId, args }: { forumId: string, args: TQueryParam[] }) => {
                const params = new URLSearchParams();
                args?.forEach((item) => params.append(item.name, item.value as string));
                return { url: `/forums/join/${forumId}`, method: "GET", params }
            },
            transformResponse: (response: TResponseRedux<{ user: User }[]>) => ({
                data: response.data,
            }),
            providesTags: ["User"],
        }),

        // Update Study Circles Group
        updateCircleGroup: builder.mutation({
            query: ({ id, body }) => ({
                url: `/forums/circle/${id}`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Group"],
        }),

        // Update Location Based Group
        updateLocationGroup: builder.mutation({
            query: ({ id, body }) => ({
                url: `/forums/location/${id}`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Group"],
        }),

        // Delete Group
        deleteGroup: builder.mutation({
            query: (forumId: string) => ({
                url: `/forums/${forumId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Group"],
        }),
    }),
});

export const {
    useCreateCircleGroupMutation,
    useCreateLocationGroupMutation,
    useJoinGroupMutation,
    useGetAllGroupsQuery,
    useGetSingleGroupQuery,
    useGetAllConnectedUserToGroupQuery,
    useUpdateCircleGroupMutation,
    useUpdateLocationGroupMutation,
    useDeleteGroupMutation,
} = groupApi;
