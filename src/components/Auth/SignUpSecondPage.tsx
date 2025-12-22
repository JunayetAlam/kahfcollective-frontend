import { resetData, setCurrentPage, setData, useCurrentSignUpData } from "@/redux/signUpSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { FieldValues } from "react-hook-form";
import CustomForm from "../Forms/CustomForm";
import CustomInput from "../Forms/CustomInput";
import CustomRadioCheckpoint from "../Forms/CustomRadioCheckpoints";
import { Button } from "../ui/button";
import PageStep from "./PageStep";
import { toast } from "sonner";
import { useSignUpMutation } from "@/redux/api/userApi";
import { useRouter } from "next/navigation";

export default function SignUpSecondPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const data = useAppSelector(useCurrentSignUpData).data;
  const [signUp, { isLoading }] = useSignUpMutation();
  const defaultValues = {
    currentClass: data.currentClass || "",
    roll: data.roll || "",
    subject: data.subject || "",
  };

  const handleSubmit = async (formData: FieldValues) => {
    const registerData = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      address: data.fullAddress,
      introduction: data.shortIntroduction,
      referredBy: formData.other,
      gender: data.gender,
      currentClass: formData.currentClass,
      roll: Number(formData.roll),
      subject: formData.subject,

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
      {/* Current Class */}
      <CustomInput
        required
        label="What is your current class?"
        name="currentClass"
        type="text"
        placeholder="current class"
      />

      {/* Roll */}
      <CustomInput
        required
        label="What is your roll?"
        name="roll"
        type="number"
        placeholder="roll"
      />

      {/* Subject */}
      <CustomInput
        required
        label="What is your subject?"
        name="subject"
        type="text"
        placeholder="subject"
      />


      <PageStep disable={isLoading} />

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full"
        size="lg"
        variant="secondary"
      >
        Confirm
      </Button>
    </CustomForm>
  );
}
