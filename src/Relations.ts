import { Model } from './Model';
import { HasManyReturn, HasOneReturn, BaseModel } from './types';

export const HasMany = <T extends BaseModel>(
  model: Model<T>
): HasManyReturn<T> => {
  return {
    type: 'HasMany',
    model: model,
  };
};

export const HasOne = <T extends BaseModel>(
  model: Model<T>
): HasOneReturn<T> => {
  return {
    type: 'HasOne',
    model: model,
  };
};
