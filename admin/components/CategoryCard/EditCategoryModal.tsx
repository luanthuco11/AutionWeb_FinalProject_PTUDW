import { useEffect, useState } from "react";
import { X } from "lucide-react";

export const EditCategoryModal = ({
    isOpen,
    onClose,
    category,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    category: { id: number; name: string };
    onSubmit: (id: number, name: string) => void;
}) => {
    const [name, setName] = useState(category.name);

    useEffect(() => {
        setName(category.name)
    }, [category])
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(category.id, name);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Chỉnh sửa danh mục</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên danh mục
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên danh mục"
                            required
                        />
                    </div>

                    <div className="flex gap-3 p-4 border-t justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
