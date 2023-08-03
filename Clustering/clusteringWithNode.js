process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require("cluster");
const express = require("express");
const crypto = require("crypto");
const numCPUs = require("os").cpus().length;

console.log(cluster.isMaster);
// Is the file being executed in master mode
if (cluster.isMaster) {
  // Cause index.js to be executed again but in child mode
  // cluster.fork();
  // cluster.fork();

  // Nice way of clustering without knowing the amount of cpu cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // This is an event listener that runs when a cluster exits/dies
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restarting the cluster
    cluster.fork();
  });
} else {
  // Im a child, im going to act like a server and nothing else
  const app = express();

  app.get("/", (req, res) => {
    crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
      res.send("Hi there");
    });
  });

  app.get("/fast", (req, res) => {
    res.send("This was fast");
  });

  app.listen(8080);
}
