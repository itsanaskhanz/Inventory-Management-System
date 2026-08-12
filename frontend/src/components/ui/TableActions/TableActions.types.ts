export interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  cancelLabel?: string;
}
