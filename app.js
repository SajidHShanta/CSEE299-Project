const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

//set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static("public"));

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

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
