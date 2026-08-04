import { Icon } from "../Icon";
import { TableActionsProps } from "./TableActions.types";

const TableActions = ({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: TableActionsProps) => {
  return (
    <div className="flex items-center gap-6">
      {onEdit && (
        <button
          type="button"
          className="cursor-pointer"
          onClick={onEdit}
          aria-label={editLabel}
        >
          <Icon name="Pencil" size="sm" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className="cursor-pointer"
          onClick={onDelete}
          aria-label={deleteLabel}
        >
          <Icon name="Trash" size="sm" color="red" />
        </button>
      )}
    </div>
  );
};

TableActions.displayName = "TableActions";

export default TableActions;
