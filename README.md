## API Documentation

**Important note:**\
Don't run both servers in the same time, because it can cause problems with database syncing.

```bash
yarn api:rest
# Start REST API server on port 4000.

yarn api:graphql
# Start GraphQL API server on port 4000.

yarn db:reset
# Reset the database.
# Requires restarting used API server.
```

### REST API

All responses come with format:

```js
{
  // Type depends on specific endpoint.
  // 'null' only if there are some errors.
  data: object[] | object | null

  // Array of error objects (code + message).
  // If no errors, this field is omited.
  errors: object[]
}
```

#### `GET /statuses`

Get list of all statuses.

#### `GET /tags`

Get list of all tags.

#### `GET /tasks`

Get list of all tasks.

#### `GET /users`

Get list of all users.

#### `POST /tasks`

Create a new task. By default, each new task gets a `To do` status.\
Request body is required:

```js
{
  // (optional) Parent task id.
  // Skip this if task should not be a child of some other task.
  parentId: int;

  // (required) Task title.
  title: string;

  // (required) User id that should be assigned to this task.
  userId: int;
}
```

#### `PUT /tasks/:taskId/tags`

Add new tag for task specified by `taskId`.\
Request body is required:

```js
{
  // (required) Name of the tag that should be added to task tags.
  // If a tag does not exist, it's additionally inserted into database.
  tagName: string;
}
```

#### `DELETE /tasks/:taskId/tags/:tagId`

Remove specific tag from task.\
No request body required.

---

### GraphQL API

Just run the GraphQL API server and open <http://localhost:4000> in your browser. You can find there a GraphQL playground with all available endpoints.

#### Custom error handling

Our GraphQL API has a custom error reporting mechanism (for mutations only) inspired by this talk: <https://www.youtube.com/watch?v=GYBhHUGR1ZY>. That means that you can get a HTTP 200 code when there is some error, like invalid task id. However, there is a (small, but still) possibility of getting for example a Internal Server Error.\
This is how you should work with the mutation response:

```graphql
{
  mutation {
    result: addTagForTask(taskId: 4, tagName: "Tag for task") {
      __typename
      ... on Task {
        id
        title
        tagsId
      }
      ... on OperationError {
        code
        message
      }
    }
  }
}
```

##### Result with error

Example of failed mutation response:

```json
{
  "data": {
    "result": {
      "__typename": "OperationError",
      "code": "TOO_MANY_TAGS",
      "message": "A single task cannot have more than 4 tags"
    }
  }
}
```

##### Successful result

```json
{
  "data": {
    "result": {
      "__typename": "Task",
      "id": 4,
      "title": "Write reusable base styles",
      "tagsId": [3, 6]
    }
  }
}
```
