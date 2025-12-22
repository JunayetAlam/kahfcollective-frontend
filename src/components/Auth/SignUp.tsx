"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useCurrentSignUpData } from "@/redux/signUpSlice";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import Subtitle from "../Global/Subtitle";
import SIgnUpFirstPage from "./SIgnUpFirstPage";
import SignUpSecondPage from "./SignUpSecondPage";

export default function SignUp() {
  const [isLoading] = useState(false);
  const { currentPage } = useAppSelector(useCurrentSignUpData);

  return (
    <div className="w-full max-w-md">
      <Subtitle className="pt-3 pb-8 text-center font-medium">
        Create your account
      </Subtitle>
      {currentPage === 1 && <SIgnUpFirstPage />}
      {currentPage === 2 && <SignUpSecondPage />}

      <div className="pt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/sign-in">
            <Button
              variant="link"
              className="text-primary px-0 text-sm"
              disabled={isLoading}
            >
              Sign in
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
