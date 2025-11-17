"use client"

import { EditIcon } from "@/components/icons"
import Image from "next/image"
import { useEffect, useRef, useState } from "react";

type ImageProps = {
  src: string;
  alt?: string
  width?: number;
  height?: number;
}

export default function Avatar({
  allowEdit = false,
  imageProps
}: {
  allowEdit: boolean,
  imageProps: ImageProps
}) {
  const {
    src = "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTyhgwFBBuEqiLB5BAjQR4hCDCoJYefwwYtelRMap_8uXFoyisZLRptYiqLuXet0zX9X9Z4z_UAxYbYCcyD9Pm8i2iEe1ljOiYaXfrieWMo7cAQCVQZQ8iYoWz5pDdJFY67SAOckK9jv-c&s=19",
    alt = "avatar",
    width = 100,
    height = 100
  } = imageProps

  const [isAvatarClicked, setIsAvatarClicked] = useState<boolean>(false);
  const [viewAvatar, setViewAvatar] = useState<boolean>(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Detect click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsAvatarClicked(false);
      }
    }

    // Attach listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleViewImage() {
    setViewAvatar(true);
    setIsAvatarClicked(false); 
  }

  function handleUpdateImage() {
    console.log("Update Image");
  }

  function handleRemoveImage() {
    console.log("Remove Image");
  }
  return <div ref={avatarRef} className="group relative inline-block w-fit">
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      onClick={() => setViewAvatar(true)}
      className="border-2 border-black rounded-full object-cover cursor-pointer"
    />

    {viewAvatar && (
      <div
        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
        onClick={() => setViewAvatar(false)} 
      >
        <Image
          src={src}
          alt={alt}
          width={width / height * 600}
          height={600}
          className={`
            max-w-[600px] max-h-[600px] rounded-lg shadow-lg
            transition-transform duration-200
          `}
        />
      </div>
    )}

    {allowEdit && <div className="cursor-pointer" onClick={() => setIsAvatarClicked(true)}>
      <div className={`absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-60 transition-opacity duration-200 w-[${width}px] h-[${height}px] rounded-full`} />
      <EditIcon className="text-white absolute opacity-0 group-hover:opacity-60 transition-opacity duration-200 flex top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>}

    {isAvatarClicked && <div className="absolute flex flex-col min-w-max border-2 border-gray-200 shadow-sm bg-white rounded-lg mt-2">
      <p className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleViewImage}>Xem ảnh</p>
      <p className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleUpdateImage}>Chỉnh sửa ảnh</p>
      <p className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleRemoveImage}>Gỡ ảnh</p>
    </div>}
  </div>
}