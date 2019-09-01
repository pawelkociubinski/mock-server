module.exports.operationError = function operationError(message, code) {
  return {
    code,
    message
  };
};
