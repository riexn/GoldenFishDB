import { Model, ModelBase } from './Model';
import { extractGeneric, PartialBy } from './utils';

// export const BelongsTo = <T extends ModelBase>(
//   // the model it belongs to
//   model: Model<T>
// ) => {};

export const BelongsTo = <T extends ModelBase>(model: Model<T>) => {};

export const hasMany = () => {};

export class Database<
  T extends ModelBase,
  ModelsIndex extends {
    [key: string]: Model<T>;
  },
  ModelsIndexWithRelations extends {
    [key: string]: Model<T & { potato: any }>;
  },
  ModelsTypeKeys extends keyof ModelsIndex,
  RelationsProps extends { [key: string]: any },
  Relations extends Partial<{ [key in ModelsTypeKeys]: RelationsProps }>,
  RelationsKeys extends keyof Relations,
  ModelsRelations extends Relations,
  ModelsRelationsKeys extends keyof ModelsRelations,
  ModelsSeeds extends {
    [key in ModelsTypeKeys]: PartialBy<
      extractGeneric<ModelsIndex[key]>,
      'id'
    >[];
  }
> {
  models: ModelsIndexWithRelations;
  constructor(
    models: ModelsIndex,
    relations: ModelsRelations /*seeds?: Partial<ModelsSeeds>*/
  ) {
    this.models = models;
    // if (seeds) {
    // Object.keys(seeds).forEach((key) => {
    //   // ...
    // });
    // }
  }
}
