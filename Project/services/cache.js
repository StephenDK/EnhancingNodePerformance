const { channel } = require("diagnostics_channel");
const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

client.get = util.promisify(client.get);

// Get reference to mongoose exec function
// and override the function

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  console.log("IM ABOUT TO RUN A QUERY");

  //   console.log(this.getQuery());
  //   console.log(this.mongooseCollection.name);

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  //   console.log(key);

  // See if we have a value for 'key' in redis
  const cacheValue = await client.get(key);

  // If we do, return value
  if (cacheValue) {
    console.log(cacheValue);
  }

  // Otherwise, issue the query and store the result in redis

  const result = await exec.apply(this, arguments);
  console.log(result);
};
