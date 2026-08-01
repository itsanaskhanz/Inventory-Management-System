"use client";
import { Button, Icon, Logo, NavLink, Typography } from "@/components/ui";
import { UserRole } from "@/config/roles";
import { getNavigationForRole } from "@/config/routes";
import { useAppContext } from "@/contexts/AppContext";
import { Icons } from "@/lib/icons";

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
            <Icon name={navItem.icon as keyof typeof Icons} />
            {navItem.label}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <div>
          <Typography variant="body1">{user?.email}</Typography>
          <Typography variant="body2">{user?.role}</Typography>
        </div>
        <Button variant="secondary" onClick={logout} className="">
          Logout <Icon name="LogOut" />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
