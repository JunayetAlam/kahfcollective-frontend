'use client';

import { Heart } from "lucide-react";
import Container from "../Global/Container";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import TopTitle from "../Global/TopTitle";
import { AiFillDollarCircle } from "react-icons/ai";
import { useState } from "react";
import { useCreatePaymentMutation } from "@/redux/api/paymentApi";
import { AlertCircle } from "lucide-react";

export default function Donate() {
    const [amount, setAmount] = useState(500);
    const [createPayment, { isLoading, error }] = useCreatePaymentMutation();

    const handleDonate = async () => {
        try {
            const result = await createPayment({
                paymentType: "DONATION",
                amount: Number(amount),
            }).unwrap();

            if (result.success && result.data?.stripUrl) {
                window.location.href = result.data.stripUrl; // redirect to stripe
            } else {
                console.error("Donation creation failed:", result);
            }
        } catch (err) {
            console.error("Donation error:", err);
        }
    };

    return (
        <Container className="py-20">
            <div className="w-full max-w-xl space-y-6 mx-auto">
                {/* Support Us Card */}
                <Card className="rounded-lg shadow-none">
                    <div className="max-w-[350px] mx-auto">
                        <CardHeader className="flex flex-col items-center space-y-2 pt-6 pb-4">
                            <TopTitle hideLine>
                                Support Us{" "}
                                <Heart className="h-5 w-5 text-primary fill-primary" />
                            </TopTitle>
                            <p className="text-sm text-gray-500">
                                Make a contribution to support our platform
                            </p>
                        </CardHeader>

                        <CardContent className="px-6 pb-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="donation-amount"
                                    className="block text-sm md:text-base font-medium text-gray-700"
                                >
                                    Enter your donation amount
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <AiFillDollarCircle className="h-6 w-6 text-foreground" />
                                    </div>
                                    <Input
                                        id="donation-amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(Number(e.target.value))
                                        }
                                        className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-gray-900 text-end h-11 !text-xl md:!text-2xl font-extrabold"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3 px-6 pb-6">
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                    Donation failed. Please try again.
                                </div>
                            )}
                            <button
                                onClick={handleDonate}
                                disabled={isLoading}
                                className="w-full h-11 flex justify-center items-center gap-2 bg-secondary text-background rounded-lg hover:bg-secondary/90 text-sm md:text-base"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <AiFillDollarCircle size={24} /> Donate ${amount}
                                    </>
                                )}
                            </button>
                        </CardFooter>
                    </div>
                </Card>

                {/* How Your Donation Helps Card */}
                <Card className="rounded-lg shadow-none bg-[#F5F5F5] py-16 md:px-16">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-gray-800">
                            How Your Donation Helps
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc space-y-2 pl-5 text-gray-700 text-sm">
                            <li>Supports the development of new courses and content</li>
                            <li>Helps maintain our platform and technology infrastructure</li>
                            <li>Enables us to provide scholarships to students in need</li>
                            <li>Allows us to compensate our qualified instructors fairly</li>
                            <li>Funds community programs and study circles</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
}
