var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbConfig = require('../db/DBconfig');
var userSQL = require('../db/UserSQL');

var pool = mysql.createPool(dbConfig.mysql);

var responseJSON = function(res, ret){
    if(typeof ret === 'undefined'){
        res.json({
            code: '-200',
            msg: 'operation failed'
        });
    }else{
        res.json(ret);
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.get('/index', function(req, res, next) {
    res.render('index.html');
});


/* Get login page*/
router.get('/login', function(req, res, next){
    res.render('login.html');
});


/* Get register page*/
router.get('/register', function(req, res, next){
    res.render('register.html');
});

router.post('/register', function(req, res, next){
    pool.getConnection(function(err, connection){
        var data = req.body;
        connection.query(userSQL.insert, [data.username, data.pwd1], function(err, result){
            if(result){
                result = {
                    code: 200,
                    msg: 'register succeeded!'
                }
            }
            responseJSON(res, result);
            connection.release();
        })
    });
    

});

module.exports = router;
