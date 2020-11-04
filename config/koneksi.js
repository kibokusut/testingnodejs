var mysql = require('mysql');

//buat koneksi database
const koneksi = mysql.createConnection({
    host: "34.101.105.174",
    user: "root",
    password: "15mei2019",
    database: "testing",
    multipleStatements: true,
});

koneksi.connect((err)=>{
    if(err) throw err;
    console.log('Mysql terkoneksi');
});

module.exports = koneksi;