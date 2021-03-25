import { expect } from 'chai';
import { BelongsTo, Document, Model, Database } from '../src';

describe('Relations', function () {
  it('should create database instance', function () {
    interface IUserModel {
      id: number;
      name: string;
    }

    interface IRoleModel {
      id: number;
      title: string;
    }
    const userModel = new Model<IUserModel>();
    const roleModel = new Model<IRoleModel>();
    const db = new Database(
      {
        user: userModel,
        role: roleModel,
      },
      {
        user: {
          role: BelongsTo(roleModel),
        },
      }
    );
    const users = db.models.user.find();
    // users[0].data.
    // const userModel = new Model(
    //   { id: '', name: '' },
    //   { userRole: BelongsTo('role') }
    // );
    // const user = userModel
    //   .create({ name: 'hello', role: 1 })
    //   .populate(['role']);
    // // roleId = 1
    // // role = {...}
    // const roleModel = new Model({} as any, { comment: 'hasMany' });
    // // commentIds= [1, 2, 3, 4]
    // // comments = [{...}]
    // const commentModel = new Model();
  });
  //   it('should create database instance', function () {
  //     const userModel = new Model(
  //       { id: '', name: '' },
  //       { userRole: BelongsTo('role') }
  //     );
  //     const user = userModel
  //       .create({ name: 'hello', role: 1 })
  //       .populate(['role']);
  //     // roleId = 1
  //     // role = {...}
  //     const roleModel = new Model({} as any, { comment: 'hasMany' });
  //     // commentIds= [1, 2, 3, 4]
  //     // comments = [{...}]
  //     const commentModel = new Model();
  //   });
});
