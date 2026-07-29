"use client";
import { Button, Logo, NavLink, Typography } from "@/components/ui";
import React from "react";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: "📊", path: "/" },
    { name: "Users", icon: "👥", path: "/users" },
    { name: "Products", icon: "📦", path: "/products" },
    { name: "Orders", icon: "🛒", path: "/orders" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];
  return (
    <div className="h-full w-75 p-4 flex flex-col gap-6">
      <Logo size="md" />
      <div className="flex flex-col gap-2">
        {navItems.map((navItem, key) => (
          <NavLink href={navItem.path} key={key}>
            <span className="text-lg">{navItem.icon}</span>
            {navItem.name}
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
