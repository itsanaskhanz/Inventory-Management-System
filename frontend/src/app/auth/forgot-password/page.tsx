"use client";
import { AuthBrandPanel } from "@/components/domain/auth";
import { Button, Input, Logo, Typography } from "@/components/ui";
import { useForgotPasswordMutation, useResetPasswordMutation } from "@/lib/api/authApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: sendCode, isPending: isSending } = useForgotPasswordMutation();
  const { mutate: resetPassword, isPending: isResetting } = useResetPasswordMutation();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warn("Please enter your email");
      return;
    }
    sendCode(
      { email },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Reset code sent to your email");
          setStep("reset");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to send reset code")),
      },
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.warn("Please enter the 6-digit reset code");
      return;
    }
    if (!password || password.length < 6) {
      toast.warn("Password must be at least 6 characters");
      return;
    }
    resetPassword(
      { email, otpCode, password },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Password reset successfully");
          router.push("/auth/login");
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to reset password")),
      },
    );
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthBrandPanel
        title="Reset your password"
        description="Enter your email and we'll send you a code to reset your password securely."
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
                <Typography variant="h3">{step === "email" ? "Forgot password" : "Set a new password"}</Typography>
                <Typography variant="body2" color="secondary">
                  {step === "email"
                    ? "Enter your account email to receive a 6-digit reset code."
                    : `We sent a code to ${email}. Enter it along with your new password.`}
                </Typography>
              </div>
            </div>

            {step === "email" ? (
              <form onSubmit={handleSendCode} className="flex flex-col gap-5">
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

                <Button variant="primary" size="lg" fullWidth rounded="md" type="submit" loading={isSending}>
                  Send reset code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
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

                <div className="relative">
                  <Input
                    type="password"
                    placeholder="New password"
                    fullWidth
                    rounded="md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="new-password"
                    leftIcon="Lock"
                  />
                </div>

                <Button variant="primary" size="lg" fullWidth rounded="md" type="submit" loading={isResetting}>
                  Reset password
                </Button>
              </form>
            )}

            <div className="flex flex-col items-center gap-3">
              {step === "reset" && (
                <Typography variant="body2" align="center">
                  Didn&apos;t get the code?{" "}
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isSending}
                    className="font-medium text-primary hover:underline underline-offset-4 disabled:opacity-50"
                  >
                    {isSending ? "Sending..." : "Resend code"}
                  </button>
                </Typography>
              )}

              <Typography variant="body2" align="center">
                Back to Login?{" "}
                <Link href="/auth/login" className="font-medium text-primary hover:underline underline-offset-4">
                  Sign in
                </Link>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
