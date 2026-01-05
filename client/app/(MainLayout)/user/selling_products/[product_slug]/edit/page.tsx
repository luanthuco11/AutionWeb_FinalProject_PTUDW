"use client";
import BreadCrump from "@/components/Breadcrump";
import { CalendarOutlineIcon, UserOutlineIcon } from "@/components/icons";
import { ImageCarousel } from "@/components/ImageCarousel";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import ProductHook from "@/hooks/useProduct";
import { useParams, useRouter } from "next/navigation";
import {
  Product,
  ProductCategoryTree,
} from "../../../../../../../shared/src/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatPrice, getTimeDifference } from "@/utils";
import CategoryHook from "@/hooks/useCategory";
import { useAuthStore } from "@/store/auth.store";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";

const Editor = dynamic(
  () =>
    import("@tinymce/tinymce-react").then(
      (mod) => mod.Editor as unknown as React.ComponentType<any>
    ),
  { ssr: false }
);
const EditProductPage = () => {
  const user = useAuthStore((s) => s.user);
  const [content, setContent] = useState("");
  const {
    mutate: updateProductDescription,
    isPending: isUpdatingProductDescription,
  } = ProductHook.useUpdateProductDescription();

  const { product_slug } = useParams();
  const {
    data: product,
    isLoading: isLoadingProduct,
    error: loadingProductError,
  } = ProductHook.useGetProductBySlug(String(product_slug)) as {
    data: Product;
    isLoading: boolean;
    error: any;
  };

  const {
    data: category,
    isLoading: isLoadingCategory,
    error: loadingCategoryError,
  } = CategoryHook.useCategoryDetailById(product?.category_id) as {
    data: ProductCategoryTree;
    isLoading: boolean;
    error: any;
  };

  const productImages: string[] = useMemo(() => {
    if (!product) return [];

    return [product.main_image, ...(product.extra_images || [])];
  }, [product]);

  const handleEditorChange = (content: string, editor: any) => {
    setContent(content);
  };
  const handleAddDes = (productId: number, description: string) => {
    updateProductDescription({ id: productId, description: description });
  };

  if (user && product?.seller && user.id != product.seller.id)
    return <UnauthorizedAccess />;

  return (
    <div className=" w-full">
      {(!user ||
        isLoadingProduct ||
        isUpdatingProductDescription ||
        isLoadingCategory) && (
        <div className="fixed inset-0 z-100">
          <LoadingSpinner />
        </div>
      )}
      {!isLoadingProduct &&
        !isUpdatingProductDescription &&
        !isLoadingCategory && (
          <>
            <div className="mb-4">
              <BreadCrump
                category_name={category.name}
                category_slug={category.slug}
                product_name={product.name}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-12 mb-12 ">
              <div className="p-8 md:p-0 md:w-1/2 ">
                <ImageCarousel images={productImages} />
              </div>
              <div className="bg-white border shadow-sm  border-gray-200 rounded-lg p-4 sm:p-8 w-full">
                <div className="pb-4 md:pb-6 border-b mb-4 md:mb-6  border-slate-200">
                  <h1 className="text-2xl font-bold mb-4 text-slate-900">
                    {product.name}
                  </h1>
                  <p className="text-sm font-light mb-2 text-slate-600">
                    Giá hiện tại
                  </p>
                  <p className="text-4xl font-bold text-teal-600 mb-2">
                    {formatPrice(product.current_price!) ||
                      formatPrice(product.initial_price!)}{" "}
                    ₫
                  </p>
                  <p className="text-sm text-slate-600 font-light">
                    {" "}
                    {10} Lượt đấu giá
                  </p>
                </div>
                <div className="pb-4 md:pb-6 border-b mb-4 md:mb-6 border-slate-200 grid grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                      <CalendarOutlineIcon />
                      Thời điểm đăng
                    </p>
                    <p className="ml-4 text-[16px] font-semibold text-slate-900">
                      Ngày{" "}
                      {new Date(product.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                      <UserOutlineIcon />
                      Người ra giá cao nhất
                    </p>
                    <p className=" ml-4 text-[16px] font-semibold text-slate-900">
                      {product.top_bidder?.name || "Chưa có"}
                    </p>
                  </div>
                </div>

                <div className="pb-4 md:pb-6 border-b  mb-4 md:mb-6 border-slate-200 ">
                  <p className="text-sm text-slate-600 mb-2 font-light">
                    Thời gian còn lại
                  </p>
                  <p className="text-xl font-bold text-teal-600">
                    {getTimeDifference(new Date(), new Date(product.end_time))}
                  </p>
                </div>
                <div className="pb-4 md:pb-6 border-b  mb-4 md:mb-6 border-slate-200 ">
                  <p className="text-sm text-slate-600 mb-2 font-light">
                    Giá mua ngay
                  </p>
                  <p className="text-3xl font-bold text-teal-600">
                    {product.buy_now_price
                      ? formatPrice(product.buy_now_price) + " ₫"
                      : "Không có giá mua ngay"}
                  </p>
                </div>
                <div></div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm   mb-4 sm:mb-8 border border-slate-200">
              <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                {" "}
                <h3 className="text-2xl font-bold text-slate-900 mb-1 sm:mb-4">
                  Thông tin chi tiết sản phẩm
                </h3>
              </div>

              <div
                className="p-4 max-h-[500px] overflow-y-scroll"
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
              />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Thêm mô tả sản phẩm
            </h3>
            <div className="bg-white rounded-lg   mb-8 border border-slate-200">
              <Editor
                apiKey="211n6cxarxlvaqsl12amn3gpqw2r8urx8llspg5k7b1q77my"
                initialValue=""
                init={{
                  height: 500,
                  menubar: false,
                  skin: "oxide",
                  readonly: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize backcolor forecolor  | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
                onEditorChange={handleEditorChange}
                disabled={false}
              />
              <div className="flex w-full my-4 justify-center">
                <button
                  type="button"
                  onClick={() => handleAddDes(product.id, content)}
                  className="w-48 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold hover:cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            </div>
          </>
        )}
    </div>
  );
};
export default EditProductPage;
