import { ResourceTypeEnum } from "../models/ResourceTypeEnum";
import { ListTableData } from "../models/ListTableData";
import { Resource } from "../models/types";
import { cloudTypeImageFormater } from "../utils/valueFormatters";
import { cloudProfilesConfigList } from "../screens/CloudProfiles/cloudProfilesConfig";
import { clusterConfigList } from "../screens/CloudProfiles/clusterConfig";
import { CloudProfile } from "../screens/Dashboard/model/CloudProfile";
import { Cluster } from "../screens/Dashboard/model/Cluster";

export class ListTableDataFactory {
  public static createTableData(resourceType: ResourceTypeEnum, resources: Resource[]): ListTableData {
    switch (resourceType) {
      case ResourceTypeEnum.CloudProfileByUser: {
        const tableData: ListTableData = {
          columnHeaders: cloudProfilesConfigList,
          rows: (resources as CloudProfile[]).map((resource) => {
            const collapsibleTableViewData = {
              columnHeaders: clusterConfigList,
              rows: resource.clusters
                ? (resource.clusters as Cluster[])?.map((resource) => {
                    return {
                      resourceId: resource._id,
                      data: [resource._id, resource.name, resource.version, resource.region, resource.nodeSize],
                    };
                  })
                : [],
            };

            const cloudTypeImage = cloudTypeImageFormater(resource.cloudType);

            return {
              resourceId: resource._id,
              data: [resource._id, resource.name, resource.clusters.length, resource.region, cloudTypeImage],
              detailData: collapsibleTableViewData,
            };
          }),
        };

        checkColumnCount(tableData, resourceType);

        return tableData;
      }
    }
  }
}

/**
 * Simple check to make sure number of header columns matches
 * number of columns for data rows
 *
 * @param tableData
 * @param resourceType
 */
const checkColumnCount = (tableData: ListTableData, resourceType: ResourceTypeEnum): void => {
  const totalHeaders = tableData.columnHeaders.length;
  const isValid = tableData.rows.every((row) => row.data.length === totalHeaders);
  if (!isValid) {
    throw new Error(`${resourceType} table view error: Number of column headers must match number of columns in each row`);
  }
};
