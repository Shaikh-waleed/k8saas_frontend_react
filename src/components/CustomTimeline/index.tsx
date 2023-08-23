import React from "react";

interface Step {
  name: string;
  number: number;
}

interface Props {
  steps: Step[];
  activeStep: Step;
  width: number;
}

const CustomTimeline: React.FC<Props> = ({ steps, activeStep, width }) => {
  return (
    <div style={{ width: width * (steps.length + 1) }}>
      <div className="flex justify-between">
        {steps.map((step) => {
          const isActive = step.number === activeStep.number || step.number < activeStep.number;
          const isActiveBar = step.number < activeStep.number;
          return (
            <div className="relative">
              {step.number !== steps.length ? (
                <span
                  style={{ width: width * (steps.length > 2 ? 1.5 : 2) }}
                  className={`block h-[4px] absolute top-[14px] left-[35px] ${isActiveBar ? "bg-gradient-to-r from-gradientDarkBlue to-gradientLightBlue" : "bg-TimelineGray"}`}
                />
              ) : null}
              <div style={{ width }} className={`flex flex-col justify-center items-center`}>
                <span
                  className={`cursor-default relative w-[32px] h-[32px] flex justify-center items-center rounded-[32px] text-white text-[14px] font-Psb ${
                    isActive ? "bg-gradient-to-r from-gradientDarkBlue to-gradientLightBlue" : "bg-TimelineGray"
                  }`}
                >
                  {step.number}
                </span>
                <span className={`cursor-default text-[12px] font-Pm mt-1 ${isActive ? "text-HeadingColor" : "text-TimelineText"}`}>{step.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomTimeline;
