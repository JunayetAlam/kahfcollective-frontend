/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSignUpMutation } from "@/redux/api/userApi";
import {
  resetData,
  setCurrentPage,
  useCurrentSignUpData,
} from "@/redux/signUpSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import CustomForm from "../Forms/CustomForm";
import CustomInput from "../Forms/CustomInput";
import CustomRadioCheckpoint from "../Forms/CustomRadioCheckpoints";
import { Button } from "../ui/button";
import PageStep from "./PageStep";

export default function SignUpThirdPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const data = useAppSelector(useCurrentSignUpData).data;
  const [signUp, { isLoading }] = useSignUpMutation();
  const defaultValues = {
    isSheikhSalmanReferred: data.isSheikhSalmanReferred || "",
    other: data.other || "",
  };
  const handleSubmit = async (formData: FieldValues) => {
    const registerData = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      address: data.fullAddress,
      introduction: data.shortIntroduction,
      isReferredBySheikhSalmam:
        formData.isSheikhSalmanReferred === "yes" ? true : false,
      majorOrProfession: data.profession,
      coursesName: data.coursesName,
      referredBy: formData.other, // assuming "other" field is who referred
      haveTakenCoursesBefore: data.wasTakeCourseBefore === "yes" ? true : false,
      isTakeCourseWithSheikh:
        data.isTakeCourseWithSheikh === "yes" ? true : false,
      howLongInCourse: data.howLongCorrespondence,
      gender: data.gender,
    };
    const toastId = toast.loading("Creating your account...");
    try {
      const result = await signUp(registerData).unwrap();
      toast.success(result?.message, { id: toastId });
      dispatch(resetData());
      router.push(`/auth/check-email?email=${data.email}`);
    } catch (error: any) {
      if (error?.data?.message === "User already exists with the email") {
        dispatch(setCurrentPage({ currentPage: 1 }));
      }
      toast.error(error?.data?.message || "Sign up failed", { id: toastId });
    }
  };

  return (
    <CustomForm
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      className="space-y-4"
    >
      {/* Is Sheikh Salman Referred */}
      <CustomRadioCheckpoint
        name="isSheikhSalmanReferred"
        label="Were you referred by Sheikh Salman?"
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        otherFieldName="other"
        placeholder="If other, specify here"
      />

      {/* Other referral (conditional) */}
      <CustomInput
        name="other"
        type="text"
        label="If other, please specify"
        placeholder="Enter referral name or details"
        disabled={isLoading}
      />


      <Button
        disabled={isLoading}
        type="submit"
        className="mt-6 w-full"
        size="lg"
        variant="secondary"
      >
        Sign Up
      </Button>
    </CustomForm>
  );
}
