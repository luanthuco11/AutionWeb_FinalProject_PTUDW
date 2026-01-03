"use client";

import React, { useState } from "react";
import { ChevronRight, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { ProductCategoryTree } from "../../../shared/src/types/Product";
import { useRouter } from "next/navigation";
import CategoryHook from "@/hooks/useCategory";
import { toast } from "react-toastify";

export type CategoryWithProductCount = Omit<ProductCategoryTree, "children"> & {
  productNumber: number;
  children: CategoryWithProductCount[];
};

const CategoryCard = ({ category }: { category: CategoryWithProductCount }) => {
  const router = useRouter();
  const [openChildren, setOpenChildren] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const updateCategoryMutation = CategoryHook.useUpdateCategory();
  const deleteCategoryMutation = CategoryHook.useDeleteCategory();
  const createCategoryMutation = CategoryHook.useCreateCategory();

  const handleView = (categorySlug: string) => {
    router.push(`/product/category/${categorySlug}`);
  };

  const handleEdit = (categoryId: number, categoryName: string) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
    setEditModalOpen(true);
    console.log(selectedCategory)
  };

  const handleDelete = (
    categoryId: number,
    categoryName: string,
    productNumber: number
  ) => {
    if (productNumber > 0) {
      toast.error("Không thể xóa danh mục đang có sản phẩm");
      return;
    }
    setSelectedCategory({ id: categoryId, name: categoryName });
    setDeleteModalOpen(true);
  };

  const handleCreate = (categoryId: number, categoryName: string) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
    setCreateModalOpen(true);
  };

  const handleEditSubmit = (id: number, name: string) => {
    updateCategoryMutation.mutate(
      { id, name },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setSelectedCategory(null);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  const handleDeleteConfirm = (id: number) => {
    deleteCategoryMutation.mutate(id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedCategory(null);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const handleAddSubCategory = (name: string, parent_id: number) => {
    createCategoryMutation.mutate(
      { name, parent_id },
      {
        onSuccess: () => {
          setCreateModalOpen(false);
          setSelectedCategory(null);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  // --- Styled Components / Classes để tái sử dụng ---
  // Responsive icon size: nhỏ hơn trên mobile (h-5, h-6) và to hơn trên desktop (h-7, h-8)
  const actionIconClass = (colorClass: string) =>
    `h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-1 rounded-md transition-colors duration-200 cursor-pointer ${colorClass}`;

  const rowBaseClass =
    "min-h-[3.5rem] h-auto bg-blue-100/40 border border-gray-300 rounded-md shadow-md flex flex-row gap-1 px-2 sm:px-3 py-2 justify-between items-center select-none hover:border-blue-500 transition-colors duration-200";

  return (
    <div className="w-full">
      {/* PARENT CATEGORY ROW */}
      <div className={rowBaseClass}>
        <div
          onClick={() => setOpenChildren(!openChildren)}
          className="cursor-pointer shrink-0"
          style={{
            transition: "transform 200ms ease-in-out",
            transform: openChildren ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 hover:text-blue-500 transition-colors duration-200" />
        </div>

        {/* Tên danh mục: Cho phép wrap text trên mobile */}
        <p className="flex grow pt-0.5 font-bold text-sm sm:text-base break-words mr-2">
          {category.name}
          <span className="ml-2 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold bg-blue-500 text-white rounded-full flex items-center h-fit my-auto">
            {category.productNumber}
          </span>
        </p>

        {/* Action Buttons Group */}
        <div className="flex flex-row gap-1 sm:gap-2 justify-center items-center shrink-0">
          {/* <Eye
            onClick={(e) => {
              e.stopPropagation();
              handleView(category.slug);
            }}
            className={actionIconClass("text-blue-600 hover:bg-blue-600/20")}
          /> */}
          <Pencil
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(category.id, category.name);
            }}
            className={actionIconClass(
              "text-orange-500 hover:bg-orange-500/20"
            )}
          />
          <Trash2
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(category.id, category.name, category.productNumber);
            }}
            className={actionIconClass("text-red-500 hover:bg-red-500/20")}
          />
        </div>
      </div>

      {/* CHILDREN LIST */}
      {openChildren && (
        <div className="flex flex-col gap-2 mt-2 mb-2 select-none">
          {category.children?.map((child) => (
            <div
              key={child.id}
              // Indentation responsive: ml-4 trên mobile, ml-10 trên desktop
              className="ml-4 sm:ml-8 md:ml-10 min-h-[3rem] h-auto border border-gray-300 rounded-md shadow-md flex flex-row gap-1 pl-2 sm:pl-5 pr-2 sm:pr-3 py-2 justify-between items-center hover:border-blue-500 transition-colors duration-200 bg-white"
            >
              <p className="flex grow pt-0.5 text-sm sm:text-base break-words mr-2">
                {child.name}
                <span className="ml-2 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold bg-blue-300 text-white rounded-full flex items-center h-fit my-auto">
                  {child.productNumber}
                </span>
              </p>

              <div className="flex flex-row gap-1 sm:gap-2 justify-center items-center shrink-0">
                <Eye
                  onClick={() => handleView(child.slug)}
                  className={actionIconClass(
                    "text-blue-600 hover:bg-blue-600/20"
                  )}
                />
                <Pencil
                  onClick={() => handleEdit(child.id, child.name)}
                  className={actionIconClass(
                    "text-orange-500 hover:bg-orange-500/20"
                  )}
                />
                <Trash2
                  onClick={() =>
                    handleDelete(child.id, child.name, child.productNumber)
                  }
                  className={actionIconClass(
                    "text-red-500 hover:bg-red-500/20"
                  )}
                />
              </div>
            </div>
          ))}

          {/* ADD SUB CATEGORY BUTTON */}
          <button
            onClick={() => handleCreate(category.id, category.name)}
            className="ml-4 sm:ml-8 md:ml-10 h-10 border-2 border-dashed border-gray-300 rounded-md flex flex-row gap-2 pl-2 sm:pl-5 pr-3 py-1 justify-center items-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 group"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            <span className="text-xs sm:text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200 font-medium">
              Thêm danh mục con
            </span>
          </button>
        </div>
      )}

      {/* Modals - giữ nguyên logic */}
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
