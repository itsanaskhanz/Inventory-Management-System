"use client";
import { Spinner } from "@/components/ui";
import { useAppContext } from "@/contexts/AppContext";
import clsx from "clsx";
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, topBarOpen, sidebarOpen } = useAppContext();
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  return (
    <div className={clsx("h-screen flex overflow-hidden")}>
      {sidebarOpen && user && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {topBarOpen && user && (
          <>
            <Topbar />
            <hr />
          </>
        )}
        <main className={clsx("flex-1 overflow-auto p-4")}>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
