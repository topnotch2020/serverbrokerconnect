export const checkMissingFields = (data: any, fields: string[]) => {
  const missing: string[] = [];

  for (const field of fields) {
    const value = field.split(".").reduce((obj, key) => obj?.[key], data);
    if (value === undefined || value === null) {
      missing.push(field);
    }
  }

  return missing;
};
