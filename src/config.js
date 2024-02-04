const mongoose = require("mongoose");
//db connection
const connect = mongoose.connect("mongodb://127.0.0.1:27017/login-mvc");

//check db connectd or not
connect
  .then(() => {
    console.log("Database connected Successfully!");
  })
  .catch(() => {
    console.log("Database connection failed!");
  });

//create a schema
const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//db collection
//collection has 2 parameters - collection name and the schema
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;
