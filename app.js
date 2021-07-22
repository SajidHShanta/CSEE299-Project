const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

//set view engine
app.set('view engine', 'ejs');

//set static folder
app.use(express.static("public"));

//databasae connection
//to-do

app.get('/', (req,  res) => {
  res.send('Hello World!')
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
