import mysql from "mysql2";
import "dotenv/config";
const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DB;

const connection = mysql.createConnection({
  host,
  user,
  password,
  database,
});

export { connection };
