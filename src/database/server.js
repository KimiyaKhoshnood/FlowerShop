const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("src/database/db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
    // "server": "json-server src/database/db.json --port 3004"
