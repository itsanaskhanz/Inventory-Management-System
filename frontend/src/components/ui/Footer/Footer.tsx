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
    <footer className="flex flex-col items-center gap-3 border-t border-border bg-background px-6 py-6">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {appConfig.appSupportEmail && (
          <a
            href={`mailto:${appConfig.appSupportEmail}`}
            className="flex items-center gap-1.5 text-xs text-foreground-tertiary hover:text-foreground"
          >
            <Mail className="h-3.5 w-3.5" />
            {appConfig.appSupportEmail}
          </a>
        )}
        {appConfig.appSupportPhone && (
          <a
            href={`tel:${appConfig.appSupportPhone}`}
            className="flex items-center gap-1.5 text-xs text-foreground-tertiary hover:text-foreground"
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
            className="text-xs text-foreground-tertiary hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <span className="text-xs text-foreground-tertiary">
        &copy; {new Date().getFullYear()} {appConfig.appName}. All rights
        reserved.
      </span>
    </footer>
  );
};

export default Footer;
