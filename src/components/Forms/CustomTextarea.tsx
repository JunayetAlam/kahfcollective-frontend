"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { JSX } from "react";

type TTextareaProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string; // container class
  labelClassName?: string;
  fieldClassName?: string; // textarea class
  Icon?: JSX.Element

};

const CustomTextarea = ({
  name,
  label,
  placeholder,
  required,
  disabled,
  rows = 4,
  className,
  labelClassName,
  fieldClassName,
  Icon,
}: TTextareaProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field }) => (
        <div className={cn("flex flex-col", className)}>
          {label && (
            <label
              htmlFor={name}
              className={cn("text-sm md:text-sm font-semibold pb-2", labelClassName)}
            >
              {label}
            </label>
          )}
          {
            Icon && <div className="absolute text-sm w-8 h-9 flex justify-center items-center">{Icon}</div>
          }
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={cn("w-full text-sm", fieldClassName, Icon && 'pl-8',)}
          />

          {errors?.[name] && (
            <small className="text-red-500 text-sm mt-1">
              {errors?.[name]?.message as string}
            </small>
          )}
        </div>
      )}
    />
  );
};

export default CustomTextarea;
