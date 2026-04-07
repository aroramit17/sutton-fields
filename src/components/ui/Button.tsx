import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "gradient";

interface ButtonProps {
  variant?: ButtonVariant;
  href?: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-container text-on-primary shadow-sm",
  secondary:
    "bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary",
  ghost: "text-primary font-bold hover:text-primary-container",
  gradient:
    "bg-linear-to-r from-primary to-primary-container text-on-primary shadow-lg hover:opacity-90",
};

export function Button({
  variant = "primary",
  href,
  children,
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
    variantStyles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles} onClick={onClick}>
      {children}
    </button>
  );
}
