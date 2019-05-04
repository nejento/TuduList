const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

let router = express.Router();

let pool = mysql.createPool({
    connectionLimit: 5,
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
        pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results, fields) => {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.uid = results[0].id;
                req.session.username = results[0].username;
                req.session.afterLogin = true;
                res.redirect('/list');
            } else {
                res.render('auth', {
                    title: 'Přihlašování',
                    username: username,
                    infobox: "Zadali jste špatné uživatelské jméno nebo heslo Zkuste to znovu.",
                    infoboxType: "error"
                });
            }
        });

    } else {
        res.render('auth', {
            title: 'Přihlašování',
            infobox: "Zadejte uživatelské jméno a heslo.",
            infoboxType: "warn"
        });
    }
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
