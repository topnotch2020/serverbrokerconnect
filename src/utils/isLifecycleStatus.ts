import { PropertyLifecycleStatus } from "../config/property.lifecycle.js";
import { PropertyStatus } from "../enums/property.enums.js";
;

const LIFECYCLE_STATUSES: readonly PropertyLifecycleStatus[] = [
  PropertyStatus.DRAFTED,
  PropertyStatus.UNVERIFIED,
  PropertyStatus.VERIFIED,
  PropertyStatus.EXPIRED,
  PropertyStatus.SOLD,
  PropertyStatus.DELETED,
];

export const isLifecycleStatus = (
  status: string
): status is PropertyLifecycleStatus => {
  return LIFECYCLE_STATUSES.includes(status as PropertyLifecycleStatus);
};
