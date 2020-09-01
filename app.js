const express = require('express');
const path = require('path');
//init App
const app = express();
//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//Home Route
app.get('/', function(req, res) {
    let articles = [
        {
            id: 1,
            title: 'Article one',
            author: 'Babu',
            body: 'This is article one'
        },
        {
            id: 2,
            title: 'Article two',
            author: 'Babu',
            body: 'This is article two'
        },
        {
            id: 3,
            title: 'Article three',
            author: 'Babu',
            body: 'This is article three'
        }
    ];
    res.render('index', {
        title: 'Articles',
        articles: articles
    });
});
//Add Route
app.get('/articles/add', function(req, res) {
    res.render('add', {
        title: 'Add Article'
    });
});
//Start Server
app.listen(3000, function() {
    console.log('Server started on 3000');
});