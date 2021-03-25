import { expect, assert } from 'chai';
import { Model } from '../src';

describe('Model', function () {
  it('should create data without interface', function () {
    const userModel = new Model({ id: '', name: '', age: 0 });
    const user = userModel.create({ id: '1', name: 'John', age: 20 });
    expect(user.data).to.eql({ id: '1', name: 'John', age: 20 });
  });

  it('should create data with interface', function () {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    const user = userModel.create({
      id: '1',
      age: 0,
      role: 'admin',
      name: 'William',
    });
    expect(user.data).to.eql({
      id: '1',
      age: 0,
      role: 'admin',
      name: 'William',
    });
  });

  it('should return one document with findOne', () => {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    userModel.create({ id: '1', age: 0, role: 'admin', name: 'William' });
    const user = userModel.findOne({ id: '1' });
    expect(user?.data).to.eql({
      id: '1',
      age: 0,
      role: 'admin',
      name: 'William',
    });
  });

  it('should return undefined when findOne has no matches', () => {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    userModel.create({ id: '1', age: 0, role: 'admin', name: 'William' });
    const user = userModel.findOne({ id: '5' });
    expect(user).to.eql(undefined);
  });

  it('should return all of the documents when using find without props', () => {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    (<any>userModel).setData([
      { id: '1', age: 0, role: 'admin', name: 'William' },
      { id: '2', age: 0, role: 'admin', name: 'Jenny' },
      { id: '3', age: 0, role: 'admin', name: 'Mark' },
      { id: '3', age: 0, role: 'admin', name: 'Emma' },
    ]);
    const users = userModel.find();
    const usersData = users.map((user) => user.data);
    expect(usersData).to.eql([
      { id: '1', age: 0, role: 'admin', name: 'William' },
      { id: '2', age: 0, role: 'admin', name: 'Jenny' },
      { id: '3', age: 0, role: 'admin', name: 'Mark' },
      { id: '3', age: 0, role: 'admin', name: 'Emma' },
    ]);
  });

  it('should bulk delete the document from the model delete function', () => {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    (<any>userModel).setData([
      { id: '1', age: 0, role: 'admin', name: 'William' },
      { id: '2', age: 0, role: 'admin', name: 'Jenny' },
      { id: '3', age: 20, role: 'admin', name: 'Mark' },
      { id: '4', age: 20, role: 'admin', name: 'Emma' },
    ]);
    userModel.delete({ age: 20 });
    const users = userModel.find();
    const usersData = users.map((user) => user.data);
    expect(usersData).to.eql([
      { id: '1', age: 0, role: 'admin', name: 'William' },
      { id: '2', age: 0, role: 'admin', name: 'Jenny' },
    ]);
  });

  it('should delete the document from the document delete function', () => {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    (<any>userModel).setData([
      { id: '1', age: 0, role: 'admin', name: 'William' },
      { id: '2', age: 0, role: 'admin', name: 'Jenny' },
      { id: '3', age: 0, role: 'admin', name: 'Mark' },
      { id: '4', age: 0, role: 'admin', name: 'Emma' },
    ]);
    const user = userModel.findOne({ id: '1' });
    if (user) {
      user.delete();
    }
    const users = userModel.find();
    const usersData = users.map((user) => user.data);
    expect(usersData).to.eql([
      { id: '2', age: 0, role: 'admin', name: 'Jenny' },
      { id: '3', age: 0, role: 'admin', name: 'Mark' },
      { id: '4', age: 0, role: 'admin', name: 'Emma' },
    ]);
  });

  it('should update the document from the document update function', () => {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    (<any>userModel).setData([
      { id: '1', age: 0, role: 'admin', name: 'William' },
      { id: '2', age: 0, role: 'admin', name: 'Jenny' },
    ]);
    const user = userModel.findOne({ id: '1' });
    if (user) {
      user.update({ role: 'user' });
    }
    const users = userModel.find();
    const usersData = users.map((user) => user.data);
    expect(usersData).to.eql([
      { id: '1', age: 0, role: 'user', name: 'William' },
      { id: '2', age: 0, role: 'admin', name: 'Jenny' },
    ]);
  });

  it('should bulk update the documents from the model update function', () => {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    (<any>userModel).setData([
      { id: '1', age: 20, role: 'user', name: 'William' },
      { id: '2', age: 30, role: 'user', name: 'Jenny' },
      { id: '3', age: 20, role: 'user', name: 'Mark' },
      { id: '3', age: 30, role: 'user', name: 'Emma' },
    ]);
    userModel.update({ age: 30 }, { role: 'admin' });
    const users = userModel.find();
    const usersData = users.map((user) => user.data);
    expect(usersData).to.eql([
      { id: '1', age: 20, role: 'user', name: 'William' },
      { id: '2', age: 30, role: 'admin', name: 'Jenny' },
      { id: '3', age: 20, role: 'user', name: 'Mark' },
      { id: '3', age: 30, role: 'admin', name: 'Emma' },
    ]);
  });
});
