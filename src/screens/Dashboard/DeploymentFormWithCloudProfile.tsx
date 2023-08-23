import React, { useEffect, useState } from "react";
import { CloudType, ClusterType } from "./ClusterEnum";
import CustomTimeline from "../../components/CustomTimeline";
import CustomSelect from "../../components/CustomSelect";
import { cloudTypeImageFormater, cloudTypeNameFormater } from "../../utils/valueFormatters";
import { InfoIcon } from "../../theme/svgs";
import { AWSLogo, AWSLogoWhite, AzureLogo, AzureLogoWhite, AddCloudProfileIcon, AddCloudProfileWhiteIcon, DigitalOceanLogo, OracleLogo, LinodeLogo } from "../../theme/svgs";
import { GCPLogo, GCPLogoWhite } from "../../theme/images";
import PaymentForm from "./PaymentForm";
import { createResource, getResource } from "../../api";
import { ResourceTypeEnum } from "../../models/ResourceTypeEnum";
import { Cluster } from "./model/Cluster";
import { CloudProfile } from "./model/CloudProfile";
import { useAuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getResourcesAsSelectOptions } from "../../utils/formHelper";
import { LabelValue } from "../../models/LabelValue";
import { ResourceId } from "../../models/types";

interface Props {
  clusterType: ClusterType;
  cloudProfile: LabelValue<string>;
  name: string;
  nodeSize: LabelValue<string>;
  version: LabelValue<string>;
  region: LabelValue<string>;
  resourceGroupName: string;
  workerNodes: number;
  onChangeCloudProfile: (cloudProfile: LabelValue<ResourceId>) => void;
  onChangeName: (name: string) => void;
  onChangeNodeSize: (nodeSize: LabelValue<ResourceId>) => void;
  onChangeVersion: (version: LabelValue<ResourceId>) => void;
  onChangeRegion: (region: LabelValue<ResourceId>) => void;
  onChangeResourceGroupName: (resourceGroupName: string) => void;
  onChangeWorkerNodes: (workerNodes: number) => void;
  onClickCancel: () => void;
}

const FORM_STEPS = [
  { name: "Cloud Profile", number: 1 },
  { name: "Create Cluster", number: 2 },
  { name: "Summary", number: 3 },
];

const CLOUD_PROFILE_STEPS = [
  { name: "Select cloud profile", number: 1 },
  { name: "Select your cloud", number: 2 },
  { name: "Cloud details", number: 3 },
];

const SUMMARY_AND_PAYMENT_STEP = [
  { name: "Summary", number: 1 },
  { name: "Payment", number: 2 },
  { name: "Done", number: 3 },
];

const DeploymentForm: React.FC<Props> = ({
  clusterType,
  cloudProfile,
  onChangeCloudProfile,
  name,
  onChangeName,
  nodeSize,
  onChangeNodeSize,
  version,
  onChangeVersion,
  region,
  onChangeRegion,
  resourceGroupName,
  onChangeResourceGroupName,
  workerNodes,
  onChangeWorkerNodes,
  onClickCancel,
}) => {
  const { accessToken } = useAuthContext();

  const [selectedStep, setSelectedStep] = useState(FORM_STEPS[0]);
  const [cloudProfileStep, setCloudProfileStep] = useState(CLOUD_PROFILE_STEPS[0]);
  const [summaryAndPaymentStep, setSummaryAndPaymentStep] = useState(SUMMARY_AND_PAYMENT_STEP[0]);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [addCloudProfileIcon, setAddCloudProfileIcon] = useState(AddCloudProfileIcon);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [cloudType, setCloudType] = useState<CloudType>(null);
  const [cloudProfileName, setCloudProfileName] = useState("");
  const [cloudProfileAccessKey, setCloudProfileAccessKey] = useState("");
  const [cloudProfileSecretAccessKey, setCloudProfileSecretAccessKey] = useState("");
  const [cloudProfileRegion, setCloudProfileRegion] = useState(null);
  const [cloudProfileDatabaseType, setCloudProfileDatabaseType] = useState(null);
  const [cloudProfileResourceGroupName, setCloudProfileResourceGroupName] = useState("");
  const [cloudProfiles, setCloudProfiles] = useState<CloudProfile[]>([]);
  const [cloudProfileOptions, setCloudProfileOptions] = useState<LabelValue<ResourceId>[]>([]);
  const [selectedCloudProfile, setSelectedCloudProfile] = useState<CloudProfile>(null);

  const onClickCreateCloudProfile = () => {
    onChangeCloudProfile(null);
    setSelectedCloudProfile(null);
    setCloudProfileStep(CLOUD_PROFILE_STEPS[cloudProfileStep.number]);
  };

  const onCancel = () => {
    setSelectedStep(FORM_STEPS[0]);
    setCloudProfileStep(CLOUD_PROFILE_STEPS[0]);
    setSummaryAndPaymentStep(SUMMARY_AND_PAYMENT_STEP[0]);
    setIsNextButtonDisabled(true);
    setAddCloudProfileIcon(AddCloudProfileIcon);
    setCloudType(null);
    setCloudProfileName("");
    setCloudProfileAccessKey("");
    setCloudProfileSecretAccessKey("");
    setCloudProfileRegion(null);
    setCloudProfileDatabaseType(null);
    setCloudProfileResourceGroupName("");
    onClickCancel();
  };

  const resetCloudProfileStates = () => {
    setCloudType(null);
    setCloudProfileName("");
    setCloudProfileAccessKey("");
    setCloudProfileSecretAccessKey("");
    setCloudProfileRegion(null);
    setCloudProfileDatabaseType(null);
    setCloudProfileResourceGroupName("");
  };

  const onBack = () => {
    if (cloudProfile) {
      if (selectedStep.number === FORM_STEPS[2].number && summaryAndPaymentStep.number !== SUMMARY_AND_PAYMENT_STEP[0].number) {
        setSummaryAndPaymentStep(SUMMARY_AND_PAYMENT_STEP[summaryAndPaymentStep.number - 2]);
      } else {
        setSelectedStep(FORM_STEPS[selectedStep.number - 2]);
      }
    } else {
      setAddCloudProfileIcon(AddCloudProfileIcon);
      setCloudProfileStep(CLOUD_PROFILE_STEPS[cloudProfileStep.number - 2]);
    }
  };

  const onNext = () => {
    if (cloudProfile) {
      if (selectedStep.number === FORM_STEPS[2].number) {
        setSummaryAndPaymentStep(SUMMARY_AND_PAYMENT_STEP[summaryAndPaymentStep.number]);
      } else {
        setSelectedStep(FORM_STEPS[selectedStep.number]);
      }
    } else {
      setAddCloudProfileIcon(AddCloudProfileIcon);
      setCloudProfileStep(CLOUD_PROFILE_STEPS[cloudProfileStep.number]);
    }
  };

  const createPayloadForCloudProfile = () => {
    switch (cloudType) {
      case CloudType.AMAZON_WEB_SERVICES:
        return { cloudType, name: cloudProfileName, region: cloudProfileRegion.value, accessKeyId: cloudProfileAccessKey, secretAccessKey: cloudProfileSecretAccessKey };

      case CloudType.MICROSOFT_AZURE:
        return { cloudType, name: cloudProfileName, region: cloudProfileRegion.value, databaseType: cloudProfileDatabaseType.value, resourceGroupName: cloudProfileResourceGroupName };

      default:
        break;
    }
  };

  const getCloudProfileByUser = async () => {
    try {
      const cloudProfileByUser = await getResource<CloudProfile[]>(accessToken, ResourceTypeEnum.CloudProfileByUser);
      setCloudProfiles(cloudProfileByUser);
      const cloudProfileOptions = await getResourcesAsSelectOptions(cloudProfileByUser, ResourceTypeEnum.CloudProfileByUser, "name");
      setCloudProfileOptions(cloudProfileOptions);
    } catch (error) {
      alert(error.message);
    }
  };

  const createCloudProfile = async () => {
    try {
      setIsButtonLoading(true);
      const payload = createPayloadForCloudProfile();
      await createResource<CloudProfile>(accessToken, ResourceTypeEnum.CloudProfile, payload);
      await getCloudProfileByUser();
      resetCloudProfileStates();
      setCloudProfileStep(CLOUD_PROFILE_STEPS[0]);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const createPayloadForCluster = () => {
    switch (selectedCloudProfile.cloudType) {
      case CloudType.AMAZON_WEB_SERVICES:
        return { clusterType, cloudId: cloudProfile.value, cloudType: selectedCloudProfile.cloudType, name, nodeSize: nodeSize.value, version: version.value, region: region.value };

      case CloudType.MICROSOFT_AZURE:
        return { clusterType, cloudId: cloudProfile.value, cloudType: selectedCloudProfile.cloudType, name, version: version.value, region: region.value, resourceGroupName, workerNodes };

      default:
        break;
    }
  };

  const createCluster = async () => {
    try {
      setIsButtonLoading(true);
      const payload = createPayloadForCluster();
      await createResource<Cluster>(accessToken, ResourceTypeEnum.Cluster, payload);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const onCreate = () => {
    if (cloudProfileStep.number === CLOUD_PROFILE_STEPS[2].number) {
      createCloudProfile();
    } else {
      createCluster();
    }
  };

  const getButtonText = () => {
    if (cloudProfileStep.number === CLOUD_PROFILE_STEPS.length || summaryAndPaymentStep.number === SUMMARY_AND_PAYMENT_STEP[1].number) {
      return "Create";
    } else if (selectedStep.number === FORM_STEPS.length) {
      return "Confirm";
    } else {
      return "Next";
    }
  };

  // Using it to disable a button based on form validation
  useEffect(() => {
    if (cloudProfileStep.number === CLOUD_PROFILE_STEPS[0].number && !cloudProfile) {
      setIsNextButtonDisabled(true);
    } else if (cloudProfileStep.number === CLOUD_PROFILE_STEPS[1].number && !cloudType) {
      setIsNextButtonDisabled(true);
    } else if (
      cloudProfileStep.number === CLOUD_PROFILE_STEPS[2].number &&
      cloudType === CloudType.AMAZON_WEB_SERVICES &&
      (!cloudProfileName || !cloudProfileAccessKey || !cloudProfileSecretAccessKey || !cloudProfileRegion)
    ) {
      setIsNextButtonDisabled(true);
    } else if (
      cloudProfileStep.number === CLOUD_PROFILE_STEPS[2].number &&
      cloudType === CloudType.MICROSOFT_AZURE &&
      (!cloudProfileName || !cloudProfileRegion || !cloudProfileDatabaseType || !cloudProfileResourceGroupName)
    ) {
      setIsNextButtonDisabled(true);
    } else if (selectedStep.number === FORM_STEPS[1].number && selectedCloudProfile.cloudType === CloudType.AMAZON_WEB_SERVICES && (!name || !nodeSize || !version || !region)) {
      setIsNextButtonDisabled(true);
    } else if (selectedStep.number === FORM_STEPS[1].number && selectedCloudProfile.cloudType === CloudType.MICROSOFT_AZURE && (!name || !version || !region || !resourceGroupName || !workerNodes)) {
      setIsNextButtonDisabled(true);
    } else {
      setIsNextButtonDisabled(false);
    }
  }, [
    cloudProfileStep,
    cloudProfile,
    cloudType,
    cloudProfileName,
    cloudProfileAccessKey,
    cloudProfileSecretAccessKey,
    cloudProfileRegion,
    cloudProfileDatabaseType,
    cloudProfileResourceGroupName,
    selectedStep,
    selectedCloudProfile,
    name,
    nodeSize,
    version,
    region,
    resourceGroupName,
    workerNodes,
  ]);

  useEffect(() => {
    getCloudProfileByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderListItem = (label, value) => {
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

  const renderSelectCard = ({ isDisabled = false, isActive, onClick, activeImage, inActiveImage, alt }) => {
    return (
      <div
        onClick={!isDisabled ? () => onClick() : null}
        className={`w-full h-[150px] relative shadow-lg flex flex-col justify-center items-center rounded-[24px] ${
          isActive ? "bg-gradient-to-tr from-gradientDarkBlue to-gradientLightBlue" : "bg-white"
        } ${isDisabled ? "cursor-default" : "cursor-pointer"}`}
      >
        {isDisabled ? <span className="text-white font-Psb text-[10px] absolute top-0 left-0 bg-gradientDarkBlue py-2 px-3 rounded-tl-[18px] rounded-br-[14px] fon">Coming soon</span> : null}
        <span className={`w-[18px] h-[18px] rounded-[18px] border-[1px] flex justify-center items-center absolute top-4 right-4 ${isActive ? "border-white" : "border-BorderColor"}`}>
          {isActive ? <span className="bg-white w-[12px] h-[12px] rounded-[12px]" /> : null}
        </span>
        <img src={isActive ? activeImage : inActiveImage} alt={alt} className={`w-[130px] h-[130px] ${isDisabled ? "grayscale" : ""}`} />
      </div>
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
            value={cloudProfileAccessKey}
            onChange={(event) => setCloudProfileAccessKey(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter access key id"}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Secret access key</label>
          <input
            type={"text"}
            value={cloudProfileSecretAccessKey}
            onChange={(event) => setCloudProfileSecretAccessKey(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter secret access key"}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Region</label>
          <CustomSelect
            value={cloudProfileRegion}
            placeholder={"Select Option"}
            options={[
              { label: "US East (N. Virginia)", value: "US East (N. Virginia)" },
              { label: "US East (Ohio)", value: "US East (Ohio)" },
              { label: "US West (N. California)", value: "US West (N. California)" },
            ]}
            onChange={(value) => setCloudProfileRegion(value)}
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
            value={cloudProfileRegion}
            placeholder={"Select Option"}
            options={[
              { label: "US East (N. Virginia)", value: "US East (N. Virginia)" },
              { label: "US East (Ohio)", value: "US East (Ohio)" },
              { label: "US West (N. California)", value: "US West (N. California)" },
            ]}
            onChange={(value) => setCloudProfileRegion(value)}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Database type</label>
          <CustomSelect value={cloudProfileDatabaseType} placeholder={"Select Option"} options={[{ label: "AKS", value: "AKS" }]} onChange={(value) => setCloudProfileDatabaseType(value)} />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Resource group name</label>
          <input
            type={"text"}
            value={cloudProfileResourceGroupName}
            onChange={(event) => setCloudProfileResourceGroupName(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter resource group name"}
          />
        </div>
      </>
    );
  };

  const renderAWSClusterFields = () => {
    return (
      <>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Name</label>
          <input
            type={"text"}
            value={name}
            onChange={(event) => onChangeName(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter your cluster name"}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Cluster node size</label>
          <CustomSelect
            value={nodeSize}
            placeholder={"Select Option"}
            options={[{ label: "Micro", value: "Micro" }]}
            infoText={"In trial mode only standalone micro instance is allowed"}
            onChange={(value) => onChangeNodeSize(value)}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Version</label>
          <CustomSelect
            value={version}
            placeholder={"Select Option"}
            options={[
              { label: "v7.5.39", value: "v7.5.39" },
              { label: "v8.0.30", value: "v8.0.30" },
            ]}
            onChange={(value) => onChangeVersion(value)}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Cluster region</label>
          <CustomSelect
            value={region}
            placeholder={"Select Option"}
            options={[
              { label: "US East (N. Virginia)", value: "US East (N. Virginia)" },
              { label: "US East (Ohio)", value: "US East (Ohio)" },
              { label: "US West (N. California)", value: "US West (N. California)" },
            ]}
            onChange={(value) => onChangeRegion(value)}
          />
        </div>
      </>
    );
  };

  const renderAzureClusterFields = () => {
    return (
      <>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Name</label>
          <input
            type={"text"}
            value={name}
            onChange={(event) => onChangeName(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter your cluster name"}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Version</label>
          <CustomSelect
            value={version}
            placeholder={"Select Option"}
            options={[
              { label: "v7.5.39", value: "v7.5.39" },
              { label: "v8.0.30", value: "v8.0.30" },
            ]}
            onChange={(value) => onChangeVersion(value)}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Cluster region</label>
          <CustomSelect
            value={region}
            placeholder={"Select Option"}
            options={[
              { label: "US East (N. Virginia)", value: "US East (N. Virginia)" },
              { label: "US East (Ohio)", value: "US East (Ohio)" },
              { label: "US West (N. California)", value: "US West (N. California)" },
            ]}
            onChange={(value) => onChangeRegion(value)}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Resource group name</label>
          <input
            type={"text"}
            value={resourceGroupName}
            onChange={(event) => onChangeResourceGroupName(event.target.value)}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter your resource group name"}
          />
        </div>
        <div className="mb-2">
          <label className="text-[12px] font-Pb text-MainHeading">Number of worker nodes</label>
          <input
            type={"number"}
            value={workerNodes}
            onChange={(event) => onChangeWorkerNodes(Number(event.target.value))}
            className="block w-full py-1.5 px-2 text-[12px] font-Pr text-MainHeading border-2 border-BorderColor rounded-[8px] placeholder:text-Placeholder focus:outline-none"
            placeholder={"Enter your worker nodes"}
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex justify-center items-center absolute top-0 right-0 lg:bottom-0 left-0 p-3 bg-Overlay">
      <div className="w-full md:w-4/5 bg-MainBg rounded-[12px]">
        <div className="grid grid-cols-12 py-3 md:px-5">
          <div className="md:col-span-5 col-span-12 flex justify-center md:justify-start items-center">
            <p className="text-MenuBarBg font-Psb md:text-[18px] text-[16px] md:mb-0 mb-2 md:text-left text-center">
              {cloudProfileStep.number > 1 ? "Create new cloud profile" : "New Kubernetes Cluster deployment"}
            </p>
          </div>
          <div className="md:col-span-7 col-span-12 flex md:justify-end justify-center">
            <CustomTimeline steps={FORM_STEPS} activeStep={selectedStep} width={88} />
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
              {cloudProfileStep.number === CLOUD_PROFILE_STEPS[0].number ? (
                <div className="grid md:grid-cols-2 gap-4 py-4 px-5">
                  <div className="md:pr-4 lg:w-4/5">
                    <div className="mb-2">
                      <label className="text-[12px] font-Pb text-MainHeading">Select cloud profile</label>
                      <CustomSelect
                        value={cloudProfile}
                        placeholder={"Select cloud profile"}
                        options={cloudProfileOptions}
                        onChange={(value) => {
                          onChangeCloudProfile(value);
                          const selectedCloudProfile = cloudProfiles.filter((cloudProfile) => cloudProfile._id === value.value)[0];
                          setSelectedCloudProfile(selectedCloudProfile);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div
                      onMouseEnter={() => setAddCloudProfileIcon(AddCloudProfileWhiteIcon)}
                      onMouseLeave={() => setAddCloudProfileIcon(AddCloudProfileIcon)}
                      onClick={onClickCreateCloudProfile}
                      className="w-full h-[260px] md:w-[270px] md:h-[270px] lg:w-[350px] lg:h-[350px] ml-auto flex flex-col justify-center items-center p-3 rounded-[20px] bg-MainBg text-MainHeading border-2 border-dashed border-HeadingColor hover:bg-gradient-to-r hover:from-gradientDarkBlue hover:to-gradientLightBlue hover:text-white hover:border-0 hover:custom-box-shadow cursor-pointer"
                    >
                      <img src={addCloudProfileIcon} alt={"add cloud profile icon"} className="w-24 h-24 mb-4" />
                      <p className="text-[14px] font-Psb">Create a new cloud profile</p>
                    </div>
                  </div>
                </div>
              ) : null}
              {cloudProfileStep.number === CLOUD_PROFILE_STEPS[1].number ? (
                <div className="bg-GrayScale py-4 px-5">
                  <p className="text-MainHeading text-[18px] font-Psb text-center mb-2">Select your cloud</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex justify-center items-center">
                      {renderSelectCard({
                        isActive: cloudType === CloudType.AMAZON_WEB_SERVICES,
                        onClick: () => setCloudType(CloudType.AMAZON_WEB_SERVICES),
                        activeImage: AWSLogoWhite,
                        inActiveImage: AWSLogo,
                        alt: "amazon-web-services-logo",
                      })}
                    </div>
                    <div className="flex justify-center items-center">
                      {renderSelectCard({
                        isActive: cloudType === CloudType.MICROSOFT_AZURE,
                        onClick: () => setCloudType(CloudType.MICROSOFT_AZURE),
                        activeImage: AzureLogoWhite,
                        inActiveImage: AzureLogo,
                        alt: "microsoft-azure-logo",
                      })}
                    </div>
                    <div className="flex justify-center items-center">
                      {renderSelectCard({
                        isActive: cloudType === CloudType.GOOGLE_CLOUD_PLATFORM,
                        onClick: () => setCloudType(CloudType.GOOGLE_CLOUD_PLATFORM),
                        activeImage: GCPLogoWhite,
                        inActiveImage: GCPLogo,
                        alt: "google-cloud-platform-logo",
                      })}
                    </div>
                    <div className="flex justify-center items-center">
                      {renderSelectCard({
                        isDisabled: true,
                        isActive: cloudType === CloudType.DIGITAL_OCEAN,
                        onClick: () => setCloudType(CloudType.DIGITAL_OCEAN),
                        activeImage: DigitalOceanLogo,
                        inActiveImage: DigitalOceanLogo,
                        alt: "digital-ocean-logo",
                      })}
                    </div>
                    <div className="flex justify-center items-center">
                      {renderSelectCard({
                        isDisabled: true,
                        isActive: cloudType === CloudType.ORACLE,
                        onClick: () => setCloudType(CloudType.ORACLE),
                        activeImage: OracleLogo,
                        inActiveImage: OracleLogo,
                        alt: "oracle-logo",
                      })}
                    </div>
                    <div className="flex justify-center items-center">
                      {renderSelectCard({
                        isDisabled: true,
                        isActive: cloudType === CloudType.LINODE,
                        onClick: () => setCloudType(CloudType.LINODE),
                        activeImage: LinodeLogo,
                        inActiveImage: LinodeLogo,
                        alt: "linode-logo",
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
              {cloudProfileStep.number === CLOUD_PROFILE_STEPS[2].number ? (
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
              ) : null}
            </>
          ) : null}

          {selectedStep.number === FORM_STEPS[1].number ? (
            <>
              <div className="flex bg-MenuBarBg justify-end items-center py-3 px-5">
                <p className="text-[12px] font-Pr text-white">
                  The estimated cost for your <strong>Micro size</strong> deployment is <strong>$10/month</strong>
                </p>
                <img src={InfoIcon} alt={"info-icon"} className={"w-4 h-4 ml-1"} />
              </div>
              <div className="grid md:grid-cols-2 gap-4 py-4 px-5">
                <div className="md:pr-4 lg:w-4/5">
                  {selectedCloudProfile.cloudType === CloudType.AMAZON_WEB_SERVICES ? renderAWSClusterFields() : null}
                  {selectedCloudProfile.cloudType === CloudType.MICROSOFT_AZURE ? renderAzureClusterFields() : null}
                </div>
                <div>
                  <div className="flex flex-col justify-center items-center p-3 mb-4 rounded-[20px] bg-gradient-to-r from-gradientDarkBlue to-gradientLightBlue custom-box-shadow">
                    <p className="text-[13px] font-Psb text-white">Selected Cloud</p>
                    <img src={cloudTypeImageFormater(selectedCloudProfile.cloudType, true)} alt={"cloud profile logo"} className="w-24 h-24" />
                  </div>
                  <div className="p-3 rounded-[20px] bg-white custom-box-shadow">
                    <p className="text-[13px] font-Psb text-HeadingColor mb-2 ml-2">Node Size</p>
                    <ul className="list-disc text-[12px] font-Pm text-MainHeading ml-6">
                      <li>t3.micro - 1GB</li>
                      <li>2 vCPU</li>
                      <li>10 GB EBS General purpose (SSD)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {selectedStep.number === FORM_STEPS[2].number ? (
            <>
              {summaryAndPaymentStep.number === SUMMARY_AND_PAYMENT_STEP[0].number ? (
                <div className="md:py-4 md:px-5 p-2">
                  <p className="text-MenuBarBg font-Psb text-[18px] md:text-[20px] lg:text-[24px] text-center mb-4">Create Deployment</p>
                  <ul className="md:mx-12 [&>*:nth-child(odd)]:bg-MainBg [&>*:nth-child(even)]:bg-white [&>*:nth-child(odd)]:before:bg-HeadingColor [&>*:nth-child(even)]:before:bg-BorderColor">
                    {renderListItem("Plan", "Dedicated Hosting")}
                    {renderListItem("Cluster Name", name)}
                    {renderListItem("Cloud", cloudTypeNameFormater(selectedCloudProfile.cloudType))}
                    {renderListItem("Cluster Region", region.label)}
                    {renderListItem("Node Size", nodeSize.label)}
                    {renderListItem("EKS Version", version.label)}
                    {renderListItem("Type", "Standalone")}
                  </ul>
                </div>
              ) : null}
              {summaryAndPaymentStep.number === SUMMARY_AND_PAYMENT_STEP[1].number ? <PaymentForm /> : null}
            </>
          ) : null}
        </div>
        <div className="flex md:justify-end justify-center py-4 md:px-4">
          <button disabled={isButtonLoading} onClick={onCancel} className="md:w-24 md:h-8 w-20 h-8 text-white font-Pm text-[12px] bg-CancelBtn rounded-[6px] mx-1">
            Cancel
          </button>
          {cloudProfileStep.number > 1 || selectedStep.number > 1 ? (
            <button disabled={isButtonLoading} onClick={onBack} className="md:w-24 md:h-8 w-20 h-8 text-HeadingColor font-Pm text-[12px] border-HeadingColor border-2 rounded-[6px] mx-1">
              Back
            </button>
          ) : null}
          <button
            disabled={isNextButtonDisabled || isButtonLoading}
            onClick={() => {
              if (cloudProfileStep.number === CLOUD_PROFILE_STEPS.length || summaryAndPaymentStep.number === SUMMARY_AND_PAYMENT_STEP[1].number) {
                return onCreate();
              } else {
                return onNext();
              }
            }}
            className="md:w-24 md:h-8 w-20 h-8 text-white font-Pm text-[12px] bg-HeadingColor rounded-[6px] mx-1 disabled:bg-gradientLightBlue"
          >
            {isButtonLoading ? <LoadingSpinner height="4" width="4" /> : getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentForm;
