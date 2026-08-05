import { Modal } from "@/components/ui";
import {
  ReceiptData,
  buildReceiptHtml,
  downloadReceipt,
  printReceipt,
} from "@/lib/receipt";

interface ReceiptModalProps {
  isOpen: boolean;
  receiptData: ReceiptData | null;
  onClose: () => void;
}

const ReceiptModal = ({ isOpen, receiptData, onClose }: ReceiptModalProps) => {
  if (!isOpen || !receiptData) return null;

  const html = buildReceiptHtml(receiptData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Receipt"
      description={`Receipt for order ${receiptData.orderId}`}
      cancelText="Download"
      onCancel={() => downloadReceipt(receiptData)}
      confirmText="Print"
      onConfirm={() => printReceipt(html)}
    >
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <iframe
          srcDoc={html}
          title="Receipt preview"
          className="h-96 w-full"
        />
      </div>
    </Modal>
  );
};

export default ReceiptModal;
