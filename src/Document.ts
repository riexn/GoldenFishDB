import { BaseModel } from './types';
import { Model, RelatedTo } from './Model';
import { assign, findIndex, isMatch } from 'lodash';

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
    this.model.relatedTo.forEach((relation) => {
      if (relation.type === 'HasOne') {
        this.removeHasOneRelations(relation);
      } else {
        this.removeHasManyRelations(relation);
      }
    });
  }

  private removeHasOneRelations(relation: RelatedTo) {
    const search = { [relation.foreignKey]: this.data.id };
    const updateValue = { [relation.foreignKey]: '' };
    const documentsThatIExistIn = relation.model.find(search);
    documentsThatIExistIn.forEach((document) => {
      document.update(updateValue);
    });
  }
  // is not the most optimal way, this is because our search cannot go through arrays yet
  private removeHasManyRelations(relation: RelatedTo) {
    const documentsOfRelatedModel = relation.model.find();
    documentsOfRelatedModel.forEach((document) => {
      document.update({
        [relation.foreignKey]: document.data[relation.foreignKey].filter(
          (id: any) => id !== this.data.id
        ),
      });
    });
  }
  toObject() {
    return this.data;
  }
}
