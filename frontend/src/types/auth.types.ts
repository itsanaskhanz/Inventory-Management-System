enum UserRole {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
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
