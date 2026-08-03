"use client";
import AdminDashboard from "@/components/domain/dashboard/AdminDashboard";
import SuperAdminDashboard from "@/components/domain/dashboard/SuperAdminDashboard";
import { useAppContext } from "@/contexts/AppContext";

const Page = () => {
  const { isSuperAdmin } = useAppContext();
  return isSuperAdmin ? <SuperAdminDashboard /> : <AdminDashboard />;
};

export default Page;
