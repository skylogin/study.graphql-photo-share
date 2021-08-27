const { GraphQLScalarType } = require('graphql');

module.exports = {
  // trivial resolver
  Photo: {
    id: parent => parent.id || parent._id,
    url: parent => `/img/photos/${parent._id}.jpg`,
    postedBy: async (parent, args, { db }) => {
      return await db.collection('users').findOne({ githubLogin: parent.userID });
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
