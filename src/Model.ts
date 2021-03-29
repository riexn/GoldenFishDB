import { find, filter, matches, isMatch, assign } from 'lodash';
import { IDGenerator } from './IDGenerator';
import { NumberIdGenerator } from './IDGenerators';
import { Document } from './Document';
import { BaseModel } from './types';

interface FindOneOptions {
  populate: string[];
}

export interface RelatedTo {
  foreignKey: string;
  model: Model<any>;
  type: 'HasMany' | 'HasOne';
}

export class Model<T extends BaseModel> {
  relations: any = {};
  relatedTo: RelatedTo[] = [];
  collection: Document<T>[] = [];
  constructor(schema?: T) {}

  create<PropsType extends Partial<T> | Partial<T>[]>(
    props: PropsType
  ): PropsType extends Partial<T> ? Document<T> : Document<T>[];

  create<PropsType extends Partial<T> | Partial<T>[]>(
    props: PropsType
  ): Document<T> | Document<T>[] {
    if (Array.isArray(props)) {
      const documents = props.map((data) => new Document<T>(data, this));
      this.collection.push(...documents);
      return documents;
    } else {
      const document = new Document<T>(props, this);
      this.collection.push(document);
      return document;
    }
  }
  find(searchProps?: string[] | Partial<T>) {
    if (!searchProps) {
      return this.collection;
    } else if (Array.isArray(searchProps)) {
      const ids = searchProps;
      const documents = this.collection.filter((document) => {
        return ids.includes(document.data.id);
      });
      return documents;
    } else {
      return filter(this.collection, (document) =>
        isMatch(document.data, searchProps)
      );
    }
  }
  findOne(findProps: string | Partial<T>, options?: FindOneOptions) {
    if (typeof findProps === 'string') {
      const id = findProps;
      const document = this.collection.find(
        (document) => document.data.id === id
      );
      if (!document) return;
      if (options) {
        const { populate } = options;
        if (populate.length > 0) {
          this.populateOne(document, populate);
        }
      }
      // document && this.populate(document);
      return document;
    } else {
      return find(this.collection, (document) =>
        isMatch(document.data, findProps)
      );
    }
  }

  update(findProps: Partial<T>, updateProps: Partial<T>) {
    const documents = this.find(findProps);
    documents.forEach((document) => document.update(updateProps));
    return documents;
  }

  private populateOne(
    document: Document<T>,
    relationsToPopulateKeys: string[]
  ) {
    relationsToPopulateKeys.map((relationKey: any) => {
      if (this.isHasOneRelation(relationKey)) {
        this.getHasOneData(document, relationKey);
      } else {
        this.getHasManyData(document, relationKey);
      }
    });
  }

  private isHasOneRelation(relationKey: any) {
    return this.relations[relationKey].type === 'HasOne';
  }

  private getHasOneData(document: any, relationKey: any) {
    const relationData = this.relations[relationKey].model.findOne(
      (document.data as any)[`${relationKey}Id`]
    )?.data;
    document.data[relationKey] = relationData;
  }

  private getHasManyData(document: any, relationKey: any) {
    document.data[relationKey] = this.relations[relationKey].model
      .find((document.data as any)[`${relationKey}Ids`])
      .map((document: any) => document.data);
  }

  delete(findProps: Partial<T>) {
    const documents = this.find(findProps);
    documents.map((document) => document.delete());
  }
}

// export class Document<Type extends ModelBase> {
//   data: Type;
//   model: Model<Type>;
//   constructor(data: Type, model: Model<Type>) {
//     this.data = data;
//     this.model = model;
//   }
//   update(props: Partial<Type>) {
//     assign(this.data, props);
//   }
//   // finds itself then deletes
//   delete() {
//     this.model.documents = this.model.documents.filter(
//       (document) => document.data.id !== this.data.id
//     );
//   }
// }

// export class Model<Type extends ModelBase> {
//   private idGenerator: IDGenerator<number | string> = new NumberIdGenerator(0);
//   documents: Document<Type>[] = [];
//   constructor(object?: Type) {}
//   private setIdGenerator(idGenerator: IDGenerator<number | string>) {
//     this.idGenerator = idGenerator;
//   }
//   private setData(data: Type[]) {
//     this.documents = data.map((item) => this.create(item));
//   }
//   findOne(props: Partial<Type>) {
//     return find(this.documents, (document) => isMatch(document.data, props));
//   }
//   find(props?: Partial<Type>) {
//     return filter(this.documents, (document) =>
//       isMatch(document.data, props || {})
//     );
//   }
//   create(props: Partial<Type>) {
//     // generates an id if one wasn't defined
//     const data = { ...props, id: props.id ?? this.idGenerator.getId() };
//     if (props.id !== undefined) {
//       this.idGenerator.generatedIds.push(props.id);
//     }
//     const document = new Document<Type>(data as Type, this);
//     this.documents.push(document);
//     return document;
//   }
//   update(searchProps: Partial<Type>, updateProps: Partial<Type>) {
//     const updatedDocument = this.find(searchProps);
//     updatedDocument.map((document) => document.update(updateProps));
//   }
//   delete(props: Partial<Type>) {
//     const deletedDocuments = this.find(props);
//     deletedDocuments.map((document) => document.delete());
//   }
// }
