const { Tasks } = require("./entities");
const { operationError } = require("./utils");

module.exports = function removeTagFromTask({ taskId, tagId }) {
  const task = Tasks.getOne(taskId);

  if (!task) {
    return operationError(`No task with id: ${taskId}`, "NO_TASK_WITH_ID");
  }

  const tagsId = task.tagsId.filter(currentTagId => currentTagId !== tagId);

  return Tasks.update(taskId, {
    tagsId
  });
};
