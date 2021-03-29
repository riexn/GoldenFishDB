import { Model } from './Model';

export interface BaseModel {
  id: string;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ExtractModelGeneric<Type> = Type extends Model<infer X> ? X : never;

export interface HasManyReturn<T extends BaseModel> {
  type: 'HasMany';
  model: Model<T>;
}
export interface HasOneReturn<T extends BaseModel> {
  type: 'HasOne';
  model: Model<T>;
}

export type Relationify<
  M extends Record<keyof M, Model<any>>,
  R extends Partial<Record<keyof M, any>>
> = {
  [K in keyof M]: M[K] extends Model<infer P>
    ? Model<
        Extract<
          P & AddProps<K, P, R[K]> extends infer O
            ? { [K in keyof O]: O[K] }
            : never,
          BaseModel
        >
      >
    : never;
};

export type AddProps<K extends PropertyKey, P, R> = {
  [L in keyof R as R[L] extends HasOneReturn<any>
    ? L
    : never]: R[L] extends HasOneReturn<infer M> ? M : never;
} &
  {
    [L in keyof R as R[L] extends HasOneReturn<any>
      ? // stays as is
        `${Extract<L, string>}Id`
      : never]: R[L] extends HasOneReturn<infer M>
      ? Extract<M, BaseModel>['id']
      : never;
  } &
  // has many property
  {
    [L in keyof R as R[L] extends HasManyReturn<any>
      ? // there used to be an added s at the end here, but not it's removed
        `${Extract<L, string>}`
      : never]: R[L] extends HasManyReturn<infer M> ? M[] : never;
  } &
  // has many ids
  {
    [L in keyof R as R[L] extends HasManyReturn<any>
      ? `${Extract<L, string>}Ids`
      : never]: R[L] extends HasManyReturn<infer M>
      ? Extract<M, BaseModel>['id'][]
      : never;
  };
