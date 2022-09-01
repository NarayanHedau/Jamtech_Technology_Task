const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/jamtech_Database")
  .then(() => {
    console.log("Database connected Successfully");
  })
  .catch(() => {
    console.log("Unable to connect Database");
  });
