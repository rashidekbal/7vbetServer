import { INSUFFICIENT_BALANCE, TIME_UP } from "../constants/Enums.js";
import fetchDb from "../utils/fetchDb.js";
import Response from "../utils/StandardResponse.js";
import {
  CHECK_BALANCE_QUERY,
  INSERT_WINGO_BET_QUERY,
  UPDATE_BALANCE_QUERY,
} from "../constants/Queries.js";
import {
  generatePeriod1min,
  generatePeriod30sec,
  generatePeriod3min,
  generatePeriod5min,
} from "../utils/PeriodGenerator.js";

async function bet(req, res, periodGenerator) {
  let uid = req.uid;
  let period = periodGenerator();
  let { selection, amount, game, time } = req.body.packet;
  amount = Number(amount);
  let netAmount = amount - amount / 50;
  try {
    let balanceQueryResponse = await fetchDb(CHECK_BALANCE_QUERY, [uid]);
    let userbalance = Number(balanceQueryResponse[0].balance);
    if (userbalance < amount) {
      return res.json(
        new Response(INSUFFICIENT_BALANCE, { msg: "balance is not enough" })
      );
    }
    await fetchDb(UPDATE_BALANCE_QUERY, [userbalance - amount, uid]);
    await fetchDb(INSERT_WINGO_BET_QUERY, [
      uid,
      game,
      time,
      period,
      selection,
      netAmount,
    ]);
    return res.json(new Response(201, { msg: "bet added" }));
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

const wingo30secController = async (req, res) => {
  let x = new Date();
  let sec = x.getSeconds();
  let currentsec = sec > 30 ? Math.abs(sec - 60) : Math.abs(sec - 30);

  if (currentsec <= 5) {
    return res.json(new Response(TIME_UP, { msg: "time up" }));
  } else {
    await bet(req, res, generatePeriod30sec);
  }
};
const wingo1minController = async (req, res) => {
  let x = new Date();
  let sec = x.getSeconds();
  if (sec > 55) {
    return res.json(new Response(TIME_UP, { msg: "time up" }));
  } else {
    await bet(req, res, generatePeriod1min);
  }
};
const wingo3minController = async (req, res) => {
  let x = new Date();
  let sec = x.getSeconds();
  if (x.getMinutes() % 3 == 2 && sec > 55) {
    return res.json(new Response(TIME_UP, { msg: "time up" }));
  } else {
    //if left more than 1 min
    await bet(req, res, generatePeriod3min);
  }
};
const wingo5minController = async (req, res) => {
  let x = new Date();
  let sec = x.getSeconds();
  if (x.getMinutes() % 5 == 4 && sec > 55) {
    return res.json(new Response(TIME_UP, { msg: "time up" }));
  } else {
    await bet(req, res, generatePeriod5min);
  }
};

export {
  wingo1minController,
  wingo3minController,
  wingo5minController,
  wingo30secController,
};
