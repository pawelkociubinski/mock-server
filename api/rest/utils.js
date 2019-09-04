module.exports.isInt = function(arg) {
  return typeof arg === "number";
};

module.exports.isIntOrUndef = function(arg) {
  return arg === undefined || typeof arg === "number";
};

module.exports.isString = function(arg) {
  return typeof arg === "string";
};

module.exports.toInt = function(arg) {
  return parseInt(arg, 10);
};

module.exports.validate = function(schema) {
  const errors = [];

  for (const row of schema) {
    const [value, checker, errMsg] = row;

    if (!checker(value)) {
      errors.push(errMsg);
    }
  }

  if (errors.length === 0) {
    return;
  }

  return errors;
};
