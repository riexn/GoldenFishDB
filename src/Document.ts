import { BaseModel } from './types';
import { Model } from './Model';
import { assign } from 'lodash';

export class Document<T extends BaseModel> {
  data: T;
  model: Model<T>;
  constructor(data: any, model: any) {
    this.data = data;
    this.model = model;
  }
  update(updateProps: Partial<T>) {
    return assign(this.data, updateProps);
  }
  delete() {
    this.model.collection = this.model.collection.filter(
      (document) => document.data.id !== this.data.id
    );
  }
  toObject() {
    return this.data;
  }
}
