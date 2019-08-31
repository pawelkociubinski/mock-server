const slug = require("slug");

const { Tasks, Users } = require("./entities");

module.exports = function createTask({ parentId, title, userId }) {
  const taskSlug = slug(title);

  const taskWithTheSameSlug = Tasks.findOne({ slug: taskSlug });

  // Don't allow creating a task with the same slug.
  // Slug should be unique.
  if (taskWithTheSameSlug) {
    throw new Error(`There is already a task with the same or similar name`);
  }

  const user = Users.getOne(userId);

  if (user === undefined) {
    throw new Error(`No user with id: ${userId}`);
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
