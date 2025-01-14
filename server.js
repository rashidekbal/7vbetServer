import express from "express";
import "dotenv/config";
import cors from "cors";
import { Server } from "socket.io";
import { connection } from "./db/dbConnect.js";
import { wingo } from "./WingoResults/wingoresults.js";
import { settle1MinWingo } from "./WingoResults/betResultCalcWingo.js";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket", "polling"],
});
io.on("connection", (socket) => {
  setInterval(() => {
    let x = new Date();
    let data = { minute: x.getMinutes(), seconds: x.getSeconds() };
    socket.emit("message", data);
  }, 1000);
  socket.on("message", (message) => {
    console.log(message);
  });

  socket.on("disconnect", () => {});
});
connection.connect((err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`);
  } else {
    console.log("Finally connected to database");
    wingo();

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
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
    "select * from wingo1min order by period desc limit 10",

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
  let period;
  let choice = req.body.packet.selection;
  let initialAmount = Number(req.body.packet.amount);
  let amount = initialAmount - initialAmount / 50;
  let game = req.body.packet.game;
  let time = req.body.packet.time;
  let x = new Date();
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
                  min == 0 ? `60` : min < 10 ? "0" + min : min}`;
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
                let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status,BetTime,	wlAmount) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending",'${
                  x.toLocaleDateString() + " " + x.toLocaleTimeString()
                }',${0});`;
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
  let period;
  let choice = req.body.packet.selection;
  let initialAmount = Number(req.body.packet.amount);
  let amount = initialAmount - initialAmount / 50;
  let game = req.body.packet.game;
  let time = req.body.packet.time;
  let date = new Date();
             
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              let hour = date.getHours();
              let min =
                date.getMinutes() + Math.abs((date.getMinutes() % 3) - 3);
               period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
                min == 0 ? `60` : min < 10 ? "0" + min : min
              }`;
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
                  let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status,BetTime,	wlAmount) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending",'${
                    x.toLocaleDateString() + " " + x.toLocaleTimeString()
                  }',${0});`;
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
                let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status,BetTime,	wlAmount) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending",'${
                  x.toLocaleDateString() + " " + x.toLocaleTimeString()
                }',${0});`;
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
  let period ;
  let choice = req.body.packet.selection;
  let initialAmount = Number(req.body.packet.amount);
  let amount = initialAmount - initialAmount / 50;
  let game = req.body.packet.game;
  let time = req.body.packet.time;
  let date=new Date();
   let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              let hour = date.getHours();
              let min =
                date.getMinutes()+
                Math.abs((date.getMinutes() % 5) - 5);
  period = `${year}${month}${day}${
                hour == 0 ? `00` : hour
              }${min}`;
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
                  let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status,BetTime,	wlAmount) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending",'${
                    x.toLocaleDateString() + " " + x.toLocaleTimeString()
                  }',${0});`;
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
                let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status,BetTime,	wlAmount) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending",'${
                  x.toLocaleDateString() + " " + x.toLocaleTimeString()
                }',${0});`;
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
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  // generate new random int between 0 and 9
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }${date.getSeconds() > 30 ? 2 : 1}`;
  let choice = req.body.packet.selection;
  let initialAmount = Number(req.body.packet.amount);
  let amount = initialAmount - initialAmount / 50;
  let game = req.body.packet.game;
  let time = req.body.packet.time;
  let x = new Date();
  let sec = x.getSeconds();
  let currentsec = sec > 30 ? Math.abs(sec - 60) : Math.abs(sec - 30);

  if (currentsec <= 5) {
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
                let query = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status,BetTime,	wlAmount) VALUES ('${uid}','${game}' ,'${time}','   ${period}', '${choice}', '${amount}',"pending",'${
                  x.toLocaleDateString() + " " + x.toLocaleTimeString()
                }',${0});`;
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
app.post("/wingobethistory30sec", (req, res) => {
  let q = `select * from userbethistory where uid='${req.body.id}'and  game='wingo' and timeperiod='30sec' order by id desc limit 10`;
  connection.query(q, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      res.send("err occured " + err);
    }
  });
});
app.post("/wingobethistory1min", (req, res) => {
  let q = `select * from userbethistory where uid='${req.body.id}'and  game='wingo' and timeperiod='onemin' order by id desc limit 10`;
  connection.query(q, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      res.send("err occured " + err);
    }
  });
});

app.post("/wingobethistory3min", (req, res) => {
  let q = `select * from userbethistory where uid='${req.body.id}'and  game='wingo' and timeperiod='3min' order by id desc limit 10`;
  connection.query(q, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      res.send("err occured " + err);
    }
  });
});
app.post("/wingobethistory5min", (req, res) => {
  let q = `select * from userbethistory where uid='${req.body.id}'and  game='wingo' and timeperiod='5min' order by id desc limit 10`;
  connection.query(q, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      res.send("err occured " + err);
    }
  });
});
