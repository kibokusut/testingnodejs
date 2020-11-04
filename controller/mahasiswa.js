"use restrict";

const koneksiDatabase = require("./../config/koneksi");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("./../config/secret");
const ip = require("ip");
const { json } = require("body-parser");

const comparePW = (password, passwordDB) => {
  bcrypt.compare(password, passwordDB, function (err, result) {
    console.log(result);
  });
};

exports.checkpassword = (req, res) => {
  let tampungNilai = {
    email: req.body.email,
    password: req.body.password,
  };

  let query = "SELECT * FROM ?? WHERE ??=?";
  let table = ["user", "email", tampungNilai.email];
  query = mysql.format(query, table);
  koneksiDatabase.query(query, async (err, result) => {
    if (err) {
      res.json("salah query");
    } else {
      //CEK KONDISI EMAIL ADA ATAU TIDAK
      if (result.length > 0) {
        const passwordValid = await bcrypt.compare(
          tampungNilai.password,
          result[0].password
        );
        //CEK JIKA PASSWORD SAMA ATAU TIDAK
        if (passwordValid) {
          // JIKA BERHASIL LAKUKAN
          //GENERATE JSONWEBTOKENYA
          let token = jwt.sign({ result }, secret.secret, {
            expiresIn: 1440,
          });
          id_user = result[0].id_user;
          // console.log(id_user);
          // return false;
          //CEK KONDISI TABLE AKSES TOKEN
          let queryAksestoken = "SELECT * FROM ?? WHERE ??=?";
          let table_database_aksesTOKEN = ["akses_token", "id_user", id_user];
          queryAksestoken = mysql.format(
            queryAksestoken,
            table_database_aksesTOKEN
          );
          koneksiDatabase.query(queryAksestoken, (gagal, hasilaksestoken) => {
            if (gagal) {
              console.log(gagal);
              res.json("ada yang eror");
            } else {
              // console.log(hasilaksestoken.length);
              // res.json(hasilaksestoken);
              // return false;
              //CEK KONDISI JIKA TOKEN SUDAH ADA BERDASARKAN ID
              if (hasilaksestoken.length == 0) {
                let dataToken = {
                  access_token: token, // sesuaikan nama table
                  id_user: id_user, // sesuaikan nama table
                  ip_address: ip.address(), // sesuaikan nama table
                };
                let queryinsertAksestoken = "INSERT INTO ?? SET ?";
                let table_database = ["akses_token"];
                queryinsertAksestoken = mysql.format(
                  queryinsertAksestoken,
                  table_database
                );
                koneksiDatabase.query(
                  queryinsertAksestoken,
                  dataToken,
                  (gagal, hasil) => {
                    if (gagal) {
                      console.log("gagal insert bro");
                    } else {
                      console.log(hasil);
                      res.json({
                        status:
                          "berhasil masukan data token ke table akses token",
                        token: token,
                      });
                    }
                  }
                );
              } else {
                let dataToken = {
                  access_token: token, // sesuaikan nama table
                  id_user: id_user, // sesuaikan nama table
                  ip_address: ip.address(), // sesuaikan nama table
                };
                let query = "UPDATE ?? SET ??=?, ??=? WHERE ??=?";
                let table_database = [
                  "akses_token",
                  "access_token",
                  dataToken.access_token,
                  "ip_address",
                  dataToken.ip_address,
                  "id_user",
                  dataToken.id_user,
                ];
                query = mysql.format(query, table_database);
                koneksiDatabase.query(query, (gagal, hasil) => {
                  if (gagal) {
                    console.log("gagal update", gagal);
                    res.json("gagal update bos");
                  } else {
                    console.log("berhasil rubah data");
                    res.json({
                      pesan: "berhasil merubah data",
                      value: dataToken.access_token,
                    });
                  }
                });
                // res.json({ status: "token sudah ada", token: token });
              }
              // return false;

              // res.json(hasilaksestoken);
            }
          });

          // let datas = {
          //   id_user: id_user,
          //   access_token: token,
          //   ip_address: ip.address(),
          // };
          ////////// GENERATE JSON WEB TOKEN END
        } else {
          res.json("salah password bro");
        }
      } else {
        res.json("email tidak terdaftar bro");
      }
    }
  });
};

exports.index = (req, res) => {
  koneksiDatabase.query("SELECT * FROM film", (gagal, hasil) => {
    if (gagal) {
      console.log("gagal ambil data");
    } else {
      console.log(hasil);
      res.status(200).json({
        pesan: hasil,
      });
    }
  });
  // res.status(200).json({
  //   pesan: "index dari mahasiswa",
  // });
};

//CONTROLLER REGISTRASI
exports.registrasi = (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const tampungNilai = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
    role: req.body.role,
    tanggal_daftar: req.body.tanggal_daftar,
  };

  let query = "SELECT email FROM ??  WHERE ??=? ";
  let table = ["user", "email", tampungNilai.email];
  query = mysql.format(query, table);
  koneksiDatabase.query(query, (gagal, hasil) => {
    if (gagal) {
      console.log(gagal);
    } else {
      if (hasil.length == 0) {
        let query = "INSERT INTO ?? set ?";
        let table = ["user"];
        query = mysql.format(query, table);
        koneksiDatabase.query(query, tampungNilai, (gagal, hasil) => {
          if (gagal) {
            console.log("gagal menambah data", gagal);
          } else {
            res.json("berhasil resgistrasi");
          }
        });
      } else {
        res.json("email sudah terdaftar");
      }
    }
  });
};

//CONTROLLER LOGIN MAHASISWA
exports.login = (req, res) => {
  const tampungnilai = {
    password: req.body.password,
    email: req.body.email,
  };

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
      console.log("gagal ambil data / query salah");
    } else {
      console.log("DATA", hasil[0].id_user);
      if (
        hasil.length > 0 &&
        bcrypt.compareSync(tampungnilai.password, hasil[0].password)
      ) {
        const data = {
          role: hasil[0].role,
        };
        let token = jwt.sign({ hasil: [data] }, secret.secret, {
          expiresIn: 1440,
        });
        id_user = hasil[0].id_user;
        let datas = {
          id_user: id_user,
          access_token: token,
          ip_address: ip.address(),
        };

        let query = "SELECT * FROM ?? WHERE ??=?";
        let table_database = ["akses_token", "id_user", id_user];
        query = mysql.format(query, table_database);
        koneksiDatabase.query(query, (gagal, hasil) => {
          if (gagal) {
            console.log(gagal);
          } else {
            if (hasil.length > 0) {
              let datass = {
                access_token: token,
                id_user: id_user,
                ip_address: ip.address(),
              };
              let query = "UPDATE ?? SET ??=?, ??=? WHERE ??=?";
              let table_database = [
                "akses_token",
                "access_token",
                datass.access_token,
                "ip_address",
                datass.ip_address,
                "id_user",
                datass.id_user,
              ];
              query = mysql.format(query, table_database);
              koneksiDatabase.query(query, (gagal, hasil) => {
                if (gagal) {
                  console.log("gagal update", gagal);
                  res.json("gagal update bos");
                } else {
                  console.log("berhasil rubah data");
                  res.json({
                    pesan: "berhasil merubah data",
                    value: datass.access_token,
                  });
                }
              });
            } else {
              let query = "INSERT INTO ?? SET ?";
              let table_database = ["akses_token"];
              query = mysql.format(query, table_database);
              koneksiDatabase.query(query, datas, (gagal, hasil) => {
                if (gagal) {
                  console.log(gagal);
                } else {
                  console.log(hasil);
                  res.json({
                    status: "berhasil masukan data",
                    token: datas.access_token,
                  });
                }
              });
            }
          }
        });
      } else {
        res.json({
          error: true,
          Message: "username atau email salah bro cek lagi ya",
        });
      }
    }
  });
};

exports.halamanVerifikasi = (req, res) => {
  let query = "SELECT * FROM ?? ";
  let table = ["user"];
  query = mysql.format(query, table);
  koneksiDatabase.query(query, (err, result) => {
    if (err) {
      console.log("gagal");
    } else {
      res.json({ pesan: "halaman rahasia", data: result });
    }
  });
  // res.json("halaman ini untuk verfikasi token yang yang role nya hanya 2 ya");
};

