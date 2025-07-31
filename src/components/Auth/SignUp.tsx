'use client';

import React, { FormEvent, useState } from 'react';
import { Eye, Mail, User, EyeClosed, LockKeyhole, LockKeyholeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Subtitle from '../Global/Subtitle';
import Link from 'next/link';

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('');
    const [gender, setGender] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const location = formData.get('location');

        // Basic password confirmation validation
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        console.log('Sign up attempt:', {
            name,
            email,
            password,
            confirmPassword,
            role,
            location,
            gender
        });

        // You can now use the form data for registration logic
    };

    return (
        <div className="w-full max-w-md">
            <Subtitle className="font-medium pt-3 pb-8 text-center">
                Create your account
            </Subtitle>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="pl-10 h-11"
                            placeholder="Enter your full name"
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="pl-10 h-11"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="relative">
                        <LockKeyholeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="pl-10 pr-12 h-11"
                            placeholder="Create password"
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

                {/* Role Selection */}
                <div className="space-y-2">
                    <Select value={role} onValueChange={setRole} required>
                        <SelectTrigger className="!h-11 w-full">
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="instructor">Instructor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                    <div className="relative">

                        <Input
                            id="location"
                            name="location"
                            type="text"
                            required
                            className="h-11"
                            placeholder="Enter your location"
                        />
                    </div>
                </div>

                {/* Gender Selection */}
                <div className="space-y-2">
                    <Select value={gender} onValueChange={setGender} required>
                        <SelectTrigger className="!h-11 w-full">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full mt-6" size="lg" variant="secondary">
                    Join Kahf
                </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href={'/auth/sign-in'}>
                        <Button variant="link" className="px-0 text-sm">
                            Sign in
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    );
}