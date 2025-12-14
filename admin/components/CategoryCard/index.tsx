"use client";

import React, { useState } from "react";
import { ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { ProductCategoryTree } from "../../../shared/src/types/Product";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import CategoryHook from "@/hooks/useCategory";
import { error } from "console";

export type CategoryWithProductCount =
  Omit<ProductCategoryTree, "children"> & {
    productNumber: number;
    children: CategoryWithProductCount[];
  };

const CategoryCard = ({ category }: { category: CategoryWithProductCount }) => {

    // Define state
    const router = useRouter();
    const [openChildren, setOpenChildren] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<{
        id: number;
        name: string;
    } | null>(null);

    // Hooks
    const updateCategoryMutation = CategoryHook.useUpdateCategory();
    const deleteCategoryMutation = CategoryHook.useDeleteCategory();
    const createCategoryMutation = CategoryHook.useCreateCategory();

    // Handler
    const handleView = (categoryId: number) => {
        router.push(`/product/${categoryId}`);
    };

    const handleEdit = (categoryId: number, categoryName: string) => {
        setSelectedCategory({ id: categoryId, name: categoryName });
        setEditModalOpen(true);
    };

    const handleDelete = (categoryId: number, categoryName: string, productNumber: number) => {
        if (productNumber > 0) {
            alert("Không thể xóa danh mục đang có sản phẩm");
            return;
        }
        setSelectedCategory({ id: categoryId, name: categoryName });
        setDeleteModalOpen(true);
    };

    const handleCreate = (categoryId: number, categoryName: string) => {
        setSelectedCategory({ id: categoryId, name: categoryName })
        setCreateModalOpen(true);
    }

    const handleEditSubmit = (id: number, name: string) => {
        updateCategoryMutation.mutate(
            { id, name },
            {
                onSuccess: () => {
                    setEditModalOpen(false);
                    setSelectedCategory(null);
                    alert("Chinh sua thanh cong")
                },
                onError: (error) => {
                    console.log(error);
                    alert("Chinh sua that bai")
                }
            }
        );
    };

    const handleDeleteConfirm = (id: number) => {
        deleteCategoryMutation.mutate(id, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedCategory(null);
                alert("Xoa thanh cong")
            },
            onError: (error) => {
                console.log(error);
                alert("Xoa that bai")
            }
        });
    };

    const handleAddSubCategory = (name: string, parent_id: number) => {
        createCategoryMutation.mutate(
            { name, parent_id }, {
            onSuccess: () => {
                setCreateModalOpen(false);
                setSelectedCategory(null);
                alert("Them danh muc con thanh cong")
            },
            onError: (error) => {
                console.log(error);
                alert("Them that bai")
            }
        }

        )
    };

    return (
        <div>
            <div className="h-16 bg-blue-100/40 border border-gray-300 rounded-md shadow-md flex flex-row gap-1 px-3 py-1 justify-between items-center select-none hover:border-blue-500 transition-colors duration-200">
                <div
                    onClick={() => setOpenChildren(!openChildren)}
                    className="cursor-pointer"
                    style={{
                        transition: "transform 200ms ease-in-out",
                        transform: openChildren ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                >
                    <ChevronRight className="hover:text-blue-500 transition-colors duration-200" />
                </div>
                <p className="flex grow pt-0.5 font-bold">
                    {category.name}
                    <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">
                        {category.productNumber}
                    </span>
                </p>
                <div className="flex flex-row gap-2 justify-center items-center">
                    <Eye
                        onClick={() => handleView(category.id)}
                        className="h-8 w-8 p-1 text-blue-600 hover:bg-blue-600/20 rounded-md transitions-colors duration-200 cursor-pointer"
                    />
                    <Pencil
                        onClick={() => handleEdit(category.id, category.name)}
                        className="h-8 w-8 p-1 text-orange-500 hover:bg-orange-500/20 rounded-md transitions-colors duration-200 cursor-pointer"
                    />
                    <Trash2
                        onClick={() => handleDelete(category.id, category.name, category.productNumber)}
                        className="h-8 w-8 p-1 text-red-500 hover:bg-red-500/20 rounded-md transitions-colors duration-200 cursor-pointer"
                    />
                </div>
            </div>

            {openChildren && (
                <div className="flex flex-col gap-1 mt-1 mb-2 select-none">
                    {category.children?.map((child) => (
                        <div
                            key={child.id}
                            className="ml-10 h-10 border border-gray-300 rounded-md shadow-md flex flex-row gap-1 pl-5 pr-3 py-1 justify-between items-center hover:border-blue-500 transition-colors duration-200"
                        >
                            <p className="flex grow pt-0.5">
                                {child.name}
                                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-300 text-white rounded-full">
                                    {child.productNumber}
                                </span>
                            </p>
                            <div className="flex flex-row gap-2 justify-center items-center">
                                <Eye
                                    onClick={() => handleView(child.id)}
                                    className="h-7 w-7 p-1 text-blue-600 hover:bg-blue-600/20 rounded-md transitions-colors duration-200 cursor-pointer"
                                />
                                <Pencil
                                    onClick={() => handleEdit(child.id, child.name)}
                                    className="h-7 w-7 p-1 text-orange-500 hover:bg-orange-500/20 rounded-md transitions-colors duration-200 cursor-pointer"
                                />
                                <Trash2
                                    onClick={() => handleDelete(child.id, child.name, child.productNumber)}
                                    className="h-7 w-7 p-1 text-red-500 hover:bg-red-500/20 rounded-md transitions-colors duration-200 cursor-pointer"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => handleCreate(category.id, category.name)}
                        className="ml-10 h-10 border-2 border-dashed border-gray-300 rounded-md flex flex-row gap-2 pl-5 pr-3 py-1 justify-center items-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 group"
                    >
                        <Plus className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                        <span className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200 font-medium">
                            Thêm danh mục con
                        </span>
                    </button>
                </div>
            )}

            {/* Modals */}
            {selectedCategory && (
                <>
                    <EditCategoryModal
                        isOpen={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        category={selectedCategory}
                        onSubmit={handleEditSubmit}
                    />
                    <DeleteCategoryModal
                        isOpen={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        category={selectedCategory}
                        onConfirm={handleDeleteConfirm}
                    />
                    <CreateCategoryModal
                        isOpen={createModalOpen}
                        onClose={() => setCreateModalOpen(false)}
                        category={selectedCategory}
                        onSubmit={handleAddSubCategory}
                        />
                </>
            )}
        </div>
    );
};

export default CategoryCard;