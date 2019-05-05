const express = require('express');
const db = require('../db');
const xss = require("xss");
let router = express.Router();

/*TODO:
 * Nahodit na server
 * Přidat dokumentaci kódu
 * Dodělat stylování
 */

let getPolozky = (uid, polozky) => {
    db.getConnection((err, conn) => {
        conn.query('SELECT * FROM todos WHERE ?', {user: uid}, (err, results) => {
            if (results.length > 0) {
                let items = [];
                for (let i = 0; i < results.length; i++) {
                    items.push({id: results[i].id, task: results[i].task, done: (results[i].done === 1)});
                }
                polozky(items);

            } else polozky({});
        });
        conn.release();
    });
};

router.get('/', (req, res) => {
    if (req.session.loggedin) {
        if (req.session.afterLogin) {
            req.session.afterLogin = false;
            getPolozky(req.session.userid, (polozky) => {
                res.render('list', {
                    title: 'Seznam',
                    polozky: polozky,
                    infobox: "Byli jste úspěšně přihlášeni",
                    infoboxType: "ok",
                    logged: true,
                    username: req.session.username
                });
            });
        } else {
            getPolozky(req.session.userid, (polozky) => {
                res.render('list', {
                    title: 'Seznam',
                    polozky: polozky,
                    logged: true,
                    username: req.session.username
                });
            });
        }
    } else {
        res.redirect("/auth");
    }
});

// Přidání položky
router.post('/add', (req, res) => {
    if (req.session.loggedin) {
        let addedTask = xss(req.body.task.trim());
        if (addedTask.length <= 0) {
            res.status(406);
            res.send('Přidávaná položka nesmí mít nulovou velikost');
        } else {
            db.getConnection((err, conn) => {
                conn.query('INSERT INTO todos SET ?', {user: req.session.userid, task: addedTask, done: 0}, (err, result) => {
                    if (!err) {
                        conn.query('SELECT * FROM todos WHERE ?', {id: result.insertId}, (err, results) => {
                            res.send({id: "task-" + results[0].id, task: results[0].task, done: results[0].done});
                        });
                    } else {
                        res.status(406);
                        res.send("Error: Nepovedlo se přidat task");
                    }
                });
                conn.release();
            });
        }
    } else {
        res.status(401);
        res.send("Nejste přihlášen");
    }

});

//Editace položky
router.put('/edit', (req, res) => {
    if (req.session.loggedin) {
        let editedTask = xss(req.body.task.trim()),
            taskID = xss(req.body.id.replace("task-", ""));
        if (editedTask.length <= 0) {
            res.status(406);
            res.send('Upravovaná položka nesmí mít nulovou velikost');
        } else {
            db.getConnection((err, conn) => {
                conn.query('UPDATE todos SET task = ?, done = ? WHERE id = ? AND user = ?', [editedTask, 0, taskID, req.session.userid], (err, result) => {
                    if (!err) {
                        conn.query('SELECT * FROM todos WHERE ?', {id: taskID}, (err, results) => {
                            res.send({task: results[0].task, done: results[0].done});
                        });
                    } else {
                        console.log(err);
                        res.status(406);
                        res.send("Error: Nepovedlo se upravit task");
                    }
                });
                conn.release();
            });
        }
    } else {
        res.status(401);
        res.send("Nejste přihlášen");
    }
});

//Editace položky
router.put('/check', (req, res) => {
    if (req.session.loggedin) {
        if (req.body.id && (req.body.done === "check" || req.body.done === "uncheck")) {
            let taskID = xss(req.body.id.replace("task-", ""));
            db.getConnection((err, conn) => {
                conn.query('UPDATE todos SET done = ? WHERE id = ? AND user = ?', [(req.body.done === "check" ? 1 : 0), taskID, req.session.userid], (err, result) => {
                    if (!err) {
                        conn.query('SELECT * FROM todos WHERE ?', {id: taskID}, (err, results) => {
                            res.send((results[0].done === 1 ? "checked" : "unchecked"));
                        });
                    } else {
                        console.log(err);
                        res.status(406);
                        res.send("Error: Nepovedlo se upravit task");
                    }
                });
                conn.release();
            });
        } else {
            res.status(406);
            res.send('Odškrtávaná položka musí obsahovat ID položky a stav odškrtnutí');
        }
    } else {
        res.status(401);
        res.send("Nejste přihlášen");
    }
});

//Odstranění položky
router.delete('/remove', (req, res) => {
    if (req.session.loggedin) {
        let taskID = xss(req.body.id.replace("task-", ""));
        db.getConnection((err, conn) => {
            conn.query('DELETE FROM todos WHERE id = ? AND user = ?', [taskID, req.session.userid], (err, result) => {
                if (!err) {
                    res.send('true');
                } else {
                    console.log(err);
                    res.status(406);
                    res.send("Error: Nepovedlo se upravit task");
                }
            });
            conn.release();
        });
    } else {
        res.status(401);
        res.send("Nejste přihlášen");
    }
});

//Raw JSON data
router.get('/raw', (req, res) => {
    if (req.session.loggedin) {
        getPolozky(req.session.userid, (polozky) => {
            res.send(polozky);
        });
    } else {
        res.status(401);
        res.send("Nejste přihlášen");
    }
});

module.exports = router;
