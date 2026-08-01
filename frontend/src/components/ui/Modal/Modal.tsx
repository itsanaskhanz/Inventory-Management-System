import { Button } from "../Button";
import { Icon } from "../Icon";
import { Typography } from "../Typography";
import { closeButton, container, overlay } from "./Modal.styles";
import { ModalProps } from "./Modal.types";

const Modal = ({
  onClose,
  onCancel,
  onConfirm,
  isOpen,
  title,
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={overlay} onClick={onClose}>
      <div className={container} onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" onClick={onClose} className={closeButton}>
          <Icon name="X" size="sm" />
        </Button>

        {title && <Typography variant="h3">{title}</Typography>}
        {description && (
          <Typography variant="body2" color="secondary">
            {description}
          </Typography>
        )}
        <hr className="my-4" />

        <div className="py-2 px-4">{children}</div>

        <div className="flex justify-end gap-3 mt-6">
          {onCancel && (
            <Button onClick={onCancel} variant="secondary">
              {cancelText}
            </Button>
          )}
          {onConfirm && <Button onClick={onConfirm}>{confirmText}</Button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
