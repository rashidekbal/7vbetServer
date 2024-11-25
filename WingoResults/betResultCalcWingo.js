import { connection } from "../db/dbConnect.js";

function settle1MinWingo() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  // generate new random int between 0 and 9
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }`;

  let current_result_query = `select * from wingo1min where period ='${period}'`;
  let fetchBet = `select * from userbethistory where period=${period} and game='wingo' and timeperiod='onemin'`;

  connection.query(fetchBet, (err, result) => {
    if (!err) {
      if (result == 0) {
      } else {
        connection.query(current_result_query, (er, res) => {
          if (!er) {
            if (res == 0) {
            } else {
              finalsettlement(result, res[0]);
            }
          } else {
            console.log("err fetching the current bet details");
          }
        });
      }
    } else {
      console.log("err occured");
    }
  });
}
function settle3MinWingo() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  // generate new random int between 0 and 9
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }`;

  let current_result_query = `select * from wingo3min where period ='${period}'`;
  let fetchBet = `select * from userbethistory where period=${period} and game='wingo' and timeperiod='3min'`;

  connection.query(fetchBet, (err, result) => {
    if (!err) {
      if (result == 0) {
      } else {
        connection.query(current_result_query, (er, res) => {
          if (!er) {
            if (res == 0) {
            } else {
              finalsettlement(result, res[0]);
            }
          } else {
            console.log("err fetching the current bet details");
          }
        });
      }
    } else {
      console.log("err occured");
    }
  });
}
function settle5MinWingo() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  // generate new random int between 0 and 9
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }`;

  let current_result_query = `select * from wingo5min where period ='${period}'`;
  let fetchBet = `select * from userbethistory where period=${period} and game='wingo' and timeperiod='5min'`;

  connection.query(fetchBet, (err, result) => {
    if (!err) {
      if (result == 0) {
      } else {
        connection.query(current_result_query, (er, res) => {
          if (!er) {
            if (res == 0) {
            } else {
              finalsettlement(result, res[0]);
            }
          } else {
            console.log("err fetching the current bet details");
          }
        });
      }
    } else {
      console.log("err occured");
    }
  });
}
function settle30secwingo() {
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

  let current_result_query = `select * from wingo30sec where period ='${period}'`;
  let fetchBet = `select * from userbethistory where period=${period} and game='wingo' and timeperiod='30sec'`;

  connection.query(fetchBet, (err, result) => {
    if (!err) {
      if (result == 0) {
      } else {
        connection.query(current_result_query, (er, res) => {
          if (!er) {
            if (res == 0) {
            } else {
              finalsettlement(result, res[0]);
            }
          } else {
            console.log("err fetching the current bet details");
          }
        });
      }
    } else {
      console.log("err occured");
    }
  });
}

function finalsettlement(userdata, serverdata) {
  for (let i = 0; i < userdata.length; i++) {
    settle(userdata[i], serverdata);
  }
}
function settle(userdata, serverdata) {
  if (userdata.choice == "violet") {
    if (serverdata.number == "0") {
      connection.query(
        `update userfinances set balance = balance+${
          userdata.amount * 4
        } where uid=${userdata.uid}`,
        (err, res) => {
          if (!err) {
            connection.query(
              `update userbethistory set status ='win', wlAmount=${
                userdata.amount * 4
              } where id=${userdata.id}`,
              (err, respp) => {
                if (!err) {
                }
              }
            );
          }
        }
      );
    } else if (serverdata.number == "5") {
      connection.query(
        `update userfinances set balance = balance+${
          userdata.amount * 4
        } where uid=${userdata.uid}`,
        (err, res) => {
          if (!err) {
            connection.query(
              `update userbethistory set status ='win' , wlAmount=${
                userdata.amount * 4
              } where id=${userdata.id}`,
              (err, respp) => {
                if (!err) {
                }
              }
            );
          }
        }
      );
    } else {
      connection.query(
        `update userbethistory set status ='loss' where id=${userdata.id}`,
        (err, respp) => {
          if (!err) {
          }
        }
      );
    }
  } else if (userdata.choice == "Big") {
    if (serverdata.size == "big") {
      connection.query(
        `update userfinances set balance = balance+${
          userdata.amount * 2
        } where uid=${userdata.uid}`,
        (err, res) => {
          if (!err) {
            connection.query(
              `update userbethistory set status ='win', wlAmount=${
                userdata.amount * 2
              } where id=${userdata.id}`,
              (err, respp) => {
                if (!err) {
                }
              }
            );
          }
        }
      );
    } else {
      connection.query(
        `update userbethistory set status ='loss' where id=${userdata.id}`,
        (err, respp) => {
          if (!err) {
          }
        }
      );
    }
  } else if (userdata.choice == "small") {
    if (serverdata.size == "small") {
      connection.query(
        `update userfinances set balance = balance+${
          userdata.amount * 2
        } where uid=${userdata.uid}`,
        (err, res) => {
          if (!err) {
            connection.query(
              `update userbethistory set wlAmount=${
                userdata.amount * 2
              } , status ='win' where id=${userdata.id}`,
              (err, respp) => {
                if (!err) {
                }
              }
            );
          }
        }
      );
    } else {
      connection.query(
        `update userbethistory set status ='loss' where id=${userdata.id}`,
        (err, respp) => {
          if (!err) {
          }
        }
      );
    }
  } else if (userdata.choice == "red") {
    if (serverdata.color == "redViolet") {
      connection.query(
        `update userfinances set balance = balance+${
          userdata.amount * 1.5
        } where uid=${userdata.uid}`,
        (err, res) => {
          if (!err) {
            connection.query(
              `update userbethistory set status ='win', wlAmount=${
                userdata.amount * 1.5
              } where id=${userdata.id}`,
              (err, respp) => {
                if (!err) {
                }
              }
            );
          }
        }
      );
    } else if (serverdata.color == "red") {
      connection.query(
        `update userfinances set balance = balance+${
          userdata.amount * 2
        } where uid=${userdata.uid}`,
        (err, res) => {
          if (!err) {
            connection.query(
              `update userbethistory set status ='win' , wlAmount=${
                userdata.amount * 2
              } where id=${userdata.id}`,
              (err, respp) => {
                if (!err) {
                }
              }
            );
          }
        }
      );
    } else {
      connection.query(
        `update userbethistory set status ='loss' where id=${userdata.id}`,
        (err, respp) => {
          if (!err) {
          }
        }
      );
    }
  } else if (userdata.choice == "green") {
    if (serverdata.color == "greenViolet") {
      connection.query(
        `update userfinances set balance = balance+${
          userdata.amount * 1.5
        } where uid=${userdata.uid}`,
        (err, res) => {
          if (!err) {
            connection.query(
              `update userbethistory set status ='win' , wlAmount=${
                userdata.amount * 1.5
              } where id=${userdata.id}`,
              (err, respp) => {
                if (!err) {
                }
              }
            );
          }
        }
      );
    } else if (serverdata.color == "green") {
      connection.query(
        `update userfinances set balance = balance+${
          userdata.amount * 2
        } where uid=${userdata.uid}`,
        (err, res) => {
          if (!err) {
            connection.query(
              `update userbethistory set status ='win', wlAmount=${
                userdata.amount * 2
              } where id=${userdata.id}`,
              (err, respp) => {
                if (!err) {
                }
              }
            );
          }
        }
      );
    } else {
      connection.query(
        `update userbethistory set status ='loss' where id=${userdata.id}`,
        (err, respp) => {
          if (!err) {
          }
        }
      );
    }
  } else if (userdata.choice == serverdata.number) {
    connection.query(
      `update userfinances set balance = balance+${
        userdata.amount * 9
      } where uid=${userdata.uid}`,
      (err, res) => {
        if (!err) {
          connection.query(
            `update userbethistory set status ='win', wlAmount=${
              userdata.amount * 9
            } where id=${userdata.id}`,
            (err, respp) => {
              if (!err) {
              }
            }
          );
        }
      }
    );
  } else {
    connection.query(
      `update userbethistory set status ='loss' where id=${userdata.id}`,
      (err, respp) => {
        if (!err) {
        }
      }
    );
  }
}
export { settle1MinWingo, settle30secwingo, settle3MinWingo, settle5MinWingo };
