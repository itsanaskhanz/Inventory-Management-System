"use client";
import { Button, Input, Typography } from "@/components/ui";
import { useAppContext } from "@/contexts/AppContext";
import { useLoginMutation } from "@/lib/api/authApi";
import { User } from "@/types/auth.types";
import axios from "axios";
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
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "Login failed");
          } else {
            toast.error("Login failed");
          }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button variant="primary" fullWidth loading={isPending} type="submit">
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
