const express = require('express');
let router = express.Router();

//TODO: Přidat knihovnu XSS, která automaticky odstraní XSS skripty

let polozky = [
    { id: 1, name: "bob" },
    { id: 2, name: "john" },
    { id: 3, name: "jake" }
];

/* GET users listing. */
router.get('/', (req, res, next) => {
    //res.send('respond with a resource');
    res.render('list', {
        title: 'Seznam',
        polozky: polozky
    });
});

router.post('/', (req, res) => {
    polozky.push({id: Math.max(...polozky.map(p => p.id)) + 1, name: req.body.task});
    res.send(req.body.task);
    console.log(req.body.task);
});

/*
router.delete('/', (req, res) => {
    res.send('Got a DELETE request');
});
*/

module.exports = router;
