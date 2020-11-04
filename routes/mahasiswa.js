const express = require("express");
const { route } = require("../app");
const verifikasi = require("../middleware/verifikasiToken");
const router = express.Router();
const bcrypt = require("bcrypt");

const MahasiswaConttroller = require("./../controller/mahasiswa");

router.get("/", MahasiswaConttroller.index);
router.post("/registrasi", MahasiswaConttroller.registrasi);
router.post("/login", MahasiswaConttroller.login);
router.post("/cek", MahasiswaConttroller.checkpassword);

router.get(
  "/halamanrahasia",
  verifikasi(),
  MahasiswaConttroller.halamanVerifikasi
);

module.exports = router;
