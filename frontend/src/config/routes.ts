import { UserRole } from "./roles";

export interface IRoute {
  id: string;
  label: string;
  href: string;
  roles: UserRole[];
}
const APP_ROUTES: IRoute[] = [
  {
    id: "Dashboard",
    label: "Dashboard",
    href: "/",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    id: "Contractors",
    label: "Contractors",
    href: "/contractors",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    id: "Products",
    label: "Products",
    href: "/products",
    roles: [UserRole.ADMIN],
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
