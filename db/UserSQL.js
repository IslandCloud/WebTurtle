var UserSQL = {
    insert_student: 'INSERT INTO student(username, pwd) VALUES(?,?)',
    insert_teacher: 'INSERT INTO teacher(username, pwd) VALUES(?,?)',
    get_student_by_username:'SELECT * FROM student WHERE username = ?',
    get_teacher_by_username:'SELECT * FROM teacher WHERE username = ?',
};

module.exports = UserSQL;