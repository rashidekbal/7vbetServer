import express from "express";
import "dotenv/config";
import cors from "cors";
import { connection } from "./db/dbConnect.js";
import { wingo } from "./WingoResults/wingoresults.js";
const app = express();

connection.connect((err) => {
  if (err) {
    console.log(`error connection to database ${err}`);
  } else {
    console.log("finally connected to database");
    wingo();
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
  const date = new Date();
  let uid = String(phone).slice(2);

  let query = `select * from userdetails where uid=${phone} limit 1`;
  3;
  let insert = `insert into userdetails values(${uid},${phone},'${password}','${referredBy}','${date.toLocaleDateString()}','${date.toLocaleTimeString()}')`;
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
              let q1 = `insert into userfinances values('${uid}','${uid}',${"0.0"},${0},${0})`;
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
          console.log(err);
        }
      } else {
        res.send("user_Exists");
      }
    }
  });
});

app.post("/login", (req, res) => {
  let response;
  let phone = req.body.phone;
  let password = req.body.password;
  const query = `select * from userdetails where phone =${phone}`;
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send("err");
    } else {
      if (result == 0) {
        res.send("null");
      } else {
        response = result[0];
        if (response.pass !== password) {
          res.send("passerr");
        } else {
          res.send("sucess");
        }
      }
    }
  });
});

app.get("/wingoOneMin", (req, res) => {
  connection.query(
    "select * from wingo1min   order by period desc limit 10",

    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send(response);
      }
    }
  );
});

app.post("/userfinances", (req, res) => {
  let query = `select * from userfinances where uid=${req.body.uid}`;

  connection.query(query, (err, result) => {
    if (!err) {
      if (!result == 0) {
        res.send(result[0]);
      } else {
        res.send("Exception_Details_Not_Found");
      }
    } else {
      res.send("err");
    }
  });
});
