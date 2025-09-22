'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, CreditCard, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetPaymentBySessionIdQuery } from '@/redux/api/paymentApi';

export default function Success() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const session_id = searchParams.get('session_id');

    const { data, isLoading, error } = useGetPaymentBySessionIdQuery(session_id as string, {
        skip: !session_id
    });

    const handleGoHome = () => {
        router.push('/');
    };

    // Loading Skeleton
    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-40 w-full max-w-md" />
                <Skeleton className="h-10 w-40" />
            </div>
        );
    }
    const paymentData = data?.data
    // No Session ID
    if (!session_id) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-4 w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Session Not Found</h2>
                <p className="text-gray-600 text-center max-w-sm">
                    No session ID was provided. Please check your link and try again.
                </p>
                <Button onClick={handleGoHome} className="mt-4">Go to Home</Button>
            </div>
        );
    }

    // Error or No Data Found
    if (error || !paymentData) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-4 w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Payment Not Found</h2>
                <p className="text-gray-600 text-center max-w-sm">
                    We couldn&lsquo;t find the payment information for this session. Please contact support if you believe this is an error.
                </p>
                <Button onClick={handleGoHome} className="mt-4">Go to Home</Button>
            </div>
        );
    }

    // Format currency
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency?.toUpperCase(),
        }).format(amount); // Assuming amount is in cents
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-6 p-4">
            {/* Success Icon and Title */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900">Payment Successful!</h2>
                <p className="text-gray-600 mt-2">
                    Your payment has been processed successfully.
                </p>
            </div>

            {/* Payment Details Card */}
            <Card className="w-full max-w-md">
                <CardContent className="p-6 space-y-4">
                    {/* Amount */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Amount Paid</span>
                        </div>
                        <span className="font-semibold text-lg">
                            {formatCurrency(paymentData.amount, paymentData.currency)}
                        </span>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Payment Method</span>
                        </div>
                        <span className="text-sm font-medium capitalize">
                            {paymentData.paymentMethodType}
                        </span>
                    </div>

                    {/* Customer Info */}
                    {paymentData.user && (
                        <div className="flex items-center gap-3 pt-2 border-t">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={paymentData.user.profile} />
                                <AvatarFallback>
                                    {paymentData.user.firstName?.[0]}{paymentData.user.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {paymentData.user.firstName} {paymentData.user.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {paymentData.user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Product Info */}
                    {paymentData.product && (
                        <div className="flex items-center gap-3 pt-2 border-t">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {paymentData.product.title}
                                </p>
                                {paymentData.category && (
                                    <p className="text-xs text-gray-500">
                                        Category: {paymentData.category.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment ID */}
                    <div className="pt-2 border-t">
                        <div className="text-xs text-gray-500">
                            Transaction ID: {paymentData.stripePaymentId}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            {new Date(paymentData.createdAt).toLocaleString()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              
                <Button onClick={handleGoHome} variant="outline" className="w-full">
                    Go to Home
                </Button>
            </div>
        </div>
    );
}