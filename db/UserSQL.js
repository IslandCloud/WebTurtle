var UserSQL = {
    insert: 'INSERT INTO user(username, pwd) VALUES(?,?)',
    queryAll: 'SELECT * FROM user',
    getUserById: 'SELECT * FROM user WHERE id = ?',
    getUserByUsername: 'SELECT * FROM user WHERE username = ?'
};

module.exports = UserSQL;