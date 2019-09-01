const _slug = require("slug");

const op = Symbol("operationErrorFlag");

module.exports.op = op;

module.exports.operationError = function operationError(message, code) {
  return {
    [op]: true,
    code,
    message
  };
};

module.exports.slug = function slug(str) {
  return _slug(str).toLowerCase();
};
