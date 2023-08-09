const mongoose = require("mongoose");

// Get reference to mongoose exec function
// and override the function

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
  console.log("IM ABOUT TO RUN A QUERY");

  //   console.log(this.getQuery());
  //   console.log(this.mongooseCollection.name);

  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name,
  });

  console.log(key);

  return exec.apply(this, arguments);
};