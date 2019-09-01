declare namespace TaskManager {
  type Task = {
    id: number;
    parentId: number | null;
    slug: string;
    statusId: number;
    tagsId: number[];
    title: string;
    userId: number;
  };

  type User = {
    fullName: string;
    id: number;
  };

  type Status = {
    id: number;
    name: string;
    slug: string;
  };

  type Tag = {
    id: number;
    name: string;
    slug: string;
  };

  enum OperationErrorCode {
    DUPLICATE_TASK,
    NO_TASK_WITH_ID,
    NO_USER_WITH_ID,
    TOO_MANY_TAGS
  }

  type OperationError = {
    code: OperationErrorCode;
    message: string;
  };

  type TaskResult = Task | OperationError;
}

declare namespace TaskManagerAPI {
  // Those types are shared between GraphQL and REST.
  enum OperationErrorCode {
    DUPLICATE_TASK,
    NO_TASK_WITH_ID,
    NO_USER_WITH_ID,
    TOO_MANY_TAGS
  }

  type OperationError = {
    code: OperationErrorCode;
    message: string;
  };

  // Those types are specific for REST API.
  enum ValidationErrorCode {
    VALIDATION_ERROR
  }

  type ValidationError = {
    code: ValidationErrorCode;
    message: string;
  };
}
