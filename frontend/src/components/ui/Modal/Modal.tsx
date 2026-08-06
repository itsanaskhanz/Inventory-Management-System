import { Button } from "../Button";
import { Icon } from "../Icon";
import { Typography } from "../Typography";
import {
  body,
  closeButton,
  container,
  footer,
  header,
  overlay,
} from "./Modal.styles";
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
  confirmVariant = "primary",
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={overlay} onClick={onClose}>
      <div className={container} onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" onClick={onClose} className={closeButton}>
          <Icon name="X" size="sm" />
        </Button>

        {(title || description) && (
          <div className={header}>
            {title && (
              <Typography variant="h4" weight="bold">
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body2" color="secondary">
                {description}
              </Typography>
            )}
          </div>
        )}

        <div className={body}>{children}</div>

        {(onCancel || onConfirm) && (
          <div className={footer}>
            {onCancel && (
              <Button onClick={onCancel} variant="secondary">
                {cancelText}
              </Button>
            )}
            {onConfirm && (
              <Button onClick={onConfirm} variant={confirmVariant}>
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;