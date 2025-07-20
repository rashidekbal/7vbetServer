import { SELECT_FROM_WITH_UID_GAME_TYPE_AND_LIMIT_QUERY } from "../constants/Queries.js";
import fetchDb from "../utils/fetchDb.js";
import Response from "../utils/StandardResponse.js";
async function fetch(req, res, game, type, limit) {
  let uid = req.uid;
  try {
    let response = await fetchDb(
      SELECT_FROM_WITH_UID_GAME_TYPE_AND_LIMIT_QUERY,
      [uid, game, type, limit]
    );
    return res.json(new Response(200, { response }));
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
const wingo30secController = async (req, res) => {
  await fetch(req, res, "wingo", "30sec", 10);
};
const wingo1minController = async (req, res) => {
  await fetch(req, res, "wingo", "onemin", 10);
};
const wingo3minController = async (req, res) => {
  await fetch(req, res, "wingo", "3min", 10);
};
const wingo5minController = async (req, res) => {
  await fetch(req, res, "wingo", "5min", 10);
};

export {
  wingo1minController,
  wingo3minController,
  wingo5minController,
  wingo30secController,
};
