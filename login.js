var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var app = express()

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'asdasd123',
    database : 'users'
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// TODO Need to make a basic page where you can choose to make account or login

// Login page
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

// Create account page
app.get('/createAccount', function (req, res) {
    res.sendFile(path.join(__dirname + '/create_user.html'))
})

// Static files that I need to for some functionality in css and js
app.use('/static', express.static('./static'))

// Post request access user info from database. the username and password to login
app.post('/auth', function (req, res) {

    var username = req.body.username
    var password = req.body.password

    // TODO Need to hash the plain password before it goes to db

    if(username && password){

        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?',
            [username, password], function (error, results, fields) {
                if (results.length > 0){
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/home');
                } else {
                    res.send('Incorrect username and/or password!')
                }
                res.end()
            })
    }else {
        res.send('Please enter Username and Password')
        res.end()
    }
})

// Post request to database to create user
app.post('/create', function (req, res) {

    var username = req.body.username
    var password = req.body.password

    // TODO Need to hash the password before it goes into db

        // Checking if there is text in fields
        if(username && password){
            // Sending the data to database
            connection.query('INSERT INTO accounts (username, password) VALUES (?, ?)',
                [username, password], function (error, result, fields) {
                    res.redirect('/')
                    res.end()
                })
        }else {
            res.send('Creating account failed!')
            res.end()
        }

})


app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        // TODO Need to make a personal login page that displays some personal info
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.listen(3000);