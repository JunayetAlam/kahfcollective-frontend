'use client';

import React, { FormEvent, useState } from 'react';
import { Eye, Mail, LockKeyhole, EyeClosed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Subtitle from '../Global/Subtitle';
import Link from 'next/link';

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const email = formData.get('email');
        const password = formData.get('password');

        console.log('Login attempt:', { email, password });

        // You can now use email and password for authentication logic
    };

    return (
        <div className="w-full max-w-md">
            <Subtitle className="font-medium pt-3 pb-8 text-center">
                Let’s sign in to your account
            </Subtitle>
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

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="pl-10 pr-12 md:h-11"
                            placeholder="Enter your password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        >
                            {!showPassword ? <EyeClosed /> : <Eye />}
                        </Button>
                    </div>
                </div>

                {/* Forgot Password */}
                <div className="flex items-center justify-end">
                    <Link href={'/auth/forget-password'}>
                        <Button variant="link" className="px-0 text-sm">
                            Forgot password?
                        </Button>
                    </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" variant="secondary">
                    Sign In
                </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/sign-up">
                        <Button variant="link" className="px-0 text-sm">
                            Sign up
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    );
}
