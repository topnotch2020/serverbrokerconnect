import { PROPERTY_STEPS } from "../config/property.lifecycle.js";
import { checkMissingFields } from "./checkMissingFields.js";

export const computeProgress = (property: any) => {
  const progress: Record<string, any> = {};

  for (const step of Object.keys(PROPERTY_STEPS)) {
    const missing = checkMissingFields(
      property,
      PROPERTY_STEPS[step].required
    );

    progress[step] = {
      completed: missing.length === 0,
      missingFields: missing,
    };
  }

  return progress;
};
