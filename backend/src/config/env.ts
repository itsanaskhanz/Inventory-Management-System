import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || 9000,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default env;
