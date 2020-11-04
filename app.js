const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mahasiswa = require("./routes/mahasiswa");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", mahasiswa);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "GET,POST, PUT, UPDATE, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
  next();
});

// app.use((req, res, next) => {
//   const error = new Error("not found");
//   error.status(404);
//   next(error);
// });

// app.use((req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       pesan: error.pesan,
//     },
//   });
// });

module.exports = app;
