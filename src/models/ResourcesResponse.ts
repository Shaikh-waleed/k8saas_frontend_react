import { ServerPaginationState } from "./PaginationState";
import { Resource } from "./types";

export interface ResourcesResponse {
  pagination: ServerPaginationState;
  resources: Resource[];
}
