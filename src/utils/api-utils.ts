import { ResourceTypeEnum } from "../models/ResourceTypeEnum";
import { MapOf, Resource, ResourceId } from "../models/types";
import { fetchError } from "../models/error";

export const getStandardFetchHeaders = (authToken: string): MapOf<string> => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  auth_token: `${authToken}`,
  "request-origin": "Web",
});

export async function genericFetchResponseHandler(res) {
  let jsonData;

  try {
    jsonData = await res.json();
  } catch (err) {
    /* no-op */
  }

  if (jsonData && jsonData.response && !jsonData.response.success) {
    throw new fetchError(jsonData.response.error);
  } else {
    if (res.ok) {
      // assume successful responses will always have a JSON body
      return jsonData.data ?? jsonData;
    } else {
      if (jsonData) {
        throw new fetchError(jsonData.title ? jsonData.title : jsonData);
      } else {
        throw new fetchError(res.statusText);
      }
    }
  }
}

/**
 * Gets conventional id name for C# model.
 * Ex. id name for MachineLocation is machineLocationId
 * Also handles exceptions to the naming convention
 */
export const getIdNameForResource = (resourceType: ResourceTypeEnum): string => {
  switch (resourceType) {
    // exception to naming convention
    case ResourceTypeEnum.Login:
      return "userId";

    default:
      return `_id`;
  }
};

/**
 * Gets the id value for any resource-crud
 * @param resourceType
 * @param resource
 */
export const getIdForResource = (resourceType: ResourceTypeEnum, resource: Partial<Resource>): ResourceId => {
  const idName = getIdNameForResource(resourceType);
  const idValue = resource[idName];
  if (!idValue) throw new Error(`Can't get id for resource. ${resourceType} is missing ${idName}`);
  return idValue;
};
