const express = require('express');
let router = express.Router();

/*TODO: Přidat knihovnu XSS, která automaticky odstraní XSS skripty
 * Přidat MySQL připojení
 * Přidat přihlášení
 * Přidat označení hotové položky
 * Přidat kontroly XSS injection
 * Nahodit na server
 */

let polozky = [
    { id: 1, task: "bob" },
    { id: 2, task: "john" },
    { id: 3, task: "jake" }
];

router.get('/', (req, res, next) => {
    if (req.session.loggedin) {
        res.render('list', {
            title: 'Seznam',
            polozky: polozky,
            loggedin: true
        });
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
            let maxID = Math.max(...polozky.map(p => p.id));
            let newID = (maxID < 0 ? 0 : maxID) + 1;
            console.log(`Adding task with ID: ${newID} with text: ${req.body.task}`);
            polozky.push({id: newID, task: req.body.task.trim()});
            res.send({id: "task-" + newID, task: req.body.task.trim()});
        }
    } else {
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
            let taskToEdit = polozky.findIndex((p => p.id === parseInt(req.body.id.replace("task-", ""))));
            console.log(`Editing task ID: ${taskToEdit} with text: ${req.body.task}`);
            polozky[taskToEdit].task = req.body.task;
            res.send({task: polozky[taskToEdit].task});
        }
    } else {
        res.send("Not logged in");
    }

});

//Odstranění položky
router.delete('/remove', (req, res) => {
    if (req.session.loggedin) {
        let taskToRemove = polozky.findIndex(p => p.id === parseInt(req.body.id.replace("task-", "")));
        console.log(`Removing task ID: ${taskToRemove} with text: ${polozky[taskToRemove].task}`);
        polozky.splice(taskToRemove, 1);
        res.send('true');
    } else {
        res.send("Not logged in");
    }

});

module.exports = router;
