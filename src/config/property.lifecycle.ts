import { PropertyStatus } from "../enums/property.enums.js";

export type PropertyLifecycleStatus =
  | PropertyStatus.DRAFTED
  | PropertyStatus.UNVERIFIED
  | PropertyStatus.VERIFIED
  | PropertyStatus.EXPIRED
  | PropertyStatus.SOLD
  | PropertyStatus.DELETED;

export const PROPERTY_TRANSITIONS: Record<
  PropertyLifecycleStatus,
  PropertyLifecycleStatus[]
> = {
  DRAFTED: [PropertyStatus.UNVERIFIED],
  UNVERIFIED: [PropertyStatus.VERIFIED],
  VERIFIED: [PropertyStatus.EXPIRED, PropertyStatus.SOLD],
  EXPIRED: [],
  SOLD: [],
  DELETED: [],
};

export const PROPERTY_STEPS = {
  DRAFTED: {
    required: ["title", "description"],
  },
  UNVERIFIED: {
    required: ["price", "location"],
  },
  VERIFIED: {
    required: ["documents"],
  },
  EXPIRED: {
    required: [],
  },
  SOLD: {
    required: [],
  },
  DELETED: {
    required: [],
  },
};
