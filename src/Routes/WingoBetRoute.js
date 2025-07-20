import { Router } from "express";
import {
  wingo1minController,
  wingo30secController,
  wingo3minController,
  wingo5minController,
} from "../contorllers/WingoBetContorller.js";
import verifyToken from "../middleWares/Authorization.js";

let router = Router();
router.route("/thirtysec").post(verifyToken, wingo30secController);
router.route("/onemin").post(verifyToken, wingo1minController);
router.route("/threemin").post(verifyToken, wingo3minController);
router.route("/fivemin").post(verifyToken, wingo5minController);
export default router;
