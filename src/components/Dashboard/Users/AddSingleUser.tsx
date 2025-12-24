import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Edit3, Plus, X } from "lucide-react";
import CustomForm from "@/components/Forms/CustomForm";
import Spinner from "@/components/Global/Spinner";
import CustomInput from "@/components/Forms/CustomInput";
import CustomSelect from "@/components/Forms/CustomSelect";
import { FieldValues } from "react-hook-form";
import CustomTextarea from "@/components/Forms/CustomTextarea";
import { useCreateMultipleUsersMutation } from "@/redux/api/userApi";
import { toast } from "sonner";

const defaultValues = {
  fullName: "",
  email: "",
  password: "",
  isUserVerified: "NO",
  gender: "MALE",
  address: "",
  phoneNumber: "",
  introduction: "",
  currentClass: "",
  roll: "",
  subject: "",
};

export default function AddSingleUserForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const [createSingleUser, { isLoading }] = useCreateMultipleUsersMutation();

  const handleSave = async (data: FieldValues) => {
    const toastId = toast.loading("Creating user...");
    const updatedData = {
      ...data,
      isUserVerified: data.isUserVerified === "YES" ? true : false,
      roll: Number(data.roll),
    };
    try {
      console.log("Single user data:", updatedData);
      await createSingleUser({ users: [updatedData] }).unwrap();
      toast.success("User created successfully", { id: toastId });
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user", {
        id: toastId,
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <CustomForm
      onSubmit={handleSave}
      defaultValues={defaultValues}
      className="bg-background border-border rounded-lg border p-6"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-foreground text-lg font-semibold">
          Add Single User
        </h3>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <CustomInput
          required
          type="text"
          name="fullName"
          label="Full Name"
          placeholder="Enter full name"
          disabled={isLoading}
        />

        <CustomInput
          required
          name="email"
          type="email"
          label="Email"
          placeholder="Enter email"
          disabled={isLoading}
        />

        <CustomInput
          required
          name="password"
          type="text"
          label="Password"
          placeholder="Enter password"
          disabled={isLoading}
        />

        <CustomSelect
          name="isUserVerified"
          label="User Verified"
          placeholder="Select user verified"
          disabled={isLoading}
          options={[
            { label: "Yes", value: "YES" },
            { label: "No", value: "NO" },
          ]}
        />

        <CustomSelect
          name="gender"
          label="Gender"
          placeholder="Select gender"
          disabled={isLoading}
          options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
          ]}
        />

        <CustomInput
          required
          type="text"
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter phone number"
          disabled={isLoading}
        />

        <CustomInput
          required
          type="text"
          name="address"
          label="Address"
          placeholder="Enter address"
          disabled={isLoading}
        />

        <CustomInput
          type="text"
          name="currentClass"
          label="Current Class"
          placeholder="Enter current class"
          disabled={isLoading}
        />

        <CustomInput
          type="number"
          name="roll"
          label="Roll"
          placeholder="Enter roll"
          disabled={isLoading}
        />

        <CustomInput
          type="text"
          name="subject"
          label="Subject"
          placeholder="Enter subject"
          disabled={isLoading}
        />

        <CustomTextarea
          className="md:col-span-2"
          name="introduction"
          label="Introduction"
          placeholder="Enter introduction"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="text-muted-foreground"
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>

        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <Plus className="h-4 w-4" />}
          Add
        </Button>
      </div>
    </CustomForm>
  );
}
