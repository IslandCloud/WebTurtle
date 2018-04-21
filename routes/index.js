var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbConfig = require('../db/DBconfig');
var userSQL = require('../db/UserSQL');

var pool = mysql.createPool(dbConfig.mysql);


/* GET home page. */
router.get('/', function(req, res) {

    var user = req.session.user;

    if(user !== undefined){
        res.render('index', {
            username: user,
            isloggedin: true
        });
    }else{
        res.render('index', {
            username: '',
            isloggedin: false
        });
    }
});

router.get('/index', function(req, res) {
    res.render('index.html', {username: ''});
});


/* Get login page*/
router.get('/login', function(req, res){
    res.render('login', {login_error: ""});
});

router.post('/login', function(req, res){
    var data = req.body;

    if(data.username.length < 1){ //Empty username
        res.render('login', {login_error: "please enter your username"});
        return;
    }else if(data.pwd.length < 1){ //Empty password
        res.render('login', {login_error: "please enter your password"});
        return;
    }

    pool.getConnection(function(err, connection){
        connection.query(userSQL.get_student_by_username, data.username, function(err, result){
            if(typeof result === 'undefined' || result.length === 0){ //Username not exist in student table

                // connection.query(userSQL.get_teacher_by_username, data.username, function(err, result){ //Find in teacher
                //     if(typeof result === 'undefined' || result.length === 0){ //Username not exist in both tables
                //         //connection.release();
                //         res.render('login', {login_error: "username does not exist"});
                //     }else{ //Username exists in teacher table
                //         if(result[0]['pwd'] === data.pwd){
                //             res.render('index', {username: 'Hello, ' + data.username});
                //         }else{
                //             res.render('login', {login_error: "password not correct!"});
                //         }
                //     }
                //
                // });
                res.render('login', {login_error: "username does not exist"});

            }else{ //Username exists in student table
                if(result[0]['pwd'] === data.pwd){

                    //for session
                    req.session.user = data.username;
                    res.redirect('/');
                    // res.render('index', {username: 'Hello, ' + data.username});

                }else{
                    res.render('login', {login_error: "password not correct!"});
                }
            }
            connection.release();
        });

    });

});

router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');

});


/* Get register page*/
router.get('/register', function(req, res){
    //res.render('register.html');
    res.render('register', {register_error: ''});
});

router.post('/register', function(req, res){
    pool.getConnection(function(err, connection){
        var data = req.body;

        if(data.username.length < 1){ //Empty username
            res.render('register', {register_error: 'Username cannot be empty'});
            return;
        }else if(data.pwd1.length < 1){
            res.render('register', {register_error: 'Password cannot be empty'});
            return;
        }else if(data.pwd2.length < 1){
            res.render('register', {register_error: 'Please enter your password again'});
            return;
        }else if(data.pwd1 !== data.pwd2){ //Two passwords not match
            res.render('register', {register_error: 'Password does not match'});
            return;
        }else if(data.secret.length < 1){ //no secret code
            res.render('register', {register_error: 'Please enter the secret code'});
            return;
        }

        if(data.secret === 'student'){ //If user is student
            connection.query(userSQL.get_student_by_username, data.username,function(err, result){
                if(typeof result !== 'undefined' && result.length !== 0){ //Username already existed
                    connection.release();
                    res.render('register', {register_error: 'Username already existed'});
                }else{
                    connection.query(userSQL.insert_student, [data.username, data.pwd1], function(err, result){
                        if(typeof result === 'undefined'){

                            res.json('Register failed!');
                        }else{
                            setTimeout(function(){
                                res.redirect('login');
                                //res.render('login', {login_error: ''})
                            }, 1000);

                        }
                        connection.release();
                    });
                }
            });
        }else if(data.secret === 'teacher'){ //If user is teacher
            connection.query(userSQL.get_teacher_by_username, data.username,function(err, result){
                if(typeof result !== 'undefined' && result.length !== 0){ //Username already existed
                    connection.release();
                    res.render('register', {register_error: 'Username already existed'});
                }else{
                    connection.query(userSQL.insert_teacher, [data.username, data.pwd1], function(err, result){
                        if(typeof result === 'undefined'){
                            res.json('Register failed!');
                        }else{
                            setTimeout(function(){
                                res.redirect('login');
                                //res.render('login', {login_error: ''})
                            }, 1000);

                        }
                        connection.release();
                    });
                }
            });
        }else{ //Secret code not correct
            res.render('register', {register_error: 'Secret code not correct'});
        }

    });

});

module.exports = router;
