/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FormProvider,
} from "react-hook-form";
import { toast } from "sonner";

type TFormConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
  className?: string;
};

type TFormProps = {
  onSubmit: SubmitHandler<FieldValues>;
  children: ReactNode;
  defaultValues?: Record<string, any>; // Ensure this is passed to initialize form state
} & TFormConfig;

const CustomForm = ({
  onSubmit,
  children,
  defaultValues,
  resolver,
  className,
}: TFormProps) => {
  // Configure React Hook Form with passed props
  const formConfig: TFormConfig = {};
  if (defaultValues) formConfig.defaultValues = defaultValues;
  if (resolver) formConfig.resolver = resolver;

  const methods = useForm(formConfig);

  const submit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await onSubmit(data);
      methods.reset(); // Optional: Reset form after submit
    } catch {
      toast.error("Error submitting form:");
    }
  };

  return (
    <FormProvider {...methods}>
      <form className={className} onSubmit={methods.handleSubmit(submit)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default CustomForm;
