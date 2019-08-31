const { Tags } = require("./entities");

module.exports = function getAllTags() {
  return Tags.getAll();
};
