'use client';

import React from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCreatePaymentMutation } from '@/redux/api/paymentApi';

export default function Page() {
    const [createPayment, { isLoading, error }] = useCreatePaymentMutation();

    const handlePayment = async () => {
        try {
             const result = await createPayment({paymentType: "PURCHASE"}).unwrap();
            
            if (result.success && result.data?.stripUrl) {
                // Redirect to Stripe checkout
                window.location.href = result.data.stripUrl;
            } else {
                console.error('Payment creation failed:', result);
            }
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-6 p-4 min-h-screen">
            {/* Header Icon */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-blue-600" />
            </div>

            {/* Main Message */}
            <div className="text-center max-w-md">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Get Access to Our Website
                </h2>
                <p className="text-gray-600 leading-relaxed">
                    Please pay for getting access to the website. Your payment will be reviewed by authority and will give you access to the website. You can trust us.
                </p>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-700">
                        <strong>Note:</strong> If you have already paid, please wait for approval or contact the author. 
                        If your monthly subscription has ended, please pay again to continue access.
                    </p>
                </div>
            </div>

            {/* Payment Card */}
            <Card className="w-full max-w-md">
                <CardContent className="p-6">
                    {/* Price Display */}
                    <div className="text-center mb-6">
                        <div className="text-3xl font-bold text-gray-900 mb-2">$50</div>
                        <div className="text-sm text-gray-500">Monthly subscription</div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Full website access</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Reviewed by authority</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Secure payment</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span className="text-sm text-red-600">
                                Payment failed. Please try again.
                            </span>
                        </div>
                    )}

                    {/* Payment Button */}
                    <Button 
                        onClick={handlePayment} 
                        className="w-full" 
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Pay $50
                            </>
                        )}
                    </Button>

                    {/* Security Notice */}
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                        <Shield className="w-3 h-3" />
                        <span>Secured by Stripe</span>
                    </div>
                </CardContent>
            </Card>

            {/* Trust Message */}
            <div className="text-center max-w-sm">
                <p className="text-sm text-gray-500">
                    Your payment is secure and will be processed immediately. 
                    Access will be granted after authority review.
                </p>
            </div>
        </div>
    );
}