import { Cluster } from "./Cluster";

export interface CloudProfile {
  userId?: string;
  cloudType: number;
  name: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region: string;
  databaseType?: string;
  resourceGroupName?: string;
  _id?: string;
  clusters?: Cluster[];
}
