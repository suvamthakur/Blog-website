//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Load environment variables from .env file
require('dotenv').config();

const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASS);

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.9mxdtli.mongodb.net/blogDB`);

// Schema
let posts = [];
const blogSchema = new mongoose.Schema({
  title: String,
  description: String
})

// Collection/Model
const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res)=> {
  Blog.find({})
        .then(function(result) {
          res.render("home", {content : homeStartingContent, articles: result});
        })
        .catch(function(err) {
          console.log(err);
        })
})

app.get("/compose", (req, res)=> {
  res.render("compose");
})
app.post("/compose", (req, res)=> {
  let articleTitle = req.body.postTitle;
  let articleDescription = req.body.postDescription;

  const post = new Blog({
    title: articleTitle,
    description: articleDescription
  })
  
  Blog.insertMany(post)
        .then(function() {
          console.log("Post added to the database")
        })
        .catch(function() {
          console.log("Error");
        })
  res.redirect("/");
})

app.get("/posts/:individual", (req, res)=> {
  const reqRoute = req.params.individual;
  Blog.find({})
        .then(function(result) {
          result.forEach(function(keys) {
            if(_.lowerCase(reqRoute) == _.lowerCase(keys.title)) {
              res.render("post", {header: reqRoute, para: keys.description})
            }
          })
        })
        .catch(function(err) {
          console.log(err);    
        })
})

app.get("/about", (req, res)=> {
  res.render("about", {content: aboutContent});
})

app.get("/contact", (req, res)=> {
  res.render("contact", {content: contactContent});
})

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
