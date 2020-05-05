var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

// Usefull parameter
var time = new Date();

// Imports for crypting passwords
var bcrypt = require('bcrypt');
var saltRounds = 10;

// All created users are set to some privilege level
var privilege = 'user'

// MAIN
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
app.get('/login', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

// Main page
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/main.html'));
});

// Create account page
app.get('/createAccount', function (req, res) {
    res.sendFile(path.join(__dirname + '/create_user.html'))
})

app.get('/deleteSuccess', function (req, res) {
    res.sendFile(path.join(__dirname + 'account_delete_success.html'))
})

// Create users home page
app.get('/home:username', function (req, res) {
    if(req.session.loggedin){
        res.sendFile(path.join(__dirname + '/user_main_page.html'))
    }else {
        res.send('Please login to access this page')
    }
})

// Static files that I need to for some functionality in css and js
app.use('/static', express.static('./static'))

// Post request access user info from database. the username and password to login
app.post('/auth', function (req, res) {

    // Taking the username and password from user
    var username = req.body.username

    if(username){

        // Querying database for the some username if found check if the passwords match
        connection.query('SELECT * FROM accounts WHERE username = ?',
            [username], function (error, results, fields) {
                if (results.length > 0){

                    var password = req.body.password

                    // Checking if the passwords match the hashed one from db
                    bcrypt.compare(password, results[0].password, function (err, result) {

                        // If they are some do some stuff
                        if(result){
                            console.log('Passwords match!')
                            console.log('User _' + req.body.username + '_ login time_ ' + time.getTime())
                            req.session.loggedin = true;
                            req.session.username = username;
                            console.log("Directing " + username + " to a home page")
                            res.redirect('/home' + username);

                            res.end()
                        }else {
                            console.log('The password given is not the some as the hash')
                            console.log(err)
                        }
                    })
                } else {
                    res.send('No account with this name!')
                }
            })
    }else {
        res.send('Please enter Username and Password')
        res.end()
    }
})

// Post request to database to create user
app.post('/create', function (req, res) {

    var username = req.body.username
    // Made one change here!

    //hashing the password before it goes into db
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(req.body.password.toString(), salt, function (err, hash) {
            if(err){
                console.log(err)
            }

            // Password is now HASHED (60bit)
            password = hash;

            // Checking if there is text in fields
            if(username && password){
                // Sending the data to database
                connection.query('INSERT INTO accounts (username, password, access_level) VALUES (?, ?, ?)',
                    [username, password, privilege], function (error, result, fields) {
                        res.redirect('/login')
                        res.end()
                    })
            }else {
                // Waiting couple seconds so the user get to read the text
                setTimeout(function () {
                    console.log('Waiting 3 secs...')
                }, 3000)

                res.redirect('/createAccount')
                res.end()
            }

        })
    })

})

// Deletes the users account that is loggedin
app.post('/deleteAccount', function (req, res) {
    connection.query('DELETE FROM accounts WHERE username=?', [req.body.username], function (error, result, fields) {
        console.log(req.body.username + '_ account successfully deleted')
        res.redirect('/deleteSuccess')
    })
})

// Sending users name for the client so it can be used in website
app.get('/username', function(req, res) {
    if (req.session.loggedin) {
        res.send(req.session.username);
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});

// switching to main page after successful delete
app.get('/backToMain', function (req, res) {
    res.redirect('/main.html')
})

// Logout with the user you loged in
app.get('/logout', function (req, res) {
    console.log('User _' + req.session.username + '_ logout time_ ' + time.getTime())
    req.session.loggedin = false;
    res.send({redirect: '/'})
    res.end()
})

app.listen(3000);