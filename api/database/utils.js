const _slug = require("slug");

const opErrFlagSymbol = Symbol("operationErrorFlag");

module.exports.opErrFlagSymbol = opErrFlagSymbol;
module.exports.operationError = function operationError(message, code) {
  return {
    [opErrFlagSymbol]: true,
    code,
    message
  };
};

module.exports.slug = function slug(str) {
  return _slug(str).toLowerCase();
};
