const HttpError = require("../models/http-error");
const bcrypt = require("bcrypt");
const mysql = require("../db/db");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = "supersecret_dont_share";

const signupController = (req, res, next) => {
  var { username, password, email } = req.body;

  // CHECK FOR EXISTING USER

  bcrypt.hash(password, 10, function (err, hash) {
    if (err) console.log(err);
    password = hash;
    console.log(password);

    let queryString = `INSERT INTO users VALUES (?,?,?,?,?);`;
    var id = uuidv4();
    console.log(id);
    mysql.query(
      queryString,
      [id, username, password, email, "user"],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ err: "Server error" });
        } else {
          console.log(result);
          res.status(200).json({
            status: "Account successfully created",
            status_code: 200,
            user_id: id,
          });
        }
      }
    );
  });
};

const loginController = (req, res, next) => {
  let { username, password } = req.body;
  let queryString = `SELECT id,username,email,password FROM users WHERE username=?`;
  mysql.query(queryString, username, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ err: "Server error" });
    } else {
      if (result.length == 0) {
        res.status(401).json({ success: false });
      } else {
        //console.log(result.password);
        bcrypt.compare(
          password,
          result[0]["password"],
          function (err, matched) {
            if (err) {
              console.log(err);
              res.status(500).json({ err: "Server error" });
            } else {
              if (matched) {
                //Token Generation
                let token;
                console.log(result[0].id + " " + result[0].email);
                token = jwt.sign({ id: result[0].id }, JWT_SECRET, {
                  expiresIn: "24h",
                });

                console.log(result);
                res.status(200).json({
                  status: "Login successful",
                  status_code: 200,
                  user_id: result[0].id,
                  access_token: token,
                });
              } else {
                res.status(401).json({
                  status: "Incorrect username/password provided. Please retry",
                  status_code: 401,
                });
              }
            }
          }
        );
      }
    }
  });
};

module.exports = {
  signupController,
  loginController,
};
