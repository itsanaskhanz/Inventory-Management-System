import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
