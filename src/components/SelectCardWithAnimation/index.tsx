import React from "react";
import "./styles.css";

interface Props {
  isActive: boolean;
  onClick: () => void;
  hasTag?: boolean;
  tag?: string;
  activeImage: string;
  inActiveImage: string;
  title: string;
  description: string;
  alt: string;
}

const SelectCardWithAnimation: React.FC<Props> = ({ isActive, onClick, hasTag = false, tag, activeImage, inActiveImage, title, description, alt }) => {
  return (
    <div
      onClick={onClick}
      className={`w-full h-[320px] md:h-[370px] lg:h-[420px] relative shadow-lg flex flex-col justify-end items-center rounded-[24px] overflow-hidden p-4 my-4 cursor-pointer ${
        isActive ? "bg-gradient-to-r from-gradientLightBlue to-gradientDarkBlue" : "bg-white"
      }`}
    >
      {isActive ? <span className="overlay" /> : null}
      {hasTag ? (
        <span className="bg-HeadingColor absolute top-0 left-0 p-3 rounded-br-[12px]">
          <span className="text-[16px] md:text-[20px] lg:text-[24px] font-Pm text-white">{tag}</span>
        </span>
      ) : null}
      <span className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] border-[1px] rounded-[20px] md:rounded-[24px] border-MainHeading flex justify-center items-center self-end absolute top-4">
        {isActive ? <span className="bg-HeadingColor w-[12px] h-[12px] rounded-[12px] md:w-[16px] md:h-[16px] md:rounded-[16px]" /> : null}
      </span>
      <img src={isActive ? activeImage : inActiveImage} alt={alt} className={"w-[125px] h-[125px] md:w-[145px] md:h-[145px] lg:w-[190px] lg:h-[190px] absolute top-11 md:top-12 lg:top-10"} />
      <div className="mt-14 mb-4 whitespace-pre-wrap">
        <p className={`text-[17px] md:text-[20px] lg:text-[24px] font-Psb text-center mb-2 ${isActive ? "text-white" : "text-HeadingColor"}`}>{title}</p>
        <p className={`text-[12px] md:text-[12px] lg:text-[13px] font-Pm text-center ${isActive ? "text-white" : "text-MainHeading"}`}>{description}</p>
      </div>
    </div>
  );
};

export default SelectCardWithAnimation;
