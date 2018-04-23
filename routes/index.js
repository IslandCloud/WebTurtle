var express = require('express');
var fs = require('fs');
var multer = require('multer');
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

// router.get('/index', function(req, res) {
//     res.render('index.html', {username: ''});
// });


/* Get login page*/
router.get('/login', function(req, res){
    res.render('login', {login_error: ""});
});

router.get('/teacherlogin', function(req, res){

    res.render('teacherlogin', {login_error: ""});
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

                res.render('login', {login_error: "username does not exist"});

            }else{ //Username exists in student table
                if(result[0]['pwd'] === data.pwd){

                    //for session
                    req.session.user = data.username;
                    req.session.student_class_id = result[0]['class_id'];
                    req.session.student_id = result[0]['student_id'];
                    res.redirect('/');
                }else{
                    res.render('login', {login_error: "password not correct!"});
                }
            }
            connection.release();
        });

    });

});

router.post('/teacherlogin', function(req, res){
    var data = req.body;

    if(data.username.length < 1){ //Empty username
        res.render('teacherlogin', {login_error: "please enter your username"});
        return;
    }else if(data.pwd.length < 1){ //Empty password
        res.render('teacherlogin', {login_error: "please enter your password"});
        return;
    }

    pool.getConnection(function(err, connection){
        connection.query(userSQL.get_teacher_by_username, data.username, function(err, result){
            if(typeof result === 'undefined' || result.length === 0){ //Username not exist in teacher table
                res.render('teacherlogin', {login_error: "username does not exist"});
            }else{ //Username exists in student table
                if(result[0]['pwd'] === data.pwd){
                    //for session
                    req.session.user = data.username;
                    req.session.class_id = result[0]['class_id'];
                    res.redirect('/teacherpage');
                }else{
                    res.render('teacherlogin', {login_error: "password not correct!"});
                }
            }
            connection.release();
        });

    });

});

router.get('/teacherpage', function(req, res){

    pool.getConnection(function(err, connection){
        connection.query(userSQL.select_available_students, function(err, result){
            if(err){
                throw err;
            }
            var length1 = result.length;
            var available_student = JSON.parse(JSON.stringify(result));


            connection.query(userSQL.select_students_in_class, req.session.class_id, function(err, result){
                if(err){
                    throw err;
                }
                var length2 = result.length;
                var current_student = JSON.parse(JSON.stringify(result));

                connection.query(userSQL.select_teacher_upload, req.session.class_id, function(err, result){

                    var length3 = result.length;
                    var result3 = JSON.parse(JSON.stringify(result));

                    res.render('teacherpage', {
                        username: req.session.user,
                        result1: available_student,
                        length1: length1,
                        class_id: req.session.class_id,
                        length2: length2,
                        result2: current_student,
                        length3: length3,
                        result3: result3
                    });
                });


            });

        });

    });

});

router.post('/teacherpage', function(req, res){

    var data = req.body;
    var class_id = req.session.class_id;
    if(data.addid === undefined && data.kickid === undefined && data.removename !== undefined){
        pool.getConnection(function(err, connection){
            connection.query(userSQL.delete_teacher_upload, data.removename, function(err, result){
                if(err){
                    throw err;
                }
                if(result.length === 0){
                    console.log('Delete failed!');
                }else{
                    res.redirect('/teacherpage');
                }
            })
        });
    }else if(data.addid === undefined && data.kickid !== undefined){
        pool.getConnection(function(err, connection){
            connection.query(userSQL.kick_from_class, data.kickid, function(err, result){
                if(err){
                    throw err;
                }
                if(result.length === 0){
                    console.log('Kick failed!');
                }else{
                    res.redirect('/teacherpage');
                }
            })
        });
    }else if(data.kickid === undefined && data.addid !== undefined){
        var add = [class_id, data.addid];
        pool.getConnection(function(err, connection){
            connection.query(userSQL.add_to_class, add, function(err, result){
                if(err){
                    throw err;
                }
                if(result.length === 0){
                    console.log('Add failed!');
                }else{
                    res.redirect('/teacherpage');
                }
            })
        });
    }


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
        }else if(data.firstname.length < 1){
            res.render('register', {register_error: 'Firstname cannot be empty'});
            return;
        }else if(data.lastname.length < 1){
            res.render('register', {register_error: 'Lastname cannot be empty'});
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
                    connection.query(userSQL.insert_student, [data.username, data.pwd1, data.firstname, data.lastname], function(err, result){
                        if(typeof result === 'undefined'){
                            res.json('Register failed!');
                        }else{
                            setTimeout(function(){
                                res.redirect('login');
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

router.get('/teacherregister', function(req, res){
    res.render('teacherregister', {register_error: ''});
});


router.post('/teacherregister', function(req, res){
    pool.getConnection(function(err, connection){
        var data = req.body;

        if(data.username.length < 1){ //Empty username
            res.render('teacherregister', {register_error: 'Username cannot be empty'});
        }else if(data.pwd1.length < 1){
            res.render('teacherregister', {register_error: 'Password cannot be empty'});
        }else if(data.pwd2.length < 1){
            res.render('teacherregister', {register_error: 'Please enter your password again'});
        }else if(data.pwd1 !== data.pwd2){ //Two passwords not match
            res.render('teacherregister', {register_error: 'Password does not match'});
        }else if(data.classid.length < 1){
            res.render('teacherregister', {register_error: 'Please enter your classroom id'});
        }else if(data.secret.length < 1){ //no secret code
            res.render('teacherregister', {register_error: 'Please enter the secret code'});
        }

        if(data.secret === 'teacher'){ //If user is teacher
            connection.query(userSQL.get_teacher_by_username, data.username, function(err, result){
                if(typeof result !== 'undefined' && result.length !== 0){ //Username already existed
                    // connection.release();
                    res.render('teacherregister', {register_error: 'Username already existed'});
                }else{

                    connection.query(userSQL.select_teacher_by_classid, data.classid, function(err, result){
                        if(typeof result !== 'undefined' && result.length !== 0){ //classroom id already existed
                            // connection.release();
                            res.render('teacherregister', {register_error: 'Classroom id already existed'});
                        }else{

                            connection.query(userSQL.insert_teacher, [data.username, data.pwd1, data.classid], function(err, result){
                                if(typeof result === 'undefined'){
                                    res.json('Register failed!');
                                }else{
                                    setTimeout(function(){
                                        res.redirect('teacherlogin');
                                    }, 1000);

                                }
                                connection.release();
                            });
                        }

                    });

                }
            });
        }else{ //Secret code not correct
            res.render('register', {register_error: 'Secret code not correct'});
        }

    });

});


// For file upload
var upload = multer({ dest: './public/upload' });

router.get('/userpage', function(req, res){

    pool.getConnection(function(err, connection){
        connection.query(userSQL.select_student_upload, req.session.student_id, function(err, result){
            if(err){
                throw err;
            }
            var length1 = result.length;
            var result1 = JSON.parse(JSON.stringify(result));

            if(req.session.student_class_id){
                connection.query(userSQL.select_teacher_upload, req.session.student_class_id, function(err, result){
                    if(err){
                        throw err;
                    }
                    var length2 = result.length;
                    var result2 = JSON.parse(JSON.stringify(result));

                    res.render('userpage', {
                        username: req.session.user,
                        length1: length1,
                        result1: result1,
                        length2: length2,
                        result2: result2,
                        class_id: req.session.student_class_id
                    });
                });
            }else{
                res.render('userpage', {
                    username: req.session.user,
                    length1: length1,
                    result1: result1,
                    length2: null,
                    result2: null,
                    class_id: null
                });
            }

        });
    });


});

router.post('/userpage', upload.single('myfile'), function(req, res){

    var file = req.file;
    var name=file.originalname;
    var nameArray=name.split('');
    var nameMime=[];
    var l=nameArray.pop();
    nameMime.unshift(l);
    while(nameArray.length!==0&&l!=='.'){
        l=nameArray.pop();
        nameMime.unshift(l);
    }
    var Mime=nameMime.join('');

    fs.renameSync('./public/upload/'+file.filename,'./public/upload/'+file.filename+Mime);

    var filepath = file.destination.split(".")[1] + '/' + file.filename + Mime;

    pool.getConnection(function(err, connection){
        connection.query(userSQL.insert_student_upload, [req.session.student_id, req.session.student_class_id, filepath], function(err, result){
            if(err){
                throw err;
            }
            res.redirect('userpage');
        })
    });

});

router.post('/teacherupload', upload.single('myfile'), function(req, res){
    var file = req.file;
    var name=file.originalname;
    var nameArray=name.split('');
    var nameMime=[];
    var l=nameArray.pop();
    nameMime.unshift(l);
    while(nameArray.length!==0&&l!=='.'){
        l=nameArray.pop();
        nameMime.unshift(l);
    }
    var Mime=nameMime.join('');

    fs.renameSync('./public/upload/'+file.filename,'./public/upload/'+file.filename+Mime);

    var filepath = file.destination.split(".")[1] + '/' + file.filename + Mime;

    // console.log(file);
    pool.getConnection(function(err, connection){
        connection.query(userSQL.insert_teacher_upload, [req.session.class_id, filepath, file.originalname], function(err, result){
            if(err){
                throw err;
            }
            res.redirect('teacherpage');
        })
    });
});


module.exports = router;
