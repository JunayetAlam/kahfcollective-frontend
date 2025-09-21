import { Tier } from "./tiers.type";
import { User } from "./user.type";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELED";
export type Currency = "usd" | "eur" | "gbp" | "bdt" | "inr";
export type PaymentMethodType = "CARD" | "BANK_TRANSFER" | "PAYPAL" | "STRIPE" | "OTHER";

export interface Payment {
    id: string;
    userId: string;
    tierId: string;
    amount: number;
    currency: Currency;
    status: PaymentStatus;

    paymentMethodType?: PaymentMethodType;
    cardBrand?: string;
    cardLast4?: string;
    cardExpMonth?: number;
    cardExpYear?: number;
    user: User
    tier: Tier

    stripePaymentId?: string;
    stripeSessionId?: string;
    stripeCustomerId?: string;

    createdAt: Date;
    updatedAt: Date;
}
