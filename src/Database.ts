import { map } from 'lodash';
import { ModelBase } from './Model';
import { extractGeneric, PartialBy } from './utils';

// export const BelongsTo = <T extends ModelBase>(
//   // the model it belongs to
//   model: Model<T>
// ) => {};

// export const BelongsTo = <T extends ModelBase>(model: Model<T>) => {};

interface BaseModel {
  id: string;
}

class Document<T extends BaseModel> {
  data: T;
  model: any;
  constructor(data: any, model: any) {
    this.data = data;
    this.model = model;
  }
  toObject() {
    return this.data;
  }
}

interface FindOneOptions {
  populate: any;
}

export class Model<T extends BaseModel> {
  private relations: any = {};
  collection: Document<T>[] = [];
  constructor(schema?: T) {}

  create(props: Partial<T>) {
    const document = new Document<T>(props, this);
    this.collection.push(document);
    // get the relations data
    // this.populate(document);
    return document;
  }
  find(id: string[] | string) {
    if (Array.isArray(id)) {
      const documents = this.collection.filter((document) => {
        return id.includes(document.data.id);
      });
      return documents;
    } else {
      const documents = this.collection.filter(
        (document) => document.data.id === id
      );
      return documents;
    }
  }
  findOne(id: string, options?: FindOneOptions) {
    const document = this.collection.find(
      (document) => document.data.id === id
    );
    if (!document) return;
    if (options) {
      const { populate } = options;
      if (populate) {
        this.populateOne(document, populate);
      }
    }
    // document && this.populate(document);
    return document;
  }

  private populateOne(
    document: Document<T>,
    relationsToPopulateKeys: string[]
  ) {
    relationsToPopulateKeys.map((relationKey) => {
      (document.data as any)[`${relationKey}`] =
        this.relations[relationKey].type === 'HasOne'
          ? this.relations[relationKey].model.findOne(
              (document.data as any)[`${relationKey}Id`]
            )?.data
          : this.relations[relationKey].model
              .find((document.data as any)[`${relationKey}Ids`])
              .map((document: any) => document.data);
    });
  }

  private populate(document: Document<T>, relationsKeys: string[]) {
    console.log('relations keys', relationsKeys);
    relationsKeys.map((relationKey) => {
      console.log('hello');
      //   document.data[`${relationKey}`] =
      //     this.relations[relationKey].type === 'HasOne'
      //       ? this.relations[relationKey].model.findOne(
      //           document.data[`${relationKey}Id`]
      //         )?.data
      //       : this.relations[relationKey].model
      //           .find(document.data[`${relationKey}Ids`])
      //           .map((document: any) => document.data);
    });
  }
}
interface HasMany<T extends BaseModel> {
  type: 'HasMany';
  model: Model<T>;
}

export const HasMany = <T extends BaseModel>(model: Model<T>): HasMany<T> => {
  // TODO: manipulate this model to have a mapped thing if it exists..
  return {
    type: 'HasMany',
    model: model,
  };
};

interface HasOne<T extends BaseModel> {
  type: 'HasOne';
  model: Model<T>;
}
export const HasOne = <T extends BaseModel>(model: Model<T>): HasOne<T> => {
  return {
    type: 'HasOne',
    model: model,
  };
};

type Relationify<
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

type AddProps<K extends PropertyKey, P, R> = {
  [L in keyof R as R[L] extends HasOne<any> ? L : never]: R[L] extends HasOne<
    infer M
  >
    ? M
    : never;
} &
  {
    [L in keyof R as R[L] extends HasOne<any>
      ? // stays as is
        `${Extract<L, string>}Id`
      : never]: R[L] extends HasOne<infer M>
      ? Extract<M, BaseModel>['id']
      : never;
  } &
  // has many property
  {
    [L in keyof R as R[L] extends HasMany<any>
      ? // there used to be an added s at the end here, but not it's removed
        `${Extract<L, string>}`
      : never]: R[L] extends HasMany<infer M> ? M[] : never;
  } &
  // has many ids
  {
    [L in keyof R as R[L] extends HasMany<any>
      ? `${Extract<L, string>}Ids`
      : never]: R[L] extends HasMany<infer M>
      ? Extract<M, BaseModel>['id'][]
      : never;
  };

export class GoldenFishDB<
  T extends BaseModel,
  DBModel extends Model<T>,
  SchemaModels extends { [key: string]: DBModel },
  SchemaModelsKeys extends keyof SchemaModels,
  Relations extends { [key: string]: HasOne<T> | HasMany<T> },
  SchemaRelations extends Partial<
    {
      [key in keyof SchemaModels]: any;
    }
  >,
  FixturesIndex extends Partial<{ [key in keyof SchemaModels]: any[] }>
> {
  // in here, we can 'fake' the typing of the models
  schema: Relationify<SchemaModels, SchemaRelations>;
  constructor(config: {
    schema: { models: SchemaModels; relations: SchemaRelations };
    fixtures?: FixturesIndex;
  }) {
    const { schema } = config;
    const { models, relations } = schema;

    Object.keys(models).map((modelKey: string) => {
      if ((relations as any)[modelKey]) {
        // casting it to any since relations is a private property
        (models[modelKey] as any).relations = (relations as any)[modelKey];
      }
    });

    this.schema = models as any;
  }
}
