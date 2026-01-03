"use client";

import { EditIcon } from "@/components/icons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
const defaultImage =
  "https://img.freepik.com/premium-photo/white-colors-podium-abstract-background-minimal-geometric-shape-3d-rendering_48946-113.jpg?semt=ais_hybrid&w=740&q=80";

type ImageProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function Avatar({
  allowEdit = false,
  imageProps,
  onSubmit,
}: {
  allowEdit: boolean;
  imageProps: ImageProps;
  onSubmit?: (data: { file: File; url: string }) => void;
}) {
  const [imageUrl, setImageUrl] = useState<string>(imageProps.src);
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [updateImage, setUpdateImage] = useState<File | null>(null);
  const [viewAvatar, setViewAvatar] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsAvatarClicked(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickUpdateImage = () => {
    setIsEditModal(true);
    setIsAvatarClicked(false);
  };

  function handleViewImage() {
    setViewAvatar(true);
    setIsAvatarClicked(false);
  }

  const handleUpdateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn đúng định dạng ảnh!");
      return;
    }

    setUpdateImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitUpdateImage = () => {
    if (!updateImage) {
      alert("Chưa chọn ảnh mới!");
      return;
    }

    setIsEditModal(false);

    onSubmit?.({
      file: updateImage,
      url: imageUrl,
    });
  };

  const size = imageProps.width || 120;

  return (
    <div ref={avatarRef} className="group relative inline-block">
      {/* Main Avatar - FIX: Thêm aspect-square và đảm bảo tròn */}
      <div
        className={cn(
          "relative overflow-hidden rounded-full border-2 border-gray-200 shadow-sm cursor-pointer",
          imageProps.className
        )}
        style={{ width: size, height: size }}
        onClick={() => setViewAvatar(true)}
      >
        <Image
          src={imageUrl || defaultImage}
          alt="Avatar"
          fill
          className="object-cover"
        />
      </div>

      {/* View full image */}
      {viewAvatar && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4"
          onClick={() => setViewAvatar(false)}
        >
          <div className="relative w-full max-w-2xl aspect-square">
            <Image
              src={imageUrl || defaultImage}
              alt="Avatar"
              fill
              className="rounded-lg shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Hover Edit Icon */}
      {allowEdit && (
        <div className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden cursor-pointer">
          <div className="w-full h-full bg-black opacity-0 group-hover:opacity-50 transition-all duration-200 rounded-full" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100">
            <EditIcon />
          </div>

          <button
            type="button"
            className="absolute inset-0 w-full h-full bg-transparent"
            onClick={() => setIsAvatarClicked(true)}
          />
        </div>
      )}

      {/* Popup options */}
      {isAvatarClicked && (
        <div className="absolute left-0 sm:left-auto sm:right-0 flex flex-col min-w-max border border-gray-200 shadow-lg bg-white rounded-lg mt-2 z-[50] overflow-hidden">
          <button
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-left transition-colors text-sm font-medium"
            onClick={handleViewImage}
          >
            Xem ảnh
          </button>
          <div className="border-t border-gray-100" />
          <button
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-left transition-colors text-sm font-medium"
            onClick={handleClickUpdateImage}
          >
            Chỉnh sửa ảnh
          </button>
        </div>
      )}

      {/* EDIT MODAL - Responsive */}
      {isEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-md relative">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Chọn ảnh đại diện mới
            </h2>

            {/* Preview - FIX: Đảm bảo tròn */}
            <div className="w-full flex justify-center mb-4">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* File input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpdateImage}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsEditModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                Hủy
              </button>

              <button
                onClick={handleSubmitUpdateImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
              >
                Lưu ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
