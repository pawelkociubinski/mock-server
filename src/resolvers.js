const low = require("lowdb");
const path = require("path");
const fs = require("fs");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.fork.json");
const db = low(adapter);

if (Object.keys(db).length === 0) {
  const freshDb = require("./db.json");
  db.defaults(freshDb).write();
}

const resolvers = {
  Query: {
    statuses: () => db.get("statuses"),
    tags: () => db.get("tags"),
    tasks: () => db.get("tasks"),
    users: () => db.get("users")
  },
  Mutation: {
    /**
     * @param {{ tagName: string }} args
     */
    addTaskTag: (_ctx, args) => {
      const tag = {
        id: 1000,
        name: args.tagName
      };

      db.tags.push(tag);

      const idx = db.tasks.findIndex(task => task.id === args.taskId);

      if (idx === -1) {
        throw new Error("No task with id: " + args.taskId);
      }

      const task = db.tasks[idx];

      task.tagsId.push(tag.id);

      db.tasks[idx] = task;

      return tag;
    }
  }
};

export default resolvers;
