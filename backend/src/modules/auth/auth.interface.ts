export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
}

export interface IUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<IUser, "password">;

export interface IRegister {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  isVerified?: boolean;
  otpCode?: string | null;
  otpExpiry?: Date | null;
}

export interface IVerifyEmail {
  email: string;
  otpCode: string;
}

export interface IResendOTP {
  email: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  email: string;
  otpCode: string;
  password: string;
}
export interface ILogin {
  email: string;
  password: string;
}

export interface IUpdateProfile {
  name?: string;
  email?: string;
  password?: string;
}
