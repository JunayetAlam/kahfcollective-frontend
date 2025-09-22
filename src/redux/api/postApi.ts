import { Post, React, Reply, TQueryParam, TResponseRedux, } from "@/types";
import { baseApi } from "./baseApi";

const postApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create a post in a forum
        createPost: builder.mutation({
            query: ({ id, data }) => ({
                url: `/posts/${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Post", "Forum"],
        }),

        // Reply to a post
        replyToPost: builder.mutation({
            query: ({ id, data }) => ({
                url: `/posts/reply/${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Post"],
        }),

        // Reply to a reply
        replyToReply: builder.mutation({
            query: ({ parentReplyId, ...replyData }: { parentReplyId: string } & Partial<Post>) => ({
                url: `/posts/reply-to-reply/${parentReplyId}`,
                method: "POST",
                body: replyData,
            }),
            invalidatesTags: ["Post"],
        }),

        // React to a post (toggle)
        giveReact: builder.mutation({
            query: (postId) => ({
                url: `/posts/react/${postId}`,
                method: "POST",
            }),
            invalidatesTags: ["Post", "User"],
        }),

        // Toggle publish status
        togglePublish: builder.mutation({
            query: (postId: string) => ({
                url: `/posts/toggle-status/${postId}`,
                method: "POST",
            }),
            invalidatesTags: ["Post"],
        }),
        toggleDeletePost: builder.mutation({
            query: (postId: string) => ({
                url: `/posts/toggle-delete/${postId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Post"],
        }),

        // Get all posts for a forum (with optional query params)
        getAllPostForSpecificForum: builder.query({
            query: (data?: { forumId: string; args?: TQueryParam[] }) => {
                const queryParams = new URLSearchParams();
                data?.args?.forEach((item) => queryParams.append(item.name, item.value as string));
                return {
                    url: `/posts/forum/${data?.forumId}?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            transformResponse: (response: TResponseRedux<Post[]>) => ({ data: response.data, meta: response.meta }),
            providesTags: ["Post"],
        }),

        // Get all posts (for admin/instructor)
        getAllPost: builder.query({
            query: (args?: TQueryParam[]) => {
                const params = new URLSearchParams();

                if (args) {
                    args.forEach((item) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return { url: `/posts`, method: "GET", params }
            },
            transformResponse: (response: TResponseRedux<Post[]>) => ({ data: response.data }),
            providesTags: ["Post"],
        }),

        // Get all replies for a post
        getAllReplyForSpecificPost: builder.query({
            query: (data?: { postId: string; args?: TQueryParam[] }) => {
                const queryParams = new URLSearchParams();
                data?.args?.forEach((item) => queryParams.append(item.name, item.value as string));
                return { url: `/posts/replies/${data?.postId}?${queryParams.toString()}`, method: "GET" }
            },
            transformResponse: (response: TResponseRedux<Reply[]>) => ({ data: response.data, meta: response.meta }),
            providesTags: ["Post"],
        }),

        // Get all reactions for a post
        getAllReactForPost: builder.query({
            query: (postId: string) => ({ url: `/posts/reacts/${postId}`, method: "GET" }),
            transformResponse: (response: TResponseRedux<React[]>) => ({ data: response.data }),
            providesTags: ["Post", "User"],
        }),
    }),
});

export const {
    useCreatePostMutation,
    useReplyToPostMutation,
    useReplyToReplyMutation,
    useGiveReactMutation,
    useTogglePublishMutation,
    useGetAllPostForSpecificForumQuery,
    useGetAllPostQuery,
    useGetAllReplyForSpecificPostQuery,
    useGetAllReactForPostQuery,
    useToggleDeletePostMutation
} = postApi;
