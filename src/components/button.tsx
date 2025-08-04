import { type VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";
import * as React from "react";

import { Button as UIButton, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const DefaultButton = ({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  icon,
  iconPosition = "left",
  children,
  disabled,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const isDisabled = disabled || loading;

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Loader className="size-4 animate-spin" />
          {loadingText || "Vui lòng đợi"}
        </>
      );
    }

    if (icon && iconPosition === "left") {
      return (
        <>
          {icon}
          {children}
        </>
      );
    }

    if (icon && iconPosition === "right") {
      return (
        <>
          {children}
          {icon}
        </>
      );
    }

    return children;
  };

  return (
    <UIButton
      className={cn(className)}
      variant={variant}
      size={size}
      asChild={asChild}
      disabled={isDisabled}
      ref={ref}
      {...props}
    >
      {renderContent()}
    </UIButton>
  );
};

const CancelButton = ({
  children = "Hủy",
  ref,
  ...props
}: Omit<ButtonProps, "variant"> & { ref?: React.Ref<HTMLButtonElement> }) => {
  return (
    <DefaultButton ref={ref} variant="outline" {...props}>
      {children}
    </DefaultButton>
  );
};

const DeleteButton = ({
  children = "Xóa",
  ref,
  ...props
}: Omit<ButtonProps, "variant"> & { ref?: React.Ref<HTMLButtonElement> }) => {
  return (
    <DefaultButton ref={ref} variant="destructive" {...props}>
      {children}
    </DefaultButton>
  );
};

const Button = Object.assign(DefaultButton, {
  Cancel: CancelButton,
  Delete: DeleteButton,
});

export default Button;
