import { Spinner } from "../Spinner";
import { AsyncStateProps } from "./AsyncState.types";

const AsyncState = ({
  isLoading,
  isError,
  errorMessage,
  children,
}: AsyncStateProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-background py-24">
        <Spinner label="Loading…" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-8 py-16 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10 text-lg font-bold text-danger">
          !
        </span>
        <p className="text-sm font-medium text-foreground">{errorMessage}</p>
      </div>
    );
  }
  return <>{children}</>;
};

AsyncState.displayName = "AsyncState";

export default AsyncState;