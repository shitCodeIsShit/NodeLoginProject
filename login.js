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

// Login page
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

// Create account page
app.get('/createAccount', function (req, res) {
    res.sendFile(path.join(__dirname + '/create_user.html'))
})

// Post request to database about the username and password to login
app.post('/auth', function (req, res) {

    var username = req.body.username
    var password = req.body.password

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

    if(username && password){
        connection.query('INSERT INTO accounts (username, password) VALUES (?, ?)',
            [username, password], function (error, result, fields) {
                console.log(result)
                console.log(error)
                setTimeout(function () {

                }, 10000)
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
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.listen(3000);