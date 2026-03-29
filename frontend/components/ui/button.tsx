import Link from 'next/link';
import { ReactNode } from 'react';

type ButtonProps = {
  href?: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
};

export function buttonClassName(options: { fullWidth?: boolean; className?: string } = {}) {
  const { fullWidth = false, className = '' } = options;

  return [
    'inline-flex items-center justify-center rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-70',
    fullWidth ? 'w-full' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');
}

export function Button({
  href,
  children,
  className,
  fullWidth = false,
  type = 'button',
  disabled = false,
  onClick
}: ButtonProps) {
  const classes = buttonClassName({ fullWidth, className });

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
