const { Tasks } = require("./entities");

module.exports = function getAllTasks() {
  return Tasks.getAll();
};
