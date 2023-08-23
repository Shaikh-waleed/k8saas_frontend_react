import React, { useEffect } from "react";

interface Props {
    isActive: boolean;
    onClick: () => void;
    planName: string;
    planPrice: string
}

const PaymentCard: React.FC<Props> = ({ isActive, onClick, planName, planPrice }) => {
    useEffect(() => {
        console.log("PaymentCard")
    }, [])
    return (
        <div
            onClick={onClick}
            className={`w-full h-[120px] relative flex flex-row border-[1px] p-3 border-payCard justify-center items-center rounded-[14px] md:rounded-[16px] lg:rounded-[18px] ${isActive ? "bg-gradient-to-tr from-gradientDarkBlue to-gradientLightBlue" : "bg-white"
                }`}
        >
            <div className="w-1/3 h-full pr-4 md:pr-2 lg:pr-2 ">
                <div className={`w-full h-full flex flex-col justify-center md:p-1 items-center rounded-[14px] md:rounded-[16px] lg:rounded-[18px] ${!isActive ? "bg-gradient-to-tr from-payCard to-gradientLightBlue" : "bg-white"}`}>
                    <div className={`font-Pm xsm:text-[12px]  lg:text-[12px]  md:mb-0 mb-2 md:text-left text-center ${!isActive ? "text-white" : "text-payCard"}`}>Save</div>
                    <div className={`font-Psb xsm:text-[14px]  lg:text-[18px]  md:mb-0 mb-2 md:text-left text-center ${!isActive ? "text-white" : "text-payCard"}`}>$4.99</div>
                </div>
            </div>
            <div className={`w-2/3 h-full flex flex-col justify-evenly items-center mr-8 md:mr-4 rounded-[14px] md:rounded-[16px] lg:rounded-[18px]`}>
                {/* <div className={`xsm:w-[100] sm:w-full md:w-[120px] lg:w-[150px] whitespace-nowrap overflow-hidden text-ellipsis bg-black font-Psb xsm:text-[12px] md:text-[12px] lg:text-[12px] whitespace-no-wrap md:mb-0 mb-2 md:text-left text-center ${isActive ? "text-white" : "text-payCard"}`}>{planName}</div> */}
                <div className={`font-Psb xsm:text-[12px] md:text-[12px] lg:text-[12px] whitespace-no-wrap md:mb-0 mb-2 md:text-left text-justify ${isActive ? "text-white" : "text-payCard"}`}>{planName}</div>
                <div className={`font-Pb xsm:text-[30px] md:text-[24px] lg:text-[34px] md:mb-0 mb-2 md:text-left text-center ${isActive ? "text-white" : "text-MainHeading"}`}>{`$${planPrice}`}</div>
                <div className={`font-Psb xsm:text-[12px] md:text-[12px] lg:text-[12px] md:mb-0 mb-2 md:text-left text-center ${isActive ? "text-white" : "text-SubHeading"}`}>USD/month</div>
            </div>
            <span
                className={`xsm:w-[20px] xsm:h-[20px] xsm:rounded-[20px] md:w-[12px] md:h-[12px] md:rounded-[12px] lg:w-[16px] lg:h-[16px] lg:rounded-[16px] border-[1px] flex justify-center items-center absolute top-3 right-3 ${isActive ? "border-white" : "border-BorderColor"}`}
            >
                {isActive ? <span className="bg-white xsm:w-[12px] xsm:h-[12px] xsm:rounded-[12px] md:w-[6px] md:h-[6px] md:rounded-[6px] lg:w-[8px] lg:h-[8px] lg:rounded-[8px]" /> : null}
            </span>
            {/* <span
                className={`w-[20px] h-[20px] rounded-[20px] md:w-[20px] md:h-[20px] md:rounded-[20px] border-[1px] flex justify-center items-center absolute top-3 right-3 ${isActive ? "border-white" : "border-BorderColor"}`}
            >
                {isActive ? <span className="bg-white w-[12px] h-[12px] rounded-[12px] md:w-[16px] md:h-[16px] md:rounded-[16px]" /> : null}
            </span> */}
        </div>
    );
};

export default PaymentCard;
