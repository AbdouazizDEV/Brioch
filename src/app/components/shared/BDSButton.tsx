import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface BDSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const BDSButton = React.forwardRef<HTMLButtonElement, BDSButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-bds-red text-white hover:bg-red-800 shadow-md",
      secondary: "bg-bds-gold text-white hover:bg-yellow-600 shadow-md",
      outline: "border-2 border-bds-red text-bds-red hover:bg-red-50",
      ghost: "text-bds-black hover:bg-gray-100",
    };

    const sizes = {
      sm: "h-8 px-4 text-sm rounded-lg",
      md: "h-12 px-6 text-base rounded-xl",
      lg: "h-14 px-8 text-lg rounded-xl w-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
