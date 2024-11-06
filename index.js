import express from "express";
import "dotenv/config";
import cors from "cors";
import { connection } from "./db/dbConnect.js";
const app = express();

connection.connect((err) => {
  if (err) {
    console.log(`error connection to database ${err}`);
  } else {
    console.log("finally connected to database");
    app.listen(process.env.PORT, () => {
      console.log("server is running on port ", process.env.PORT);
    });
  }
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.post("/register", (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;
  const referredBy = req.body.refferedBy;
  let uid = String(phone).slice(2);

  let query = `select * from userdetails where uid=${uid} limit 1`;
  3;
  let insert = `insert into userdetails values(${uid},${phone},'${password}',${referredBy})`;
  connection.query(query, (erry, result) => {
    if (erry) {
      console.log(erry);
    } else {
      if (result == 0) {
        try {
          connection.query(insert, (err, result) => {
            if (err) {
              res.send(err);
            } else {
              res.send("ok");
            }
          });
        } catch (error) {
          console.log(err);
        }
      } else {
        res.send("user_Exists ");
      }
    }
  });
});
