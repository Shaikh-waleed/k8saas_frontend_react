import React from "react";
import MainMenu from "../MainMenu";

interface Props {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}

const PageLayout: React.FC<Props> = ({ children, heading, subheading }) => {
  return (
    <section className="bg-MainBg flex md:p-2 min-h-screen p-1">
      <MainMenu />
      <div className="w-4/5 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="">
            <h1 className="text-MainHeading text-[20px] md:text-[22px] lg:text-[24px] font-Psb">{heading}</h1>
            <p className="text-SubHeading text-[14px] md:text-[15px] lg:text-[16px] font-Pr">{subheading}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
};

export default PageLayout;
