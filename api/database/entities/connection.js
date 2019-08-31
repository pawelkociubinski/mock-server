const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const fs = require("fs");
const path = require("path");

module.exports = function createConnection() {
  // This refers to the context of yarn command,
  // so probably app root dir.
  const adapter = new FileSync("db.fork.json");
  const database = low(adapter);

  const isDatabaseEmpty = database.size().value() === 0;

  if (isDatabaseEmpty) {
    const freshDb = require("../db.json");
    database.defaults(freshDb).write();
  }

  return database;
};
