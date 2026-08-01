"use client";
import { Button, Logo, NavLink, Typography } from "@/components/ui";
import { UserRole } from "@/config/roles";
import { getNavigationForRole } from "@/config/routes";
import { useAppContext } from "@/contexts/AppContext";

const Sidebar = () => {
  const { user, logout } = useAppContext();
  const navItems = getNavigationForRole(user?.role as UserRole);

  return (
    <div className="h-full w-75 p-4 flex flex-col gap-6">
      <Logo size="md" />
      {/* <Typography variant="h3" className="font-bold">
        {user?.name}
      </Typography> */}
      <hr />
      <div className="flex flex-col gap-2">
        {navItems.map((navItem, key) => (
          <NavLink href={navItem.href} key={key}>
            {navItem.label}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between">
        <div>
          <Typography variant="body1">{user?.email}</Typography>
          <Typography variant="body2">{user?.role}</Typography>
        </div>
        <div>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
