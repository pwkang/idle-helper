export type ValuesOf<T extends Record<string, unknown>> = T[keyof T];
