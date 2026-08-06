"use client";
import {
  Button,
  ConfirmDialog,
  Input,
  PageHeader,
  Typography,
} from "@/components/ui";
import {
  useDeleteAccountMutation,
  useUpdateProfileMutation,
} from "@/lib/api/authApi";
import { useAppContext } from "@/contexts/AppContext";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useState } from "react";
import { toast } from "react-toastify";
import { User, Mail, KeyRound, LogOut, AlertTriangle } from "lucide-react";

const SettingsPage = () => {
  const { user, setUser, logout } = useAppContext();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation();
  const { mutate: deleteAccount, isPending: isDeleting } =
    useDeleteAccountMutation();

  const handleUpdate = () => {
    updateProfile(
      {
        ...(name !== user?.name ? { name } : {}),
        ...(email !== user?.email ? { email } : {}),
        ...(password ? { password } : {}),
      },
      {
        onSuccess: () => {
          setPassword("");
          setUser({ ...user!, name, email });
          toast.success("Profile updated successfully");
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to update profile")),
      },
    );
  };

  const handleDelete = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        toast.success("Account deleted successfully");
        logout();
      },
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "Failed to delete account")),
    });
  };

  const hasChanges =
    name !== user?.name ||
    email !== user?.email ||
    (password && password.length > 0);

  return (
    <>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <PageHeader
          title="Settings"
          description="Manage your account and preferences"
        />

        <section className="flex flex-col gap-4 rounded-xl border border-border bg-background-secondary p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </span>
            <Typography variant="h6" weight="medium">
              Account Information
            </Typography>
          </div>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                fullWidth
                className="pl-9"
              />
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                fullWidth
                className="pl-9"
              />
            </div>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                type="password"
                fullWidth
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleUpdate}
              disabled={!hasChanges || isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-border bg-background-secondary p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <LogOut className="h-4 w-4" />
            </span>
            <Typography variant="h6" weight="medium">
              Session
            </Typography>
          </div>
          <Typography variant="body2" color="secondary">
            Log out of your account on this device.
          </Typography>
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsLogoutOpen(true)}
            >
              Logout
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-danger/30 bg-danger/5 p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <Typography variant="h6" weight="medium">
              Danger Zone
            </Typography>
          </div>
          <Typography variant="body2" color="secondary">
            Deleting your account will permanently remove all of your data,
            including products, categories and order history. This action
            cannot be undone.
          </Typography>
          <div className="flex justify-end">
            <Button
              variant="danger"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </section>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        description="Are you sure you want to delete your account?"
        confirmText="Delete"
        pendingText="Deleting..."
        isPending={isDeleting}
        danger
      >
        <Typography variant="body1">
          All of your data will be permanently deleted. This action cannot be
          undone.
        </Typography>
      </ConfirmDialog>

      <ConfirmDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => logout()}
        title="Logout"
        description="Are you sure you want to logout?"
      >
        <Typography variant="body1">
          You will be logged out of the application.
        </Typography>
      </ConfirmDialog>
    </>
  );
};

export default SettingsPage;