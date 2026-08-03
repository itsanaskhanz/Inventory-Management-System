import { Icons } from "@/lib/icons";
import { UserRole } from "./roles";

export interface IRoute {
  id: string;
  label: string;
  href: string;
  roles: UserRole[];
  icon?: keyof typeof Icons;
}
const APP_ROUTES: IRoute[] = [
  {
    id: "Dashboard",
    label: "Dashboard",
    href: "/",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    icon: "LayoutDashboard",
  },
  {
    id: "Contractors",
    label: "Contractors",
    href: "/contractors",
    roles: [UserRole.SUPER_ADMIN],
    icon: "Newspaper",
  },
  {
    id: "Products",
    label: "Products",
    href: "/products",
    roles: [UserRole.ADMIN],
    icon: "ShoppingBag",
  },
  {
    id: "Categories",
    label: "Categories",
    href: "/categories",
    roles: [UserRole.ADMIN],
    icon: "LayoutGrid",
  },
];

const hasAccessToRoute = (pathname: string, userRole: UserRole): boolean => {
  const route = APP_ROUTES.find((r) => r.href === pathname);
  if (!route) {
    console.warn(`Route not found for pathname: ${pathname}`);
    return true; // If route is not defined, allow access by default
  }
  return route.roles.includes(userRole);
};

const getNavigationForRole = (role: UserRole): IRoute[] => {
  return APP_ROUTES.filter((r) => r.roles.includes(role));
};
export { APP_ROUTES, getNavigationForRole, hasAccessToRoute };
