"use client";
import { Button, Input, Typography } from "@/components/ui";
import { useRegisterMutation } from "@/lib/api/authApi";
import axios from "axios";
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
    <div className="h-screen w-full flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md sm flex flex-col gap-6 rounded-lg border border-border bg-background px-6 py-16 shadow-sm"
      >
        <Typography variant="h1" align="center" weight="medium">
          Register
        </Typography>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Name"
            fullWidth
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
        <Button variant="primary" fullWidth type="submit" loading={isPending}>
          Register
        </Button>
        <Typography variant="body2" align="center">
          Already have an account? <Link href="/auth/login">Login</Link>
        </Typography>
      </form>
    </div>
  );
};

export default Page;
