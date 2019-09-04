const { Users } = require("./entities");

module.exports = function getAllUsers() {
  return Users.getAll();
};
