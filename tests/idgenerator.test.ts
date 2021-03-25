import { expect, assert } from 'chai';
import { Model } from '../src';
import { UUIDGenerator } from '../src/IDGenerators';
import { IDGenerator } from '../src';
import { v4 as uuidv4 } from 'uuid';
import sinon from 'sinon';

describe('Base ID Generator', function () {
  it('should return 0', function () {
    const idGenerator = new IDGenerator(0);
    const get = idGenerator.getId();
    expect(get).to.eql(0);
  });
});

describe('Number ID Generator', function () {
  it('should generate id when not provided', function () {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    const user = userModel.create({
      age: 0,
      role: 'admin',
      name: 'William',
    });
    expect(user.data).to.eql({
      id: 0,
      age: 0,
      role: 'admin',
      name: 'William',
    });
  });

  it('should generate the next id based on the next number after the highest id', function () {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel = new Model<IUser>();
    (<any>userModel).setData([
      { id: 0, age: 0, role: 'admin', name: 'William' },
      { id: 1, age: 0, role: 'admin', name: 'Jenny' },
      { id: 2, age: 0, role: 'admin', name: 'Mark' },
      { id: 100, age: 0, role: 'admin', name: 'Emma' },
    ]);

    userModel.create({ name: 'Henry', role: 'admin', age: 0 });
    const users = userModel.find();
    const usersData = users.map((user) => user.data);

    expect(usersData).to.eql([
      { id: 0, age: 0, role: 'admin', name: 'William' },
      { id: 1, age: 0, role: 'admin', name: 'Jenny' },
      { id: 2, age: 0, role: 'admin', name: 'Mark' },
      { id: 100, age: 0, role: 'admin', name: 'Emma' },
      { id: 101, age: 0, role: 'admin', name: 'Henry' },
    ]);
  });
});

describe('UUID Generator', () => {
  it('should generate id as UUID when not defined in create function ', () => {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel: any = new Model<IUser>();
    const uuidgenerator = new UUIDGenerator('');
    const sampleUUID = uuidv4();
    sinon.stub(uuidgenerator, 'getId').returns(sampleUUID);

    userModel.setIdGenerator(uuidgenerator);

    const user = userModel.create({
      age: 0,
      role: 'admin',
      name: 'William',
    });

    expect(user.data).to.eql({
      id: sampleUUID,
      age: 0,
      role: 'admin',
      name: 'William',
    });
  });

  it('should generate another UUID if the generated one already exists', () => {
    interface IUser {
      id: string;
      name: string;
      role: 'admin' | 'user';
      age: number;
    }
    const userModel: any = new Model<IUser>();
    const uuidgenerator = new UUIDGenerator('');
    const sampleUUID = uuidv4();

    uuidgenerator.generatedIds.push(sampleUUID);
    const spy = sinon.spy(uuidgenerator, 'getNextId');
    sinon.stub(uuidgenerator, 'id').value(sampleUUID);

    userModel.setIdGenerator(uuidgenerator);

    const user = userModel.create({
      age: 0,
      role: 'admin',
      name: 'William',
    });

    expect(spy.callCount).to.eql(2);
    expect(user.data).to.have.property('id');
    // expect(user.data.id).to.eql(user.data.id);
  });
});
