import { ResourceId } from "./types";
import { ResourceFieldConfig } from "./ResourceFieldConfig";

interface Row {
  resourceId: ResourceId;
  data: (string | number | boolean | object)[];
  detailData?: ListTableData;
}

export interface ListTableData {
  columnHeaders: ResourceFieldConfig[];
  rows: Row[];
}
