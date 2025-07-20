const CHECK_BALANCE_QUERY = `select balance from userfinances where uid=?`;
const UPDATE_BALANCE_QUERY = `update userfinances set balance=? where uid=?`;
const INSERT_WINGO_BET_QUERY = `INSERT INTO userbethistory ( uid,game,timeperiod, period, choice, amount,status,BetTime,wlAmount) VALUES (?,?,?,?,?,?,'pending','${
  new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
}',${0});`;
const SELECT_FROM_WITH_UID_GAME_TYPE_AND_LIMIT_QUERY = `select * from userbethistory where uid=? and  game=? and timeperiod=? order by id desc limit ?`;
const GET_USERFINACE_DETAILS_QUERY = `select * from userfinances where uid=?`;
export {
  CHECK_BALANCE_QUERY,
  UPDATE_BALANCE_QUERY,
  INSERT_WINGO_BET_QUERY,
  SELECT_FROM_WITH_UID_GAME_TYPE_AND_LIMIT_QUERY,
  GET_USERFINACE_DETAILS_QUERY,
};
