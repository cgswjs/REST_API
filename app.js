//this script create and insert data to database
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

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
      //delete the entire database if no specific condition provided in {}
      Article.deleteMany(
        {},function(err){
          if(!err){
            res.send("succefully deleted all articles")
          }else{
            res.send(err);
          }
        });
    });

//Request targetting specific article//
app.route("/articles/:customArticleName")
.get(
  function(req,res){
    const articleName = req.params.customArticleName;
    Article.findOne({title:articleName},function(err,foundArticle){
      if(foundArticle){
        res.send(foundArticle)
      }else{
        res.send("No article found")
      }
    });
  })

//put request will delete the original object and insert the new object
.put(
  function(req,res){
    const articleName = req.params.customArticleName;
    Article.update(
      {title:articleName},
      {title:req.body.title,content:req.body.content},
      {overwrite:true},
      function(err){
        if(!err){
          res.send("succefully updated");
        }else{
          res.send(err);
        }
      }
    )
  })

//patch request allows user to partially update object in the database
.patch(
  function(req,res){
    const articleName = req.params.customArticleName;
    Article.update(
      {title:articleName},
      {$set:{title:req.body.title}},
      function(err){
        if(!err){
          res.send("succefully patched database");
        }else{
          res.send(err);
        }
      })
  })
.delete(
  function(req,res){
    Article.deleteOne(
      {title:req.params.customArticleName},function(err){
        if(!err){
          res.send("successfully deleted");
        }else{
          res.send(err);
        }
      }
    );
  });

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
