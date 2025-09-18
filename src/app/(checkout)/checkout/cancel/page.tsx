'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCancelPaymentMutation } from '@/redux/api/paymentApi';

export default function CancelPaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [cancel, { isLoading, error, isSuccess }] = useCancelPaymentMutation();
    const [cancelAttempted, setCancelAttempted] = useState(false);

    const paymentId = searchParams.get('paymentId');

    useEffect(() => {
        if (!paymentId) {
            toast.error('Payment ID is required');
            return;
        }

        const handleAutoCancelPayment = async () => {
            if (cancelAttempted) return;
            setCancelAttempted(true);
            try {
                await cancel(paymentId).unwrap();
            } catch { }
        };

        handleAutoCancelPayment();
    }, [paymentId, cancel, cancelAttempted]);

    const handleRetryCancel = async () => {
        try {
            await cancel(paymentId!).unwrap();
        } catch { }
    };

    const handleGoHome = () => {
        router.push('/');
    };

    // Loading Skeleton
    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center gap-4 p-4 ">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-40" />
            </div>
        );
    }

    // No Payment ID
    if (!paymentId) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-4 w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Payment Not Found</h2>
                <p className="text-gray-600 text-center max-w-sm">
                    No payment ID was provided. Please check your link and try again.
                </p>
                <Button onClick={handleGoHome} className="mt-4">Go to Home</Button>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-center gap-6 p-4 ">
            {/* Success */}
            {isSuccess && (
                <>
                    <div className="w-16 h-16 = rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Payment Cancelled</h2>
                    <p className="text-gray-600 text-center max-w-sm">
                        Your payment has been successfully cancelled.
                    </p>
                  
                </>
            )}

            {/* Error */}
            {error && !isSuccess && (
                <>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Cancellation Failed</h2>
                    <p className="text-gray-600 text-center max-w-sm">
                        We couldn&apos;t cancel your payment. Please try again or contact support.
                    </p>
                   
                </>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
                {error && !isSuccess && (
                    <Button
                        onClick={handleRetryCancel}
                        disabled={isLoading}
                        variant="destructive"
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Retrying...
                            </>
                        ) : (
                            'Try Again'
                        )}
                    </Button>
                )}

                <Button onClick={handleGoHome} variant="default" className="w-full">
                    Go to Home
                </Button>
            </div>
        </div>
    );
}
