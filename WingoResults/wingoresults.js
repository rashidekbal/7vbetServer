import { connection } from "../db/dbConnect.js";

//note :- every game result will be published thorugh wingo page
const wingo = () => {
  setInterval(() => {
    let date = new Date();

    //for one minute games
    if (date.getSeconds() == 55) {
      WingoOneMinResult();
    }

    //for
  }, 1000);
};
export { wingo };

function WingoOneMinResult() {
  let result;
  let date = new Date();
  // generate new random int between 0 and 9
  let period = `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}${date.getHours()}${date.getMinutes() + 1}`;
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
