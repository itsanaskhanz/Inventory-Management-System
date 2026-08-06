import clsx from "clsx";
import { TextareaProps } from "./Textarea.types";

const Textarea = ({ className, fullWidth = false, ...props }: TextareaProps) => {
  return (
    <textarea
      className={clsx(
        "bg-background-secondary border border-border text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3.5 py-2.5 text-sm resize-none shadow-sm transition-colors duration-200",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
};

Textarea.displayName = "Textarea";

export default Textarea;
