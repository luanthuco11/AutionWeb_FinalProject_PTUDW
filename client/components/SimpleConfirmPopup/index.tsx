import { X } from "lucide-react";

export const SimpleConfirmPopup = ({
  title = "Xác nhận",
  isOpen = true,
  onClose,
  content,
  onConfirm,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
}: {
  title?: string;
  isOpen?: boolean;
  onClose: () => void;
  content: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-blue-600">
            {confirmLabel}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-700">
            <span className="">{content}</span>
          </p>
        </div>

        <div className="flex gap-3 p-4 border-t justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
