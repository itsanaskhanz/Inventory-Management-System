import { Icon } from "../Icon";
import { TableActionsProps } from "./TableActions.types";

const actionButton =
  "inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const TableActions = ({
  onView,
  onEdit,
  onDelete,
  onCancel,
  viewLabel = "View",
  editLabel = "Edit",
  deleteLabel = "Delete",
  cancelLabel = "Cancel",
}: TableActionsProps) => {
  return (
    <div className="flex items-center gap-1">
      {onView && (
        <button
          type="button"
          className={`${actionButton} text-foreground-secondary hover:bg-primary/10 hover:text-primary`}
          onClick={onView}
          aria-label={viewLabel}
          title={viewLabel}
        >
          <Icon name="Eye" size="sm" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          className={`${actionButton} text-foreground-secondary hover:bg-primary/10 hover:text-primary`}
          onClick={onEdit}
          aria-label={editLabel}
          title={editLabel}
        >
          <Icon name="Pencil" size="sm" />
        </button>
      )}
      {onCancel && (
        <button
          type="button"
          className={`${actionButton} text-foreground-secondary hover:bg-danger/10 hover:text-danger`}
          onClick={onCancel}
          aria-label={cancelLabel}
          title={cancelLabel}
        >
          <Icon name="X" size="sm" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className={`${actionButton} text-foreground-secondary hover:bg-danger/10 hover:text-danger`}
          onClick={onDelete}
          aria-label={deleteLabel}
          title={deleteLabel}
        >
          <Icon name="Trash" size="sm" />
        </button>
      )}
    </div>
  );
};

TableActions.displayName = "TableActions";

export default TableActions;