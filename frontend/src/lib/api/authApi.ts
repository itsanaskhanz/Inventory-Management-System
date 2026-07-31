import {
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
  });
};
