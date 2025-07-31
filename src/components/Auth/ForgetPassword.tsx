'use client';

import React, { FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Subtitle from '../Global/Subtitle';
import Link from 'next/link';

export default function ForgetPassword() {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get('email');

        console.log('Password reset request for:', email);

        // You can now use the email for password reset logic (API call, etc.)
    };

    return (
        <div className="w-full max-w-md">
            {/* Page Subtitle */}
            <Subtitle className="font-medium pt-3 pb-8 text-center">
                Forgot your password?
            </Subtitle>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="pl-10 md:h-11"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" variant="secondary">
                    Send Reset Link
                </Button>
            </form>

            {/* Back to Sign In */}
            <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                    Go back to{' '}
                    <Link href="/auth/sign-in">
                        <Button variant="link" className="px-0 text-sm">
                            Sign In
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    );
}
