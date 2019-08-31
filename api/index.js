const apiType = process.argv[2];

if (apiType === undefined) {
  throw new Error("API type is not specified ([rest, graphql])");
  process.exit(1);
}

require(`./api-${apiType}`)();
