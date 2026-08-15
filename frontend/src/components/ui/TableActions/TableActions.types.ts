export interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  cancelLabel?: string;
}
