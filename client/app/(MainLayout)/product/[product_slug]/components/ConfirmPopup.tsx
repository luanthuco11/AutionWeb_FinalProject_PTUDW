import { X } from "lucide-react";

export const ConfirmPopup = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1003">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-red-600">Xác nhận</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-700">Bạn có chắc chắn muốn đấu giá không</p>
          <p className="text-sm text-gray-500 mt-2">
            Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="flex gap-3 p-4 border-t justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm()}
            className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};
