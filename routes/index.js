var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbConfig = require('../db/DBconfig');
var userSQL = require('../db/UserSQL');

var pool = mysql.createPool(dbConfig.mysql);



/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html');
});

router.get('/index', function(req, res) {
    res.render('index.html');
});


/* Get login page*/
router.get('/login', function(req, res){
    res.render('login.html');
});

router.post('/login', function(req, res){
    var data = req.body;

    if(data.username.length < 1){ //Empty username
        return res.json('please enter your username');
    }else if(data.pwd.length < 1){ //Empty password
        return res.json('please enter your password');
    }

    pool.getConnection(function(err, connection){
        connection.query(userSQL.getUserByUsername, data.username, function(err, result){
            if(typeof result === 'undefined' || result.length === 0){ //Username not exist
                connection.release();
                res.json('username not exist');
            }else{
                if(result[0]['pwd'] === data.pwd){
                    res.json('login succeed!');
                }else{
                    res.json('password not correct!');
                }
            }
            connection.release();
        });

    });

});


/* Get register page*/
router.get('/register', function(req, res){
    res.render('register.html');
});

router.post('/register', function(req, res){
    pool.getConnection(function(err, connection){
        var data = req.body;

        if(data.username.length < 1){ //Empty username
            return res.json('Username cannot be empty!');
            //res.redirect('/register');
        }else if(data.pwd1.length < 1){
            return res.json('Password cannot be empty!');
        }else if(data.pwd2.length < 1){
            return res.json('Please enter your password again!');
        }else if(data.pwd1 !== data.pwd2){ //Two passwords not match
            return res.json('Password does not match!');
        }

        connection.query(userSQL.getUserByUsername, data.username, function(err, result){ //Username already existed
            if(typeof result !== 'undefined' && result.length !== 0){
                //console.log(result);
                connection.release();
                return res.json('Username already existed!');
            }else{

                // Registration
                connection.query(userSQL.insert, [data.username, data.pwd1], function(err, result){
                    if(typeof result === 'undefined'){
                        result = 'register failed!';
                    }else{
                        result = 'register succeeded!';
                    }
                    res.json(result);
                    connection.release();
                });
            }
        });


        // Registration
        // connection.query(userSQL.insert, [data.username, data.pwd1], function(err, result){
        //     if(typeof result === 'undefined'){
        //         result = 'register failed!';
        //     }else{
        //         result = 'register succeeded!';
        //     }
        //     res.json(result);
        //     connection.release();
        // });


    });
    

});

module.exports = router;
