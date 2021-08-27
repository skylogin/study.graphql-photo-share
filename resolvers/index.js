const { GraphQLScalarType } = require('graphql');

var _id = 4;
// var photos = [];



const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => photos,
  },

  Mutation: {
    postPhoto(parent, args){
      var newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date()
      };

      photos.push(newPhoto);
      return newPhoto;
    }
  },

  // trivial resolver
  Photo: {
    url: parent => `http://github.com/skylogin/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser);
    },
    taggedUsers: parent => {
      return tags
        //현재사진에 대한 태그만 필터링
        .filter(tag => tag.photoId === parent.id)
        //태그 배열을 userId배열로 변환
        .map(tag => tag.userId)
        //userId배열을 바탕으로 사용자 찾기
        .map(userId => users.find(u => u.githubLogin === userId));
    },
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin);
    },
    inPhotos: parent => {
      return tags
        //현재 사용자에 대한 태그만 필터링
        .filter(tag => tag.userId === parent.id)
        //태그 배열을 photoId배열로 변환
        .map(tag => tag.photoId)
        //photoId배열을 바탕으로 사진 찾기
        .map(photoId => photos.find(p=> p.id === photoId));
    }
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value.',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
};
