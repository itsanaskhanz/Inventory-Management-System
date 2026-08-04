export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  github: string;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export interface FeatureFlags {
  enableRegistration: boolean;
  enablePos: boolean;
}

export interface SecurityConfig {
  cookieName: string;
  authPaths: string[];
  publicPaths: string[];
}

export interface AppConfig {
  appName: string;
  appDescription: string;
  appAuthor: string;
  appTheme: "light" | "dark";
  appLogoUrl: string;
  appSupportEmail: string;
  appSupportPhone: string;
  socialLinks: SocialLinks;
  api: ApiConfig;
  appWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  showSidebar: boolean;
  showTopbar: boolean;
  defaultPageLimit: number;
  maxFetchLimit: number;
  features: FeatureFlags;
  security: SecurityConfig;
  appCurrencySymbol: string;
}

const appConfig: AppConfig = {
  appName: "Inventory Management System",
  appDescription:
    "A clean, fast inventory management system that helps your team track products, stock, and revenue from one place.",
  appAuthor: "John Doe",
  appTheme: "light",
  appLogoUrl: "/logo.png",
  appSupportEmail: "support@example.com",
  appSupportPhone: "+1 555 000 0000",
  socialLinks: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
  },
  api: {
    baseUrl: "http://localhost:8000/api",
    timeout: 10000,
  },
  appWidth: "full",
  showSidebar: true,
  showTopbar: true,
  defaultPageLimit: 10,
  maxFetchLimit: 100,
  features: {
    enableRegistration: false,
    enablePos: true,
  },
  security: {
    cookieName: "token",
    authPaths: ["/auth/login", "/auth/register"],
    publicPaths: ["/home", "/color-guid"],
  },
  appCurrencySymbol: "Rs.",
};

export default appConfig;
