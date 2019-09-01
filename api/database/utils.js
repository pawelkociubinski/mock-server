const _slug = require("slug");

module.exports.operationError = function operationError(message, code) {
  return {
    isOperationError: true,
    code,
    message
  };
};

module.exports.slug = function slug(str) {
  return _slug(str).toLowerCase();
};
