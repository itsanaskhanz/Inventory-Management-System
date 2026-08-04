import { Modal } from "../Modal";
import { ConfirmDialogProps } from "./ConfirmDialog.types";

const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  pendingText,
  cancelText = "Cancel",
  isPending = false,
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      title={title}
      description={description}
      confirmText={isPending ? (pendingText ?? confirmText) : confirmText}
      cancelText={cancelText}
    >
      {children}
    </Modal>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";

export default ConfirmDialog;
