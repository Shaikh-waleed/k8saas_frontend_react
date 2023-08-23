import queryString from "query-string";
import { BACKEND_API_BASE_URL } from "./config";
import { ResourceTypeEnum } from "./models/ResourceTypeEnum";
import { MapOf, Resource, ResourceId } from "./models/types";
import { genericFetchResponseHandler, getIdForResource, getStandardFetchHeaders } from "./utils/api-utils";
import { ServerPaginationState } from "./models/PaginationState";
import { ResourcesResponse } from "./models/ResourcesResponse";

const resourcePathMap: MapOf<string> = {
  [ResourceTypeEnum.Login]: "/login",
  [ResourceTypeEnum.SignUp]: "/signup",
  [ResourceTypeEnum.GetProfile]: "/getProfile",
  [ResourceTypeEnum.GetPaymentDetails]: "/getpaymentdetails",
  [ResourceTypeEnum.GetPaymentVerification]: "/getpaymentverification",
  [ResourceTypeEnum.Cluster]: "/Cluster",
  [ResourceTypeEnum.CloudProfile]: "/CloudProfile",
  [ResourceTypeEnum.CloudProfileByUser]: "/CloudProfile/ByUser",
};

export const createResource = async <T>(token: string, resourceType: ResourceTypeEnum, resource: Partial<T>): Promise<T> => {
  const response = await fetch(`${BACKEND_API_BASE_URL}${resourcePathMap[resourceType]}`, {
    headers: getStandardFetchHeaders(token),
    method: "POST",
    body: JSON.stringify(resource),
  });

  return await genericFetchResponseHandler(response);
};

export const listResources = async (token: string, resourceType: ResourceTypeEnum, urlParams?: MapOf<any>): Promise<ResourcesResponse> => {
  const urlParamsEncoded = urlParams ? queryString.stringify(urlParams, { skipNull: true }) : "";
  const response = await fetch(`${BACKEND_API_BASE_URL}${resourcePathMap[resourceType]}?${urlParamsEncoded}`, {
    headers: getStandardFetchHeaders(token),
    method: "GET",
  });

  const resources: Resource[] = await genericFetchResponseHandler(response);
  const pagination: ServerPaginationState = JSON.parse(response.headers.get("X-Pagination"));

  return {
    pagination,
    resources,
  };
};

export const getResource = async <T>(token: string, resourceType: ResourceTypeEnum, urlParams?: MapOf<any>): Promise<T> => {
  const urlParamsEncoded = urlParams ? queryString.stringify(urlParams, { skipNull: true }) : "";
  const response = await fetch(`${BACKEND_API_BASE_URL}${resourcePathMap[resourceType]}?${urlParamsEncoded}`, {
    headers: getStandardFetchHeaders(token),
    method: "GET",
  });

  return await genericFetchResponseHandler(response);
};

export const getResourceById = async <T>(token: string, resourceType: ResourceTypeEnum, id: ResourceId, urlParams?: MapOf<any>): Promise<T> => {
  const urlParamsEncoded = urlParams ? queryString.stringify(urlParams, { skipNull: true }) : "";
  const response = await fetch(`${BACKEND_API_BASE_URL}${resourcePathMap[resourceType]}/${id}?${urlParamsEncoded}`, {
    headers: getStandardFetchHeaders(token),
    method: "GET",
  });

  return await genericFetchResponseHandler(response);
};

export const patchResourceWithId = async <T>(token: string, resourceType: ResourceTypeEnum, resource: Partial<T>): Promise<T> => {
  const resourceId = getIdForResource(resourceType, resource);

  const response = await fetch(`${BACKEND_API_BASE_URL}${resourcePathMap[resourceType]}/${resourceId}`, {
    headers: getStandardFetchHeaders(token),
    method: "PATCH",
    body: JSON.stringify(resource),
  });

  return await genericFetchResponseHandler(response);
};

export const patchResourceWithOutId = async <T>(token: string, resourceType: ResourceTypeEnum, resource: Partial<T>): Promise<T> => {
  const response = await fetch(`${BACKEND_API_BASE_URL}${resourcePathMap[resourceType]}`, {
    headers: getStandardFetchHeaders(token),
    method: "PATCH",
    body: JSON.stringify(resource),
  });

  return await genericFetchResponseHandler(response);
};

export const putResourceWithId = async <T>(token: string, resourceType: ResourceTypeEnum, resource: Partial<T>, resourceId: ResourceId): Promise<T> => {
  const response = await fetch(`${BACKEND_API_BASE_URL}${resourcePathMap[resourceType]}/${resourceId}`, {
    headers: getStandardFetchHeaders(token),
    method: "PUT",
    body: JSON.stringify(resource),
  });

  return await genericFetchResponseHandler(response);
};

export const putResourceWithOutId = async <T>(token: string, resourceType: ResourceTypeEnum, resource: Partial<T>): Promise<T> => {
  const response = await fetch(`${BACKEND_API_BASE_URL}${resourcePathMap[resourceType]}`, {
    headers: getStandardFetchHeaders(token),
    method: "PUT",
    body: JSON.stringify(resource),
  });

  return await genericFetchResponseHandler(response);
};

export const deleteResource = async <T>(token: string, resourceType: ResourceTypeEnum, id: ResourceId): Promise<T> => {
  const response = await fetch(`${BACKEND_API_BASE_URL}${resourcePathMap[resourceType]}/${id}`, {
    headers: getStandardFetchHeaders(token),
    method: "DELETE",
  });

  return await genericFetchResponseHandler(response);
};
