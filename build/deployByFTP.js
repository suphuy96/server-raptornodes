

var Client = require("@icetee/ftp");
// const { Client } = require('ssh2');
var path = require("path");
var fs = require("fs");
var option = require("./optionFTP");

var c = new Client();

c.on("ready", async ()=> {
    console.log("fadsfsad");
    const dirrr = "/usr/web/mainnet-raptornodes";
    c.list("/usr/web",function(err, list) {
        if (err) throw err;
        console.dir(list);
        c.end();
    });
    c.put(path.join(__dirname,"..","azure","bin","public","index.html"),dirrr+"/bin/www",(e)=>{
        console.log(e);
    });
    c.put(path.join(__dirname,"..","dist","bundle.js"),dirrr+"/bin/www",(e)=>{
        console.log(e);
    });
    c.put(path.join(__dirname,"..","assets","dot.png"),dirrr+"/bin/dot.png",(e)=>{
        console.log(e);
    });
    c.put(path.join(__dirname,"..","assets","bg.png"),dirrr+"/bin/bg.png",(e)=>{
        console.log(e);
    });
    function getFiles(dir, files_) {
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files) {
            var name = dir + "/" + files[i];
            if (fs.statSync(name).isDirectory()) {
                getFiles(name, files_);
            } else {
                files_.push(name);
            }
        }
        return files_;
    }
   const filepublic = getFiles(path.join(__dirname,"..","azure","bin","public"));
    // c.put(path.join(__dirname,"..","azure","bin"),dirrr+"/bin",(e)=>{
    //     console.log(e);
    // });
    c.put(path.join(__dirname,"..","azure","package.json"),dirrr+"/package.json",(e)=>{
        console.log(e);
    });
    // c.put(path.join(__dirname,"..","azure",".env"),dirrr+"/.env",(e)=>{
    //     console.log(e);
    // });
    for await (const fi of filepublic) {
        console.log(fi.replace(path.join(__dirname,"..","azure","bin","public"),""));
        await new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve(true) ;
            },2600);
        });
        console.log(dirrr+"/bin/public"+(fi.replace(path.join(__dirname,"..","azure","bin","public"),"")));
        c.put(fi,dirrr+"/bin/public"+(fi.replace(path.join(__dirname,"..","azure","bin","public"),"")),(e)=>{
            console.log(e);
        });
    }


});
c.connect(option);
