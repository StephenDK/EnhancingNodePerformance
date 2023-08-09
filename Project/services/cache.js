const mongoose = require("mongoose");

// Get reference to mongoose exec function
// and override the function

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
  console.log("IM ABOUT TO RUN A QUERY");

  return exec.apply(this, arguments);
};
