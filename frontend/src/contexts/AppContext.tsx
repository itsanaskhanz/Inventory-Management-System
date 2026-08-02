"use client";
import appConfig, { AppConfig } from "@/config/app.config";
import { UserRole } from "@/config/roles";
import { useGetProfileQuery, useLogoutMutation } from "@/lib/api/authApi";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { ProfileResponse, User } from "../types/auth.types";

interface IAppContext {
  appConfig: AppConfig;
  user: User | null;
  setUser: (user: User | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  topBarOpen: boolean;
  setIsTopBarOpen: (open: boolean) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isSuperAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
}

const appContext = createContext({} as IAppContext);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(
    appConfig.showSidebar,
  );
  const [topBarOpen, setIsTopBarOpen] = useState<boolean>(appConfig.showTopbar);
  const [theme, setTheme] = useState<"light" | "dark">(appConfig.appTheme);
  const { data: response, isLoading } = useGetProfileQuery();
  const { mutate: logoutMutate } = useLogoutMutation();
  const [loadedProfile, setLoadedProfile] = useState<ProfileResponse | null>(
    null,
  );

  if (response && response !== loadedProfile) {
    setLoadedProfile(response);
    setUser(response?.data?.user ?? null);
  }

  const logout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/auth/login");
      },
      onError: () => {
        toast.error("Error logging out");
      },
    });
  };

  return (
    <appContext.Provider
      value={{
        logout,
        appConfig,
        user,
        setUser,
        sidebarOpen,
        setSidebarOpen,
        topBarOpen,
        setIsTopBarOpen,
        theme,
        setTheme,
        isSuperAdmin: user?.role === UserRole.SUPER_ADMIN,
        isLoading,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(appContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};
export { AppContextProvider, useAppContext };
