import React, { useState } from "react";
import SelectCardWithAnimation from "../../components/SelectCardWithAnimation";
import { CreateCluster, CreateClusterSelected, BringYourOwnCloud, BringYourOwnCloudSelected } from "../../theme/svgs";
import { ClusterType } from "./ClusterEnum";

interface Props {
  onClick: (clusterType: ClusterType) => void;
}

const SelectClusterType: React.FC<Props> = ({ onClick }) => {
  const [clusterType, setClusterType] = useState<ClusterType>(0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 py-3 lg:px-3 md:gap-5">
        <div className="flex justify-center items-center">
          <SelectCardWithAnimation
            isActive={clusterType === ClusterType.DEDICATED}
            onClick={() => setClusterType(ClusterType.DEDICATED)}
            hasTag
            tag={"Test"}
            activeImage={CreateClusterSelected}
            inActiveImage={CreateCluster}
            title={"Create cluster"}
            description={`Try to create a Provision for a temporary\ncluster for a single day trial.`}
            alt={"create-cluster"}
          />
        </div>
        <div className="flex justify-center items-center">
          <SelectCardWithAnimation
            isActive={clusterType === ClusterType.BRING_YOUR_OWN_CLOUD}
            onClick={() => setClusterType(ClusterType.BRING_YOUR_OWN_CLOUD)}
            activeImage={BringYourOwnCloudSelected}
            inActiveImage={BringYourOwnCloud}
            title={"Create cluster"}
            description={"Set up a cluster for distributed computing by\ncreating different cloud profiles."}
            alt={"bring-your-own-cloud"}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => onClick(clusterType)}
          disabled={!clusterType}
          className="w-32 text-white font-Pm text-[14px] bg-gradientDarkBlue py-2 rounded-[6px] self-center focus:outline-none disabled:opacity-60"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default SelectClusterType;
