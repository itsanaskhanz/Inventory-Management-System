"use client";
import { AuthBrandPanel } from "@/components/domain/auth";
import { Button, Input, Typography } from "@/components/ui";
import { useAppContext } from "@/contexts/AppContext";
import { useLoginMutation } from "@/lib/api/authApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { User } from "@/types/auth.types";
import { ArrowRight, Lock, Mail } from "lucide-react";
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
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Login failed")),
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
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-8 rounded-lg border border-border bg-background-secondary p-8 shadow-sm md:p-10">
            <div className="flex flex-col gap-2">
              <Typography variant="h3">Welcome back</Typography>
              <Typography variant="body2" color="secondary">
                Sign in to your account to continue
              </Typography>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  fullWidth
                  rounded="md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
                <Input
                  type="password"
                  placeholder="Your password"
                  fullWidth
                  rounded="md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                rounded="md"
                type="submit"
                loading={isPending}
              >
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
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </form>

            <Typography variant="body2" align="center">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-foreground underline underline-offset-4"
              >
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
