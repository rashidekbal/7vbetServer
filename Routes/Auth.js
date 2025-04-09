import express from "express";
import { connection } from "../db/dbConnect.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
let router = express.Router();
router.get("/", (req, res) => {
  res.send("Auth route is working");
});

router.post("/register", (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;
  const referredBy = req.body.refferedBy;
  const date = new Date();
  let uid = String(phone).slice(2);

  let query = `select * from userdetails where uid=${phone} limit 1`;
  3;
  let insert = `insert into userdetails values(${uid},'${phone}','${password}','${referredBy}','${date.toLocaleDateString()}','${date.toLocaleTimeString()}')`;
  connection.query(query, (erry, result) => {
    if (erry) {
      console.log(erry);
      res.send("err");
    } else {
      if (result == 0) {
        try {
          connection.query(insert, (err, result) => {
            if (err) {
              res.send(err);
            } else {
              let q1 = `insert into userfinances values(${uid},${100.0},${0},${0})`;
              connection.query(q1, (err, result) => {
                if (!err) {
                  res.send("ok");
                } else {
                  res.send("ok");
                }
              });
            }
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        res.send("user_Exists");
      }
    }
  });
});

router.post("/loginV2", (req, res) => {
  let response;
  let phone = req.body.phone;
  let password = req.body.password;
  const query = `select * from userdetails where phone =${phone}`;
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ msg: "err" });
    } else {
      if (result == 0) {
        res.json({ msg: "null" });
      } else {
        response = result[0];
        if (response.pass !== password) {
          res.send({ msg: "passerr" });
        } else {
          const id = { uid: result[0].uid };
          const acess_token = jwt.sign(id, process.env.SECRET_KEY);
          res.send({ msg: "sucess", token: acess_token });
        }
      }
    }
  });
});
export default router;
