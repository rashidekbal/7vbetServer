import { connection } from "../db/dbConnect.js";
import {
  settle1MinWingo,
  settle30secwingo,
  settle3MinWingo,
  settle5MinWingo,
} from "./betResultCalcWingo.js";

//note :- every game result will be published thorugh wingo page
const wingo = () => {
  setInterval(() => {
    let date = new Date();

    //for one minute games
    if (date.getSeconds() == 55) {

      WingoOneMinResult();
    }

    //for 30 sec game
    if (date.getSeconds() == 25) {
      wingo30secresult();
    }
    if (date.getSeconds() == 55) {
      wingo30secresult();
    }

    //for 3min game

    if (date.getMinutes() % 3 == 2) {
      if (date.getSeconds() == 55) {
        wingo3min();
      }
    }

    //for five min wingo
    if (date.getMinutes() % 5 == 4) {
      if (date.getSeconds() == 55) {
        wingo5min();
      }
    }
  }, 1000);
};
export { wingo };

function wingo30secresult() {
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
  }${date.getSeconds() > 30 ? 2 : 1}`;

  let number = Math.floor(Math.random() * 10);
  let size;
  let color;

  if (number < 5) {
    size = "Small";
  } else {
    size = "Big";
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

  let insert = `insert into wingo30sec(period, number, size, color) values (?,?,?,?)`;
let values=[period, number, size, color]
  connection.query(insert,values, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      settle30secwingo();
    }
  });
}
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
    size = "Small";
  } else {
    size = "Big";
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
const insert = `INSERT INTO wingo1min (period, number, size, color) VALUES (?, ?, ?, ?)`;
const values = [period, number, size, color];

  connection.query(insert,values, (err, reeee) => {
    if (err) {
      console.log(err);
    } else {
      settle1MinWingo();
    }
  });
}

function wingo3min() {
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
    size = "Small";
  } else {
    size = "Big";
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

  const insert = `INSERT INTO wingo3min (period, number, size, color) VALUES (?, ?, ?, ?)`;
const values = [period, number, size, color];

  connection.query(insert,values, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      settle3MinWingo();
    }
  });
}
function wingo5min() {
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
    size = "Small";
  } else {
    size = "Big";
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

  const insert = `INSERT INTO wingo5min (period, number, size, color) VALUES (?, ?, ?, ?)`;
const values = [period, number, size, color];

  connection.query(insert, values,(err, result) => {
    if (err) {
      console.log(err);
    } else {
      settle5MinWingo();
    }
  });
}
