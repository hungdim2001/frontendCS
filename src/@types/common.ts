export type Anonymous = Record<string | number, any>;

export type ActionMap<Payload extends { [index: string]: any }> = {
  [Key in keyof Payload]: Payload[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: Payload[Key];
      };
};

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

export type SnakeToCamelCaseNested<T> = T extends object
  ? T extends Array<any>
    ? T
    : {
        [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[K]>;
      }
  : T;

export type OrNull<T = {}> = T extends Array<infer P>
  ? Array<OrNull<P>>
  : T extends object
  ? {
      [Key in keyof T]: OrNull<T[Key]> | null;
    }
  : T | null;

export type PaginatedData<T> = {
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
  content: Array<OrNull<T>>;
};
