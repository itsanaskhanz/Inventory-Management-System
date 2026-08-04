"use client";
import { AuthBrandPanel } from "@/components/domain/auth";
import { Button, Input, Typography } from "@/components/ui";
import { useRegisterMutation } from "@/lib/api/authApi";
import axios from "axios";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending } = useRegisterMutation();

  const handleRegister = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.warn("Please fill in all fields");
      return;
    }
    mutate(
      { name, email, password },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Account created successfully");
          router.push("/auth/login");
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "Registration failed");
          } else {
            toast.error("Registration failed");
          }
        },
      },
    );
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthBrandPanel
        title="Start managing inventory in minutes"
        description="Create your free account and get instant access to products, stock, and revenue tracking — all in one clean workspace."
      />

      {/* ===== Form Panel ===== */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-8 rounded-lg border border-border bg-background-secondary p-8 shadow-sm md:p-10">
            <div className="flex flex-col gap-2">
              <Typography variant="h3">Create your account</Typography>
              <Typography variant="body2" color="secondary">
                Get started in a few seconds
              </Typography>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
                <Input
                  type="text"
                  placeholder="Your full name"
                  fullWidth
                  rounded="md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  autoComplete="name"
                />
              </div>

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
                  placeholder="Create a password"
                  fullWidth
                  rounded="md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="new-password"
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
                Create account
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
                  Browse as guest
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </form>

            <Typography variant="body2" align="center">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Sign in
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
