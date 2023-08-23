import { User } from "../context/@types.auth";
import { CloudProfile } from "../screens/Dashboard/model/CloudProfile";

// These are dummy interface for API structure we will import the orignal after API integration
/**
 * ex. '2008-09-15'
 */
export type ISO8601Date = string;

export type MapOf<T> = { [key: string]: T };

/**
 * This is a TypeScript union type and supports keeping the codebase as DRY as possible
 */
export type Resource = User | CloudProfile;

/**
 * it's only a string type for Player due to a back-end inconsistency
 */
export type ResourceId = string | number;
