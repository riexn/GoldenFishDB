import { GoldenFishDB, HasOne, HasMany, Model } from './src';

const test = () => {
  interface IUserModel {
    id: string;
    name: string;
  }

  interface IRoleModel {
    id: string;
    name: string;
  }

  interface IPostModel {
    id: string;
    title: string;
    text: string;
  }

  interface ICommentModel {
    id: string;
    text: string;
  }
  const userModel = new Model<IUserModel>({ id: '', name: '' });
  const roleModel = new Model<IRoleModel>({ id: '', name: '' });
  const postModel = new Model<IPostModel>({ id: '', title: '', text: '' });
  const commentModel = new Model<ICommentModel>({ id: '', text: '' });

  const db = new GoldenFishDB({
    schema: {
      models: {
        user: userModel,
        role: roleModel,
        post: postModel,
        comment: commentModel,
      },
      relations: {
        user: {
          userRole: HasOne(roleModel),
          posts: HasMany(postModel),
          comments: HasMany(commentModel),
        },
        post: {
          author: HasOne(userModel),
          editor: HasOne(userModel),
        },
      },
    },
    defaults: { user: {} },
    // should get the user's T
    fixtures: { user: [{ name: 'potato' }] },
  });

  db.schema.user.create({
    id: '1',
    name: 'john',
    userRoleId: '1',
    postsIds: ['1', '123'],
  });
  db.schema.role.create({ id: '1', name: 'admin' });
  db.schema.post.create({
    id: '1',
    title: 'post title',
    text: 'post text....',
  });
  db.schema.post.create({ id: '123', title: 'this is my title' });
  db.schema.post.create({ id: '123' });
  // const user = db.schema.user.findOne('1', { populate: ['posts', 'userRole'] });
  // need to infer the relations properties
  const user = db.schema.user.findOne('1', { populate: ['posts'] });
  if (user) {
    const userObj = user.toObject();
    console.log(userObj);
  }
};

test();
