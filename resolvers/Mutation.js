const { GraphQLScalarType } = require('graphql');
const { authorizeWithGithub } = require('../lib');


//테스트 데이터
var { users, photos, tags } = require('../testData');



module.exports = {
  postPhoto(parent, args){
    var newPhoto = {
      id: _id++,
      ...args.input,
      created: new Date()
    };

    photos.push(newPhoto);
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
};
