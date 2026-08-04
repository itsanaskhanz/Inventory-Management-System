export interface AsyncStateProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  children: React.ReactNode;
}
