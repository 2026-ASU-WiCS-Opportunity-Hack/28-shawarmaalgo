import { getServerAuthToken, getServerRole } from "@/lib/auth";
import { getRoleDestination } from "@/lib/auth-routing";
import { HeaderClient } from "@/components/layout/HeaderClient";

export function Header() {
  const token = getServerAuthToken();
  const portalHref = token ? getRoleDestination(getServerRole()) : null;

  return <HeaderClient portalHref={portalHref} />;
}
