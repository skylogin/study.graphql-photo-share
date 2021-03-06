const { GraphQLScalarType } = require('graphql');
const fetch = require('node-fetch')

const { authorizeWithGithub } = require('../lib');


module.exports = {
  async postPhoto(parent, args, { db, currentUser }){
    if(!currentUser){
      throw new Error("only an authorized user can post a photo");
    }

    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date()
    };

    const { insertedId } = await db.collection("photos").insertOne(newPhoto);
    newPhoto.id = insertedId.toString();

    return newPhoto;
  },
  async githubAuth(parent, { code }, { db }){
    // github 데이터 받기
    let { message, access_token, avatar_url, login, name } = await authorizeWithGithub({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    });


    // 에러일 경우 message가 채워짐
    if(message){
      throw new Error(message);
    }


    // 결과값을 객체화
    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    };


    // 데이터를 새로 추가하거나 이미 있는 데이터를 업데이트
    await db
      .collection('users')
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });


    // 사용자 데이터 및 토큰 반환
    return { user: latestUserInfo, token: access_token }

  },
  async addFakeUsers(parent, { count }, { db }){
    const randomUserApi = `https://randomuser.me/api/?results=${count}`;
    const { results } = await fetch(randomUserApi).then(res => res.json());

    const users = results.map(r => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avartar: r.picture.thumbnail,
      githubToken: r.login.sha1
    }));

    await db.collection('users').insertMany(users);
    return users;
  },
  async fakeUserAuth(parent, { githubLogin }, { db }){
    const user = await db.collection('users').findOne({ githubLogin });

    if(!user){
      throw new Error(`Cannot find user with githublogin "${githubLogin}`);
    }

    return {
      token: user.githubToken,
      user
    }
  }
};
