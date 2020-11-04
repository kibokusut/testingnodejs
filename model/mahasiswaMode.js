
const koneksiDatabase = require("./../config/koneksi");
const mysql = require("mysql");
const bcrypt = require("bcrypt");


exports.getAllUser = (nama) => {
  return new Promise((resolve) => {
    let query =
      "SELECT * FROM ?? INNER JOIN film ON order.id_order =  film.id_order";
    var query_var = [nama];
    query = mysql.format(query, query_var);
    koneksiDatabase.query(query, (err, result) => {
      if (err) {
        console.log("gagal");
      } else {
        resolve(result)
      }
    });
  })
};



exports.getTableUser = ({ tampungnilai }) => {
  return new Promise((resolve) => {
    let query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    let table = [
      "user",
      "password",
      bcrypt.compareSync(tampungnilai.password, "10"),
      // tampungnilai.password,
      "email",
      tampungnilai.email,
    ];
    query = mysql.format(query, table);
    koneksiDatabase.query(query, (gagal, hasil) => {
      if (gagal) {
        console.log("gagal query table user", gagal)
      } else {
        resolve(hasil)
      }
    })
  })
}