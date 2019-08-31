declare namespace TaskManagerAPI {
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
    id: number;
    fullName: string;
  };

  type Status = {
    id: number;
    name: string;
  };

  type Tag = {
    id: number;
    name: string;
    slug: string;
  };
}
