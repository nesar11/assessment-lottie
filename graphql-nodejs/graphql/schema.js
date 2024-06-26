const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type Animation {
    id: ID!
    name: String!
    metadata: String!
  }

  type Query {
    animations: [Animation]
    animation(id: ID!): Animation
    files: [File]
    searchFiles(filename: String!): [File]
  }

  type Mutation {
    addAnimation(id: ID!, name: String!, metadata: String!): Animation
    uploadFile(file: Upload!): File!
    downloadFile(url: String!): String # Return URL as String
  }
`;

module.exports = typeDefs;
