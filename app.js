const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

//set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

//databasae connection
mongoose.connect("mongodb+srv://admin-hm:test123@cluster0.zintc.mongodb.net/hakunamatataDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.get("/", (req,  res) => {
  res.render("landing-page")
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.render("home");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
