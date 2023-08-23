export interface Cluster {
  userId?: string;
  cloudId?: string;
  clusterType: number;
  cloudType: number;
  name: string;
  version: string;
  region: string;
  nodeSize?: string;
  resourceGroupName?: string;
  workerNodes?: number;
  _id?: string;
}
