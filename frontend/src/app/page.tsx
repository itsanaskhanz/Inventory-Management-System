"use client";
import { useAppContext } from "@/contexts/AppContext";
import AppLayout from "@/layouts/AppLayout";

const Page = () => {
  const { isSuperAdmin } = useAppContext();
  return (
    <AppLayout>
      {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
    </AppLayout>
  );
};

export default Page;
