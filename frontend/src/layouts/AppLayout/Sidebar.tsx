"use client";
import { Icon, NavLink } from "@/components/ui";
import { UserRole } from "@/config/roles";
import { getNavigationForRole } from "@/config/routes";
import { useAppContext } from "@/contexts/AppContext";
import { Icons } from "@/lib/icons";

function Sidebar() {
  const { user } = useAppContext();
  const navItems = getNavigationForRole(user?.role as UserRole);

  return (
    <div className="h-screen w-22 py-5 flex flex-col gap-6 bg-background border-r border-border shadow-lg shadow-black/5">
      {navItems.map((navItem, key) => (
        <NavLink
          href={navItem.href}
          key={key}
          className="w-full flex items-center justify-center"
          title={navItem.label}
        >
          <Icon name={navItem.icon as keyof typeof Icons} />
        </NavLink>
      ))}
    </div>
  );
}

export default Sidebar;
