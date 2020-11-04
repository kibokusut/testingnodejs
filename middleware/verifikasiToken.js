const jwt = require("jsonwebtoken");
const secret = require("./../config/secret");

const verifikasi = () => {
  return (req, res, next) => {
    let tokenWithBearer = req.headers.authorization;

    if (tokenWithBearer) {
      let token = tokenWithBearer.split(" ")[1];

      jwt.verify(token, secret.secret, (err, decode) => {
        if (err) {
          return res.status(401).send({
            auths: false,
            message: "token tidak ada / terdaftar / SALAH !!!!",
          });
        } else {
          var role = decode.hasil[0].role;
          if (role == 2) {
            req.authssss = decode;
            console.log("req auth apa ini", req.authssss);
            next();
          } else {
            console.log(decode.hasil[0].role);
            return res.status(401).send({
              auths: false,
              message: "role anda tidak memiliki otorisasi",
            });
          }
        }
      });
    } else {
      return res
        .status(401)
        .send({ auths: false, message: "token tidak tersedia" });
    }
  };
};

module.exports = verifikasi;
