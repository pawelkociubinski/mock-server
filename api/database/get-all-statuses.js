const { Statuses } = require("./entities");

module.exports = function getAllStatuses() {
  return Statuses.getAll();
};
