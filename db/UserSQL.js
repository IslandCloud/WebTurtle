var UserSQL = {
    insert: 'INSERT INTO user(username, pwd) VALUES(?,?)',
    queryAll: 'SELECT * FROM user',
    getUserById: 'SELECT * FROM user WHERE id = ?'
};

module.exports = UserSQL;