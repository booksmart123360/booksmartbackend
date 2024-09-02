const mongoose = require("mongoose");

module.exports.connectToDb = (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Database connected");
    })
    .catch((e) => {
      console.error("Error connecting to database:", e);
    });
};
