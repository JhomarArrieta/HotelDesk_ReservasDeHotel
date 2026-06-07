import { clsx } from "clsx";

type ButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  readonly variant?: "primary" | "secondary" | "danger";
  readonly loading?: boolean;
};

export default function Button({
  variant = "primary",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-amber-400 hover:bg-amber-300 text-slate-900",
    secondary:
      "border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600",
    danger: "bg-red-500 hover:bg-red-400 text-white",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
}
