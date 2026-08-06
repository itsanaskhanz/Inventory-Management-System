import appConfig from "@/config/app.config";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Facebook", href: appConfig.socialLinks.facebook },
  { label: "Twitter", href: appConfig.socialLinks.twitter },
  { label: "Instagram", href: appConfig.socialLinks.instagram },
  { label: "LinkedIn", href: appConfig.socialLinks.linkedin },
  { label: "GitHub", href: appConfig.socialLinks.github },
].filter((link) => Boolean(link.href));

const Footer = () => {
  return (
    <footer className="flex w-full flex-col items-center gap-4 border-t border-border bg-background px-6 py-8">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {appConfig.appSupportEmail && (
          <a
            href={`mailto:${appConfig.appSupportEmail}`}
            className="flex items-center gap-1.5 text-xs text-foreground-secondary transition-colors hover:text-primary"
          >
            <Mail className="h-3.5 w-3.5" />
            {appConfig.appSupportEmail}
          </a>
        )}
        {appConfig.appSupportPhone && (
          <a
            href={`tel:${appConfig.appSupportPhone}`}
            className="flex items-center gap-1.5 text-xs text-foreground-secondary transition-colors hover:text-primary"
          >
            <Phone className="h-3.5 w-3.5" />
            {appConfig.appSupportPhone}
          </a>
        )}
        {SOCIAL_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-foreground-secondary transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <span className="text-xs text-foreground-tertiary">
        © {new Date().getFullYear()} {appConfig.appName}. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;