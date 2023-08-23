import React, { useState, useEffect } from "react";
import CustomSelect from "../../components/CustomSelect";
import CustomTimeline from "../../components/CustomTimeline";
import ToolTip from "../../components/ToolTip";
import { InfoIcon } from "../../theme/svgs";
import { cloudTypeImageFormater, cloudTypeNameFormater, clusterTypeNameFormater } from "../../utils/valueFormatters";
import { CloudType, ClusterType } from "./ClusterEnum";
import { createResource } from "../../api";
import { ResourceTypeEnum } from "../../models/ResourceTypeEnum";
import { Cluster } from "./model/Cluster";
import { useAuthContext } from "../../context/AuthContext";
import { LabelValue } from "../../models/LabelValue";
import { ResourceId } from "../../models/types";
import LoadingSpinner from "../../components/LoadingSpinner";

interface Props {
  clusterType: ClusterType;
  cloudType: CloudType;
  name: string;
  nodeSize: LabelValue<string>;
  version: LabelValue<string>;
  region: LabelValue<string>;
  resourceGroupName: string;
  workerNodes: number;
  onChangeName: (name: string) => void;
  onChangeNodeSize: (nodeSize: LabelValue<ResourceId>) => void;
  onChangeVersion: (version: LabelValue<ResourceId>) => void;
  onChangeRegion: (region: LabelValue<ResourceId>) => void;
  onChangeResourceGroupName: (resourceGroupName: string) => void;
  onChangeWorkerNodes: (workerNodes: number) => void;
  onClickCancel: () => void;
}

const FORM_STEPS = [
  { name: "Details", number: 1 },
  { name: "Summary", number: 2 },
];

const DeploymentForm: React.FC<Props> = ({
  clusterType,
  cloudType,
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
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const onCancel = () => {
    setSelectedStep(FORM_STEPS[0]);
    setIsNextButtonDisabled(true);
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
      const payload = createPayload();
      await createResource<Cluster>(accessToken, ResourceTypeEnum.Cluster, payload);
      alert("Cluster sucessfully created.");
      onCancel();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const createPayload = () => {
    switch (cloudType) {
      case CloudType.AMAZON_WEB_SERVICES:
        return { clusterType, cloudType, name, nodeSize: nodeSize.value, version: version.value, region: region.value };

      case CloudType.MICROSOFT_AZURE:
        return { clusterType, cloudType, name, version: version.value, region: region.value, resourceGroupName, workerNodes };

      default:
        break;
    }
  };

  useEffect(() => {
    if (cloudType === CloudType.AMAZON_WEB_SERVICES && name && nodeSize && version && region) {
      setIsNextButtonDisabled(false);
    } else if (cloudType === CloudType.MICROSOFT_AZURE && name && version && region && resourceGroupName && workerNodes) {
      setIsNextButtonDisabled(false);
    } else {
      setIsNextButtonDisabled(true);
    }
  }, [cloudType, name, nodeSize, version, region, resourceGroupName, workerNodes]);

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

  const renderAWSFields = () => {
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

  const renderAzureFields = () => {
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
    <div className="flex justify-center items-center absolute top-0 right-0 md:bottom-0 left-0 p-3 bg-Overlay">
      <div className="w-full md:w-4/5 lg:w-2/3 bg-MainBg rounded-[12px]">
        <div className="grid grid-cols-12 py-3 md:px-5 px-2">
          <div className="md:col-span-7 col-span-12 flex justify-center md:justify-start items-center">
            <p className="text-MenuBarBg font-Psb md:text-[18px] text-[16px] md:mb-0 mb-2 md:text-left text-center">New Kubernetes Cluster Deployment</p>
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
                <div className="md:pr-4 lg:w-4/5">
                  {cloudType === CloudType.AMAZON_WEB_SERVICES ? renderAWSFields() : null}
                  {cloudType === CloudType.MICROSOFT_AZURE ? renderAzureFields() : null}
                </div>
                <div>
                  <div className="flex flex-col justify-center items-center p-3 mb-4 rounded-[20px] bg-gradient-to-r from-gradientDarkBlue to-gradientLightBlue custom-box-shadow">
                    <p className="text-[13px] font-Psb text-white">Selected Cloud</p>
                    <img src={cloudTypeImageFormater(cloudType, true)} alt={"aws logo"} className="w-24 h-24" />
                  </div>
                  <div className="p-3 rounded-[20px] bg-white custom-box-shadow">
                    <div className="flex items-center mb-2">
                      <span className="text-[13px] font-Psb text-HeadingColor mx-2 inline-block">Node Size</span>
                      <ToolTip text={"In trial mode only standalone micro instance is allowed"} />
                    </div>
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
          {selectedStep.number === FORM_STEPS[1].number ? (
            <div className="md:py-4 md:px-5 p-2">
              <p className="text-MenuBarBg font-Psb text-[18px] md:text-[20px] lg:text-[24px] text-center mb-4">Create Deployment</p>
              <ul className="md:mx-12 [&>*:nth-child(odd)]:bg-MainBg [&>*:nth-child(even)]:bg-white [&>*:nth-child(odd)]:before:bg-HeadingColor [&>*:nth-child(even)]:before:bg-BorderColor">
                {renderListItem("Plan", clusterTypeNameFormater(clusterType))}
                {renderListItem("Cluster Name", name)}
                {renderListItem("Cloud", cloudTypeNameFormater(cloudType))}
                {renderListItem("Cluster Region", region.label)}
                {nodeSize ? renderListItem("Node Size", nodeSize.label) : null}
                {renderListItem("EKS Version", version.label)}
                {resourceGroupName ? renderListItem("Resource Group Name", resourceGroupName) : null}
                {workerNodes ? renderListItem("No. of Worker Nodes", workerNodes) : null}
                {renderListItem("Type", "Standalone")}
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

export default DeploymentForm;
