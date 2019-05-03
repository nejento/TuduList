const express = require('express');
let router = express.Router();

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'phplogin'
});


router.get('/', (req, res, next) => {
    res.render('list', {
        title: 'Seznam',
        polozky: polozky
    });
});


