"use client";

import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      icon,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "text-sm px-3 py-1",
      md: "px-4 py-2",
      lg: "text-lg px-5 py-3",
    };

    const variantClass = variant === "primary" ? "btn-primary" : "btn-outline";

    return (
      <button
        ref={ref}
        className={`btn ${variantClass} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
