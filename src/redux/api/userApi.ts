import { User, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";
import { setUser } from "../authSlice";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, ...rest } = data.data as User & { accessToken: string };
          if (accessToken) dispatch(setUser({ user: { ...rest }, token: accessToken }));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    resendVerificationEmail: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/resend-verification-email",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: userInfo,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, ...rest } = data.data as User & { accessToken: string };
          if (accessToken) dispatch(setUser({ user: { ...rest }, token: accessToken }));
        } catch (error) {
          console.error("Email verification failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    forgetPassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/change-password",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) args.forEach((item) => params.append(item.name, item.value as string));
        return { url: "/users", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<User[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["User"],
    }),
    getAllTierUsers: builder.query({
      query: ({ args, tierId }: { args: TQueryParam[], tierId: string }) => {
        const params = new URLSearchParams();
        if (args) args.forEach((item) => params.append(item.name, item.value as string));
        return { url: `/users/tier-users/${tierId}`, method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<User[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id: string) => ({ url: `/users/${id}`, method: "GET" }),
      transformResponse: (response: TResponseRedux<User>) => ({ data: response.data }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getMe: builder.query({
      query: () => ({ url: `/users/me`, method: "GET" }),
      transformResponse: (response: TResponseRedux<User>) => ({ data: response.data }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: `/users/update-profile`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => ["User", { type: "User", id }],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
    updateProfileImg: builder.mutation({
      query: (formData: FormData) => ({
        url: `/users/update-profile-image`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: () => ["User", { type: "User" }],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/users/user-role/${id}`,
          method: "PUT",
          body: data,
        }
      },
      invalidatesTags: ["User"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/user-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    toggleIsUserVerified: builder.mutation({
      query: (id) => ({
        url: `/users/toggle-verify-status/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    })
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetAllUsersQuery,
  useGetAllTierUsersQuery,
  useGetUserByIdQuery,
  useGetMeQuery,
  useUpdateProfileMutation,
  useDeleteUserMutation,
  useUpdateProfileImgMutation,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useToggleIsUserVerifiedMutation
} = userApi;