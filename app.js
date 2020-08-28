//jshint esversion:6
require('dotenv').config();
const express = require("express");
const body_parser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const md5 = require("md5");

app.set("view engine", "ejs");
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });

  newUser.save(function (err) {
    if (err) {
      console.log("error saving data" + err);
    } else {
      console.log("User saved");
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log("error login data" + err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          console.log("User Logged In");
          res.render("secrets");
        }
        else{
          console.log("Wrong password!!");
        }
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Connected to 3000");
});
