const mysql = require("mysql2/promise")
const pool = mysql.createPool({
    host: "localhost",
    user:"root",
    password : "Abuhusaina@1",
    database :"blog"
})
module.exports = pool