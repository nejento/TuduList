const express = require('express');
const db = require('../db');
let router = express.Router();

/*TODO:
 * Přidat označení hotové položky
 * Přidat kontroly XSS injection
 * Nahodit na server
 * Přidat MySQL připojení a správu poznámek
 * Přidat dokumentaci kódu
 * Opravit přidání při prázdném seznamu
 */

/*
let polozky = [
    { id: 1, task: "bob" },
    { id: 2, task: "john" },
    { id: 3, task: "jake" }
];
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
                    infoboxType: "ok"
                });
            });
        } else {
            getPolozky(req.session.id, (polozky) => {
                res.render('list', {
                    title: 'Seznam',
                    polozky: polozky
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
        if (req.body.task.trim().length <= 0) {
            res.status(406);
            res.send('Přidávaná položka nesmí mít nulovou velikost');
        } else {
            db.getConnection((err, conn) => {
                conn.query('INSERT INTO todos SET ?', {user: req.session.userid, task: req.body.task.trim(), done: 0}, (err, result) => {
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
        res.send("Not logged in");
    }

});

//Editace položky
router.put('/edit', (req, res) => {
    if (req.session.loggedin) {
        if (req.body.task.trim().length <= 0) {
            res.status(406);
            res.send('Upravovaná položka nesmí mít nulovou velikost');
        } else {
            db.getConnection((err, conn) => {
                conn.query('UPDATE todos SET task = ?, done = ? WHERE id = ? AND user = ?', [req.body.task.trim(), 0, req.body.id.replace("task-", ""), req.session.userid], (err, result) => {
                    if (!err) {
                        conn.query('SELECT * FROM todos WHERE ?', {id: req.body.id.replace("task-", "")}, (err, results) => {
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
        res.send("Not logged in");
    }

});

//Odstranění položky
router.delete('/remove', (req, res) => {
    if (req.session.loggedin) {
        db.getConnection((err, conn) => {
            //DELETE FROM table_name WHERE condition;
            conn.query('DELETE FROM todos WHERE id = ? AND user = ?', [req.body.id.replace("task-", ""), req.session.userid], (err, result) => {
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
        res.send("Not logged in");
    }

});

module.exports = router;
