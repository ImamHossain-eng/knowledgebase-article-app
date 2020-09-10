const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
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

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//Express validator middleware
app.post('/user', [
  // username must be an email
  body('username').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 })
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});

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
  req.checkBody('title', 'This is required').notEmpty();
  req.checkBody('author', 'This is required').notEmpty();
  req.checkBody('body', 'This is required').notEmpty();
  //Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add',{
      title: 'Add Article',
      errors:errors
    });
  } else {
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
      req.flash('success', 'Article Saved Successfully');
      res.redirect('/');
    }
  });    
  }
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
      req.flash('success', 'Article updated');
      res.redirect('/');
    }
  });
});

//Delete article 
app.delete('/article/:id', function (req, res) {
  let query = {_id:req.params.id};

  Article.findByIdAndRemove(query, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

//Start Server
const PORT = process.env.PORT || 3100;
app.listen(PORT, function () {
  console.log('Server started on 3100');
});
