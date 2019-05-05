const express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    let query = {
        title: "Vítejte",
        logged: (req.session.loggedin ? req.session.loggedin : false)
    };
    if (req.session.loggedout) {
        query.infobox = "Byli jste úspěšně odhlášeni.";
        query.infoboxType = "ok";
        req.session.loggedout = false;
    }
    res.render('index', query);
});

module.exports = router;