"use client";
import {
  Button,
  Icon,
  Logo,
  Modal,
  NavLink,
  Typography,
} from "@/components/ui";
import { UserRole } from "@/config/roles";
import { getNavigationForRole } from "@/config/routes";
import { useAppContext } from "@/contexts/AppContext";
import { Icons } from "@/lib/icons";
import { useState } from "react";

const Sidebar = () => {
  const { user, logout } = useAppContext();
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const navItems = getNavigationForRole(user?.role as UserRole);

  return (
    <div className="h-full w-75 p-4 flex flex-col gap-6 ">
      <Logo size="md" />
      <div className="flex flex-col gap-2 border-t border-border py-6">
        {navItems.map((navItem, key) => (
          <NavLink href={navItem.href} key={key}>
            <Icon name={navItem.icon as keyof typeof Icons} />
            {navItem.label}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <Button variant="secondary" onClick={() => setIsLogOutModalOpen(true)}>
          Logout <Icon name="LogOut" />
        </Button>
      </div>
      <Modal
        isOpen={isLogOutModalOpen}
        onClose={() => setIsLogOutModalOpen(false)}
        onCancel={() => setIsLogOutModalOpen(false)}
        onConfirm={() => logout()}
        title="Logout"
        description="Are you sure you want to logout?"
      >
        <Typography variant="body1">
          You will be logged out of the application.
        </Typography>
      </Modal>
    </div>
  );
};

export default Sidebar;
