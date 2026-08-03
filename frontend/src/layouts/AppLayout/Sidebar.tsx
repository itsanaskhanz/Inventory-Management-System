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
    <div className="shrink-0 h-80wh w-22 m-4 py-5 flex flex-col items-center gap-6 rounded-2xl bg-background border border-border shadow-lg shadow-black/5">
      <div className="flex flex-col gap-2 border-t border-border pt-5 w-full px-2 h-full">
        {navItems.map((navItem, key) => (
          <NavLink
            href={navItem.href}
            key={key}
            className="justify-center px-0"
            title={navItem.label}
          >
            <Icon name={navItem.icon as keyof typeof Icons} />
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
