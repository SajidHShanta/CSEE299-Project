require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

//set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

//setup session
app.use(session({
  secret: "nscln snk slsdnaaw anxcoc42n",
  resave: false,
  saveUninitialized: true,
}));

//initialize passport for authentication
app.use(passport.initialize());
//use passport to managing the session
app.use(passport.session());

//databasae connection
mongoose.connect(process.env.MONGOOSE_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
//set useCreateIndex to avoid DeprecationWarning
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
});

//for hash and salt password and save user in mongodb database
userSchema.plugin(passportLocalMongoose);

//create user mongoose model
const User = mongoose.model('User', userSchema);

// use LocalStrategy for passport session support
passport.use(User.createStrategy());

// use serialize and deserialize of User model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const postSchema = new mongoose.Schema({
  userID: String,
  postContent: String,
  isAnonymus: String,
});

//create post mongoose model
const Post = mongoose.model('Post', postSchema);

app.get("/", (req,  res) => {
  if(req.isAuthenticated()){
    res.render("home", {user: req.user});
  } else{
    res.render("landing-page");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});

app.post("/register", (req, res) => {
  //register() is a mathod of passport-local-mongoose package
  User.register({name: req.body.name, username: req.body.username},req.body.password, (err, user) =>{
    if(err) {
      console.log(err);
      res.redirect("/register");
    } else{
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  });
});

app.post("/login", passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
  res.redirect("/");
});

app.post("/post", (req, res) => {
  const newPost = new Post({
    userID: req.body.userID,
    postContent: req.body.postContent,
    isAnonymus: req.body.isAnonymus
  });
  newPost.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
});
