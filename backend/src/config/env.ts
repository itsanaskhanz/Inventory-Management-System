import dotenv from "dotenv";

dotenv.config();

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const env = {
  PORT: Number(getEnvVar("PORT", "8000")),
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  FRONTEND_URL: getEnvVar("FRONTEND_URL", "http://localhost:3000"),
};

export default env;
