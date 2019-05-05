const express = require('express');
const db = require('../db');
const xss = require("xss");
const bcrypt = require('bcrypt');
const saltRounds = 10;

let router = express.Router();

router.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/list');
    } else {
        res.render('auth', {
            title: 'Přihlašování'
        });
    }
});

router.post('/login', (req, res) => {
    let username = xss(req.body.username.trim());
    let password = req.body.password;
    if (username && password) {
        db.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE username = ?', username, (err, results, fields) => {
                if (results.length > 0) {
                    bcrypt.compare(password, results[0].password, (e, r) => {
                        if (!e) {
                            if (r) {
                                req.session.loggedin = true;
                                req.session.userid = results[0].id;
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
                        }
                    });
                } else {
                    res.render('auth', {
                        title: 'Přihlašování',
                        username: username,
                        infobox: "Něco se pokazilo. Zkuste to prosím později.",
                        infoboxType: "error"
                    });
                }
            });
            conn.release();
        });
    } else {
        res.render('auth', {
            title: 'Přihlašování',
            infobox: "Zadejte uživatelské jméno a heslo.",
            infoboxType: "warn"
        });
    }
});

router.get('/logout', (req, res) => {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        req.session.username = "";
        req.session.loggedout = true;
        res.redirect("/");
    } else {
        res.redirect("/");
    }
});

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Registrace',
    });
});

router.post('/register', (req, res) => {
    let username = xss(req.body.username.trim());
    let password = req.body.password;
    if (username && password) {
        if (/(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,}/g.test(password)) {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    res.render('register', {
                        title: 'Registrace',
                        username: username,
                        infobox: "Nepovedlo se správně zahashovat heslo.",
                        infoboxType: "error"
                    });
                } else {
                    db.getConnection((err, conn) => {
                        conn.query('SELECT * FROM users WHERE username = ?', username, (err, results) => {
                            if (results.length > 0) {
                                res.render('register', {
                                    title: 'Registrace',
                                    username: username,
                                    infobox: "Uživatelské jméno je již použito. Vyberte si prosím jiné.",
                                    infoboxType: "error"
                                });
                            } else {
                                conn.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
                                    if (!err) {
                                        conn.query('INSERT INTO todos (user, task, done) VALUES ?', [[[result.insertId, "Vynést odpadky", 0], [result.insertId, "Nakoupit na příští týden", 0], [result.insertId, "Umýt sporát", 1]]], (err, results) => {
                                            if (!err) {
                                                res.render('auth', {
                                                    title: 'Přihlašování',
                                                    infobox: "Uživatel " + username + " byl úspěšně zaregistrován. Nyní se můžete přihlásit.",
                                                    infoboxType: "ok"
                                                });
                                            } else {
                                                console.log(err);
                                                res.render('auth', {
                                                    title: 'Přihlašování',
                                                    infobox: "Došlo k chybě, avšak uživatel " + username + " byl měl být úspěšně zaregistrován. Nyní se můžete přihlásit.",
                                                    infoboxType: "warn"
                                                });
                                            }
                                        });
                                    } else {
                                        res.render('register', {
                                            title: 'Registrace',
                                            username: username,
                                            infobox: "Registrace se nezdařila. Zkuste to prosím znovu",
                                            infoboxType: "error"
                                        });
                                    }
                                });
                            }
                        });
                        conn.release();
                    });
                }
            });
        } else {
            res.render('register', {
                title: 'Registrace',
                infobox: "Heslo nesplňuje minimální požadavky na bezpečnost.",
                infoboxType: "error"
            });
        }
    } else {
        res.render('register', {
            title: 'Registrace',
            infobox: "Zadejte uživatelské jméno a heslo.",
            infoboxType: "warn"
        });
    }
});

module.exports = router;
