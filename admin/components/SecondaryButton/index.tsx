"use client";

import { FC, SVGProps, useState, ButtonHTMLAttributes } from "react";

interface Button extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  textColor?: string;
  hoverTextColor?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
}

export default function SecondaryButton({
  text,
  icon: Icon,
  textColor,
  hoverTextColor,
  backgroundColor,
  hoverBackgroundColor,
  ...rest
}: Button) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      {...rest}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: isHovered ? hoverTextColor || "#000000" : textColor || "#000000",
        backgroundColor: isHovered
          ? hoverBackgroundColor || "#9CA3AF"
          : backgroundColor || "#FFFFFF",
      }}
      className={`w-full flex items-center gap-2 justify-center border border-gray-400  py-2 font-medium rounded-lg `}
    >
      {Icon && <Icon />} {text}
    </button>
  );
}
