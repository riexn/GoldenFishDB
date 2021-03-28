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
    // myuser
    // console.log(user.data)
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

  it('should delete the inverted relation key', function () {
    let result = 5;
    // on delete
    // find the models that it is related to
    // user model has to know which models it is related to
    // if the relation is HasOne, then empty that field
    // if the relation is HasMany, then remove the id from the array
    // TODO: there has to be an 'inverses' property ??? not sure

    // {id:"1", title:"post title", text:"hello, this is my post",commentsIds:['1','2','3']}
    // {id:"1", text:"hi! great post!"}
    // {id:"2", text:"agreed, I think this is interesting!"}
    // {id:"3", text:"you suck!"}

    // deleting comment 3 should remove it from commentsIds in post

    // delete own reference from there
    expect(result).to.eql({ id: '1', name: 'john' });
    expect(result).to.eql({
      id: '1',
      title: 'admin',
      authorId: '1',
      editorId: '2',
    });
  });
});
