import {User } from ".";

export type Payment = {
    id: string;
    productId: string;
    userId: string;
    categoryId: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethodType: string;
    cardBrand: string;
    cardLast4: string;
    cardExpMonth: number;
    cardExpYear: number;
    stripePaymentId: string;
    stripeSessionId: string;
    stripeCustomerId: string | null;
    createdAt: string;
    updatedAt: string;
    user: User
    // product: TProduct
    // category: TCategory
};
