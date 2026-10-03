import type { ButtonHTMLAttributes } from "react";
import { focusRing } from "./focus";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-[#151817] text-white hover:bg-black",
  secondary:
    "border border-black/10 bg-white text-[#151817] hover:border-black/25 hover:shadow-sm",
  ghost: "text-[#6B716D] hover:text-[#151817]",
};

const SIZES: Record<Size, string> = {
  sm: "px-3.5 py-2 text-[13px]",
  md: "px-5 py-3 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-150 hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${focusRing} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    />
  );
}
