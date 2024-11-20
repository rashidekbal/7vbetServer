import express from "express";
import "dotenv/config";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { connection } from "./db/dbConnect.js";
import { wingo } from "./WingoResults/wingoresults.js";
import { settle1MinWingo } from "./WingoResults/betResultCalcWingo.js";

const app = express();

connection.connect((err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`);
  } else {
    console.log("Finally connected to database");
    wingo();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  }
});

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("you got it right");
});
app.post("/register", (req, res) => {
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
app.get("/wingo30sec", (req, res) => {
  connection.query(
    "select * from wingo30sec   order by period desc limit 10",

    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send(response);
      }
    }
  );
});
app.get("/wingo3min", (req, res) => {
  connection.query(
    "select * from wingo3min   order by period desc limit 10",

    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send(response);
      }
    }
  );
});
app.get("/wingo5min", (req, res) => {
  connection.query(
    "select * from wingo5min   order by period desc limit 10",

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
      res.send("err" + err);
    }
  });
});

app.post("/setWingo1minbet", (req, res) => {
  let uid = req.body.packet.uid;
  let period = req.body.packet.period;
  let choice = req.body.packet.selection;
  let initialAmount = Number(req.body.packet.amount);
  let amount = initialAmount - initialAmount / 50;
  let game = req.body.packet.game;
  let time = req.body.packet.time;
  let x = new Date();
  let sec = x.getSeconds();
  if (sec > 55) {
    res.send("time up for current round");
  } else {
    let q = `select balance from userfinances where uid='${uid}'`;
    connection.query(q, (err, result2) => {
      if (!err) {
        let userbalance = Number(result2[0].balance);
        if (userbalance < amount) {
          res.send("bet not placed balance insufficient");
        } else {
          let q3 = `update userfinances set balance=${
            userbalance - initialAmount
          } where uid='${uid}'`;
          connection.query(q3, (error, response) => {
            if (!err) {
              try {
                let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending");`;
                connection.query(query, (err, result) => {
                  if (!err) {
                    res.send("done");
                  } else {
                    res.send(err);
                  }
                });
              } catch (error) {
                res.send("err");
              }
            } else {
              res.send("err occured while deducting from user balance");
            }
          });
        }
      } else {
        res.send("err bet not set something went wrong");
      }
    });
  }
});
app.post("/setWingo3minbet", (req, res) => {
  let uid = req.body.packet.uid;
  let period = req.body.packet.period;
  let choice = req.body.packet.selection;
  let initialAmount = Number(req.body.packet.amount);
  let amount = initialAmount - initialAmount / 50;
  let game = req.body.packet.game;
  let time = req.body.packet.time;
  let x = new Date();
  let sec = x.getSeconds();
  if (x.getMinutes() % 3 == 2) {
    if (sec > 55) {
      res.send("time up for current round");
    } else {
      let q = `select balance from userfinances where uid='${uid}'`;
      connection.query(q, (err, result2) => {
        if (!err) {
          let userbalance = Number(result2[0].balance);
          if (userbalance < amount) {
            res.send("bet not placed balance insufficient");
          } else {
            let q3 = `update userfinances set balance=${
              userbalance - initialAmount
            } where uid='${uid}'`;
            connection.query(q3, (error, response) => {
              if (!err) {
                try {
                  let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending");`;
                  connection.query(query, (err, result) => {
                    if (!err) {
                      res.send("done");
                    } else {
                      res.send(err);
                    }
                  });
                } catch (error) {
                  res.send("err");
                }
              } else {
                res.send("err occured while deducting from user balance");
              }
            });
          }
        } else {
          res.send("err bet not set something went wrong");
        }
      });
    }
  } else {
    let q = `select balance from userfinances where uid='${uid}'`;
    connection.query(q, (err, result2) => {
      if (!err) {
        let userbalance = Number(result2[0].balance);
        if (userbalance < amount) {
          res.send("bet not placed balance insufficient");
        } else {
          let q3 = `update userfinances set balance=${
            userbalance - initialAmount
          } where uid='${uid}'`;
          connection.query(q3, (error, response) => {
            if (!err) {
              try {
                let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending");`;
                connection.query(query, (err, result) => {
                  if (!err) {
                    res.send("done");
                  } else {
                    res.send(err);
                  }
                });
              } catch (error) {
                res.send("err");
              }
            } else {
              res.send("err occured while deducting from user balance");
            }
          });
        }
      } else {
        res.send("err bet not set something went wrong");
      }
    });
  }
});
app.post("/setwingo5min", (req, res) => {
  let uid = req.body.packet.uid;
  let period = req.body.packet.period;
  let choice = req.body.packet.selection;
  let initialAmount = Number(req.body.packet.amount);
  let amount = initialAmount - initialAmount / 50;
  let game = req.body.packet.game;
  let time = req.body.packet.time;
  let x = new Date();
  let sec = x.getSeconds();
  if (x.getMinutes() % 5 == 4) {
    if (sec > 55) {
      res.send("time up for current round");
    } else {
      let q = `select balance from userfinances where uid='${uid}'`;
      connection.query(q, (err, result2) => {
        if (!err) {
          let userbalance = Number(result2[0].balance);
          if (userbalance < amount) {
            res.send("bet not placed balance insufficient");
          } else {
            let q3 = `update userfinances set balance=${
              userbalance - initialAmount
            } where uid='${uid}'`;
            connection.query(q3, (error, response) => {
              if (!err) {
                try {
                  let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending");`;
                  connection.query(query, (err, result) => {
                    if (!err) {
                      res.send("done");
                    } else {
                      res.send(err);
                    }
                  });
                } catch (error) {
                  res.send("err");
                }
              } else {
                res.send("err occured while deducting from user balance");
              }
            });
          }
        } else {
          res.send("err bet not set something went wrong");
        }
      });
    }
  } else {
    let q = `select balance from userfinances where uid='${uid}'`;
    connection.query(q, (err, result2) => {
      if (!err) {
        let userbalance = Number(result2[0].balance);
        if (userbalance < amount) {
          res.send("bet not placed balance insufficient");
        } else {
          let q3 = `update userfinances set balance=${
            userbalance - initialAmount
          } where uid='${uid}'`;
          connection.query(q3, (error, response) => {
            if (!err) {
              try {
                let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending");`;
                connection.query(query, (err, result) => {
                  if (!err) {
                    res.send("done");
                  } else {
                    res.send(err);
                  }
                });
              } catch (error) {
                res.send("err");
              }
            } else {
              res.send("err occured while deducting from user balance");
            }
          });
        }
      } else {
        res.send("err bet not set something went wrong");
      }
    });
  }
});

app.post("/setWingo30secbet", (req, res) => {
  let uid = req.body.packet.uid;
  let period = req.body.packet.period;
  let choice = req.body.packet.selection;
  let initialAmount = Number(req.body.packet.amount);
  let amount = initialAmount - initialAmount / 50;
  let game = req.body.packet.game;
  let time = req.body.packet.time;
  let x = new Date();
  let sec = x.getSeconds();
  if (sec > 55) {
    res.send("time up for current round");
  } else if (sec - 30 > -5) {
    res.send("time up for current round");
  } else {
    let q = `select balance from userfinances where uid='${uid}'`;
    connection.query(q, (err, result2) => {
      if (!err) {
        let userbalance = Number(result2[0].balance);
        if (userbalance < amount) {
          res.send("bet not placed balance insufficient");
        } else {
          let q3 = `update userfinances set balance=${
            userbalance - initialAmount
          } where uid='${uid}'`;
          connection.query(q3, (error, response) => {
            if (!err) {
              try {
                let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending");`;
                connection.query(query, (err, result) => {
                  if (!err) {
                    res.send("done");
                  } else {
                    res.send(err);
                  }
                });
              } catch (error) {
                res.send("err");
              }
            } else {
              res.send("err occured while deducting from user balance");
            }
          });
        }
      } else {
        res.send("err bet not set something went wrong");
      }
    });
  }
});
