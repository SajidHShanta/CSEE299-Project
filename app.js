require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.json());

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
  googleId: String,
  isVerified: {
    type: String,
    default: "no",
  },
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post"
    }
  ],
});

//for hash and salt password and save user in mongodb database
userSchema.plugin(passportLocalMongoose);

//for google login/sign up
userSchema.plugin(findOrCreate);

//create user mongoose model
const User = mongoose.model('User', userSchema);

// use LocalStrategy for passport session support
passport.use(User.createStrategy());

// use serialize and deserialize of User model for passport session support
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    User.findOrCreate({ googleId: profile.id }, {username: profile.emails[0].value, name: profile.displayName}, function (err, user) {
      return cb(err, user);
    });
  }
));

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  postContent: String,
  isAnonymus: {
    type: String,
    default: "off",
  },
  helpfull: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  ],
}, {timestamps: true});

//create post mongoose model
const Post = mongoose.model('Post', postSchema);

//quiz Schema
const quizSchema = new mongoose.Schema({
  question: String,
  options: [
    {
      type: String,
    }
  ],
  answerIndex: Number,
});

//create post mongoose model
const Quiz = mongoose.model('Quiz', quizSchema);

app.get("/", (req,  res) => {
  if(req.isAuthenticated()){
    Post.find({})
      .populate("user", "name")
      .sort({createdAt:-1})
      .limit(20)
      .exec((err, data) => {
        if(err){
          console.log(err);
        } else {
          //console.log(data);
          res.render("home", {user: req.user, posts: data});
        }
      })
  } else{
    res.render("landing-page");
  }
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ['profile',"email"] })
);

app.get("/auth/google/hakunamatata",
  passport.authenticate("google", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect to home page.
    res.redirect('/');
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get("/profile", (req, res)=> {
  if(req.isAuthenticated()){
    Post.find({user: req.user.id })
      .populate("user", "name")
      .sort({createdAt:-1})
      .limit(20)
      .exec((err, data) => {
        if(err){
          console.log(err);
        } else {
          //console.log(data);
          res.render("profile", {user: req.user, posts: data});
        }
      })
  } else{
    res.render("landing-page");
  }
});

//singale post page
app.get("/posts/:id", (req, res) => {
  const postID = req.params.id;
  if(req.isAuthenticated()){
    Post.findById(postID, (err, foundPost) => {
      res.render("post", {
        user: req.user,
        post: foundPost
      });
  })
  .populate("user", "name")
  } else{
    res.redirect("/");
  }
});

//Quiz Handeler
app.get("/verify", (req, res) => {
  res.render("start-quiz");
});
app.get("/quiz", (req, res) => {
  if(req.isAuthenticated()){
    Quiz.find({}, (err, foundItems) => {
      res.render("quiz", {user: req.user, quizes: foundItems});
    });
  } else {
    res.redirect("/");
  }
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

app.post("/post", async (req, res) => {
  const newPost = new Post({
    user: req.body.userID,
    postContent: req.body.postContent,
    isAnonymus: req.body.isAnonymus
  });
  try {
    //save posts to Post model
    const post = await newPost.save();
    //console.log(post);
    //save posts to User model
    await User.updateOne({
      _id: req.body.userID
    }, {
      $push: {
        posts: post._id
      }
    });
    res.redirect(req.body.currentPath);
  } catch(err) {
    console.log(err);
  }
});

app.post("/helpfull", async (req, res) => {
  try {
    //save posts to User model
    await Post.updateOne({
      _id: req.body.postID
    }, {
      $addToSet: {
        helpfull: req.body.userID
      }
    });
    res.redirect("/posts/"+req.body.postID);
  } catch(err) {
    console.log(err);
  }
});

app.post("/quiz", async (req, res) => {
  let score = 0, feild = "";

  for (let i = 1; i < req.body.totalQ; i++) {
    feild = "q"+i;
    //console.log("  Q"+i+" :"+ req.body[feild]);
    score+=Number(req.body[feild]);
  }

  let resultText = "";
  if (score>=7) {
    await User.updateOne({
      _id: req.body.userID
    }, {
      isVerified: "yes"
    });
    resultText="Congratulations message bla bla";
  } else {
    resultText = "Sorry, Your schore is bellow 70%. Try again bla bla";
  }
  //console.log(score);
  res.render("quiz-result", {resultText: resultText});
});

//temoporary insert quiz : this per will delete latter
app.get("/insertquiz", (req, res) => {
  res.render("insert-quiz");
});
app.post("/insertquiz", (req, res) => {
  const newQuiz = new Quiz({
    question: req.body.Q,
    options: [req.body.op1, req.body.op2, req.body.op3, req.body.op4],
    answerIndex: req.body.cA,
  });
  newQuiz.save();
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
});
