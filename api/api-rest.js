const bodyParser = require("body-parser");
const express = require("express");
const {
  isInt,
  isIntOrUndef,
  isString,
  toInt,
  validate
} = require("./rest/utils");

// Mutations.
const addTagForTask = require("./database/add-tag-for-task");
const createTask = require("./database/create-task");
const removeTagFromTask = require("./database/remove-tag-from-task");

// Queries.
const getAllStatuses = require("./database/get-all-statuses");
const getAllTags = require("./database/get-all-tags");
const getAllTasks = require("./database/get-all-tasks");
const getAllUsers = require("./database/get-all-users");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((_, res, next) => {
  res.operationError = function(err) {
    const httpCode = /^NO_.+_WITH_ID/.test(err.code) ? 404 : 400;

    res.status(httpCode).json({
      data: null,
      errors: [
        {
          __typename: "OperationError",
          ...err
        }
      ]
    });
  };

  res.validationErrors = function(err) {
    res.status(400).json({
      data: null,
      errors: err.map(errMsg => ({
        __typename: "ValidationError",
        code: "VALIDATION_ERROR",
        message: errMsg
      }))
    });
  };

  res.apiOk = function(data) {
    res.json({ data });
  };

  next();
});

// Router for queries.
app.get("/statuses", (_, res) => {
  const data = getAllStatuses();
  res.apiOk(data);
});

app.get("/tasks", (_, res) => {
  const data = getAllTasks();
  res.apiOk(data);
});

app.get("/tags", (_, res) => {
  const data = getAllTags();
  res.apiOk(data);
});

app.get("/users", (_, res) => {
  const data = getAllUsers();
  res.apiOk(data);
});

// Router for mutations.
app.post("/tasks", (req, res) => {
  const { parentId, title, userId } = req.body;
  const args = {
    parentId,
    title,
    userId
  };

  const errors = validate([
    [args.parentId, isIntOrUndef, "parentId must be an integer when passed"],
    [args.title, isString, "title is missing"],
    [args.userId, isInt, "userId must be an integer"]
  ]);

  if (errors) {
    res.validationErrors(errors);
    return;
  }

  const result = createTask(args);

  if (typeof result.code === "string") {
    res.operationError(result);
    return;
  }

  res.apiOk(result);
});

app.put("/tasks/:taskId(\\d+)/tags", (req, res) => {
  const { tagName } = req.body;
  const { taskId } = req.params;

  const args = {
    taskId: toInt(taskId),
    tagName
  };

  const errors = validate([
    [args.taskId, isInt, "taskId must be an integer"],
    [args.tagName, isString, "tagName is missing"]
  ]);

  if (errors) {
    res.validationErrors(errors);
    return;
  }

  const result = addTagForTask(args);

  if (typeof result.code === "string") {
    res.operationError(result);
    return;
  }

  res.apiOk(result);
});

app.delete("/tasks/:taskId(\\d+)/tags/:tagId(\\d+)", (req, res) => {
  const { tagId, taskId } = req.params;

  const args = {
    tagId: toInt(tagId),
    taskId: toInt(taskId)
  };

  const errors = validate([
    [args.tagId, isInt, "tagId must be an integer"],
    [args.taskId, isInt, "taskId must be an integer"]
  ]);

  if (errors) {
    res.validationErrors(errors);
    return;
  }

  const result = removeTagFromTask(args);

  if (typeof result.code === "string") {
    res.operationError(result);
    return;
  }

  res.apiOk(result);
});

app.all("*", (_, res) => {
  res.sendStatus(404);
});

module.exports = function startRestServer() {
  app.listen(4000, () => {
    console.log(`🚀  REST API server ready at http://localhost:4000`);
  });
};
