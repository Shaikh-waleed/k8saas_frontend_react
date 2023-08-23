import { defaultFormatter } from "../../utils/valueFormatters";
import { ResourceFieldConfig } from "../../models/ResourceFieldConfig";

export const cloudProfilesConfigList: ResourceFieldConfig[] = [
  {
    key: "id",
    label: "ID",
    valueFormatter: defaultFormatter,
  },
  {
    key: "profileName",
    label: "Profile Name",
    valueFormatter: defaultFormatter,
  },
  {
    key: "cluster",
    label: "Cluster",
    valueFormatter: defaultFormatter,
  },
  {
    key: "region",
    label: "Region",
    valueFormatter: defaultFormatter,
  },
  {
    key: "cloudType",
    label: "Cloud",
    valueFormatter: defaultFormatter,
    isImage: true,
  },
];
