import React from "react";
import type { LogoProps } from "./Logo.types";
import Image from "next/image";
import appConfig from "@/config/app.config";
const Logo = ({ size = "md", className }: LogoProps) => {
  const containerSize = {
    sm: "w-full h-6",
    md: "w-full h-10",
    lg: "w-full h-14",
  };
  return (
    <div className={`relative ${containerSize[size]} ${className}`}>
      <Image
        src={appConfig.appLogoUrl}
        alt={appConfig.appName}
        fill
        className="object-contain "
        priority
      />
    </div>
  );
};

export default Logo;
