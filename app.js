const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./db/connection');

//Connect Database
connectDB();
let db = mongoose.connection;
//check the connection
db.once('open', () => console.log('Connected with MongoDB'));
//db error check
db.on('error', (err) => console.log(err));

//init App
const app = express();

//Bring in Models
const Article = require('./models/article');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware parse application
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Home Route
app.get('/', function (req, res) {
  Article.find({}, function (err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles,
      });
    }
  });
});

//get single article
app.get('/article/:id', function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    res.render('article', {
      article: article,
    });
  });
});

//Add Route
app.get('/articles/add', function (req, res) {
  res.render('add', {
    title: 'Add Article',
  });
});
//Add submit post Route
app.post('/articles/add', function (req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  //save to db
  article.save(function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

//Load edit form
app.get('/article/edit/:id', function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    res.render('edit_article', {
      title: 'Edit Article',
      article: article,
    });
  });
});

//edit post or update
app.post('/articles/edit/:id', function (req, res) {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  //specify which one to update
  let query = { _id: req.params.id };
  //save to db
  Article.update(query, article, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

//Delete article
app.delete('/article/:id', function (req, res) {
  let query = { _id: req.params.id };

  Article.remove(query, function (err) {
    if (err) {
      console.log(err);
    }
    res.send('Success');
  });
});

//Start Server
const PORT = process.env.PORT || 3100;
app.listen(PORT, function () {
  console.log('Server started on 3100');
});
