"use client";
import { AuthBrandPanel } from "@/components/domain/auth";
import { Button, Icon, Input, Logo, Typography } from "@/components/ui";
import { useAppContext } from "@/contexts/AppContext";
import { useLoginMutation } from "@/lib/api/authApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { User } from "@/types/auth.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAppContext();
  const { mutate, isPending } = useLoginMutation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("Please fill in all fields");
      return;
    }
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          setUser(data.data?.user as User);
          toast.success(data.message || "Login successful");
          router.push("/");
        },
        onError: (error) => {
          const message = getApiErrorMessage(error, "Login failed");
          if (message.toLowerCase().includes("email not verified")) {
            toast.info("Please verify your email first");
            router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
            return;
          }
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthBrandPanel
        title="Your inventory, perfectly in sync"
        description="A clean, fast inventory management system that helps your team track products, stock, and revenue from one place."
      />

      {/* ===== Form Panel ===== */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="flex flex-col gap-8 rounded-2xl border border-border bg-background p-8 shadow-xl shadow-slate-950/5 md:p-10">
            <div className="flex flex-col gap-3">
              <div className="w-32">
                <Logo size="sm" />
              </div>
              <div className="flex flex-col gap-1">
                <Typography variant="h3">Welcome back</Typography>
                <Typography variant="body2" color="secondary">
                  Sign in to your account to continue
                </Typography>
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  fullWidth
                  rounded="md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                  leftIcon="Mail"
                />
              </div>

              <div className="relative">
                <Input
                  type="password"
                  placeholder="Your password"
                  fullWidth
                  rounded="md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                  leftIcon="Lock"
                />
              </div>

              <Button variant="primary" size="lg" fullWidth rounded="md" type="submit" loading={isPending}>
                Sign in
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-foreground-tertiary">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Link href="/home" className="w-full">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  rounded="md"
                  className="flex items-center justify-center gap-2"
                >
                  Explore
                  <Icon name="ArrowRight" size="sm" />
                </Button>
              </Link>
            </form>

            <Typography variant="body2" align="center">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-primary hover:underline underline-offset-4">
                Create one
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
