const slug = require("slug");

const { Tasks, Users } = require("./entities");
const { operationError } = require("./utils");

module.exports = function createTask({ parentId, title, userId }) {
  const taskSlug = slug(title);

  const taskWithTheSameSlug = Tasks.findOne({ slug: taskSlug });

  // Don't allow creating a task with the same slug.
  // Slug should be unique.
  if (taskWithTheSameSlug) {
    return operationError(
      `There is already a task with the same or similar name`,
      "DUPLICATE_TASK"
    );
  }

  const user = Users.getOne(userId);

  if (user === undefined) {
    return operationError(`No user with id: ${userId}`, "NO_USER_WITH_ID");
  }

  // Create a task with default status set to 'To-do'.
  return Tasks.insert({
    id: Tasks.nextId(),
    parentId: parentId ? parentId : null,
    slug: taskSlug,
    statusId: 1,
    tagsId: [],
    title: title,
    userId: userId
  });
};
