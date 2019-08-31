const { Tasks } = require("./entities");

module.exports = function removeTagFromTask({ taskId, tagId }) {
  const task = Tasks.getOne(taskId);

  if (!task) {
    throw new Error(`No task with id: ${taskId}`);
  }

  const tagsId = task.tagsId.filter(currentTagId => currentTagId !== tagId);

  return Tasks.update(taskId, {
    tagsId
  });
};
