
const { readFileSync } = require('fs')
const { ApolloServer } = require('apollo-server');

var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')

//테스트 데이터
var { users, photos } = require('./testData');



var _id = 4;
// var photos = [];


const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },

  Mutation: {
    postPhoto(parent, args){
      var newPhoto = {
        id: _id++,
        ...args.input,
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
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin);
    }
  }
};



const server = new ApolloServer({
  typeDefs,
  resolvers
});


server
  .listen()
  .then( ({url}) => console.log(`GraphQL Service running on ${url}`))
;