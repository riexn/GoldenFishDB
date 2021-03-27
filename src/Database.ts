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
    schema: { models: SchemaModels; relations?: SchemaRelations };
    fixtures?: FixturesIndex;
    defaults?: DefaultsIndex;
  }) {
    const { schema } = config;
    const { models, relations } = schema;

    Object.keys(models).map((modelKey: string) => {
      if (relations && (relations as any)[modelKey]) {
        // casting it to any since relations is a private property
        (models[modelKey] as any).relations = (relations as any)[modelKey];
      }
    });

    this.schema = models as any;
  }
}
