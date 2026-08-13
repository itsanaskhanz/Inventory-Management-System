import { UserRole } from "@/config/roles";

export { UserRole };
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  name: string;
  email: string;
  role?: UserRole;
  password: string;
}

export interface RegisterResponse {
  message: string;
  success: boolean;
  data?: object;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
}
export interface VerifyRequest {
  email: string;
  otpCode: string;
}

export interface VerifyResponse {
  message: string;
  success: boolean;
  data?: object;
}

export interface ResendOTPRequest {
  email: string;
}

export interface ResendOTPResponse {
  message: string;
  success: boolean;
  data?: object;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
  data?: object;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
  data?: object;
}

export interface ProfileResponse {
  message: string;
  success: boolean;
  data: {
    user: User;
  };
}

export interface JwtPayload {
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface GetUsersByRoleResponse {
  message: string;
  success: boolean;
  data: {
    users: User[];
    pagination: {
      total: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}
