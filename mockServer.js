var jsonServer = require("json-server");
var server = jsonServer.create();
var router = jsonServer.router(require("./mock.js")());
var middlewares = jsonServer.defaults();

server.use(function (_, _, next) {
  setTimeout(next, 1000);
});
server.use(middlewares);
server.use(router);
server.listen(5000, function () {
  console.log("JSON Server is running");
});
