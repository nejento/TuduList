const express = require('express');
let router = express.Router();

/*TODO: Přidat knihovnu XSS, která automaticky odstraní XSS skripty
 * Přidat ověření, že se nepřidává prázdný task
 */

let polozky = [
    { id: 1, task: "bob" },
    { id: 2, task: "john" },
    { id: 3, task: "jake" }
];

router.get('/', (req, res, next) => {
    res.render('list', {
        title: 'Seznam',
        polozky: polozky
    });
});

router.post('/add', (req, res) => {
    let maxID = Math.max(...polozky.map(p => p.id));
    let newID = (maxID < 0 ? 0 : maxID) + 1;
    polozky.push({id: newID, task: req.body.task});
    console.log(polozky);
    res.send({id: newID, task: req.body.task});
});

router.post('/edit', (req, res) => {
    console.log(Object.values(polozky));
});

router.delete('/remove', (req, res) => {
    let taskToRemove = polozky.map(p => p.id).indexOf(req.body.task);
    polozky.splice(taskToRemove, 1);
    res.send('true');
});

module.exports = router;
