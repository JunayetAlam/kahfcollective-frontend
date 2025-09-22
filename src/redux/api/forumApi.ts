import { Forum, TQueryParam, TResponseRedux, User } from "@/types";
import { baseApi } from "./baseApi";

const forumApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create Circle Forum
        createCircleForum: builder.mutation({
            query: (forumData: Partial<Forum>) => ({
                url: "/forums/circle",
                method: "POST",
                body: forumData,
            }),
            invalidatesTags: ["Forum"],
        }),

        // Create Location Forum
        createLocationForum: builder.mutation({
            query: (forumData) => ({
                url: "/forums/location",
                method: "POST",
                body: forumData,
            }),
            invalidatesTags: ["Forum"],
        }),

        // Join Forum
        joinForum: builder.mutation({
            query: (forumId: string) => ({
                url: `/forums/join/${forumId}`,
                method: "POST",
            }),
            invalidatesTags: ["Forum", "User"],
        }),

        // Get all forums (with optional query params)
        getAllForums: builder.query({
            query: (args?: TQueryParam[]) => {
                const params = new URLSearchParams();
                args?.forEach((item) => params.append(item.name, item.value as string));
                return { url: "/forums", method: "GET", params };
            },
            transformResponse: (response: TResponseRedux<Forum[]>) => ({
                data: response.data,
                meta: response.meta,
            }),
            providesTags: ["Forum"],
        }),

        // Get single forum
        getSingleForum: builder.query({
            query: (id: string) => ({ url: `/forums/${id}`, method: "GET" }),
            transformResponse: (response: TResponseRedux<Forum>) => ({
                data: response.data,
            }),
            providesTags: (result, error, id) => [{ type: "Forum", id }],
        }),

        // Get all users joined to a forum
        getAllConnectedUserToForum: builder.query({
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

        // Update Circle Forum
        updateCircleForum: builder.mutation({
            query: ({ id, body }) => ({
                url: `/forums/circle/${id}`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Forum"],
        }),

        // Update Location Forum
        updateLocationForum: builder.mutation({
            query: ({ id, body }) => ({
                url: `/forums/location/${id}`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Forum"],
        }),

        // Delete Forum
        deleteForum: builder.mutation({
            query: (forumId: string) => ({
                url: `/forums/${forumId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Forum"],
        }),
    }),
});

export const {
    useCreateCircleForumMutation,
    useCreateLocationForumMutation,
    useJoinForumMutation,
    useGetAllForumsQuery,
    useGetSingleForumQuery,
    useGetAllConnectedUserToForumQuery,
    useUpdateCircleForumMutation,
    useUpdateLocationForumMutation,
    useDeleteForumMutation,
} = forumApi;
