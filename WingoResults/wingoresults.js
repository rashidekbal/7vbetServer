import { connection } from "../db/dbConnect.js";
import { settle1MinWingo } from "./betResultCalcWingo.js";

//note :- every game result will be published thorugh wingo page
const wingo = () => {
  setInterval(() => {
    let date = new Date();

    //for one minute games
    if (date.getSeconds() == 55) {
      WingoOneMinResult();
    }

    if (date.getSeconds() == 58) {
      console.log(`current sec ${date.getSeconds()}`);
      settle1MinWingo();
    }

    //for
  }, 1000);
};
export { wingo };

function WingoOneMinResult() {
  let result;
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
  let number = Math.floor(Math.random() * 10);
  let size;
  let color;

  if (number < 5) {
    size = "small";
  } else {
    size = "big";
  }
  if (number % 2 == 0) {
    color = "red";
  } else {
    color = "green";
  }
  if (number == 0) {
    color = "redViolet";
  } else if (number == 5) {
    color = "greenViolet";
  }

  result = { period, number: `${String(number)}`, size, color };

  let insert = `insert into wingo1min values ('${period}','${number}','${size}','${color}')`;
  connection.query(insert, (err, result) => {
    if (err) {
      console.log(err);
    } else {
    }
  });
}
function WingoFiveMinResult() {
  let result;
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  // generate new random int between 0 and 9
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 && "0" + min
  }`;
  let number = Math.floor(Math.random() * 10);
  let size;
  let color;

  if (number < 5) {
    size = "small";
  } else {
    size = "big";
  }
  if (number % 2 == 0) {
    color = "red";
  } else {
    color = "green";
  }
  if (number == 0) {
    color = "redViolet";
  } else if (number == 5) {
    color = "greenViolet";
  }

  result = { period, number: `${String(number)}`, size, color };

  let insert = `insert into wingo5min values ('${period}','${number}','${size}','${color}')`;
  connection.query(insert, (err, result) => {
    if (err) {
      console.log(err);
    } else {
    }
  });
}
