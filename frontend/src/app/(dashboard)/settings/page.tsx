"use client";
import { Button, ConfirmDialog, Input, Typography } from "@/components/ui";
import {
  useDeleteAccountMutation,
  useUpdateProfileMutation,
} from "@/lib/api/authApi";
import { useAppContext } from "@/contexts/AppContext";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useState } from "react";
import { toast } from "react-toastify";

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
        <Typography variant="h5" weight="bold" align="center">
          Settings
        </Typography>

        <div className="flex flex-col gap-4 rounded-lg border border-border p-6">
          <Typography variant="h6" weight="medium">
            Account Information
          </Typography>
          <div className="flex flex-col gap-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              fullWidth
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              fullWidth
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              type="password"
              fullWidth
            />
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
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-border p-6">
          <Typography variant="h6" weight="medium">
            Session
          </Typography>
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
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-red-200 p-6">
          <Typography variant="h6" weight="medium">
            Danger Zone
          </Typography>
          <Typography variant="body2" color="secondary">
            Deleting your account will permanently remove all of your data,
            including products, categories and order history. This action
            cannot be undone.
          </Typography>
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteOpen(true)}
              className="text-red"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        description="Are you sure you want to delete your account?"
        confirmText="Delete"
        isPending={isDeleting}
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
