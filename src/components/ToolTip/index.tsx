import React, { useState } from "react";
import { TooltipIcon } from "../../theme/svgs";

interface Props {
  text: string;
}

const ToolTip: React.FC<Props> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <img onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} src={TooltipIcon} alt={"tooltip-icon"} className={"w-3 h-3"} />
      {isVisible ? <span className={`absolute md:w-60 w-40 text-[8px] font-Pr text-white p-1 pb-[2px] text-center rounded-[4px] top-[-3px] left-[20px] bg-ToolTipBg`}>{text}</span> : null}
    </span>
  );
};

export default ToolTip;
