import { map } from 'lodash';
import { Model } from './Model';
import {
  BaseModel,
  HasOneReturn,
  HasManyReturn,
  Relationify,
  ExtractModelGeneric,
} from './types';

export class GoldenFishDB<
  T extends BaseModel,
  SchemaModels extends { [key: string]: Model<T> },
  Relations extends { [key: string]: HasOneReturn<T> | HasManyReturn<T> },
  SchemaRelations extends Partial<
    {
      [key in keyof SchemaModels]: Relations;
    }
  >,
  SchemaRelationedModels extends Relationify<SchemaModels, SchemaRelations>,
  DefaultsIndex extends Partial<
    {
      [key in keyof SchemaModels]: Partial<
        Omit<ExtractModelGeneric<SchemaRelationedModels[key]>, 'id'>
      >;
    }
  >,
  FixturesIndex extends Partial<
    {
      [key in keyof SchemaModels]: Partial<
        ExtractModelGeneric<SchemaRelationedModels[key]>
      >[];
    }
  >
> {
  schema: Relationify<SchemaModels, SchemaRelations>;
  constructor(config: {
    // TODO: relations potential generated keys must not conflict with models keys
    // if a model has a "role" key, then relations should not be able to use "role" as well
    schema: { models: SchemaModels; relations?: SchemaRelations };
    fixtures?: FixturesIndex;
    defaults?: DefaultsIndex;
  }) {
    const { schema } = config;
    const { models, relations } = schema;

    Object.keys(models).map((modelKey: string) => {
      const modelHasDefinedRelations =
        relations && (relations as any)[modelKey];
      if (modelHasDefinedRelations) {
        // casting it to any since relations is a private property
        (models[modelKey] as any).relations = (relations as any)[modelKey];

        // loop those relations
        const modelRelations = (<any>relations)[modelKey];
        const relationsKeys = Object.keys(modelRelations);
        relationsKeys.forEach((relatedToKey) => {
          const modelToBeManipulated = modelRelations[relatedToKey].model;
          const dataToAdd: any = {
            foreignKey: `${relatedToKey}${
              modelRelations[relatedToKey].type === 'HasOne' ? 'Id' : 'Ids'
            }`,
            type: modelRelations[relatedToKey].type,
            model: models[modelKey],
          };
          modelToBeManipulated.relatedTo.push(dataToAdd);
        });
      }
    });

    this.schema = models as any;
  }
}
