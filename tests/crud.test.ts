import { ICommentModel, IPostModel, IRoleModel, IUserModel } from './constants';
import { GoldenFishDB, Model } from '../src';
import { expect } from 'chai';
describe('Database CRUD', () => {
  it('should create a document', () => {
    const userModel = new Model<IUserModel>();
    const db = new GoldenFishDB({ schema: { models: { user: userModel } } });
    const user = db.schema.user.create({ id: '1', name: 'John' });
    expect(user.data).to.eql({ id: '1', name: 'John' });
  });

  it('should bulk create documents', () => {
    const userModel = new Model<IUserModel>();
    const db = new GoldenFishDB({
      schema: { models: { user: userModel } },
    });
    const users = db.schema.user.create([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
      { id: '4', name: 'jenny' },
    ]);
    const usersData = users.map((user) => user.data);
    expect(usersData).to.eql([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
      { id: '4', name: 'jenny' },
    ]);
  });

  it('should find a single document based on id', () => {
    const userModel = new Model<IUserModel>();
    const db = new GoldenFishDB({
      schema: { models: { user: userModel } },
    });
    db.schema.user.create([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
      { id: '4', name: 'jenny' },
    ]);
    const user = db.schema.user.findOne('3');
    expect(user?.data).to.eql({ id: '3', name: 'lenny' });
  });

  it('should find a single document based on properties', () => {
    const userModel = new Model<IUserModel>();
    const db = new GoldenFishDB({
      schema: { models: { user: userModel } },
    });
    db.schema.user.create([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
      { id: '4', name: 'jenny' },
    ]);
    const user = db.schema.user.findOne({ name: 'emma' });
    expect(user?.data).to.eql({ id: '2', name: 'emma' });
  });

  it('should find a single document based on id', () => {
    const userModel = new Model<IUserModel>();
    const db = new GoldenFishDB({
      schema: { models: { user: userModel } },
    });
    db.schema.user.create([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
      { id: '4', name: 'jenny' },
    ]);
    const user = db.schema.user.findOne('3');
    expect(user?.data).to.eql({ id: '3', name: 'lenny' });
  });

  it('should return undefined if document with given id does not exist', () => {
    const userModel = new Model<IUserModel>();
    const db = new GoldenFishDB({
      schema: { models: { user: userModel } },
    });
    db.schema.user.create([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
      { id: '4', name: 'jenny' },
    ]);
    const user = db.schema.user.findOne('5');
    expect(user).to.eql(undefined);
  });

  // it('should find a single document based on a property that is an array of strings or numbers', () => {
  //   const userModel = new Model<IUserModel & { items: string[] }>();
  //   const db = new GoldenFishDB({
  //     schema: { models: { user: userModel } },
  //   });
  //   db.schema.user.create([
  //     { id: '1', name: 'john', items: ['lettuce', 'banana', 'grape'] },
  //     { id: '2', name: 'emma', items: ['apple', 'orange', 'melon'] },
  //     { id: '3', name: 'lenny', items: ['apple', 'carrot', 'cucumber'] },
  //     { id: '4', name: 'jenny', items: ['orange', 'grape', 'melon'] },
  //   ]);
  // FIXME: limitation is that we are restricted to an array shape
  //   const user = db.schema.user.findOne({ items: ['apple'] });
  //   expect(user?.data).to.eql({
  //     id: '2',
  //     name: 'emma',
  //     items: ['apple', 'orange', 'melon'],
  //   });
  // });

  it('should find many documents based on array of ids', () => {
    const userModel = new Model<IUserModel>();
    const db = new GoldenFishDB({
      schema: { models: { user: userModel } },
    });
    db.schema.user.create([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
      { id: '4', name: 'jenny' },
    ]);
    const users = db.schema.user.find(['2', '3']);
    const usersData = users.map((user) => user.data);
    expect(usersData).to.eql([
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
    ]);
  });

  it('should return all of the documents if find has no parameters', () => {
    const userModel = new Model<IUserModel>();
    const db = new GoldenFishDB({
      schema: { models: { user: userModel } },
    });
    db.schema.user.create([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
      { id: '4', name: 'jenny' },
    ]);
    const users = db.schema.user.find();
    const usersData = users.map((user) => user.data);
    expect(usersData).to.eql([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma' },
      { id: '3', name: 'lenny' },
      { id: '4', name: 'jenny' },
    ]);
  });

  it('should update documents that match a find condition', () => {
    const userModel = new Model<IUserModel & { mood: string }>();
    const db = new GoldenFishDB({
      schema: { models: { user: userModel } },
    });
    db.schema.user.create([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma', mood: 'sad' },
      { id: '3', name: 'lenny', mood: 'sad' },
      { id: '4', name: 'jenny' },
    ]);
    db.schema.user.update({ mood: 'sad' }, { mood: 'happy' });
    const usersData = db.schema.user.collection.map(
      (document) => document.data
    );
    expect(usersData).to.eql([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma', mood: 'happy' },
      { id: '3', name: 'lenny', mood: 'happy' },
      { id: '4', name: 'jenny' },
    ]);
  });
  it('should delete documents that match a find condition', () => {
    const userModel = new Model<IUserModel & { mood: string }>();
    const db = new GoldenFishDB({
      schema: { models: { user: userModel } },
    });
    db.schema.user.create([
      { id: '1', name: 'john' },
      { id: '2', name: 'emma', mood: 'sad' },
      { id: '3', name: 'lenny', mood: 'sad' },
      { id: '4', name: 'jenny' },
    ]);
    db.schema.user.delete({ mood: 'sad' });
    const usersData = db.schema.user.collection.map(
      (document) => document.data
    );
    expect(usersData).to.eql([
      { id: '1', name: 'john' },
      { id: '4', name: 'jenny' },
    ]);
  });
});
