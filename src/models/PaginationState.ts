/**
 * Set by the server in X-Pagination response header
 */
export interface ServerPaginationState {
  TotalPages: number;
  TotalItems: number;
  HasNextPage: boolean;
}
