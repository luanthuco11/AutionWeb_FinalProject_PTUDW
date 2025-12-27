"use client";
import React, { useMemo } from "react";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import ProductHook from "@/hooks/useProduct";
import { XIcon } from "lucide-react";

import { api } from "@/config/axios.config";
import {
  CreateProduct,
  ProductCategoryTree,
} from "../../../../../../shared/src/types";
import ErrorMessage from "./ErrorMessage";
import CategoryHook from "@/hooks/useCategory";
import { formatPrice, parseNumber } from "@/utils";
import LoadingSpinner from "@/components/LoadingSpinner";

const Editor = dynamic(
  () =>
    import("@tinymce/tinymce-react").then(
      (mod) => mod.Editor as unknown as React.ComponentType<any>
    ),
  { ssr: false }
);

const CreateProductPage = () => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [previewMain, setPreviewMain] = useState<string | null>(null);

  const [extraImages, setExtraImages] = useState<File[] | null>(null);
  const [previewExtras, setPreviewExtras] = useState<string[] | null>(null);

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const minDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: loadingCategoriesError,
  } = CategoryHook.useCategories() as {
    data: ProductCategoryTree[];
    isLoading: boolean;
    error: any;
  };

  const categoryList = useMemo(() => {
    const list: ProductCategoryTree[] = [];
    categories?.forEach(({ children, ...category }) => {
      list.push(category);

      const parentName = category.name;
      children?.forEach(({ children, name, ...category }) => {
        list.push({
          ...category,
          name: /*"     " + parentName + " > " +*/ name,
        });
      });
    });

    return list;
  }, [categories]);

  const { mutate: createProduct, isPending } = ProductHook.useCreateProduct();

  const newProductSchema = z.object({
    name: z.string().min(1, { message: "Vui lòng nhập tên sản phẩm" }),
    category_id: z.number({ message: "Vui lòng chọn loại sản phẩm" }),
    initial_price: z
      .number({ message: "Vui lòng nhập giá khởi điểm" })
      .min(0, { message: "Giá khởi điểm không được âm" }),
    price_increment: z
      .number({ message: "Vui lòng nhập bước giá" })
      .min(0, { message: "Bước giá không được âm" }),
    buy_now_price: z
      .number()
      .min(0, { message: "Giá mua ngay không được âm" })
      .optional(),
    end_time: z.date({ message: "Vui lòng chọn ngày kết thúc" }),
    description: z.string(),
    auto_extend: z.boolean(),
  });

  type NewProductType = z.infer<typeof newProductSchema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    resetField,
    control,
  } = useForm({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      description: "",
    },
  });

  const handleChangeMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setMainImage(null);
      setPreviewMain(null);
      return;
    }
    const file = e.target.files[0];
    setMainImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewMain(reader.result as string);
    };

    reader.readAsDataURL(file);
  };
  const handleChangeExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      setExtraImages(null);
      setPreviewExtras(null);
      return;
    }
    const files = Array.from(e.target.files);
    setExtraImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewExtras(previews);
  };
  const onSubmit = (payload: NewProductType) => {
    if (!mainImage) {
      alert("Yêu cầu có ảnh chính");
      return;
    }
    if ((extraImages && extraImages.length < 3) || !extraImages) {
      alert("Số lượng ảnh phụ không phù hợp");
      return;
    }

    if (
      payload.buy_now_price &&
      payload.buy_now_price <= payload.initial_price
    ) {
      alert("Giá mua ngay phải cao hơn giá khởi điểm.");
      return;
    }

    const formData = new FormData();
    formData.append("main-image", mainImage);
    formData.append("extra-images-count", String(extraImages.length));
    {
      Array.from({ length: extraImages.length }, (_, i) => {
        formData.append(`extra-image-${i}`, extraImages[i]);
      });
    }

    formData.append("payload", JSON.stringify(payload));

    createProduct(formData);
  };
  return (
    <div className="relative w-full bg-[#F8FAFC] lg:px-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Đăng sản phẩm mới
      </h1>
      <p className="text-gray-600 mb-8">
        Điền thông tin chi tiết để bán sản phẩm của bạn
      </p>

      {isPending && (
        <div className="fixed inset-0 z-100">
          <LoadingSpinner />
        </div>
      )}
      <form
        className="bg-white rounded-lg p-8 space-y-8 border border-gray-200"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Hình ảnh sản phẩm
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Tải lên 1 hình ảnh chính và ít nhất 3 ảnh phụ
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <label className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition flex items-center justify-center">
              <input
                accept="image/*"
                className="hidden"
                type="file"
                onChange={(e) => handleChangeMainImage(e)}
              />
              <div className="text-center">
                {previewMain ? (
                  <>
                    <img src={previewMain || ""} alt="Main image" />
                    <XIcon
                      onClick={(e) => {
                        e.preventDefault();
                        setMainImage(null);
                        setPreviewMain(null);
                      }}
                      className="absolute z-20 right-1.5 top-1.5 text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                    />
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-upload mx-auto mb-2 text-gray-400"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1={12} x2={12} y1={3} y2={15} />
                    </svg>
                    <span className="text-sm text-gray-600">Tải ảnh chính</span>
                  </>
                )}
              </div>
            </label>

            <label className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition flex items-center justify-center">
              <input
                multiple
                accept="image/*"
                className="hidden"
                type="file"
                onChange={(e) => handleChangeExtraImages(e)}
              />
              <div className="text-center">
                {previewExtras && previewExtras.length != 0 ? (
                  <>
                    <div className="grid grid-cols-2">
                      {(previewExtras || []).map((img, index) => (
                        <img key={index} src={img} alt="Main image" />
                      ))}
                    </div>

                    <XIcon
                      onClick={(e) => {
                        e.preventDefault();
                        setExtraImages(null);
                        setPreviewExtras(null);
                      }}
                      className="absolute right-1.5 top-1.5 text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                    />
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-upload mx-auto mb-2 text-gray-400"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1={12} x2={12} y1={3} y2={15} />
                    </svg>
                    <span className="text-sm text-gray-600">Tải ảnh phụ</span>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Nhập tên sản phẩm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              type="text"
              maxLength={255}
              {...register("name")}
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              {...register("category_id", { valueAsNumber: true })}
            >
              <option value="">--- Chọn danh mục ---</option>
              {categoryList.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  style={{
                    // Thụt lề nếu là con, màu sắc đậm nếu là cha
                    paddingLeft: category.parent_id ? "20px" : "0px",
                    color: !category.parent_id ? "black" : "inherit",
                    fontWeight: !category.parent_id ? 600 : "normal",
                  }}
                  disabled={!category.parent_id}
                >
                  {category.parent_id
                    ? `\u00A0\u00A0\u00A0\u00A0\u00A0${category.name}`
                    : category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <ErrorMessage message={errors.category_id.message} />
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Giá khởi điểm (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Giá khởi điểm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                // {...register("initial_price", { valueAsNumber: true })}
                value={formatPrice(watch("initial_price"))}
                onChange={(e) => {
                  const parsed = parseNumber(e.target.value);
                  setValue("initial_price", parsed || 0);
                }}
              />
              {errors.initial_price && (
                <ErrorMessage message={errors.initial_price.message} />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Bước giá (VND) <span className="text-red-500">*</span>
              </label>
              <input
                placeholder={"Bước giá"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                type="text"
                // {...register("price_increment", { valueAsNumber: true })}
                value={formatPrice(watch("price_increment"))}
                onChange={(e) => {
                  const parsed = parseNumber(e.target.value);
                  setValue("price_increment", parsed || 0);
                }}
              />
              {errors.price_increment && (
                <ErrorMessage message={errors.price_increment.message} />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Giá mua ngay (VND)
              </label>
              <input
                placeholder="Tuỳ chọn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                // {...register("buy_now_price", { valueAsNumber: true })}
                value={formatPrice(watch("buy_now_price"))}
                onChange={(e) => {
                  const parsed = parseNumber(e.target.value);
                  setValue("buy_now_price", parsed);
                }}
              />
              {errors.buy_now_price && (
                <ErrorMessage message={errors.buy_now_price.message} />
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Thời điểm kết thúc <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            type="datetime-local"
            {...register("end_time", { valueAsDate: true })}
            min={minDateTime}
          />
          {errors.end_time && (
            <ErrorMessage message={errors.end_time.message} />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Mô tả sản phẩm
          </h3>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Editor
                apiKey="211n6cxarxlvaqsl12amn3gpqw2r8urx8llspg5k7b1q77my"
                value={field.value || ""}
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
                onEditorChange={(content: string) => field.onChange(content)}
                onBlur={field.onBlur}
                disabled={false}
              />
            )}
          />
          {errors.description && (
            <ErrorMessage message={errors.description.message} />
          )}

          <p className="text-xs text-gray-600 mt-2">
            💡 Bạn có thể chỉnh sửa mô tả sau khi đăng (nội dung sẽ được thêm
            vào, không thay thế)
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              className="w-4 h-4"
              type="checkbox"
              {...register("auto_extend")}
            />
            <div>
              <p className="font-semibold text-blue-900">Tự động gia hạn</p>
              <p className="text-xs text-blue-700">
                Nếu có đấu giá trong 5 phút cuối, thời gian sẽ được gia hạn thêm
                10 phút
              </p>
            </div>
          </label>
          {errors.auto_extend && (
            <ErrorMessage message={errors.auto_extend.message} />
          )}
        </div>
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
          >
            Đăng sản phẩm
          </button>
          <button
            type="button"
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-900"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateProductPage;
