import { TQueryParam, TResponseRedux } from "@/types";
import { Tier } from "@/types/tiers.type";
import { baseApi } from "./baseApi";

const tierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTiers: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args)
          args.forEach((item) =>
            params.append(item.name, item.value as string),
          );
        return { url: "/tiers", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<Tier[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Tier"],
    }),
  }),
});

export const { useGetAllTiersQuery } = tierApi;
