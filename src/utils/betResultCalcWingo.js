import { connection } from "../db/dbConnect.js";
import fetchDb from "./fetchDb.js";
import {Server} from "socket.io";
async function settle1MinWingo() {

  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  // generate period number to check 
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }`;
  period=Number(period)
  let current_result_query = `select * from wingo1min where period =?`;
  let fetchBet = `select * from userbethistory where period=? and game=? and timeperiod=?`;
  try{
    let ServerResult=await fetchDb(current_result_query,[period]);
    let UserBet=await fetchDb(fetchBet,[period,'wingo','onemin']);

    if(UserBet.length>0){

      finalsettlement(UserBet, ServerResult[0]);

    }

  }catch (e) {
    console.log(e);

  }
}
async function settle3MinWingo() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  // generate new random int between 0 and 9
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }`;
period=Number(period)
  let current_result_query = `select * from wingo3min where period =?`;
  let fetchBet = `select * from userbethistory where period=? and game=? and timeperiod=?`;

  try{
    let ServerResult=await fetchDb(current_result_query,[period]);
    let UserBet=await fetchDb(fetchBet,[period,"wingo","3min"]);
    if(UserBet.length>0){
      finalsettlement(UserBet, ServerResult[0]);
    }

  }catch (e) {
    console.log(e);

  }
}
async function settle5MinWingo() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  // generate new random int between 0 and 9
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }`;
period=Number(period)
  let current_result_query = `select * from wingo5min where period =?`;
  let fetchBet = `select * from userbethistory where period=? and game=? and timeperiod=?`;

  try{
    let ServerResult=await fetchDb(current_result_query,[period]);
    let UserBet=await fetchDb(fetchBet,[period,"wingo","5min"]);
    if(UserBet.length>0){
      finalsettlement(UserBet, ServerResult[0]);
    }

  }catch (e) {
    console.log(e);

  }
}
async function settle30secwingo() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;

  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }${date.getSeconds() > 30 ? 2 : 1}`;
 period=Number(period)
  let current_result_query = `select * from wingo30sec where period =?`;
  let fetchBet = `select * from userbethistory where period=? and game=? and timeperiod=?`;


  try{
    let ServerResult=await fetchDb(current_result_query,[period]);
    let UserBet=await fetchDb(fetchBet,[period,'wingo','30sec']);
    if(UserBet.length>0){
      finalsettlement(UserBet, ServerResult[0]);
    }

  }catch (e) {
    console.log(e);

  }
}

function finalsettlement(userdata, serverdata) {
  for (let i = 0; i < userdata.length; i++) {
    settle(userdata[i], serverdata);
  }
}
async function settle(userdata, serverdata) {
  let updateBalanceQuery=`update userfinances set balance = balance+? where uid =?`;
  let updateStatusQuery=`update userbethistory set status = ? , wlAmount=? where id =?`
  if (userdata.choice == "violet") {
    if (serverdata.number == "0") {

     await fetchDb(updateBalanceQuery,[userdata.amount*4,userdata.uid]);
     await fetchDb(updateStatusQuery,["win",userdata.amount*4,userdata.id])

    } else if (serverdata.number == "5") {
      await fetchDb(updateBalanceQuery,[userdata.amount*4,userdata.uid]);
      await fetchDb(updateStatusQuery,["win",userdata.amount*4,userdata.id])
    } else {
      await fetchDb(updateStatusQuery,["loss",userdata.amount,userdata.id])
    }
  } else if (userdata.choice == "Big") {
    if (serverdata.size == "Big") {

      await fetchDb(updateBalanceQuery,[userdata.amount*2,userdata.uid]);
      await fetchDb(updateStatusQuery,["win",userdata.amount*2,userdata.id])

    } else {
      await fetchDb(updateStatusQuery,["loss",userdata.amount,userdata.id])
    }
  } else if (userdata.choice == "Small") {
    if (serverdata.size == "Small") {
       await fetchDb(updateBalanceQuery,[userdata.amount*2,userdata.uid]);
       await fetchDb(updateStatusQuery,["win",userdata.amount*2,userdata.id])

    } else {
      await fetchDb(updateStatusQuery,["loss",userdata.amount,userdata.id])

    }
  } else if (userdata.choice == "red") {
    if (serverdata.color == "redViolet") {
      await fetchDb(updateBalanceQuery,[userdata.amount*1.5,userdata.uid]);
      await fetchDb(updateStatusQuery,["win",userdata.amount*1.5,userdata.id])


    } else if (serverdata.color == "red") {
      await fetchDb(updateBalanceQuery,[userdata.amount*2,userdata.uid]);
      await fetchDb(updateStatusQuery,["win",userdata.amount*2,userdata.id])

    } else {
      await fetchDb(updateStatusQuery,["loss",userdata.amount,userdata.id])

    }
  } else if (userdata.choice == "green") {
    if (serverdata.color == "greenViolet") {
      await fetchDb(updateBalanceQuery,[userdata.amount*1.5,userdata.uid]);
      await fetchDb(updateStatusQuery,["win",userdata.amount*1.5,userdata.id])

    } else if (serverdata.color == "green") {
      await fetchDb(updateBalanceQuery,[userdata.amount*2,userdata.uid]);
      await fetchDb(updateStatusQuery,["win",userdata.amount*2,userdata.id])

    } else {
      await fetchDb(updateStatusQuery,["loss",userdata.amount,userdata.id])

    }
  } else if (userdata.choice == serverdata.number) {
    await fetchDb(updateBalanceQuery,[userdata.amount*9,userdata.uid]);
    await fetchDb(updateStatusQuery,["win",userdata.amount*9,userdata.id])

  } else {
    await fetchDb(updateStatusQuery,["loss",userdata.amount,userdata.id])

  }
}
export { settle1MinWingo, settle30secwingo, settle3MinWingo, settle5MinWingo };
