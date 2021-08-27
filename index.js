const { readFileSync } = require('fs')
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;



// graphql 파일분리
const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const resolvers = require('./resolvers');

//테스트 데이터
var { users, photos, tags } = require('./testData');



async function app() {
  var app = express();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });
  
  await server.start();
  server.applyMiddleware({ app });
  
  app.get('/', (req, res) => res.end('PhotoShare API에 오신걸 환영합니다.'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
  
  app.listen({ port: 4000 }, () => console.log(`GraphQL Service running on http:/localhost:4000${server.graphqlPath}`));
}

app();