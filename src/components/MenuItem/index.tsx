import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { AngleRightIcon } from "../../theme/svgs";

interface Props {
  href: string;
  leftIcon: string;
  leftIconAlt: string;
  label: string;
  rightIcon?: string;
  rightIconAlt?: string;
}

const MenuItem: React.FC<Props> = ({ href, leftIcon, leftIconAlt, label, rightIcon, rightIconAlt }) => {
  const { pathname } = useLocation();

  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(href.split("/")[1] === pathname.split("/")[1]);
  }, [href, pathname]);

  return (
    <Link to={href}>
      <div
        className={`flex w-8 h-8 md:w-full md:h-auto py-2 md:px-2.5 mb-4 md:mb-2 cursor-pointer items-center md:justify-between justify-center self-center rounded-[6px] ${
          isActive ? "bg-gradient-to-r from-gradientLightBlue to-gradientDarkBlue" : ""
        }`}
      >
        <span className="flex items-center">
          <img src={leftIcon} alt={leftIconAlt} className="inline-block w-5 h-5 md:w-4 md:h-4 mr-0 md:mr-2 lg:mr-4" />
          <span className="text-white font-Pr md:text-[12px] lg:text-[14px] md:inline hidden">{label}</span>
        </span>
        {isActive ? <img src={rightIcon ? rightIcon : AngleRightIcon} alt={rightIconAlt ? rightIconAlt : "angle-right-icon"} className="w-3 h-3 lg:w-3.5 lg:h-3.5 md:inline hidden" /> : null}
      </div>
    </Link>
  );
};

export default MenuItem;
