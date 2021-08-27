
const { readFileSync } = require('fs')
const { ApolloServer } = require('apollo-server');

var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')


var _id = 0;
var photos = [];

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

  Photo: {
    url: parent => `http://github.com/skylogin/img/${parent.id}.jpg`
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