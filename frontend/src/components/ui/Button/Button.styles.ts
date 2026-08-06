export const baseStyles =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "transition-all duration-200 ease-out select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none " +
  "active:scale-[0.98]";

export const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-sm shadow-primary/30 hover:bg-primary-dark hover:shadow-md hover:shadow-primary/30",
  secondary:
    "bg-background-secondary text-foreground border border-border hover:bg-background-tertiary hover:border-border-dark shadow-sm",
  ghost:
    "bg-transparent text-foreground-secondary border border-transparent hover:bg-background-tertiary hover:text-foreground",
  danger:
    "bg-danger text-primary-foreground shadow-sm shadow-danger/30 hover:bg-danger/90",
};

export const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export const roundedSizes = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
};