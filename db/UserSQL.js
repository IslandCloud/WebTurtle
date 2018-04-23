var UserSQL = {
    insert_student: 'INSERT INTO student(username, pwd, firstname, lastname) VALUES(?,?,?,?)',
    insert_teacher: 'INSERT INTO teacher(username, pwd, class_id) VALUES(?,?,?)',
    get_student_by_username:'SELECT * FROM student WHERE username = ?',
    get_teacher_by_username:'SELECT * FROM teacher WHERE username = ?',
    select_available_students: 'SELECT * FROM student WHERE class_id is null',
    select_students_in_class: 'SELECT * FROM student WHERE class_id = ?',
    add_to_class: 'UPDATE student SET class_id = ? WHERE student_id = ?',
    kick_from_class: 'UPDATE student SET class_id = null WHERE student_id = ?',
    select_teacher_by_classid: 'SELECT * FROM teacher WHERE class_id = ?',
    insert_student_upload: 'INSERT INTO studentupload(student_id, class_id, filepath) VALUES(?,?,?)',
    select_student_upload: 'SELECT * FROM studentupload WHERE student_id = ?',
    insert_teacher_upload: 'INSERT INTO teacherupload(class_id, filepath, filename) VALUES(?,?,?)',
    select_teacher_upload: 'SELECT * FROM teacherupload WHERE class_id = ?',
    delete_teacher_upload: 'DELETE FROM teacherupload WHERE filename = ?'
};

module.exports = UserSQL;