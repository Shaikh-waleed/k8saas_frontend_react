import React from "react";

interface Props {
  isDisabled?: boolean;
  isActive: boolean;
  onClick: () => void;
  activeImage: string;
  inActiveImage: string;
  alt: string;
}

const SelectCard: React.FC<Props> = ({ isDisabled = false, isActive, onClick, activeImage, inActiveImage, alt }) => {
  return (
    <div
      onClick={!isDisabled ? () => onClick() : null}
      className={`w-full h-[180px] relative shadow-lg flex flex-col justify-center items-center rounded-[18px] md:rounded-[20px] lg:rounded-[24px] ${
        isActive ? "bg-gradient-to-tr from-gradientDarkBlue to-gradientLightBlue" : "bg-white"
      } ${isDisabled ? "cursor-default" : "cursor-pointer"}`}
    >
      {isDisabled ? <span className="text-white font-Psb text-[10px] absolute top-0 left-0 bg-gradientDarkBlue py-2 px-3 rounded-tl-[18px] rounded-br-[14px] fon">Coming soon</span> : null}
      <span
        className={`w-[20px] h-[20px] rounded-[20px] md:w-[20px] md:h-[20px] md:rounded-[20px] border-[1px] flex justify-center items-center absolute top-3 right-3 ${
          isActive ? "border-white" : "border-BorderColor"
        }`}
      >
        {isActive ? <span className="bg-white w-[12px] h-[12px] rounded-[12px] md:w-[16px] md:h-[16px] md:rounded-[16px]" /> : null}
      </span>
      <img src={isActive ? activeImage : inActiveImage} alt={alt} className={`w-[130px] h-[130px] ${isDisabled ? "grayscale" : ""}`} />
    </div>
  );
};

export default SelectCard;
