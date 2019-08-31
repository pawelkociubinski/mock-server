const createConnection = require("./connection");

const database = createConnection();

module.exports = class Entity {
  constructor(tableName) {
    this.tableName = tableName;
  }

  get collection() {
    return database.get(this.tableName);
  }

  nextId() {
    const [lastId] = this.collection
      .orderBy(["id"], ["desc"])
      .take(1)
      .map("id")
      .value();

    if (typeof lastId !== "number") {
      throw new Error("Unable to determine last used 'id'");
    }

    return lastId + 1;
  }

  getAll() {
    return this.collection.value();
  }

  getOne(id) {
    return this.findOne({ id });
  }

  findOne(query) {
    return this.collection.find(query).value();
  }

  findMany(query) {
    return this.collection.filter(query).value();
  }

  insert(record) {
    return this.collection.push(record).write();
  }

  update(id, partial) {
    return this.collection
      .find({ id })
      .assign(partial)
      .write();
  }
};
