'use client'

import React, { useState } from "react"

import { Button } from "@/components/ui/button"

import Link from "next/link"
import SIgnUpFirstPage from "./SIgnUpFirstPage"
import { useAppSelector } from "@/redux/store"
import { useCurrentSignUpData } from "@/redux/signUpSlice"
import Subtitle from "../Global/Subtitle"
import SignUpSecondPage from "./SignUpSecondPage"
import SignUpThirdPage from "./SignUpThirdPage"



export default function SignUp() {
    const [isLoading] = useState(false)
    const { currentPage } = useAppSelector(useCurrentSignUpData)


    return (
        <div className="w-full max-w-md">
            <Subtitle className="font-medium pt-3 pb-8 text-center">
                Create your account
            </Subtitle>
            {
                currentPage === 1 && <SIgnUpFirstPage />
            }
            {
                currentPage === 2 && <SignUpSecondPage />
            }
            {
                currentPage === 3 && <SignUpThirdPage />
            }

            <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/sign-in">
                        <Button variant="link" className="px-0 text-sm text-primary" disabled={isLoading}>
                            Sign in
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    )
}
