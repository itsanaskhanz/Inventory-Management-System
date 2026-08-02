"use client";
import AdminDashboard from "@/components/domain/dashboard/AdminDashboard";
import SuperAdminDashboard from "@/components/domain/dashboard/SuperAdminDashboard";
import { useAppContext } from "@/contexts/AppContext";
import AppLayout from "@/layouts/AppLayout";

const Page = () => {
  const { isSuperAdmin } = useAppContext();
  return (
    <AppLayout>
      {isSuperAdmin ? <SuperAdminDashboard /> : <AdminDashboard />}
    </AppLayout>
  );
};

export default Page;
