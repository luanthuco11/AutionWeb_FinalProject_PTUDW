"use client";

import { cn } from "@/lib/utils";
import { FC, SVGProps, useState } from "react";

interface Button {
  text: string;
  textColor?: string;
  hoverTextColor?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function PrimaryButton({
  text,
  onClick,
  icon: Icon,
  textColor,
  hoverTextColor,
  backgroundColor,
  hoverBackgroundColor,
  disabled,
  className,
}: Button) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          color: isHovered
            ? hoverTextColor || "#FFFFFF"
            : textColor || "#FFFFFF",
          backgroundColor: isHovered
            ? hoverBackgroundColor || "var(--chart-6)"
            : backgroundColor || "var(--chart-2)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        className={`w-full flex items-center gap-2 justify-center py-2 font-medium rounded-lg ${cn(
          className
        )} `}
      >
        {Icon && <Icon />} {text}
      </button>
    </>
  );
}

/*
 <PrimaryButton text="Click me" icon={LoveIcon} onClick={() => console.log("123")} textColor="#333333" hoverBackgroundColor="#FF00FF" backgroundColor="#808080"  />;
  <SecondaryButton text="Click me" icon={LoveIcon} onClick={() => console.log("123")} textColor="#333333" hoverBackgroundColor="#FF00FF" backgroundColor="#808080"  />;
*/
