import { expect } from 'chai';
import { GoldenFishDB, Model, HasOne, HasMany } from '../src';
import { ICommentModel, IPostModel, IRoleModel, IUserModel } from './constants';

describe('Database Relations', function () {
  it('should populate relations on findOne', () => {
    const userModel = new Model<IUserModel>();
    const roleModel = new Model<IRoleModel>();
    const postModel = new Model<IPostModel>();
    const db = new GoldenFishDB({
      schema: {
        models: { user: userModel, role: roleModel, post: postModel },
        relations: {
          user: { role: HasOne(roleModel), posts: HasMany(postModel) },
        },
      },
    });
    db.schema.user.create({
      id: '1',
      name: 'john',
      roleId: '1',
      postsIds: ['1'],
    });
    db.schema.role.create({ id: '1', name: 'admin' });
    db.schema.post.create({
      id: '1',
      title: 'post title',
      text: 'my post description',
    });
    const user = db.schema.user.findOne('1', { populate: ['role', 'posts'] });
    expect(user?.toObject()).to.eql({
      id: '1',
      name: 'john',
      roleId: '1',
      role: { id: '1', name: 'admin' },
      postsIds: ['1'],
      posts: [
        {
          id: '1',
          title: 'post title',
          text: 'my post description',
        },
      ],
    });
  });

  it('should delete its foregin keys from the documents that reference it with a HasOne relation', function () {
    const userModel = new Model<IUserModel>();
    const roleModel = new Model<IRoleModel>();
    const db = new GoldenFishDB({
      schema: {
        models: { user: userModel, role: roleModel },
        relations: {
          user: { role: HasOne(roleModel) },
        },
      },
    });
    console.log(db.schema.user);
    db.schema.user.create({
      id: '1',
      name: 'john',
      roleId: '1',
    });
    db.schema.role.create({ id: '1', name: 'admin' });
    const role = db.schema.role.findOne('1');
    role?.delete();
    const user = db.schema.user.findOne('1');
    expect(user?.data).to.eql({
      id: '1',
      name: 'john',
      roleId: '',
    });
  });

  it('should delete its foregin keys from the documents that reference it with a HasMany relation', function () {
    const userModel = new Model<IUserModel>();
    const postModel = new Model<IPostModel>();
    const db = new GoldenFishDB({
      schema: {
        models: { user: userModel, post: postModel },
        relations: {
          user: { posts: HasMany(postModel) },
        },
      },
    });
    db.schema.user.create({
      id: '1',
      name: 'john',
      postsIds: ['1', '2', '3'],
    });
    db.schema.post.create([
      { id: '1', title: 'this is a title', text: 'this is the text' },
      { id: '2', title: 'this is a title', text: 'this is the text' },
      { id: '3', title: 'this is a title', text: 'this is the text' },
    ]);
    const posts = db.schema.post.find();
    posts.forEach((post) => post.delete());
    const user = db.schema.user.findOne('1');
    expect(user?.data).to.eql({
      id: '1',
      name: 'john',
      postsIds: [],
    });
  });
});
