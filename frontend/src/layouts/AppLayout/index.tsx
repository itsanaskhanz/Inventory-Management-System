"use client";
import { Spinner } from "@/components/ui";
import appConfig, { AppConfig } from "@/config/app.config";
import { useAppContext } from "@/contexts/AppContext";
import clsx from "clsx";
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const WIDTH_CLASSES: Record<AppConfig["appWidth"], string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, topBarOpen, sidebarOpen } = useAppContext();
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  return (
    <div className={clsx("flex h-screen overflow-hidden bg-background")}>
      {sidebarOpen && user && <Sidebar />}
      <div className="flex flex-1 flex-col min-w-0">
        {topBarOpen && user && (
          <>
            <Topbar />
          </>
        )}
        <main
          className={clsx(
            "flex-1 overflow-auto px-6 py-8 mx-auto w-full",
            WIDTH_CLASSES[appConfig.appWidth],
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
