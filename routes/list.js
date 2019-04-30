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

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('list', {
        title: 'Seznam',
        polozky: polozky
    });
});

router.post('/add', (req, res) => {
    let newID = Math.max(...polozky.map(p => p.id)) + 1;
    polozky.push({id: newID, task: req.body.task});
    console.log(polozky);
    res.send({id: newID, task: req.body.task});
});

/*
router.delete('/', (req, res) => {
    res.send('Got a DELETE request');
});
*/

module.exports = router;
