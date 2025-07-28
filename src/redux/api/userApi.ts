import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/signup",
        method: "POST",
        body: userInfo,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: userInfo,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ resetPasswordData, token }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetPasswordData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    changePassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/change-password",
        method: "POST",
        body: userInfo,
      }),
    }),

    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),

    getSingleUser: builder.query({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
    }),

    changeProfile: builder.mutation({
      query: (userInfo) => ({
        url: `/users/update-profile/${userInfo.id}`,
        method: "PATCH",
        body: userInfo.data,
      }),
    }),
    changeCover: builder.mutation({
      query: (userInfo) => ({
        url: `/users/update-cover/${userInfo.id}`,
        method: "PATCH",
        body: userInfo.data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useChangeCoverMutation,
  useChangeProfileMutation,
} = authApi;
