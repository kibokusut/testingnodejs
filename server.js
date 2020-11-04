const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 2000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("server berhasil jalan di " + PORT);
});

// const express = require("express");
// const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const { json } = require("body-parser");
// const routes = require("./middleware/index");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.listen(2000, () => {
//   console.log("berhasil jalan");
// });

let koneksi = mysql.createConnection({
  host: "34.101.105.174",
  user: "root",
  password: "15mei2019",
  database: "testing",
  multipleStatements: true,
});

koneksi.connect((err) => {
  if (!err) {
    console.log("konek ke google cloud bos");
  } else {
    console.log(err);
  }
});

// // app.get("/home", (req, res, next) => {
// //   let dataFilm = koneksi.query(
// //     "SELECT film.nama, film.id_film, film.url, kategori.nama_kategori, kategori.id_kategori FROM film JOIN kategori ON film.id_kategori = kategori.id_kategori",
// //     (gagal, kolom, isi) => {
// //       if (!gagal) {
// //         res.json(kolom);
// //       }
// //     }
// //   );
// // });

// app.use("/api", routes);

// app.get("/home", (req, res, next) => {
//   koneksi.query(
//     "SELECT mahasiswa.id_mahasiswa , mahasiswa.nim , mahasiswa.nama , mahasiswa.jurusan , matakuliah.matakuliah , matakuliah.sks FROM krs JOIN matakuliah JOIN mahasiswa WHERE krs.id_matakuliah = matakuliah.id_matakuliah AND krs.id_mahasiswa = mahasiswa.id_mahasiswa ORDER BY mahasiswa.id_mahasiswa ",
//     (gagal, kolom, isi) => {
//       if (!gagal) {
//         // res.json(kolom);

//         const bali = [
//           {
//             id_mahasiswa: 1,
//             nim: "716231",
//             nama: "jumadi",
//             jurusan: "TI",
//             matakuliah: "aljabar",
//             sks: "4",
//           },
//           {
//             id_mahasiswa: 1,
//             nim: "716231",
//             nama: "jumadi",
//             jurusan: "TI",
//             matakuliah: "basis data",
//             sks: "3",
//           },
//           {
//             id_mahasiswa: 1,
//             nim: "716231",
//             nama: "jumadi",
//             jurusan: "TI",
//             matakuliah: "algoritma",
//             sks: "3",
//           },
//           {
//             id_mahasiswa: 4,
//             nim: "18273",
//             nama: "uti",
//             jurusan: "TK",
//             matakuliah: "pemograman dasar",
//             sks: "4",
//           },
//           {
//             id_mahasiswa: 4,
//             nim: "18273",
//             nama: "uti",
//             jurusan: "TK",
//             matakuliah: "sistem operasi",
//             sks: "5",
//           },
//         ];

//         const hasil = kolom.reduce((akumulasikan, item) => {
//           // result[current.id_mahasiswa]
//           // result[current.id_mahasiswa] = result[current.id_mahasiswa] || [];
//           // result[current.id_mahasiswa].push(current);
//           //  const group = result[current.nama];

//           //tentukan key group
//           if (akumulasikan[item.sks]) {
//             // const group = akumulasikan[item.nama];
//             const jurusan = akumulasikan[item.sks];
//             // console.log(group.matakuliah)
//             console.log(jurusan.sks);

//             // if(Array.isArray(group.matakuliah)){
//             //     group.matakuliah.push(item.matakuliah);

//             // }else {
//             //     group.matakuliah = [group.matakuliah, ];
//             // }
//             // console.log(group)
//           } else {
//             akumulasikan[item.jurusan] = item;
//           }
//           return akumulasikan;
//         }, {});

//         res.json(hasil);
//       }
//     }
//   );
// });

// // SELECT * FROM kategori WHERE id_kategori = ?

app.get("/multiple", (req, res, next) => {
  var sql = "SELECT * FROM film ; SELECT * FROM kategori";
  koneksi.query(sql, ["", ""], function (error, results, fields) {
    if (!error) {
      console.log(results[0]);
      console.log(results[1]);
      res.json(results);
    }
  });
});
