"use client";

import { EditIcon } from "@/components/icons";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { defaultImage } from "@/app/const";

type ImageProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
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

  // Close popup when clicking outside avatar
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

  // Handle file choosing
  const handleUpdateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
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

  // Submit selected image (send to parent)
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

  return (
    <div ref={avatarRef} className="group relative inline-block w-fit">
      {/* Main Avatar */}
      <Image
        src={imageUrl || defaultImage}
        alt="Avatar"
        width={120}
        height={120}
        onClick={() => setViewAvatar(true)}
        className="border-1 border-black rounded-full object-cover cursor-pointer"
      />

      {/* View full image */}
      {viewAvatar && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]"
          onClick={() => setViewAvatar(false)}
        >
          <Image
            src={imageUrl || defaultImage}
            alt="Avatar"
            width={600}
            height={600}
            className="rounded-lg shadow-xl"
          />
        </div>
      )}

      {/* Hover Edit Icon */}
      {allowEdit && (
        <div className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden group cursor-pointer">
          {/* Overlay chỉ hiện khi hover */}
          <div className="w-full h-full bg-gray-800 opacity-0 group-hover:opacity-60 transition-opacity rounded-full" />

          {/* Edit Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <EditIcon />
          </div>

          {/* Click handler */}
          <button
            type="button"
            className="absolute inset-0 w-full h-full bg-transparent"
            onClick={() => setIsAvatarClicked(true)}
          />
        </div>
      )}

      {/* Popup options */}
      {isAvatarClicked && (
        <div className="absolute flex flex-col min-w-max border border-gray-200 shadow-md bg-white rounded-lg mt-2 z-[50]">
          <p
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={handleViewImage}
          >
            Xem ảnh
          </p>
          <p
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={handleClickUpdateImage}
          >
            Chỉnh sửa ảnh
          </p>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70]">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[350px] relative">
            <h2 className="text-lg font-semibold mb-3">
              Chọn ảnh đại diện mới
            </h2>

            {/* Preview */}
            <div className="w-full flex justify-center mb-3">
              <Image
                src={imageUrl}
                alt="Preview"
                width={180}
                height={180}
                className="rounded-full border object-cover"
              />
            </div>

            {/* File input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpdateImage}
              className="w-full border rounded px-3 py-2"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>

              <button
                onClick={handleSubmitUpdateImage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
