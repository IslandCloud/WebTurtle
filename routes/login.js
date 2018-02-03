var express = require('express');
var router = express.Router();

/* Get login Page. */
router.get('/', function(req, res, next){
    res.render('login.html');
});

module.exports = router;