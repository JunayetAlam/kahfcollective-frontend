import React, { useState } from "react"
import { toast } from "sonner"
import CustomTextarea from "../Forms/CustomTextarea"
import { setData, useCurrentSignUpData } from "@/redux/signUpSlice"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import CustomForm from "../Forms/CustomForm"
import CustomInput from "../Forms/CustomInput"
import CustomSelect from "../Forms/CustomSelect"
import { FieldValues } from "react-hook-form"
import { Eye, EyeClosed, LockKeyhole, Mail, User, MapPin, Phone, Pen } from "lucide-react"
import { Button } from "../ui/button"
import PageStep from "./PageStep"
export default function SIgnUpFirstPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useAppDispatch()
  const data = useAppSelector(useCurrentSignUpData).data

  const defaultValues = {
    fullName: data.fullName || "",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    password: data.password || "",
    confirmPassword: data.confirmPassword || "",
    fullAddress: data.fullAddress || "",
    gender: data.gender || "",
    shortIntroduction: data.shortIntroduction || ""
  };

  const handleSubmit = async (data: FieldValues) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Password not matched')
      return
    }

    console.log('Sign up attempt:', data)
    dispatch(setData({ data: data, currentPage: 2 }))
  }
  return (
    <CustomForm onSubmit={handleSubmit} defaultValues={defaultValues} className="space-y-4">
      {/* Full Name */}
      <CustomInput
        required
        name="fullName"
        type="text"
        placeholder="Enter your full name"
        Icon={<User size={16} />}
      />

      {/* Email */}
      <CustomInput
        required
        name="email"
        type="email"
        placeholder="your.email@example.com"
        Icon={<Mail size={16} />}
      />

      {/* Phone Number */}
      <CustomInput
        required
        name="phoneNumber"
        type="text"
        placeholder="Enter your phone number"
        Icon={<Phone size={16} />}
      />

      {/* Address */}
      <CustomInput
        required
        name="fullAddress"
        type="text"
        placeholder="Enter your address"
        Icon={<MapPin size={16} />}
      />

      {/* Short Introduction */}
      <CustomTextarea
        name="shortIntroduction"
        placeholder="Write a short intro about yourself"
        Icon={<Pen size={16} />}
      />

      {/* Password */}
      <CustomInput
        required
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Create password"
        Icon={<LockKeyhole size={16} />}
        RightIcon={showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
        onRightIconClick={() => setShowPassword(!showPassword)}
      />

      {/* Confirm Password */}
      <CustomInput
        required
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm password"
        Icon={<LockKeyhole size={16} />}
        RightIcon={showConfirmPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      {/* Gender */}
      <CustomSelect
        required
        name="gender"
        placeholder="Select gender"
        options={[
          { value: "MALE", label: "Male" },
          { value: "FEMALE", label: "Female" }
        ]}
      />

      <PageStep />

      <Button type="submit" className="w-full mt-6" size="lg" variant="secondary">
        Next
      </Button>

      {/* Already have account */}

    </CustomForm>
  );
}