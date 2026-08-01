"use client";
import { Button, Input, Typography } from "@/components/ui";
import { useAppContext } from "@/contexts/AppContext";
import { useLoginMutation } from "@/lib/api/authApi";
import { User } from "@/types/auth.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  // Router Hook for navigation
  const router = useRouter();
  // States
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  // AppContext Hook
  const { setUser } = useAppContext();
  // Mutations Hook
  const { mutate, isPending, error, isSuccess, data } = useLoginMutation();
  // Handle Login Function
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Email || !Password) {
      alert("Please fill in all fields");
      return;
    }
    mutate(
      { email: Email, password: Password },
      {
        onSuccess: (data) => {
          router.push("/");
          setUser(data.data?.user as User);
          toast.success(data.message || "Login Successful");
        },
        onError: (error) => {
          toast.error("Login Failed");
        },
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      },
    );
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md sm flex flex-col gap-6 rounded-lg border border-border bg-background px-6 py-16 shadow-sm"
      >
        <Typography variant="h1" align="center" weight="medium">
          Login
        </Typography>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Email"
            fullWidth
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            fullWidth
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          fullWidth
          onClick={(e: React.FormEvent) => handleLogin(e)}
          loading={isPending}
          type="submit"
        >
          Login
        </Button>
        <Typography variant="body2" align="center">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register">Register</Link>
        </Typography>
      </form>
    </div>
  );
};

export default Page;
