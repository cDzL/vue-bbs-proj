const database = require('./config')
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host:database.host,
    user:database.user,
    password:database.password,
    port:database.port,
    database:database.name
})
connection.connect();
module.exports = connection