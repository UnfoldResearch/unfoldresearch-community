export type ArrayOf<T> = T extends Array<infer U> ? U : never;
export type ValuesOf<T> = T extends Record<any, infer V> ? V : never;
export type KeysOf<T> = T extends Record<infer K, any> ? K : never;
export type NonEmptyArray<T> = [T, ...T[]];
