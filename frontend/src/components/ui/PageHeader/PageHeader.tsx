import { Typography } from "../Typography";
import { PageHeaderProps } from "./PageHeader.types";

const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <Typography variant="h4" weight="bold" className="tracking-tight">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="secondary">
            {description}
          </Typography>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
};

PageHeader.displayName = "PageHeader";

export default PageHeader;