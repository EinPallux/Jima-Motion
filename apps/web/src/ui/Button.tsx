import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "primary" | "ink" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Emerald accent CTA — solid emerald-700 keeps white text ≥5:1 (a11y).
  primary:
    "bg-primary-strong text-white shadow-xs hover:bg-primary-press active:bg-primary-press",
  // Strong neutral CTA.
  ink: "bg-ink text-white shadow-xs hover:bg-graphite active:bg-graphite",
  // Outline / secondary on white.
  secondary:
    "bg-paper text-ink ring-1 ring-inset ring-mist hover:bg-canvas hover:ring-slate/30",
  // Low-emphasis.
  ghost: "bg-transparent text-slate hover:bg-subtle hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 gap-1.5 px-3.5 text-sm",
  md: "h-11 gap-2 px-5 text-[15px]",
  lg: "h-12 gap-2 px-6 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center rounded-xl font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
