import { find, filter, matches, isMatch, assign } from 'lodash';
import { IDGenerator } from './IDGenerator';
import { NumberIdGenerator } from './IDGenerators';

export interface ModelBase {
  id: string | number;
}

export class Document<Type extends ModelBase> {
  data: Type;
  model: Model<Type>;
  constructor(data: Type, model: Model<Type>) {
    this.data = data;
    this.model = model;
  }
  update(props: Partial<Type>) {
    assign(this.data, props);
  }
  // finds itself then deletes
  delete() {
    this.model.documents = this.model.documents.filter(
      (document) => document.data.id !== this.data.id
    );
  }
}

export class Model<Type extends ModelBase> {
  private idGenerator: IDGenerator<number | string> = new NumberIdGenerator(0);
  documents: Document<Type>[] = [];
  constructor(object?: Type) {}
  private setIdGenerator(idGenerator: IDGenerator<number | string>) {
    this.idGenerator = idGenerator;
  }
  private setData(data: Type[]) {
    this.documents = data.map((item) => this.create(item));
  }
  findOne(props: Partial<Type>) {
    return find(this.documents, (document) => isMatch(document.data, props));
  }
  find(props?: Partial<Type>) {
    return filter(this.documents, (document) =>
      isMatch(document.data, props || {})
    );
  }
  create(props: Partial<Type>) {
    // generates an id if one wasn't defined
    const data = { ...props, id: props.id ?? this.idGenerator.getId() };
    if (props.id !== undefined) {
      this.idGenerator.generatedIds.push(props.id);
    }
    const document = new Document<Type>(data as Type, this);
    this.documents.push(document);
    return document;
  }
  update(searchProps: Partial<Type>, updateProps: Partial<Type>) {
    const updatedDocument = this.find(searchProps);
    updatedDocument.map((document) => document.update(updateProps));
  }
  delete(props: Partial<Type>) {
    const deletedDocuments = this.find(props);
    deletedDocuments.map((document) => document.delete());
  }
}
