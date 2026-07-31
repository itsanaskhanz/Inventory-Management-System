import { UserRole } from "./roles";

export interface Route {
  id: string;
  label: string;
  href: string;
  roles: UserRole[];
}
const APP_ROUTES: Route[] = [
  {
    id: "Dashboard",
    label: "Dashboard",
    href: "/",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
];

const hasAccessToRoute = (pathname: string, userRole: UserRole): boolean => {
  const route = APP_ROUTES.find((r) => r.href === pathname);
  return route ? route.roles.includes(userRole) : false;
};

const getNavigationForRole = (role: UserRole): Route[] => {
  return APP_ROUTES.filter((r) => r.roles.includes(role));
};
export { APP_ROUTES, getNavigationForRole, hasAccessToRoute };
