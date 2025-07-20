import { Router } from "express";
import verifyToken from "../middleWares/Authorization.js";
import {
  wingo1minController,
  wingo30secController,
  wingo3minController,
  wingo5minController,
} from "../contorllers/WingoResultController.js";

let router = Router();
router.route("/thirtysec").get(verifyToken, wingo30secController);
router.route("/onemin").get(verifyToken, wingo1minController);
router.route("/threemin").get(verifyToken, wingo3minController);
router.route("/fivemin").get(verifyToken, wingo5minController);

export default router;
