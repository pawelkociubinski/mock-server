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
}
