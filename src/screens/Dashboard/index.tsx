import React, { useState } from "react";
import PageLayout from "../../components/PageLayout";
import SelectClusterType from "./SelectClusterType";
import SelectYourCloud from "./SelectYourCloud";
import DeploymentForm from "./DeploymentForm";
import DeploymentFormWithCloudProfile from "./DeploymentFormWithCloudProfile";
import { ClusterType, CloudType } from "./ClusterEnum";

enum STEPS {
  SELECT_CLUSTER = "SELECT_CLUSTER",
  SELECT_YOUR_CLOUD = "SELECT_YOUR_CLOUD",
  DEPLOYMENT_FORM = "DEPLOYMENT_FORM",
  DEPLOYMENT_FORM_WITH_CLOUD_PROFILE = "DEPLOYMENT_FORM_WITH_CLOUD_PROFILE",
}

const Dashboard: React.FC = () => {
  const [activeStep, setActiveStep] = useState<STEPS>(STEPS.SELECT_CLUSTER);

  const [clusterType, setClusterType] = useState<ClusterType>(null);
  const [cloudType, setCloudType] = useState<CloudType>(null);

  const [cloudProfile, setCloudProfile] = useState(null);

  const [name, setName] = useState("");
  const [nodeSize, setNodeSize] = useState(null);
  const [version, setVersion] = useState(null);
  const [region, setRegion] = useState(null);
  const [resourceGroupName, setResourceGroupName] = useState("");
  const [workerNodes, setWorkerNodes] = useState(null);

  const onClickClusterType = (clusterType: ClusterType) => {
    setClusterType(clusterType);
    if (clusterType === ClusterType.DEDICATED) {
      setActiveStep(STEPS.SELECT_YOUR_CLOUD);
    } else if (clusterType === ClusterType.BRING_YOUR_OWN_CLOUD) {
      setActiveStep(STEPS.DEPLOYMENT_FORM_WITH_CLOUD_PROFILE);
    }
  };

  const onClickCloudType = (clusterType: CloudType) => {
    setCloudType(clusterType);
    setActiveStep(STEPS.DEPLOYMENT_FORM);
  };

  const onCancel = () => {
    setActiveStep(STEPS.SELECT_CLUSTER);
    setClusterType(null);
    setCloudType(null);
    setCloudProfile(null);
    setName("");
    setNodeSize("");
    setVersion("");
    setRegion("");
    setResourceGroupName("");
    setWorkerNodes("");
  };

  return (
    <PageLayout heading={"Welcome to K8saas!!"} subheading={"Select your interest to create your first deployment"}>
      {activeStep === STEPS.SELECT_CLUSTER ? <SelectClusterType onClick={(clusterType) => onClickClusterType(clusterType)} /> : null}
      {activeStep === STEPS.SELECT_YOUR_CLOUD ? <SelectYourCloud buttonText={"Create Cluster"} onClick={(cloudType) => onClickCloudType(cloudType)} /> : null}
      {activeStep === STEPS.DEPLOYMENT_FORM ? (
        <DeploymentForm
          clusterType={clusterType}
          cloudType={cloudType}
          name={name}
          onChangeName={setName}
          nodeSize={nodeSize}
          onChangeNodeSize={setNodeSize}
          version={version}
          onChangeVersion={setVersion}
          region={region}
          onChangeRegion={setRegion}
          resourceGroupName={resourceGroupName}
          onChangeResourceGroupName={setResourceGroupName}
          workerNodes={workerNodes}
          onChangeWorkerNodes={setWorkerNodes}
          onClickCancel={onCancel}
        />
      ) : null}
      {activeStep === STEPS.DEPLOYMENT_FORM_WITH_CLOUD_PROFILE ? (
        <DeploymentFormWithCloudProfile
          clusterType={clusterType}
          cloudProfile={cloudProfile}
          onChangeCloudProfile={setCloudProfile}
          name={name}
          onChangeName={setName}
          nodeSize={nodeSize}
          onChangeNodeSize={setNodeSize}
          version={version}
          onChangeVersion={setVersion}
          region={region}
          onChangeRegion={setRegion}
          resourceGroupName={resourceGroupName}
          onChangeResourceGroupName={setResourceGroupName}
          workerNodes={workerNodes}
          onChangeWorkerNodes={setWorkerNodes}
          onClickCancel={onCancel}
        />
      ) : null}
    </PageLayout>
  );
};

export default Dashboard;
