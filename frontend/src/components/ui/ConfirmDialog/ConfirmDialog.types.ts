export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  pendingText?: string;
  cancelText?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}
