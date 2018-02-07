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

router.get('/addUser', function(req, res, next){
    pool.getConnection(function(err, connection){
        var param = req.query || req.params;
        connection.query(userSQL.insert, [param.username, param.pwd], function(err, result){
            if(result){
                result = {
                    code: 200,
                    msg: 'user add succeeded!'
                };
            }
            responseJSON(res, result);
            connection.release();
        });
    });
});

router.get('/getUser', function(req, res, next){
    pool.getConnection(function(err, connection){
        //var param = req.query || req.params;
        connection.query(userSQL.getUserById, req.query.id, function(err, result){
            if(result){
                result = {
                    msg: 'find user!'
                };
            }
            responseJSON(res, result);
            connection.release();
        });
    });
});

module.exports = router;