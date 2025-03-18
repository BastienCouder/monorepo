"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ImageProps } from "next/image";

interface BlurImageProps extends Omit<ImageProps, "src"> {
  src: string; // The source of the image
  alt: string; // The alt text for the image
  className?: string; // Optional className for styling
}

const BlurImage: React.FC<BlurImageProps> = (props) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      {...props}
      src={props.src}
      alt={props.alt}
      className={cn(
        props.className,
        "duration-500 ease-in-out",
        isLoading ? "blur-sm" : "blur-0"
      )}
      onLoad={() => setLoading(false)}
    />
  );
};

export default BlurImage;
