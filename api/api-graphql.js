const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

// Mutations.
const addTagForTask = require("./database/add-tag-for-task");
const createTask = require("./database/create-task");
const removeTagFromTask = require("./database/remove-tag-from-task");

// Queries.
const getAllStatuses = require("./database/get-all-statuses");
const getAllTags = require("./database/get-all-tags");
const getAllTasks = require("./database/get-all-tasks");
const getAllUsers = require("./database/get-all-users");

const schemaPath = path.join(__dirname, "schema.gql");
const schema = fs.readFileSync(schemaPath, "utf-8");
const typeDefs = gql`
  ${schema}
`;

const resolvers = {
  Query: {
    statuses: () => getAllStatuses(),
    tags: () => getAllTags(),
    tasks: () => getAllTasks(),
    users: () => getAllUsers()
  },
  Mutation: {
    createTask: (_, args) => createTask(args),
    removeTagFromTask: (_, args) => removeTagFromTask(args),
    addTagForTask: (_, args) => addTagForTask(args)
  }
};

module.exports = function startGraphQLServer() {
  new ApolloServer({ typeDefs, resolvers }).listen(4000).then(({ url }) => {
    console.log(`🚀  GraphQL API server ready at ${url}`);
  });
};
