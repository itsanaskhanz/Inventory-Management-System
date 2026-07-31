"use client";
import { Button, Input, Typography } from "@/components/ui";
import { useRegisterMutation } from "@/lib/api/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  // Router Hook for navigation
  const router = useRouter();
  // States
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  // Mutations Hook
  const { mutate, isPending } = useRegisterMutation();
  // Handle Register Function
  const handleRegister = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!Name || !Email || !Password) {
      alert("Please fill in all fields");
      return;
    }
    mutate(
      { name: Name, email: Email, password: Password },
      {
        onSuccess: (data) => {
          router.push("/auth/login");
          console.log(data);
        },
        onError: (error) => {
          console.log(error);
        },
        onSettled: () => {
          setName("");
          setEmail("");
          setPassword("");
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
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
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
          type="submit"
          onClick={(e: React.FormEvent) => handleRegister(e)}
          loading={isPending}
        >
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
