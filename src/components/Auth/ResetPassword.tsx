'use client';

import React, { FormEvent, useState } from 'react';
import { Eye, EyeClosed, LockKeyhole, LockKeyholeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Subtitle from '../Global/Subtitle';
import Link from 'next/link';

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const newPassword = formData.get('newPassword')?.toString();
        const confirmPassword = formData.get('confirmPassword')?.toString();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        console.log('Password reset submitted:', {
            newPassword,
            confirmPassword,
        });

        // You can now perform your password reset API call here
    };

    return (
        <div className="w-full max-w-md">
            <Subtitle className="font-medium pt-3 pb-8 text-center">
                Reset your password
            </Subtitle>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password Field */}
                <div className="space-y-2">
                    <div className="relative">
                        <LockKeyholeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="pl-10 pr-12 h-11"
                            placeholder="New password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        >
                            {!showPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            className="pl-10 pr-12 h-11"
                            placeholder="Confirm password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        >
                            {!showConfirmPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full mt-4" size="lg" variant="secondary">
                    Reset Password
                </Button>
            </form>

            {/* Back to Sign In */}
            <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link href="/auth/sign-in">
                        <Button variant="link" className="px-0 text-sm">
                            Sign in
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    );
}
