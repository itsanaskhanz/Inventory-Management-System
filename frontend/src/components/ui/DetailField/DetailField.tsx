import { Typography } from "../Typography";
import { DetailFieldProps } from "./DetailField.types";

const DetailField = ({ label, value, children }: DetailFieldProps) => {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
        {label}
      </span>
      {value !== undefined ? (
        <Typography variant="body1" weight="medium" className="text-foreground">
          {value}
        </Typography>
      ) : (
        children
      )}
    </div>
  );
};

DetailField.displayName = "DetailField";

export default DetailField;
