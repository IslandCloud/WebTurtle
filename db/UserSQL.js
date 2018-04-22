var UserSQL = {
    insert_student: 'INSERT INTO student(username, pwd, firstname, lastname) VALUES(?,?,?,?)',
    insert_teacher: 'INSERT INTO teacher(username, pwd) VALUES(?,?)',
    get_student_by_username:'SELECT * FROM student WHERE username = ?',
    get_teacher_by_username:'SELECT * FROM teacher WHERE username = ?',
    select_available_students: 'SELECT * FROM student WHERE class_id is null',
    select_students_in_class: 'SELECT * FROM student WHERE class_id = ?',
    add_to_class: 'UPDATE student SET class_id = ? WHERE student_id = ?',
    kick_from_class: 'UPDATE student SET class_id = null WHERE student_id = ?'
};

module.exports = UserSQL;