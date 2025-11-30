"use client";
import React from "react";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProductHook from "@/hooks/useProduct";

import { api } from "@/config/axios.config";
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

  const [content, setContent] = useState("");
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const minDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

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
    buy_now_price: z.number().min(0, { message: "Giá mua ngay không được âm" }),
    end_time: z.date({ message: "Vui lòng chọn ngày kết thúc" }),
    desription: z.string(),
  });

  const {} = useForm();

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainImage) {
      alert("Yêu cầu có ảnh chính");
      return;
    }
    if (
      (extraImages && extraImages.length < 2) ||
      (extraImages && extraImages.length > 4) ||
      !extraImages
    ) {
      alert("Số lượng ảnh phụ không phù hợp");
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

    // const form = e.target as HTMLFormElement;
    // if (!previewMain) {
    //   alert("Yêu cầu có ảnh chính");
    //   return;
    // }
    // if (
    //   (previewExtras && previewExtras.length < 2) ||
    //   (previewExtras && previewExtras.length > 4) ||
    //   !previewExtras
    // ) {
    //   alert("Số lượng ảnh phụ không phù hợp");
    //   return;
    // }
    // const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    // const category = (form.elements.namedItem("category") as HTMLInputElement)
    //   .value;
    // const initPrice = (form.elements.namedItem("initPrice") as HTMLInputElement)
    //   .value;
    // const increPrice = (
    //   form.elements.namedItem("increPrice") as HTMLInputElement
    // ).value;
    // const buyNowPrice = (
    //   form.elements.namedItem("buyNowPrice") as HTMLInputElement
    // ).value;
    // const endTime = (form.elements.namedItem("endTime") as HTMLInputElement)
    //   .value;
    // const isExtend = (form.elements.namedItem("isExtend") as HTMLInputElement)
    //   .checked;
    // if (buyNowPrice <= initPrice) {
    //   alert("Giá mua ngay phải lớn hơn giá khởi điểm");
    //   return;
    // }

    // console.log(
    //   minDateTime,
    //   name,
    //   category,
    //   initPrice,
    //   increPrice,
    //   buyNowPrice,
    //   endTime,
    //   isExtend,
    //   content
    // );

    createProduct();
  };
  const handleEditorChange = (content: string, editor: any) => {
    setContent(content);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    const formData = new FormData();
    formData.append("image", mainImage || ""); // "image" chính là key backend nhận
    const res = api.post(
      "http://localhost:8080/api/favorite/upload-test",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
  };
  const handleSubmitDelete = (e: React.FormEvent) => {
    const imagePath: string =
      "https://cb5953b1e7c78dc509ddcff170b55b6e.r2.cloudflarestorage.com/ptudw-auction-images/product/1764472240348-1920-x-1080-nature-desktop-7uzi3zf1 qeoosb63.jpg";
    const res = api.delete("http://localhost:8080/api/favorite/delete-test", {
      data: {
        imagePath: imagePath,
      },
    });
    console.log(res);
  };

  return (
    <div className="w-full bg-[#F8FAFC] lg:px-32">
      {/* GIAO DIỆN TẠM - NÚT UPLOAD & XÓA ẢNH TRONG CLOUDFLARE R2 */}
      <div className="h-50 grid grid-cols-2 gap-2">
        <button
          onClick={handleSubmitUpload}
          className="bg-gray-500 border border-gray-300 cursor-pointer text-white"
        >
          Upload
        </button>
        <button
          onClick={handleSubmitDelete}
          className="bg-gray-500 border border-gray-300 cursor-pointer text-white"
        >
          Delete
        </button>
      </div>
      {/* KẾT THÚC GIAO DIỆN TẠM */}

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Đăng sản phẩm mới
      </h1>
      <p className="text-gray-600 mb-8">
        Điền thông tin chi tiết để bán sản phẩm của bạn
      </p>
      <form
        className="bg-white rounded-lg p-8 space-y-8 border border-gray-200"
        onSubmit={handleSubmit}
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Hình ảnh sản phẩm
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Tải lên 1 hình ảnh chính và ít nhất 2 ảnh phụ, tối đa 4 hình
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition flex items-center justify-center">
              <input
                accept="image/*"
                className="hidden"
                type="file"
                onChange={(e) => handleChangeMainImage(e)}
              />
              <div className="text-center">
                {previewMain ? (
                  <img src={previewMain || ""} alt="Main image" />
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

            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition flex items-center justify-center">
              <input
                multiple
                accept="image/*"
                className="hidden"
                type="file"
                onChange={(e) => handleChangeExtraImages(e)}
              />
              <div className="text-center">
                {previewExtras && previewExtras.length != 0 ? (
                  <div className="grid grid-cols-2">
                    {(previewExtras || []).map((img, index) => (
                      <img key={index} src={img} alt="Main image" />
                    ))}
                  </div>
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
              name="name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              name="category"
            >
              <option value="">Chọn danh mục</option>
              <option value="electronics">Điện tử</option>
              <option value="phones">Điện tử &gt; Điện thoại di động</option>
              <option value="laptops">Điện tử &gt; Máy tính xách tay</option>
              <option value="tablets">Điện tử &gt; Máy tính bảng</option>
              <option value="fashion">Thời trang</option>
              <option value="shoes">Thời trang &gt; Giày</option>
              <option value="watches">Thời trang &gt; Đồng hồ</option>
              <option value="clothing">Thời trang &gt; Quần áo</option>
              <option value="home">Nhà &amp; Gia đình</option>
              <option value="furniture">
                Nhà &amp; Gia đình &gt; Nội thất
              </option>
              <option value="decor">Nhà &amp; Gia đình &gt; Trang trí</option>
              <option value="collectibles">Sưu tầm</option>

              <option value="vintage">Sưu tầm &gt; Đồ cổ</option>
              <option value="art">Sưu tầm &gt; Nghệ thuật</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Giá khởi điểm (VND) <span className="text-red-500">*</span>
              </label>
              <input
                placeholder={"Gía khởi điểm"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                type="number"
                name="initPrice"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Bước giá (VND) <span className="text-red-500">*</span>
              </label>
              <input
                placeholder={"Bước giá"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                type="number"
                name="increPrice"
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Giá Mua ngay (VND)
              </label>
              <input
                placeholder="Tuỳ chọn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="number"
                name="buyNowPrice"
                min={1}
              />
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
            name="endTime"
            min={minDateTime}
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Mô tả sản phẩm
          </h3>

          <Editor
            apiKey="211n6cxarxlvaqsl12amn3gpqw2r8urx8llspg5k7b1q77my"
            initialValue=""
            init={{
              height: 500,
              menubar: false,
              skin: "oxide",
              content_css: "oxide",
              readonly: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | blocks fontfamily fontsize backcolor forecolor  | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            }}
            onEditorChange={handleEditorChange}
            disabled={false}
          />

          <p className="text-xs text-gray-600 mt-2">
            💡 Bạn có thể chỉnh sửa mô tả sau khi đăng (nội dung sẽ được thêm
            vào, không thay thế)
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input className="w-4 h-4" type="checkbox" name="isExtend" />
            <div>
              <p className="font-semibold text-blue-900">Tự động gia hạn</p>
              <p className="text-xs text-blue-700">
                Nếu có đấu giá trong 5 phút cuối, thời gian sẽ được gia hạn thêm
                10 phút
              </p>
            </div>
          </label>
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
