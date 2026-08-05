"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

type TSwitchProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  checkedValue?: string;
  uncheckedValue?: string;
};

const CustomSwitch = ({
  name,
  label,
  disabled,
  required,
  className,
  labelClassName,
  checkedValue = "ACTIVE",
  uncheckedValue = "HIDDEN",
}: TSwitchProps) => {
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
              className={cn(
                "pb-2 text-sm font-semibold md:text-sm",
                labelClassName,
              )}
            >
              {label}
            </label>
          )}
          <div className="flex h-9 items-center gap-3">
            <Switch
              id={name}
              checked={field.value === checkedValue}
              onCheckedChange={(checked) =>
                field.onChange(checked ? checkedValue : uncheckedValue)
              }
              disabled={disabled}
            />
            <span className="text-muted-foreground text-sm">
              {field.value === checkedValue ? "Active" : "Hidden"}
            </span>
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

export default CustomSwitch;
