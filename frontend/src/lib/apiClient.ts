import appConfig from "@/config/app.config";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});
