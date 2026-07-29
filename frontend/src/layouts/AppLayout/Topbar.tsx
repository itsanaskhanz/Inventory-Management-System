"use client";
import { Typography } from "@/components/ui";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Topbar = () => {
  const pathname = usePathname();
  return (
    <div className="h-16 w-full p-4 flex items-center justify-between">
      <Typography variant="h3" align="center">
        {pathname === "/" ? "Dashboard" : pathname}
      </Typography>
    </div>
  );
};

export default Topbar;
