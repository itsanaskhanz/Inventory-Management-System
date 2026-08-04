import { Typography } from "../Typography";
import { PageHeaderProps } from "./PageHeader.types";

const PageHeader = ({ title, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Typography variant="h5" weight="bold">
        {title}
      </Typography>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

PageHeader.displayName = "PageHeader";

export default PageHeader;
