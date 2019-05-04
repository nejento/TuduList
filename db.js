const mysql = require('mysql');

let  pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'tudu',
    password: 'password',
    database: 'tudu'
});

module.exports = {
    getConnection: (callback) => {
        return pool.getConnection(callback);
    }
};