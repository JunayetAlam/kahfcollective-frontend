import { baseApi } from "./baseApi";

const utilsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        invalidateFullRedis: builder.mutation({
            query: () => ({
                url: `/utils/invalidate-full-redis`,
                method: "POST",
            }),
            invalidatesTags: [
                "User",
                "Payment",
                "Contents",
                "Class",
                "Courses",
                "CourseContents",
                "Group",
                "Post",
                "QuizAnswer",
                "Questions",
                "Reply"
            ],
        }),
    }),
});

export const {
    useInvalidateFullRedisMutation,
} = utilsApi;

