import React, { useState, useEffect } from "react";
import { getResource } from "../../api";
import PaymentCard from "../../components/PaymentCard";
import { useAuthContext } from "../../context/AuthContext";
import { ResourceTypeEnum } from "../../models/ResourceTypeEnum";
import Payment from "../Payment";

interface Props {}

const PaymentForm: React.FC<Props> = () => {
  const { accessToken } = useAuthContext();
  const [isActive, setIsActive] = useState(0);
  const [planData, setPlanData] = useState<any>("");

  let price = planData ? Number(planData[isActive].billing_cycles[0].pricing_scheme.fixed_price.value) : null;
  let taxPrice = planData ? Number(planData[isActive].taxes ? (price / 100) * planData[isActive].taxes.percentage : "0.00") : null;

  const getPlanID = async () => {
    try {
      const res: any = await getResource(accessToken, ResourceTypeEnum.GetPaymentDetails);
      if (res.status === "ACTIVE") {
      }
      setPlanData(res);
    } catch (error) {
      console.log(error);
      // Error Silently
    }
  };

  useEffect(() => {
    getPlanID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {planData ? (
        <div className="grid md:grid-cols-11 xsm:px-1  sm:px-5 md:px-8 lg:px-10">
          <div className="md:pr-4 col-span-11 md:col-span-4 mb-3">
            {Array.from(planData, (item: any, index) => {
              const names = ["Monthly", "Yearly", "Quarterly"];
              const price = item.billing_cycles[0].pricing_scheme.fixed_price.value;
              return (
                <div key={index} className="flex justify-evenly items-center mt-3">
                  <PaymentCard isActive={isActive === index} onClick={() => setIsActive(index)} planName={names[index]} planPrice={price} />
                </div>
              );
            })}
          </div>
          <div className="flex flex-col justify-between items-center my-3 col-span-11 md:col-span-7">
            <div className=" w-full py-2 md:px-4 px-2 my-2 border-l-[5px] border-HeadingColor bg-payCardBg rounded-[5px]">
              <div className="flex justify-between items-center pb-3">
                <div className="">
                  <p className="text-[12px] md:text-[18px] text-black font-Pb">{planData[isActive].name}</p>
                </div>
                <div className="">
                  <p className="text-[12px] md:text-[18px] font-Psb text-black">{`$${price}`}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2 pb-3 border-b-[1px] border-[#DEDEDE]">
                <div className="">
                  <p className="text-[12px] md:text-[14px] text-MainHeading font-Psb">{planData[isActive].description}</p>
                </div>
              </div>
              <div className="flex justify-between mb-10 items-center">
                <div className="">
                  <p className="text-[12px] md:text-[14px] text-MainHeading font-Psb">{"Taxes & Fees"}</p>
                </div>
                <div className="">
                  <p className="text-[12px] md:text-[16px] font-Psb text-black">{`$${taxPrice}`}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="">
                  <p className="text-[12px] md:text-[18px] text-black font-Pb">{"Total"}</p>
                </div>
                <div className="">
                  <p className="text-[12px] md:text-[18px] text-payCard font-Pb">{`$${taxPrice + price}`}</p>
                </div>
              </div>
            </div>
            <div className="xsm:w-full md:w-1/2">
              <Payment planID={planData[isActive]._id} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PaymentForm;
