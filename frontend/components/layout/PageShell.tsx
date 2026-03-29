import { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return <div className="container-shell py-14 sm:py-16">{children}</div>;
}
