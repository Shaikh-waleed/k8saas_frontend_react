import React, { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import CustomTable from "../../components/CustomTable";
import { ListTableDataFactory } from "../../utils/ListTableDataFactory";
import { ResourceTypeEnum } from "../../models/ResourceTypeEnum";
import { ListTableData } from "../../models/ListTableData";
import { getResource } from "../../api";
import { CloudProfile } from "../Dashboard/model/CloudProfile";
import { CloudType } from "../Dashboard/ClusterEnum";
import SelectYourCloud from "../Dashboard/SelectYourCloud";
import { useAuthContext } from "../../context/AuthContext";
import CloudProfileForm from "./CloudProfileForm";

enum STEPS {
  CLOUD_PROFILE_LIST = "CLOUD_PROFILE_LIST",
  SELECT_YOUR_CLOUD = "SELECT_YOUR_CLOUD",
  CLOUD_PROFILE_FORM = "CLOUD_PROFILE_FORM",
}

const CloudProfiles: React.FC = () => {
  const [activeStep, setActiveStep] = useState<STEPS>(STEPS.CLOUD_PROFILE_LIST);
  const { accessToken } = useAuthContext();
  const [cloudProfiles, setCloudProfiles] = useState<ListTableData>();
  const [cloudType, setCloudType] = useState<CloudType>(null);

  const onClickCloudType = (clusterType: CloudType) => {
    setCloudType(clusterType);
    setActiveStep(STEPS.CLOUD_PROFILE_FORM);
  };

  const onClickCancel = () => {
    setCloudType(null);
    setActiveStep(STEPS.CLOUD_PROFILE_LIST);
  };

  const getCloudProfileByUser = async () => {
    try {
      const cloudProfileByUser = await getResource<CloudProfile[]>(accessToken, ResourceTypeEnum.CloudProfileByUser);
      const tableData = ListTableDataFactory.createTableData(ResourceTypeEnum.CloudProfileByUser, cloudProfileByUser);
      setCloudProfiles(tableData);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getCloudProfileByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageLayout heading={"Cloud Profiles"} subheading={"You can add or manage your cloud profiles"}>
      {activeStep === STEPS.CLOUD_PROFILE_LIST && cloudProfiles ? (
        <CustomTable tableData={cloudProfiles} isCollapsible hasActionBtn headerBtnText={"Add cloud profile"} onClickHeaderBtn={() => setActiveStep(STEPS.SELECT_YOUR_CLOUD)} />
      ) : null}
      {activeStep === STEPS.SELECT_YOUR_CLOUD ? <SelectYourCloud buttonText={"Next"} onClick={(cloudType) => onClickCloudType(cloudType)} /> : null}
      {activeStep === STEPS.CLOUD_PROFILE_FORM ? <CloudProfileForm cloudType={cloudType} onClickCancel={onClickCancel} /> : null}
    </PageLayout>
  );
};

export default CloudProfiles;
