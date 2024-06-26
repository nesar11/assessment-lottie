const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const path = require('path');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();


app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false, 
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });


  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
