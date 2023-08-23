import React, { useState, useEffect } from "react";
import CustomSelect from "../../components/CustomSelect";
import CustomTimeline from "../../components/CustomTimeline";
import { InfoIcon } from "../../theme/svgs";
import { cloudTypeImageFormater, cloudTypeNameFormater } from "../../utils/valueFormatters";
import { CloudType } from "../Dashboard/ClusterEnum";
import { CloudProfile } from "../Dashboard/model/CloudProfile";
import { createResource } from "../../api";
import { ResourceTypeEnum } from "../../models/ResourceTypeEnum";
import { useAuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

interface Props {
  cloudType: CloudType;
  onClickCancel: () => void;
}

const FORM_STEPS = [
  { name: "Details", number: 1 },
  { name: "Summary", number: 2 },
];

const CloudProfileForm: React.FC<Props> = ({ cloudType, onClickCancel }) => {
  const { accessToken } = useAuthContext();
  const [selectedStep, setSelectedStep] = useState(FORM_STEPS[0]);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [cloudProfileName, setCloudProfileName] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState(null);
  const [databaseType, setDatabaseType] = useState(null);
  const [resourceGroupName, setResourceGroupName] = useState("");

  const onCancel = () => {
    setSelectedStep(FORM_STEPS[0]);
    setIsNextButtonDisabled(true);
    setIsButtonLoading(false);
    setCloudProfileName("");
    setAccessKeyId("");
    setSecretAccessKey("");
    setRegion(null);
    setDatabaseType(null);
    setResourceGroupName("");
    onClickCancel();
  };

  const onBack = () => {
    setSelectedStep(FORM_STEPS[selectedStep.number - 2]);
  };

  const onNext = () => {
    setSelectedStep(FORM_STEPS[selectedStep.number]);
  };

  const onCreate = async () => {
    try {
      setIsButtonLoading(true);
      const payload = createPayloadForCloudProfile();
      await createResource<CloudProfile>(accessToken, ResourceTypeEnum.CloudProfile, payload);
      onCancel();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const createPayloadForCloudProfile = () => {
    switch (cloudType) {
      case CloudType.AMAZON_WEB_SERVICES:
        return { cloudType, name: cloudProfileName, region: region.value, accessKeyId, secretAccessKey };

      case CloudType.MICROSOFT_AZURE:
        return { cloudType, name: cloudProfileName, region: region.value, databaseType: databaseType.value, resourceGroupName };

      default:
        break;
    }
  };

  useEffect(() => {
    if (selectedStep.number === FORM_STEPS[0].number && cloudType === CloudType.AMAZON_WEB_SERVICES && (!cloudProfileName || !accessKeyId || !secretAccessKey || !region)) {
      setIsNextButtonDisabled(true);
    } else if (selectedStep.number === FORM_STEPS[0].number && cloudType === CloudType.MICROSOFT_AZURE && (!cloudProfileName || !region || !databaseType || !resourceGroupName)) {
      setIsNextButtonDisabled(true);
    } else {
      setIsNextButtonDisabled(false);
    }
  }, [selectedStep, cloudType, cloudProfileName, accessKeyId, secretAccessKey, region, databaseType, resourceGroupName]);

  const renderListItem = (label: string, value: string | number) => {
    return (
      <li className="py-2 md:px-4 px-2 my-2 rounded-[8px] relative before:left-0 before:top-[5px] before:absolute before:content-[''] before:w-[3px] before:h-[26px]">
        <div className="grid md:grid-cols-12 grid-cols-2">
          <div className="md:col-span-8">
            <p className="text-[12px] md:text-[14px] text-black font-Psb">{label}</p>
          </div>
          <div className="md:col-span-4">
            <p className="text-[12px] md:text-[14px] font-Pr text-black">{value}</p>
          </div>
        </div>
      </li>
    );
  };

  const renderAWSCloudProfileFields = () => {
    return (
      <>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Cloud profile name</label>
          <input
            type={"text"}
            value={cloudProfileName}
            onChange={(event) => setCloudProfileName(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter cloud profile name"}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Access key id</label>
          <input
            type={"text"}
            value={accessKeyId}
            onChange={(event) => setAccessKeyId(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter access key id"}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Secret access key</label>
          <input
            type={"text"}
            value={secretAccessKey}
            onChange={(event) => setSecretAccessKey(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter secret access key"}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Region</label>
          <CustomSelect
            value={region}
            placeholder={"Select Option"}
            options={[
              { label: "US East (N. Virginia)", value: "US East (N. Virginia)" },
              { label: "US East (Ohio)", value: "US East (Ohio)" },
              { label: "US West (N. California)", value: "US West (N. California)" },
            ]}
            onChange={(value) => setRegion(value)}
          />
        </div>
      </>
    );
  };

  const renderAzureCloudProfileFields = () => {
    return (
      <>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Cloud profile name</label>
          <input
            type={"text"}
            value={cloudProfileName}
            onChange={(event) => setCloudProfileName(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter cloud profile name"}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Region</label>
          <CustomSelect
            value={region}
            placeholder={"Select Option"}
            options={[
              { label: "US East (N. Virginia)", value: "US East (N. Virginia)" },
              { label: "US East (Ohio)", value: "US East (Ohio)" },
              { label: "US West (N. California)", value: "US West (N. California)" },
            ]}
            onChange={(value) => setRegion(value)}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Database type</label>
          <CustomSelect value={databaseType} placeholder={"Select Option"} options={[{ label: "AKS", value: "AKS" }]} onChange={(value) => setDatabaseType(value)} />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Resource group name</label>
          <input
            type={"text"}
            value={resourceGroupName}
            onChange={(event) => setResourceGroupName(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter resource group name"}
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex justify-center items-center absolute top-0 right-0 md:bottom-0 left-0 p-3 bg-Overlay">
      <div className="w-full md:w-4/5 lg:w-2/3 bg-MainBg rounded-[12px]">
        <div className="grid grid-cols-12 py-3 md:px-5 px-2">
          <div className="md:col-span-7 col-span-12 flex justify-center md:justify-start items-center">
            <p className="text-MenuBarBg font-Psb md:text-[18px] text-[16px] md:mb-0 mb-2 md:text-left text-center">New Cloud Profile</p>
          </div>
          <div className="md:col-span-5 col-span-12 flex md:justify-end justify-center">
            <CustomTimeline steps={FORM_STEPS} activeStep={selectedStep} width={70} />
          </div>
        </div>
        <div className="border-y-[1px] bg-white">
          {selectedStep.number === FORM_STEPS[0].number ? (
            <>
              <div className="flex bg-MenuBarBg justify-end items-center py-3 px-5">
                <p className="text-[12px] font-Pr text-white">
                  The estimated cost for your <strong>Micro size</strong> deployment is <strong>$10/month</strong>
                </p>
                <img src={InfoIcon} alt={"info-icon"} className={"w-4 h-4 ml-1"} />
              </div>
              <div className="grid md:grid-cols-2 gap-4 py-4 px-5">
                <div>
                  <div className="md:pr-4 lg:w-4/5">
                    {cloudType === CloudType.AMAZON_WEB_SERVICES ? renderAWSCloudProfileFields() : null}
                    {cloudType === CloudType.MICROSOFT_AZURE ? renderAzureCloudProfileFields() : null}
                  </div>
                  <div className="lg:w-11/12">
                    <div className="border-l-8 border-HeadingColor mt-4">
                      <p className="text-Placeholder text-[10px] font-Pr leading-normal bg-MainBg p-3 rounded-tr-[12px] rounded-br-[12px]">
                        Create a custom Cloud profile to bring your own AWS account. You can also download the K8saaS custom IAM policy to configure for your relevant AWS IAM user.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="h-60 md:h-72 flex flex-col justify-center items-center p-3 mb-4 rounded-[20px] bg-gradient-to-r from-gradientDarkBlue to-gradientLightBlue custom-box-shadow relative">
                    <p className="text-[13px] font-Psb text-white absolute top-4">Selected Cloud</p>
                    <img src={cloudTypeImageFormater(cloudType, true)} alt={"aws logo"} className="w-32 h-32 md:w-32 md:h-32" />
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {selectedStep.number === FORM_STEPS[1].number ? (
            <div className="md:py-4 md:px-5 p-2">
              <p className="text-MenuBarBg font-Psb text-[18px] md:text-[20px] lg:text-[24px] text-center mb-4">Create Cloud Profile</p>
              <ul className="md:mx-12 [&>*:nth-child(odd)]:bg-MainBg [&>*:nth-child(even)]:bg-white [&>*:nth-child(odd)]:before:bg-HeadingColor [&>*:nth-child(even)]:before:bg-BorderColor">
                {renderListItem("Name", cloudProfileName)}
                {renderListItem("Cloud", cloudTypeNameFormater(cloudType))}
                {accessKeyId ? renderListItem("Access Key", accessKeyId) : null}
                {secretAccessKey ? renderListItem("Secret Access Key", secretAccessKey) : null}
                {renderListItem("Region", region.label)}
                {databaseType ? renderListItem("Database Type", databaseType.value) : null}
                {resourceGroupName ? renderListItem("Resource Group Name", resourceGroupName) : null}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="flex md:justify-end justify-center py-4 md:px-4">
          <button disabled={isButtonLoading} onClick={onCancel} className="md:w-24 md:h-8 w-20 h-8 text-white font-Pm text-[12px] bg-CancelBtn rounded-[6px] mx-1">
            Cancel
          </button>
          {selectedStep.number > 1 ? (
            <button disabled={isButtonLoading} onClick={onBack} className="md:w-24 md:h-8 w-20 h-8 text-HeadingColor font-Pm text-[12px] border-HeadingColor border-2 rounded-[6px] mx-1">
              Back
            </button>
          ) : null}
          <button
            disabled={isNextButtonDisabled || isButtonLoading}
            onClick={() => (selectedStep.number === FORM_STEPS.length ? onCreate() : onNext())}
            className="md:w-24 md:h-8 w-20 h-8 text-white font-Pm text-[12px] bg-HeadingColor rounded-[6px] mx-1 disabled:bg-gradientLightBlue"
          >
            {isButtonLoading ? <LoadingSpinner height="4" width="4" /> : selectedStep.number === FORM_STEPS.length ? "Create" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudProfileForm;
