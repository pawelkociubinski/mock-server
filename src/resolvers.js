import db from "./db.json";

const resolvers = {
  Query: {
    tasks: () => db.tasks,
    users: () => db.users,
    status: () => db.status,
    tags: () => db.tags,
  },
  mutation: {
   // ...
  }
};

export default resolvers;
