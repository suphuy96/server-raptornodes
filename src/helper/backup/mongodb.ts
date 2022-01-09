import path from "path";
import {spawn} from "child_process";
import moment from "moment";
export function  getPathFile():string {
    const dir = path.join(__dirname,"..","..","..","src","backup");
    return dir;
}

export function reStoreBK  (pathZip:string):Promise<string>{
        return new Promise((resolve)=>{
        console.log("hêyreStoreBK");
            const dbName = process.env.DB_NAME;
            const dir = path.join(__dirname,"..","..","..","src","backup",pathZip);
    console.log(dir,"dir");
    const backupProcess = spawn("mongorestore", [
        "--db="+dbName,
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
        const dbName = process.env.DB_NAME;
        const day = moment(new Date()).format("DD-MM-YYYY_HH_mm");
        const dir = path.join(__dirname,"..","..","..","src","backup",name);
        console.log(dir,"dir");
        const backupProcess = spawn("mongodump", [
            "--db="+dbName,
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
};
