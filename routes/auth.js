const express = require('express');
const mysql = require('mysql');
const querystring = require('querystring');

let router = express.Router();

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'tudu',
    password: 'password',
    database: 'tudu'
});

router.get('/', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/list');
    } else {
        res.render('auth', {
            title: 'Přihlašování'
        });
    }
});

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        if (username === password) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/list');
        }
        /*
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/home');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
         */
    }/* else {
        res.send('Please enter Username and Password!');
        res.end();
    } */
});

router.get('/logout', (req, res, next) => {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        req.session.username = "";
        req.session.loggedout = true;
        res.redirect("/");
    } else {
        res.redirect("/");
    }
});

module.exports = router;
