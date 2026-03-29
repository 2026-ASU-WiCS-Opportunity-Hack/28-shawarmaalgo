import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ href, children, variant = "primary" }: ButtonProps) {
  const className =
    variant === "primary"
      ? "inline-flex items-center rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand-white"
      : "inline-flex items-center rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand-white"

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <button className={className}>{children}</button>;
}