import { Spinner } from "../Spinner";
import { AsyncStateProps } from "./AsyncState.types";

const AsyncState = ({
  isLoading,
  isError,
  errorMessage,
  children,
}: AsyncStateProps) => {
  if (isLoading) return <Spinner />;
  if (isError) {
    return (
      <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
        {errorMessage}
      </div>
    );
  }
  return <>{children}</>;
};

AsyncState.displayName = "AsyncState";

export default AsyncState;
