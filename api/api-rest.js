const bodyParser = require("body-parser");
const express = require("express");
const { isInt, isIntOrUndef, isString, toInt, validate } = require("./utils");

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
  res.apiError = function(err) {
    res.sendStatus(400);
    res.json({ data: null, errors: Array.isArray(err) ? err : [err] });
  };

  res.apiOk = function(data) {
    res.json({ data });
  };

  next();
});

// Router for queries.
app.get("/statuses", (_, res) => {
  try {
    const data = getAllUsers();
    res.apiOk(data);
  } catch (err) {
    res.apiError([err.message]);
  }
});

app.get("/tasks", (_, res) => {
  try {
    const data = getAllTasks();
    res.apiOk(data);
  } catch (err) {
    res.apiError([err.message]);
  }
});

app.get("/tags", (_, res) => {
  try {
    const data = getAllTags();
    res.apiOk(data);
  } catch (err) {
    res.apiError([err.message]);
  }
});

app.get("/users", (_, res) => {
  try {
    const data = getAllUsers();
    res.apiOk(data);
  } catch (err) {
    res.apiError([err.message]);
  }
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
    [args.parentId, isIntOrUndef, "Parent task id must be an integer"],
    [args.title, isString, "Task title is missing"],
    [args.userId, isInt, "User id must be an integer"]
  ]);

  if (errors) {
    res.apiError(errors);
    return;
  }

  try {
    const data = createTask(args);
    res.apiOk(data);
  } catch (err) {
    res.apiError([err.message]);
  }
});

app.put("/tasks/:taskId(\\d+)/tags", (req, res) => {
  const { tagName } = req.body;
  const { taskId } = req.params;

  const args = {
    taskId: toInt(taskId),
    tagName
  };

  const errors = validate([
    [args.taskId, isInt, "Task id must be an integer"],
    [args.tagName, isString, "Tag name is missing"]
  ]);

  if (errors) {
    res.apiError(errors);
    return;
  }

  try {
    const data = addTagForTask(args);
    res.apiOk(data);
  } catch (err) {
    res.apiError([err.message]);
  }
});

app.delete("/tasks/:taskId(\\d+)/tags/:tagId(\\d+)", (req, res) => {
  const { tagId, taskId } = req.params;

  const args = {
    tagId: toInt(tagId),
    taskId: toInt(taskId)
  };

  const errors = validate([
    [args.tagId, isInt, "Tag id must be an integer"],
    [args.taskId, isInt, "Task id must be an integer"]
  ]);

  if (errors) {
    res.apiError(errors);
    return;
  }

  try {
    const data = removeTagFromTask(args);
    res.apiOk(data);
  } catch (err) {
    res.apiError([err.message]);
  }
});

app.all("*", (_, res) => {
  res.sendStatus(404);
});

module.exports = function startRestServer() {
  app.listen(4000, () => {
    console.log(`🚀  REST API server ready at http://localhost:4000`);
  });
};
