const slug = require("slug");

const { Tags, Tasks } = require("./entities");

module.exports = function addTagForTask({ tagName, taskId }) {
  const task = Tasks.getOne(taskId);

  if (!task) {
    throw new Error(`No task with id: ${taskId}`);
  }

  // Allow only 4 tags for each task.
  if (task.tagsId.length >= 4) {
    throw new Error(`A single task cannot have more than 4 tags`);
  }

  // Create url-safe slug for a tag.
  const tagSlug = slug(tagName);

  // We use slug to determine if similar tag already exists.
  const tagWithTheSameSlug = Tags.findOne({ slug: tagSlug });

  const taskTagsId = task.tagsId;

  // Store id of the tag that will be added to task record.
  let newTagId = tagWithTheSameSlug ? tagWithTheSameSlug.id : undefined;

  // Create new tag if no similar tag found.
  if (!tagWithTheSameSlug) {
    const nextId = Tags.nextId();

    newTagId = nextId;

    Tags.insert({
      id: nextId,
      name: tagName,
      slug: tagSlug
    });
  }

  // Add tag id only if it's not added already.
  if (taskTagsId.indexOf(newTagId) === -1) {
    taskTagsId.push(newTagId);
  }

  return Tasks.update(taskId, {
    tagsId: taskTagsId
  });
};
