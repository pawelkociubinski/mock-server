const bodyParser = require("body-parser");
const express = require("express");

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
  res.errResponse = function(status, errors) {
    res.sendStatus(status);
    res.json({ data: null, errors });
  };

  res.apiResponse = function(executor) {
    let data = null;
    let errors = {};

    try {
      data = executor();
    } catch (err) {
      errors = {
        general: err.message
      };
    }

    res.json({ data, errors });
  };

  next();
});

// Router for queries.
app.get("/statuses", (_, res) => {
  res.send(getAllUsers());
});

app.get("/tasks", (_, res) => {
  res.send(getAllTasks());
});

app.get("/tags", (_, res) => {
  res.send(getAllTags());
});

app.get("/users", (_, res) => {
  res.send(getAllUsers());
});

// Router for mutations.
app.post("/tasks", (req, res) => {
  const { parentId, title, userId } = req.body;

  if (
    (parentId && typeof parentId !== "number") ||
    typeof title !== "string" ||
    typeof userId !== "number"
  ) {
    res.sendStatus(400);
    return;
  }

  res.apiResponse(() => {
    return createTask({
      parentId,
      title,
      userId
    });
  });
});

app.put("/tasks/:taskId(\\d+)/tags", (req, res) => {
  const { tagName } = req.body;

  if (typeof tagName !== "string") {
    res.sendStatus(400);
    return;
  }

  res.apiResponse(() => {
    return addTagForTask({
      taskId: parseInt(req.params.taskId, 10),
      tagName
    });
  });
});

app.delete("/tasks/:taskId(\\d+)/tags/:tagId(\\d+)", (req, res) => {
  res.send(
    removeTagFromTask({
      tagId: parseInt(req.params.tagId, 10),
      taskId: parseInt(req.params.taskId, 10)
    })
  );
});

app.all("*", (_, res) => {
  res.sendStatus(404);
});

module.exports = function startRestServer() {
  app.listen(4001, () => {
    console.log(`🚀  REST API server ready at http://localhost:4001`);
  });
};
