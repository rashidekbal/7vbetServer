import { GET_USERFINACE_DETAILS_QUERY } from "../constants/Queries.js";
import fetchDb from "../utils/fetchDb.js";
import Response from "../utils/StandardResponse.js";

async function UserFinancesGetController(req, res) {
  let uid = req.uid;
  try {
    let response = await fetchDb(GET_USERFINACE_DETAILS_QUERY, [uid]);
    if (!response.length > 0) return res.sendStatus(500);
    response = response[0];
    return res.json(new Response(200, { response }));
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}
export { UserFinancesGetController };
