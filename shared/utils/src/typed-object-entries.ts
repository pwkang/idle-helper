export const typedObjectEntries = <T extends Record<string, any>>(obj: T) =>
  Object.entries(obj) as [keyof T, T[keyof T]][];
