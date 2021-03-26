import { map } from 'lodash';
import { ModelBase } from './Model';
import { extractGeneric, PartialBy } from './utils';

// export const BelongsTo = <T extends ModelBase>(
//   // the model it belongs to
//   model: Model<T>
// ) => {};

// export const BelongsTo = <T extends ModelBase>(model: Model<T>) => {};

class Document {
  data: any;
  constructor(data: any) {
    this.data = data;
  }
}

export class Model<T> {
  relations: any = {};
  collection: Document[] = [];
  constructor(schema?: T) {}

  create(props: any) {
    const document = new Document(props);
    this.collection.push(document);
    // get the relations data
    this.populate(document);
    return document;
  }
  find(id: string) {
    const documents = this.collection.filter(
      (document) => document.data.id === id
    );
    documents.map((document) => {
      this.populate(document);
    });
    return documents;
  }
  findOne(id: string) {
    const document = this.collection.find(
      (document) => document.data.id === id
    );
    document && this.populate(document);
    return document;
  }
  private populate(document: Document) {
    console.log('my relations are', this.relations);
    Object.keys(this.relations).map((relationKey) => {
      document.data[`${relationKey}`] =
        this.relations[relationKey].type === 'HasOne'
          ? this.relations[relationKey].model.findOne(
              document.data[`${relationKey}Id`]
            )?.data
          : this.relations[relationKey].model
              .find([document.data[`${relationKey}Ids`]])
              .map((document: any) => document.data);
    });
  }
}

export const HasMany = (model: any) => {
  // manipulate this model to have a mapped thing if it exists..
  return {
    type: 'HasMany',
    model: model,
  };
};

export const HasOne = (model: any) => {
  return {
    type: 'HasOne',
    model: model,
  };
};

export class GoldenFishDB<
  T,
  DBModel extends ModelBase,
  ConfigSchema extends { models: any; relations: any },
  Config extends { schema: ConfigSchema }
> {
  schema: any = {};
  constructor(config: Config) {
    const { schema } = config;
    const { models, relations } = schema;

    Object.keys(models).map((modelKey) => {
      if (relations[modelKey]) {
        models[modelKey].relations = relations[modelKey];
      }
    });

    this.schema = models;

    return;

    let schemaModels: any = {};

    Object.keys(models).map((modelKey) => {
      // create schema models in a specific shape?
      schemaModels[modelKey] = models[modelKey];
      // find if there is a relation for this model..
      if (relations[modelKey]) {
        schemaModels[modelKey] = {
          ...schemaModels[modelKey],
          relations: relations[modelKey],
        };
      }
      // const thisModelRelations = relations[modelKey];
      // console.log(models);
      // let myRelations = { model: models[thisModelRelations] };
      // console.log('myrelations', myRelations);
      // console.log('model', modelKey, 'relations', thisModelRelations);
      // }
    });
    // create all of the models first, while pre-assuming their relationships properties
    Object.keys(schemaModels).map((modelKey) => {
      this.schema[modelKey] = new Model(modelKey);
    });
    // add in their relationships
    Object.keys(schemaModels).map((modelKey) => {
      this.schema[modelKey].relations = schemaModels[modelKey].relations;
    });
    console.log(this.schema);
  }
}

// export class Database<
//   T extends ModelBase,
//   ModelsIndex extends {
//     [key: string]: Model<T>;
//   },
//   ModelsIndexWithRelations extends {
//     [key: string]: Model<T & { potato: any }>;
//   },
//   ModelsTypeKeys extends keyof ModelsIndex,
//   RelationsProps extends { [key: string]: any },
//   Relations extends Partial<{ [key in ModelsTypeKeys]: RelationsProps }>,
//   RelationsKeys extends keyof Relations,
//   ModelsRelations extends Relations,
//   ModelsRelationsKeys extends keyof ModelsRelations,
//   ModelsSeeds extends {
//     [key in ModelsTypeKeys]: PartialBy<
//       extractGeneric<ModelsIndex[key]>,
//       'id'
//     >[];
//   }
// > {
//   models: ModelsIndexWithRelations;
//   constructor(
//     models: ModelsIndex,
//     relations: ModelsRelations /*seeds?: Partial<ModelsSeeds>*/
//   ) {
//     this.models = models;
//     // if (seeds) {
//     // Object.keys(seeds).forEach((key) => {
//     //   // ...
//     // });
//     // }
//   }
// }
