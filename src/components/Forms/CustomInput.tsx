"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { JSX, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TInputProps = {
  type: string;
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string; // container class
  labelClassName?: string;
  fieldClassName?: string; // input class
  Icon?: JSX.Element;
  RightIcon?: JSX.Element;
  onRightIconClick?: () => void;
};

const CustomInput = ({
  type,
  name,
  label,
  disabled,
  required,
  placeholder,
  className,
  labelClassName,
  fieldClassName,
  Icon,
  RightIcon,
  onRightIconClick,
}: TInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (type === "number") {
      const inputElement = document.getElementById(name);
      if (inputElement) {
        inputElement.addEventListener("wheel", (e) => e.preventDefault(), {
          passive: false,
        });
      }
    }
  }, [name, type]);
  const handleRightClick = () => {
    if (onRightIconClick) {
      onRightIconClick();
    }
  };
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
              className={cn(
                "pb-2 text-sm font-semibold md:text-sm",
                labelClassName,
              )}
            >
              {label}
            </label>
          )}
          <div className={`relative w-full`}>
            {Icon && (
              <div className="absolute flex h-9 w-8 items-center justify-center text-sm">
                {Icon}
              </div>
            )}
            {RightIcon && (
              <div
                onClick={handleRightClick}
                className="absolute right-0 flex h-9 w-8 cursor-pointer items-center justify-center text-sm"
              >
                {RightIcon}
              </div>
            )}
            <Input
              {...field}
              type={type}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              min={type === "number" ? 0 : undefined}
              step={type === "number" ? 0.01 : undefined}
              className={cn(
                "w-full text-sm disabled:opacity-95",
                fieldClassName,
                Icon && "pl-8",
                RightIcon && "pr-8",
              )}
            />
          </div>
          {errors?.[name] && (
            <small className="mt-1 text-sm text-red-500">
              {errors?.[name]?.message as string}
            </small>
          )}
        </div>
      )}
    />
  );
};

export default CustomInput;
