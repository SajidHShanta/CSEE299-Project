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
}, {timestamps: true});

//create post mongoose model
const Post = mongoose.model('Post', postSchema);

app.get("/", (req,  res) => {
  if(req.isAuthenticated()){
    Post.find({})
      .populate("user", "name")
      .select({
        _id: 0,
      })
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
    res.redirect("/");
  } catch(err) {
    console.log(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
});
