"use client";
import { Typography } from "@/components/ui";
import { useAppContext } from "@/contexts/AppContext";

const Topbar = () => {
  const { user } = useAppContext();
  return (
    <div className="h-16 w-full px-6 py-10 flex items-center justify-between border-b border-border">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-transparent border border-border font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <Typography variant="body1">{user?.name}</Typography>
          <Typography variant="body2">{user?.role}</Typography>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
