import { Post, React, TQueryParam, TResponseRedux, } from "@/types";
import { baseApi } from "./baseApi";

const postApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create a post in a forum
        createPost: builder.mutation({
            query: ({ forumId, ...postData }: { forumId: string } & Partial<Post>) => ({
                url: `/posts/${forumId}`,
                method: "POST",
                body: postData,
            }),
            invalidatesTags: ["Post", "Forum"],
        }),

        // Reply to a post
        replyToPost: builder.mutation({
            query: ({ postId, ...replyData }: { postId: string } & Partial<Post>) => ({
                url: `/posts/reply/${postId}`,
                method: "POST",
                body: replyData,
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
            query: ({ postId, type }: { postId: string; type?: React }) => ({
                url: `/posts/react/${postId}`,
                method: "POST",
                body: type ? { type } : undefined,
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
            query: (args?: { forumId: string; params?: TQueryParam[] }) => {
                const queryParams = new URLSearchParams();
                args?.params?.forEach((item) => queryParams.append(item.name, item.value as string));
                return {
                    url: `/posts/forum/${args?.forumId}?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            transformResponse: (response: TResponseRedux<Post[]>) => ({ data: response.data }),
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
            query: (postId: string) => {

                return { url: `/posts/replies/${postId}`, method: "GET" }
            },
            transformResponse: (response: TResponseRedux<Post[]>) => ({ data: response.data }),
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
