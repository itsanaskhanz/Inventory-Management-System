import { UserRole } from "@/config/roles";
import {
  GetUsersByRoleResponse,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<RegisterResponse> => {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    },
  });
};

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<ProfileResponse> => {
      const response = await apiClient.get("/auth/profile");
      return response.data;
    },
    retry: false,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.post("/auth/logout");
    },
  });
};

export const useGetUsersByRole = (
  role: UserRole = UserRole.ADMIN,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: [`users-${role}-${page}-${limit}`],
    queryFn: async (): Promise<GetUsersByRoleResponse> => {
      const response = await apiClient.get(
        `/auth/getUsersByRole/${role}?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};
