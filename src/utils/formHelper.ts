import { LabelValue } from "../models/LabelValue";
import { ResourceTypeEnum } from "../models/ResourceTypeEnum";
import { Resource, ResourceId } from "../models/types";

import { getIdNameForResource } from "./api-utils";

type labelFieldNameFn = (r: Resource) => string;

export const getResourcesAsSelectOptions = async (resources: Resource[], resourceType: ResourceTypeEnum, labelFieldName: string | labelFieldNameFn): Promise<LabelValue<ResourceId>[]> => {
  const idFieldName = getIdNameForResource(resourceType);
  return resources.map((r) => ({ label: typeof labelFieldName === "string" ? r[labelFieldName] : labelFieldName(r), value: r[idFieldName] }));
};

export const getResourcesFromArrayOfStringAsSelectOptions = async (resources): Promise<LabelValue<ResourceId>[]> => {
  return resources.map((r) => ({ label: `${r}`, value: `${r}` }));
};

export const getEnumAsSelectOptions = (anEnum): LabelValue<any>[] =>
  Object.keys(anEnum)
    .filter((k) => isNaN(Number(k)))
    .map((key) => ({
      label: key,
      value: anEnum[key],
    }));

export const getKeyForEnumValue = (sourceEnum, value: number | string): string => (value === 0 ? "Unknown foo" : getEnumAsSelectOptions(sourceEnum).find((o) => o.value === value).label);
