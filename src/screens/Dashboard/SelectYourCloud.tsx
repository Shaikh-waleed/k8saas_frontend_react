import React, { useState } from "react";
import SelectCard from "../../components/SelectCard";
import { AWSLogo, AWSLogoWhite, AzureLogo, AzureLogoWhite, DigitalOceanLogo, OracleLogo, LinodeLogo } from "../../theme/svgs";
import { GCPLogo, GCPLogoWhite } from "../../theme/images";
import { CloudType } from "./ClusterEnum";

interface Props {
  buttonText: string;
  onClick: (cloudType: CloudType) => void;
}

const SelectYourCloud: React.FC<Props> = ({ buttonText, onClick }) => {
  const [cloudType, setCloudType] = useState<CloudType>(null);

  return (
    <>
      <div className="bg-GrayScale my-4 rounded-[16px] overflow-hidden">
        <p className="bg-MenuBarBg text-white text-[16px] md:text-[18px] lg:text-[20px] font-Psb text-center py-4">Select your cloud</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 py-4 md:p-4">
          <div className="flex justify-center items-center">
            <SelectCard
              isActive={cloudType === CloudType.AMAZON_WEB_SERVICES}
              onClick={() => setCloudType(CloudType.AMAZON_WEB_SERVICES)}
              activeImage={AWSLogoWhite}
              inActiveImage={AWSLogo}
              alt={"amazon-web-services-logo"}
            />
          </div>
          <div className="flex justify-center items-center">
            <SelectCard
              isActive={cloudType === CloudType.MICROSOFT_AZURE}
              onClick={() => setCloudType(CloudType.MICROSOFT_AZURE)}
              activeImage={AzureLogoWhite}
              inActiveImage={AzureLogo}
              alt={"microsoft-azure-logo"}
            />
          </div>
          <div className="flex justify-center items-center">
            <SelectCard
              isActive={cloudType === CloudType.GOOGLE_CLOUD_PLATFORM}
              onClick={() => setCloudType(CloudType.GOOGLE_CLOUD_PLATFORM)}
              activeImage={GCPLogoWhite}
              inActiveImage={GCPLogo}
              alt={"google-cloud-platform-logo"}
            />
          </div>
          <div className="flex justify-center items-center">
            <SelectCard
              isDisabled
              isActive={cloudType === CloudType.DIGITAL_OCEAN}
              onClick={() => setCloudType(CloudType.DIGITAL_OCEAN)}
              activeImage={DigitalOceanLogo}
              inActiveImage={DigitalOceanLogo}
              alt={"digital-ocean-logo"}
            />
          </div>
          <div className="flex justify-center items-center">
            <SelectCard isDisabled isActive={cloudType === CloudType.ORACLE} onClick={() => setCloudType(CloudType.ORACLE)} activeImage={OracleLogo} inActiveImage={OracleLogo} alt={"oracle-logo"} />
          </div>
          <div className="flex justify-center items-center">
            <SelectCard isDisabled isActive={cloudType === CloudType.LINODE} onClick={() => setCloudType(CloudType.LINODE)} activeImage={LinodeLogo} inActiveImage={LinodeLogo} alt={"linode-logo"} />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => onClick(cloudType)}
          disabled={!cloudType}
          className="w-32 text-white font-Pm text-[14px] bg-gradientDarkBlue py-2 rounded-[6px] self-center focus:outline-none disabled:opacity-60"
        >
          {buttonText}
        </button>
      </div>
    </>
  );
};

export default SelectYourCloud;
