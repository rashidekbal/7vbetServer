import {connection} from "../db/dbConnect.js";
export default async function fetchDb(query,data){
    return new Promise((resolve,reject)=>{
        if(data!=null){
            connection.query(query,data,(err,result)=>{
                if(!err){
                    resolve(result);
                }else{
                    reject(err);
                }
            })
        }else{
            connection.query(query,(err,result)=>{
                if(!err){
                    resolve(result)}
                else{
                    reject(err);
                }
            })

        }

    })
}

