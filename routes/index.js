const express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Vítejte' });
});

module.exports = router;
