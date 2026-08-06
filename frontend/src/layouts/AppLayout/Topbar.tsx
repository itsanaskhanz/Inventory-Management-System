"use client";
import { useAppContext } from "@/contexts/AppContext";

const Topbar = () => {
  const { user } = useAppContext();
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
      {user && (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="text-xs text-foreground-secondary">
              {user.role}
            </span>
          </div>
        </div>
      )}
      <div className="hidden sm:flex flex-col gap-0.5">
        <h1 className="text-sm font-semibold text-foreground">
          Inventory Management
        </h1>
        <p className="text-xs text-foreground-secondary">
          Overview and quick actions
        </p>
      </div>
    </header>
  );
};

export default Topbar;
