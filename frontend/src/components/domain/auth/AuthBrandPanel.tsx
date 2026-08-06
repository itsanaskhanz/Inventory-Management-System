import { Logo } from "@/components/ui/Logo";
import appConfig from "@/config/app.config";
import { BarChart3, Package, ShieldCheck, type LucideIcon } from "lucide-react";

interface AuthBrandPanelProps {
  title: string;
  description: string;
  points?: { icon: LucideIcon; text: string }[];
}

const DEFAULT_POINTS = [
  {
    icon: Package,
    text: "Track products and stock in real time",
  },
  {
    icon: BarChart3,
    text: "Monitor revenue with live analytics",
  },
  {
    icon: ShieldCheck,
    text: "Role-based access for your whole team",
  },
];

const AuthBrandPanel = ({
  title,
  description,
  points = DEFAULT_POINTS,
}: AuthBrandPanelProps) => {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-primary-light/20 blur-3xl" />
      </div>

      <Logo size="lg" />

      <div className="relative flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
          {title}
        </h2>
        <p className="max-w-md text-base leading-relaxed text-white/80">
          {description}
        </p>
        <ul className="mt-4 flex flex-col gap-4">
          {points.map((point) => (
            <li key={point.text} className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                <point.icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-sm leading-relaxed">{point.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="text-xs text-white/60">
        © {new Date().getFullYear()} {appConfig.appName}. All rights reserved.
      </span>
    </div>
  );
};

export default AuthBrandPanel;
