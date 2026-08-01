export interface AppConfig {
  appName: string;
  appDescription: string;
  appAuthor: string;
  appTheme: "light" | "dark";
  appLogoUrl: string;
  appSupportEmail: string;
  appSupportPhone: string;
  //   appWidth: "md" | "lg" | "xl" | "2xl" | "full";
  showSidebar: boolean;
  showTopbar: boolean;
}

const appConfig: AppConfig = {
  appName: "Next.js Example",
  appDescription: "A Next.js example app",
  appAuthor: "John Doe",
  appTheme: "light",
  appLogoUrl: "/logo.png",
  appSupportEmail: "",
  appSupportPhone: "",
  //   appWidth: "2xl",
  showSidebar: true,
  showTopbar: true,
};

export default appConfig;
