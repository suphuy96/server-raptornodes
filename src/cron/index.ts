import backupDB from "../helper/backup/mongodb";
import {Backup} from "../models/Backup";
import moment from "moment";
import cron  from "node-cron";
export default ()=>{
    const dbBackupTask = cron.schedule("59 23 * * *",async () => {
        const backup = new Backup();
        console.log("schedule backup");
        backup.label = "auto backup"+moment(new Date()).format("DD/MM/YYYY HH:mm");
        const day = moment(new Date()).format("DD-MM-YYYY_HH_mm")+".zip";
        const pathZip= await backupDB(day);
        backup.path = day;
        // backup.author = "3456789";
        await backup.save();
    });
};

