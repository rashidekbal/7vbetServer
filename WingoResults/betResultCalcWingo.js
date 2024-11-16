import { connection } from "../db/dbConnect.js";

function settle1MinWingo() {
  console.log("bet setteled");
  let q = `delete from general1minbet`;
  let query = `select * from general1minbet group by uid`;
  connection.query(q, (err, result) => {
    if (!err) {
      console.log("cleared the  mess");
    } else {
      console.log("error occured while clearing the mess" + err);
    }
  });
}

export { settle1MinWingo };
