import express from "express";
import "dotenv/config";
import cors from "cors";
import { Server } from "socket.io";
import { connection } from "./src/db/dbConnect.js";
import { wingo } from "./src/utils/wingoresults.js";
import http from "http";
import start_new_game from "./src/utils/Aviator.js";
import auth from "./src/Routes/Auth.js";
import WingoRouter from "./src/Routes/WingoBetRoute.js";
import WingoResultRouter from "./src/Routes/WingoResultRoute.js";
import WingoBetHistoryRouter from "./src/Routes/WingoBetHistoryRouter.js";
import UserDetailsRouter from "./src/Routes/UserDetailsRouter.js";
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
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
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());
app.use("/api/v1/auth", auth); //tested and working
app.use("/api/v1/bet/wingo", WingoRouter); //tested and working
app.use("/api/v1/result/wingo", WingoResultRouter); //tested and working
app.use("/api/v1/bethistory/wingo", WingoBetHistoryRouter); //tested and working
app.use("/api/v1/user", UserDetailsRouter); //tested and working
app.get("/test", (req, res) => {
  res.send("you got it right");
});

// connection to db and starting of server
connection.connect((err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`);
  } else {
    console.log("Finally connected to database");
    wingo();
    setTimeout(() => {
      start_new_game(io);
    }, 1000);

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  }
});
