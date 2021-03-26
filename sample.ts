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
          //   comments: HasMany('comment'),
        },
      },
    },
  });

  db.schema.user.create({
    id: '1',
    name: 'john',
    userRoleId: '1',
    postsIds: ['1'],
  });
  db.schema.role.create({ id: '1', name: 'admin' });
  db.schema.post.create({
    id: '1',
    title: 'post title',
    text: 'post text....',
  });
  const user = db.schema.user.findOne('1');
  console.log(user);

  // TODO: user.data should log
  /**
 {
     id:"1",
     name:"john",
     roleId:"1",
     role:{
         id:"1",
         name:"admin"
     }
 }
 */
  console.log(user);
};

test();
