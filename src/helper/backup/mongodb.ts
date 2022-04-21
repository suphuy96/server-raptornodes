import path from "path";
import {spawn} from "child_process";
import moment from "moment";
import {MONGODB_URI, DB_NAME_MANNET, ENVIRONMENT} from "../../util/secrets";
export function  getPathFile():string {
    const dir = path.join(__dirname,"..","backup");
    return dir;
}

export function reStoreBK  (pathZip:string):Promise<string>{
        return new Promise((resolve)=>{
        console.log("hêyreStoreBK");
            const dbName = ENVIRONMENT === "production"?DB_NAME_MANNET:process.env.DB_NAME_TESTNET;
            const dir = path.join(__dirname,"..","backup",pathZip);
    console.log(dir,"dir");
    const backupProcess = spawn("mongorestore", [
         "--uri="+MONGODB_URI+dbName,
        "--archive="+dir,
        "--gzip"
    ]);

    backupProcess.on("exit", (code, signal) => {
        if(code){
            console.log("Backup process exited with code ", code);
        }

        else if (signal)
            console.error("Backup process was killed with singal ", signal);
        else
            console.log("Successfully backedup the database");
        resolve(dir);
    });
        });
}
export default  (name:string):Promise<string>=>{
    return new Promise((resolve)=>{
        const dbName = ENVIRONMENT === "production"?DB_NAME_MANNET:process.env.DB_NAME_TESTNET;
        const day = moment(new Date()).format("DD-MM-YYYY_HH_mm");
        const dir = path.join(__dirname,"..","backup",name);
        console.log(dir,"dir");
        const backupProcess = spawn("mongodump", [
            "--uri="+MONGODB_URI+dbName,
            "--archive="+dir,
            "--forceTableScan",
            "--gzip"
        ]);

        backupProcess.on("exit", (code, signal) => {
            if(code){
                console.log("Backup process exited with code ", code);
            }

            else if (signal)
                console.error("Backup process was killed with singal ", signal);
            else
                console.log("Successfully backedup the database");
            resolve(dir);
        });
    });
};
