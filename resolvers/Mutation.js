const { GraphQLScalarType } = require('graphql');


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
  }
};
