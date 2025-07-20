
import fetchDb from "../utils/fetchDb.js";
import Response from "../utils/StandardResponse.js";

async function fetch(req, res,query) {
  try {
    let response = await fetchDb(query);
    return res.json(new Response(200, { response }));
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

const wingo30secController = async (req, res) => {
  let query=`select * from wingo30sec order by id desc limit 10`
  await fetch(req, res, query);
};
const wingo1minController = async (req, res) => {
  let query=`select * from wingo1min order by id desc limit 10`
  await fetch(req, res, query);
};
const wingo3minController = async (req, res) => {
  let query=`select * from wingo3min order by id desc limit 10`
  await fetch(req, res, query);
};
const wingo5minController = async (req, res) => {
  let query=`select * from wingo5min order by id desc limit 10`
  await fetch(req, res, query);
};

export {
  wingo1minController,
  wingo3minController,
  wingo5minController,
  wingo30secController,
};
