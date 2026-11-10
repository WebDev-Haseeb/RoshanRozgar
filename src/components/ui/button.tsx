import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "dark" | "secondary" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  dark: "bg-ink text-white hover:bg-black",
  secondary: "bg-white text-ink ring-1 ring-inset ring-line-strong hover:bg-surface",
  ghost: "text-link hover:underline underline-offset-4",
  white: "bg-white text-ink hover:bg-white/90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-[13px]",
  md: "h-10 px-5 text-[15px]",
  lg: "h-12 px-7 text-[17px]",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], variant === "ghost" ? "px-0" : sizes[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
