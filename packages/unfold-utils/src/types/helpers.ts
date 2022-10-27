// export const makeEntryUrl = (entryId: string): string => {
//   return `unfold://entry/${entryId}`;
// };

// export const isUrlEntry = (url: string): boolean => {
//   return url.match(/^unfold:\/\/entry\/([^\/]+)$/) !== null;
// };

// export const getEntryIdFromUrl = (url: string): string => {
//   const matched = url.match(/^unfold:\/\/entry\/([^\/]+)$/);
//   if (!matched) {
//     throw Error('Tried to parse wrongly formatted url.');
//   }
//   return matched[1];
// };

export type Meta<T extends PropertyKey, P extends Record<string, unknown> = { label: string; desc?: string }> = {
  [key in T]: P;
};

// export const validateShape = <S, O extends S >(meta: O): O => {
//   return meta;
// };

export type ArrayOf<T> = T extends Array<infer U> ? U : never;
export type ValuesOf<T> = T extends Record<any, infer V> ? V : never;
export type KeysOf<T> = T extends Record<infer K, any> ? K : never;
