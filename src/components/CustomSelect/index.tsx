import React, { useState } from "react";
import { AngleDownIcon, InfoIcon } from "../../theme/svgs";
import { LabelValue } from "../../models/LabelValue";
import { ResourceId } from "../../models/types";

interface Props {
  value?: LabelValue<ResourceId>;
  placeholder: string;
  options: LabelValue<ResourceId>[];
  infoText?: string;
  onChange: (value: LabelValue<ResourceId>) => void;
  bgColor?: string;
}

const CustomSelect: React.FC<Props> = ({ value, placeholder, options, infoText, onChange, bgColor }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div onClick={() => setIsVisible(!isVisible)} className={`relative border-2 border-BorderColor ${bgColor ? bgColor : "bg-transparent"} rounded-[8px] cursor-pointer`}>
      <div className="flex justify-between items-center py-1.5 pl-2 pr-4">
        <p className="text-[12px] font-Pr text-Placeholder">{value?.label || placeholder}</p>
        <img src={AngleDownIcon} alt={"angle-down-icon"} className={"w-[10px] h-[10px]"} />
      </div>
      {isVisible ? (
        <div className="absolute z-10 top-10 bg-white shadow w-full rounded-[8px]">
          <ul className="text-[12px] font-Pr text-Placeholder">
            {options.map((option) => {
              return (
                <li
                  key={option.value}
                  onClick={() => {
                    setIsVisible(false);
                    onChange(option);
                  }}
                  className={`px-4 py-2 rounded-[8px] my-1 cursor-pointer ${
                    option === value
                      ? "bg-MainBg text-HeadingColor  border-l-2 border-HeadingColor"
                      : "text-Placeholder hover:border-l-2 hover:border-HeadingColor hover:text-HeadingColor hover:bg-SelectHover"
                  }`}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
          {infoText ? (
            <div className="flex items-center py-1 px-2">
              <img src={InfoIcon} alt={"info-icon"} className={"w-3 h-3 mr-1"} />
              <p className="text-[9px] font-Pr text-SubHeading">{infoText}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default CustomSelect;
