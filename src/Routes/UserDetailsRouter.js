import { Router } from "express";
import verifyToken from "../middleWares/Authorization.js";
import { UserFinancesGetController } from "../contorllers/UserController.js";
let router = Router();
router.route("/userfinances").get(verifyToken, UserFinancesGetController);

export default router;
