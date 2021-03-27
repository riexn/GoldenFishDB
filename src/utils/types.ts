import { Model } from '../Model';
export type ExtractModelGeneric<Type> = Type extends Model<infer X> ? X : never;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
