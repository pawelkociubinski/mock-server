## API Documentation

```bash
yarn api:rest
# Start REST API server on port 4000.

yarn api:graphql
# Start GraphQL API server on port 4000.

yarn db:reset
# Reset the database.
# Requires restarting used API server.
```

**Important note:** Don't run both servers in the same time, because it can cause problems with database syncing.

### REST API

We used Postman app to generate a documentation for REST API. You can see it here: <https://documenter.getpostman.com/view/4432831/SVfRv95c?version=latest>.

---

### GraphQL API

Just run the GraphQL API server and open <http://localhost:4000> in your browser. You can find there a GraphQL playground with all available endpoints.

#### Custom error handling

Our GraphQL API has a custom error reporting mechanism (for mutations only) inspired by this talk: <https://www.youtube.com/watch?v=GYBhHUGR1ZY>. That means that you can get a HTTP 200 code even when mutation failed because of some error, like invalid task id.\
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
