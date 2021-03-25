import { Model } from '../Model';
export type extractGeneric<Type> = Type extends Model<infer X> ? X : never;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
