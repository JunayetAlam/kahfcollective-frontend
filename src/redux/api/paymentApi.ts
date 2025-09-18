import { Payment, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";

const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPayments: builder.query({
            query: (args: TQueryParam[]) => {
                const params = new URLSearchParams();
                if (args) {
                    args.forEach((item) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: "/payments",
                    method: "GET",
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Payment[]>) => ({
                data: response.data,
                meta: response.meta,
            }),
            providesTags: ["Payment"],
        }),
        getAllPaymentsAdmin: builder.query({
            query: (args: TQueryParam[]) => {
                const params = new URLSearchParams();
                if (args) {
                    args.forEach((item) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: "/payments/admin",
                    method: "GET",
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Payment[]>) => ({
                data: response.data,
                meta: response.meta,
            }),
            providesTags: ["Payment"],
        }),
        getPaymentById: builder.query({
            query: (id: string) => ({
                url: `/payments/${id}`,
                method: "GET",
            }),
            transformResponse: (response: TResponseRedux<Payment>) => ({
                data: response.data,
            }),
            providesTags: (result, error, id) => [{ type: "Payment", id }],
        }),
        getPaymentByIdAdmin: builder.query({
            query: (id: string) => ({
                url: `/payments/admin/${id}`,
                method: "GET",
            }),
            transformResponse: (response: TResponseRedux<Payment>) => ({
                data: response.data,
            }),
            providesTags: (result, error, id) => [{ type: "Payment", id }],
        }),
        cancelPayment: builder.mutation({
            query: (id: string) => ({
                url: `/payments/cancel/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["Payment"],
        }),
        getPaymentBySessionId: builder.query({
            query: (id: string) => ({
                url: `/payments/session/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Payment", id }],
        }),
    }),
});

export const {
    useGetAllPaymentsQuery,
    useGetAllPaymentsAdminQuery,
    useGetPaymentByIdQuery,
    useGetPaymentByIdAdminQuery,
    useCancelPaymentMutation,
    useGetPaymentBySessionIdQuery
} = paymentApi;
