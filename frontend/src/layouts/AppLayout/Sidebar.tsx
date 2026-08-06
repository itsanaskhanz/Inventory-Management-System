"use client";
import { Icon, NavLink } from "@/components/ui";
import { UserRole } from "@/config/roles";
import { getNavigationForRole } from "@/config/routes";
import { useAppContext } from "@/contexts/AppContext";
import { Icons } from "@/lib/icons";
import appConfig from "@/config/app.config";
import { Logo } from "@/components/ui/Logo";
import clsx from "clsx";

function Sidebar() {
  const { user, logout } = useAppContext();
  const navItems = getNavigationForRole(user?.role as UserRole);

  return (
    <aside className="flex h-screen w-16 md:w-64 flex-col border-r border-border bg-background md:px-3 transition-[width] duration-300">
      <div className="flex h-16 items-center justify-center md:justify-start md:pl-2 border-b border-border mb-2">
        <div className="w-8 h-8 md:h-9 md:w-36">
          <Logo size="sm" className="h-full w-full" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto flex flex-col gap-1 px-2 md:px-3 py-2">
        {navItems.map((navItem) => (
          <NavLink
            href={navItem.href}
            key={navItem.id}
            title={navItem.label}
            className="w-full justify-center md:justify-start"
          >
            <Icon name={navItem.icon as keyof typeof Icons} />
            <span className="hidden md:inline">{navItem.label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div
          className={clsx(
            "border-t border-border p-3 flex items-center gap-3",
            "justify-center md:justify-between",
          )}
        >
          <div
            className={clsx(
              "hidden md:flex items-center gap-3 min-w-0 flex-1",
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs text-foreground-secondary">
                {user.role}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
            className="hidden md:inline-flex shrink-0 items-center justify-center p-2 rounded-lg text-foreground-secondary transition-colors duration-150 cursor-pointer hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon name="LogOut" size="sm" />
          </button>
        </div>
      )}

      <span className="hidden md:block px-4 pb-3 text-[10px] uppercase tracking-wider text-foreground-tertiary">
        {appConfig.appName}
      </span>
    </aside>
  );
}

export default Sidebar;