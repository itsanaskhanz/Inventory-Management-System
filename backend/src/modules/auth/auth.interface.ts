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

export interface IRegister {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
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
