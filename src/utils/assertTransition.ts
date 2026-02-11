import { PROPERTY_TRANSITIONS, PropertyLifecycleStatus } from "../config/property.lifecycle.js";
import { isLifecycleStatus } from "../utils/isLifecycleStatus.js";
import { AppError } from "./error.js";

export const assertTransition = (
  from: string | null | undefined,
  to: PropertyLifecycleStatus
) => {

  if (!from) {
    throw new AppError("Invalid or unsupported property status", 400);
  }

  if (!isLifecycleStatus(from)) {
    throw new AppError(`Invalid property status: ${from}`, 400);
  }

  const allowed = PROPERTY_TRANSITIONS[from];

  if (!allowed.includes(to)) {
    throw new AppError(
      `Invalid property status transition: ${from} → ${to}`,
      400
    );
  }
};
