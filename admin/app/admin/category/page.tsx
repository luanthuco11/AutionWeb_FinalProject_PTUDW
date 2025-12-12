"use client"

import CategoryCard from "@/components/CategoryCard";
import AdminHeader from "@/components/AdminHeader/AdminHeader";
import { useState } from "react";
import CategoryHook from "@/hooks/useCategory";
import { ProductCategoryTree } from "../../../../shared/src/types";

const page = () => {

    const [searchQuery, setSearchQuery] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const {
        data: categoriesData, 
        isLoading: isCategoriesLoading
    } = CategoryHook.useCategories() as {
        data: ProductCategoryTree[],
        isLoading: boolean,
    };

    console.log('ll', categoriesData);

    if (isCategoriesLoading) 
        return <div>Loading...</div>
    return (
        <>
            <AdminHeader onSearch={setSearchQuery} onCreateClick={() => setShowCreateModal(true)} />
            <div className="p-6">
                <h1 className="text-2xl font-bold text-text mb-6">Quản lý danh mục</h1>
                {categoriesData.map((item, index) => (
                    <CategoryCard category={item} key={index}/>
                ))}
                {/* <CategoryManagement categories={filteredCategories} /> */}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold text-text mb-4r">Tạo danh mục mới</h2>
                        <input
                            type="text"
                            placeholder="Tên danh mục"
                            className="w-full px-4 py-2 border border-surface rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-text border border-surface rounded-lg hover:bg-surface transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false)
                                }}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Tạo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default page

