//this script create and insert data to database
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express()

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));

//use public directory store static files
app.use(express.static("public"))

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true,useUnifiedTopology:true});

const articleSchema = new mongoose.Schema({
    title:String,
    content:String
  });
const Article = mongoose.model("Article",articleSchema);

//chaining get post and delete by using app.route()
app.route("/articles")
.get(
    function(req,res){
      Article.find({},function(err,foundArticles){
      if(!err){
        res.send(foundArticles);
      }else{
        res.send(err);
      }
    });
  })
.post(
    function(req,res){

      const newArticle = new Article({
      title:req.body.title,
      content:req.body.content
    });

      newArticle.save(function(err){
        if(err){
          res.send(err);
        }else{
          res.send("Succefully added a new article");
        }
    });
  })
.delete(
    function(req,res){
      Article.deleteMany(
        {},function(err){
          if(!err){
            res.send("succefully deleted all articles")
          }else{
            res.send(err);
          }
        });
    });


app.listen(3000,function(){
  console.log("Server started on port 3000");
});
