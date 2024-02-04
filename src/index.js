const express = require("express");
const pasth = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

//creating express application
const app = express();

//convert data into json format
app.use(express.json());

//express URL encoded method
app.use(express.urlencoded({ extended: false }));

//use EJS as the view engine
app.set("view engine", "ejs");

//Add static folder path for public folder for styles
app.use(express.static("public"));

//app get method 1st- root parameter, 2nd - call back function (has 2 paramerters request and response)
app.get("/", (req, res) => {
  //render login page
  res.render("login");
});

//app get method for signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

//Register user
app.post("/signup", async (req, res) => {
  //creating object to get data from the signup form
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  //check if the user already exist in the db
  const existingUser = await collection.findOne({ name: data.name });

  if (existingUser) {
    res.send("User already exists. Please choose a different Username");
  } else {
    //hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    //replace the hash pass with original pass
    data.password = hashedPassword;

    //insert data into the db
    const userData = await collection.insertMany(data);
    console.log(userData);
  }
});

////////////
//login User
////////////
app.post("/login", async (req, res) => {
  try {
    //find the user in the db
    const checkUser = await collection.findOne({ name: req.body.username });

    // Check if the user exists
    if (!checkUser) {
      return res.send("Invalid Credentials");
    }

    //compare the hash pass from the db with plain text
    const isPassMatch = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );

    if (isPassMatch) {
      // Passwords match, redirect to home page or perform other actions
      res.render("home");
    } else {
      // Passwords do not match
      res.send("Invalid Credentials");
    }
  } catch {
    // Handle any errors that occurred during the process

    res.send("An error occurred during login. Please try again.");
  }
});

//Choose port to run application
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
