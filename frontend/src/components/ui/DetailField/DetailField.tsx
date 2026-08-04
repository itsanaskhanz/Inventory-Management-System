import { Typography } from "../Typography";
import { DetailFieldProps } from "./DetailField.types";

const DetailField = ({ label, value, children }: DetailFieldProps) => {
  return (
    <div>
      <Typography variant="body2" color="secondary">
        {label}
      </Typography>
      {value !== undefined ? (
        <Typography variant="body1" weight="medium">
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
