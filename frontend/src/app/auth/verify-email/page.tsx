"use client";
import { AuthBrandPanel } from "@/components/domain/auth";
import { Button, Input, Logo, Typography } from "@/components/ui";
import { useResendOTPMutation, useVerifyEmailMutation } from "@/lib/api/authApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";

const VerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otpCode, setOtpCode] = useState("");
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmailMutation();
  const { mutate: resendOTP, isPending: isResending } = useResendOTPMutation();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warn("Please enter your email");
      return;
    }
    if (!otpCode || otpCode.length < 6) {
      toast.warn("Please enter the 6-digit verification code");
      return;
    }
    verifyEmail(
      { email, otpCode },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Email verified successfully");
          router.push("/auth/login");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Verification failed")),
      },
    );
  };

  const handleResend = () => {
    if (!email) {
      toast.warn("Please enter your email first");
      return;
    }
    resendOTP(
      { email },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Verification code sent");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to resend code")),
      },
    );
  };

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="flex flex-col gap-8 rounded-2xl border border-border bg-background p-8 shadow-xl shadow-slate-950/5 md:p-10">
        <div className="flex flex-col gap-3">
          <div className="w-32">
            <Logo size="sm" />
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="h3">Verify your email</Typography>
            <Typography variant="body2" color="secondary">
              We sent a 6-digit code to your inbox. Enter it below to activate your account.
            </Typography>
          </div>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-5">
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
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              fullWidth
              rounded="md"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="pl-10 tracking-widest"
              autoComplete="one-time-code"
              leftIcon="Lock"
            />
          </div>

          <Button variant="primary" size="lg" fullWidth rounded="md" type="submit" loading={isVerifying}>
            Verify account
          </Button>
        </form>

        <div className="flex flex-col items-center gap-3">
          <Typography variant="body2" align="center">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-medium text-primary hover:underline underline-offset-4 disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          </Typography>

          <Typography variant="body2" align="center">
            Back to Login?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthBrandPanel title="Verify your email" description="Please check your email to verify your account." />

      {/* ===== Form Panel ===== */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <Suspense fallback={null}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;