const apiType = process.argv[2];

if (apiType === undefined) {
  throw new Error("API type is not specified ([rest, graphql])");
  process.exit(1);
}

const startServer =
  apiType === "graphql" ? require("./api-graphql") : require("./api-rest");

startServer();
