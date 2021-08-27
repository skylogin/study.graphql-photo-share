const { readFileSync } = require('fs')
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;

const { MongoClient } = require('mongodb');

require('dotenv').config();


// graphql 파일분리
const typeDefs = readFileSync('typeDefs.graphql', 'UTF-8')
const resolvers = require('./resolvers');


async function app() {
  var app = express();
  const MONGO_DB = process.env.DB_HOST;


  try {
    const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true })
    db = client.db();
  } catch (error) {
    console.log(`
      Mongo DB Host not found!
      please add DB_HOST environment variable to .env file
      exiting...
       
    `)
    process.exit(1)
  }

  const context = { db };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const githubToken = req.headers.authorization;
      const currentUser = await db.collection('users').findOne({ githubToken });

      return { db, currentUser };
    }
  });
  
  await server.start();
  server.applyMiddleware({ app });
  
  app.get('/', (req, res) => res.end('PhotoShare API에 오신걸 환영합니다.'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
  
  app.listen({ port: 4000 }, () => console.log(`GraphQL Service running on http:/localhost:4000${server.graphqlPath}`));
}

app();