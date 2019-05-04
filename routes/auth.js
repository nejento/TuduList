const express = require('express');
const mysql = require('mysql');

let router = express.Router();

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'tudu',
    password: 'password',
    database: 'tudu'
});

router.get('/', (req, res, next) => {
    if (req.session.loggedin) {
        res.send('logged in');
    } else {
        res.send('logged out');
    }
});

router.post('/', (req, res) => {
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

module.exports = router;
