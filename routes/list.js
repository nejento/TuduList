const express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    //res.send('respond with a resource');
    res.render('list', {
        title: 'Seznam',
        polozky: [
            { id: 1, name: "bob" },
            { id: 2, name: "john" },
            { id: 3, name: "jake" },
        ]
    });
});

router.post('/', (req, res) => {
    res.send('Got a POST request')
});

router.delete('/', (req, res) => {
    res.send('Got a DELETE request');
});

module.exports = router;
