import appConfig from "@/config/app.config";
import { AppContextProvider } from "@/contexts/AppContext";
import QueryProvider from "@/providers/QueryClient";
import ToastProvider from "@/providers/ToastProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.appDescription,
  authors: [{ name: appConfig.appAuthor }],
  icons: appConfig.appLogoUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AppContextProvider>
            <ToastProvider>{children}</ToastProvider>
          </AppContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
