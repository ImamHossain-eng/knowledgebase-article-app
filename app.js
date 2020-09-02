const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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


//Home Route
app.get('/', function(req, res) {
    Article.find({}, function(err, articles) {
        if(err){
            console.log(err);
        }else{
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});
//Add Route
app.get('/articles/add', function(req, res) {
    res.render('add', {
        title: 'Add Article'
    });
});
//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server started on 3000');
});