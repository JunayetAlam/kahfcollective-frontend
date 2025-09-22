import { TQueryParam, TResponseRedux } from "@/types";
import { Tier } from "@/types/tiers.type";
import { baseApi } from "./baseApi";

const tierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Tier
    createTier: builder.mutation({
      query: (data) => ({
        url: "/tiers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tier"],
    }),

    // Get All Tiers (public)
    getAllTiers: builder.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) args.forEach((item) => params.append(item.name, item.value as string));
        return { url: "/tiers", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<Tier[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Tier"],
    }),

    // Get All Tiers (admin only)
    getAllTiersAdmin: builder.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) args.forEach((item) => params.append(item.name, item.value as string));
        return { url: "/tiers/admin", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<Tier[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Tier"],
    }),

    // Get Tier by ID
    getTierById: builder.query({
      query: (id: string) => ({ url: `/tiers/${id}`, method: "GET" }),
      transformResponse: (response: TResponseRedux<Tier>) => ({ data: response.data }),
      providesTags: (result, error, id) => [{ type: "Tier", id }],
    }),

    // Get Tier by ID (admin only)
    getTierByIdAdmin: builder.query({
      query: (id: string) => ({ url: `/tiers/admin/${id}`, method: "GET" }),
      transformResponse: (response: TResponseRedux<Tier>) => ({ data: response.data }),
      providesTags: (result, error, id) => [{ type: "Tier", id }],
    }),

    // Toggle Assign Tier
    toggleAssignTier: builder.mutation({
      query: (data) => ({
        url: `/tiers/toggle-tier`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User", "Tier"],
    }),

    // Update Tier
    updateTier: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tiers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Tier", { type: "Tier", id }],
    }),

    // Toggle Delete Tier
    toggleDeleteTier: builder.mutation({
      query: (id: string) => ({
        url: `/tiers/${id}/toggle-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Tier"],
    }),
  }),
});

export const {
  useCreateTierMutation,
  useGetAllTiersQuery,
  useGetAllTiersAdminQuery,
  useGetTierByIdQuery,
  useGetTierByIdAdminQuery,
  useToggleAssignTierMutation,
  useUpdateTierMutation,
  useToggleDeleteTierMutation,
} = tierApi;
