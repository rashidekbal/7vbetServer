import mysql from "mysql2";
const host = "localhost";
const user = "admin";
const password = "rashidekbal786";
const database = "7betv2";

const connection = mysql.createConnection({
  host,
  user,
  password,
  database,
});

export { connection };
