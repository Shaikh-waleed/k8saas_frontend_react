import React from "react";

interface ImageProps {
  src: string;
}

const Image: React.FC<ImageProps> = ({ src }) => {
  return <img src={src} alt="" className="w-10 h-10" />;
};

export const renderValue = (value: string | number, isImage: boolean): React.ReactNode => {
  if (isImage) {
    return value ? <Image src={value as string} /> : value;
  }

  switch (value) {
    default:
      return value;
  }
};
