"use client";
import { Button, Logo, NavLink, Typography } from "@/components/ui";
import { UserRole } from "@/config/roles";
import { getNavigationForRole } from "@/config/routes";

const Sidebar = () => {
  const navItems = getNavigationForRole("ADMIN" as UserRole);
  return (
    <div className="h-full w-75 p-4 flex flex-col gap-6">
      <Logo size="md" />
      <div className="flex flex-col gap-2">
        {navItems.map((navItem, key) => (
          <NavLink href={navItem.href} key={key}>
            {navItem.label}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between">
        <div>
          <Typography variant="body1">Anas Khan</Typography>
          <Typography variant="body2">Admin</Typography>
        </div>
        <div>
          <Button variant="secondary">Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
