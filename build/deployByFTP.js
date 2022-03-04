

var Client = require("@icetee/ftp");
var path = require("path");
var fs = require("fs");
var option = require("./optionFTP");
var c = new Client();
c.on("ready", async ()=> {
    c.list("/site/wwwroot",function(err, list) {
        if (err) throw err;
        console.dir(list);
        c.end();
    });
    // c.put(path.join(__dirname,"..","azure",'bin','public',"index.html"),"/site/wwwroot/bin/www",(e)=>{
    //     console.log(e);
    // });
    c.put(path.join(__dirname,"..","dist","bundle.js"),"/site/wwwroot/bin/www",(e)=>{
        console.log(e);
    });
    c.put(path.join(__dirname,"..","assets","dot.png"),"/site/wwwroot/bin/dot.png",(e)=>{
        console.log(e);
    });
    c.put(path.join(__dirname,"..","assets","bg.png"),"/site/wwwroot/bin/bg.png",(e)=>{
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
    // c.put(path.join(__dirname,"..","azure","bin"),"/site/wwwroot/bin",(e)=>{
    //     console.log(e);
    // });
    c.put(path.join(__dirname,"..","azure","package.json"),"/site/wwwroot/package.json",(e)=>{
        console.log(e);
    });
    // c.put(path.join(__dirname,"..","azure",".env"),"/site/wwwroot/.env",(e)=>{
    //     console.log(e);
    // });
    for await (const fi of filepublic) {
        console.log(fi.replace(path.join(__dirname,"..","azure","bin","public"),""));
        await new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve(true) ;
            },2600);
        });
        console.log("/site/wwwroot/bin/public"+(fi.replace(path.join(__dirname,"..","azure","bin","public"),"")));
        c.put(fi,"/site/wwwroot/bin/public"+(fi.replace(path.join(__dirname,"..","azure","bin","public"),"")),(e)=>{
            console.log(e);
        });
    }


});
c.connect(option);
