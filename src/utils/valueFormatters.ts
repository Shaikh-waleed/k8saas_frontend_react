import { AWSLogoWhite, AWSLogo, AzureLogoWhite, AzureLogo } from "../theme/svgs";
import { GCPLogoWhite, GCPLogo } from "../theme/images";
import { CloudType, ClusterType } from "../screens/Dashboard/ClusterEnum";

export const cloudTypeImageFormater = (cloudType: CloudType, isWhite: boolean = false) => {
  switch (cloudType) {
    case CloudType.AMAZON_WEB_SERVICES:
      return isWhite ? AWSLogoWhite : AWSLogo;
    case CloudType.MICROSOFT_AZURE:
      return isWhite ? AzureLogoWhite : AzureLogo;
    case CloudType.GOOGLE_CLOUD_PLATFORM:
      return isWhite ? GCPLogoWhite : GCPLogo;
  }
};

export const cloudTypeNameFormater = (cloudType: CloudType) => {
  switch (cloudType) {
    case CloudType.AMAZON_WEB_SERVICES:
      return "AWS";
    case CloudType.MICROSOFT_AZURE:
      return "Azure";
    case CloudType.GOOGLE_CLOUD_PLATFORM:
      return "GCP";
  }
};

export const clusterTypeNameFormater = (clusterType: ClusterType) => {
  switch (clusterType) {
    case ClusterType.DEDICATED:
      return "Dedicated Hosting";
    case ClusterType.BRING_YOUR_OWN_CLOUD:
      return "Bring your own cloud";
  }
};

export const defaultEmptyValueLabel = "-";

export const defaultFormatter = (value) => {
  const isEmpty = value === null || value === undefined || value === "";
  return isEmpty ? defaultEmptyValueLabel : value;
};
