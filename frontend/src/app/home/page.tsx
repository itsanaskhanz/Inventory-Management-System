import { Footer } from "@/components/ui/Footer";
import { Logo } from "@/components/ui/Logo";
import { Typography } from "@/components/ui/Typography";
import appConfig from "@/config/app.config";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Package,
  ShieldCheck,
  Receipt,
  Zap,
  Users,
} from "lucide-react";

const FEATURES = [
  {
    icon: Package,
    title: "Real-time stock tracking",
    description:
      "Always know exactly what's in stock, what's running low, and what needs reordering.",
  },
  {
    icon: Receipt,
    title: "Unified order management",
    description:
      "Create orders at the point of sale and keep a complete, searchable order history.",
  },
  {
    icon: BarChart3,
    title: "Revenue analytics",
    description:
      "Monitor revenue trends with live charts and insights to inform smarter decisions.",
  },
  {
    icon: Users,
    title: "Customer records",
    description:
      "Maintain a clean customer directory with detailed purchase history for every buyer.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description:
      "Granular roles and permissions keep your data safe and your team focused.",
  },
  {
    icon: Zap,
    title: "Fast & polished",
    description:
      "A lightweight, responsive interface built for speed and clarity on any device.",
  },
];

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-primary-light/10 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-6 py-20 text-center md:py-28">
            <div className="w-40 md:w-48">
              <Logo size="md" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-secondary px-3.5 py-1 text-xs font-medium text-foreground-secondary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {appConfig.appName}
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
              Your inventory,{" "}
              <span className="text-primary">perfectly in sync</span>
            </h1>

            <Typography
              variant="body1"
              color="secondary"
              className="max-w-xl text-lg"
            >
              {appConfig.appDescription}
            </Typography>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/login"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-md"
              >
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-background-secondary"
              >
                Create an account
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="mb-10 text-center">
            <Typography variant="h4" weight="bold">
              Everything you need to run your inventory
            </Typography>
            <Typography
              variant="body2"
              color="secondary"
              className="mx-auto mt-2 max-w-md"
            >
              A complete toolkit for products, customers, orders and revenue —
              designed to keep your business moving.
            </Typography>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-background-secondary p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <feature.icon className="h-5 w-5" />
                </div>
                <Typography variant="h6" weight="medium" className="mb-1.5">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="secondary">
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default Page;