import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "subtle" | "quiet";
};

export function Button({
  children,
  className = "",
  variant = "subtle",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export function IconButton({
  label,
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`icon-button ${className}`}
      title={label}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`badge ${className}`}>{children}</span>;
}
