import appConfig from "@/config/app.config";

export const formatCurrency = (value: number | string) =>
  `${appConfig.appCurrencySymbol}${Number(value).toFixed(0)}`;

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString();
