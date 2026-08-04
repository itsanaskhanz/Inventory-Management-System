import clsx from "clsx";
import { TextareaProps } from "./Textarea.types";

const Textarea = ({ className, fullWidth = false, ...props }: TextareaProps) => {
  return (
    <textarea
      className={clsx(
        "bg-background-secondary border-1 border-border text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:border-primary rounded-md px-3 py-1.5 text-sm resize-none",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
};

Textarea.displayName = "Textarea";

export default Textarea;
