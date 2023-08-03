const cluster = require("cluster");
const express = require("express");

console.log(cluster.isMaster);
// Is the file being executed in master mode
if (cluster.isMaster) {
  // Cause index.js to be executed again but in child mode
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  // Im a child, im going to act like a server and nothing else
  const app = express();

  function doWork(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {}
  }

  app.get("/", (req, res) => {
    doWork(10000);
    res.send("Hi there");
  });

  app.get("/fast", (req, res) => {
    res.send("This was fast");
  });

  app.listen(8080);
}
