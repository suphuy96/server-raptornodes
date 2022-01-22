import express, {Request, Response} from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
// Controllers (route handlers)
import * as homeController from "./controllers/home";
import  routerAuthe from "./router/auth";
import  routerPrimary from "./router/primary";
import  expressUseragent from "express-useragent";
import {getPathFile} from "./helper/backup/mongodb";
import * as passportConfig from "./config/passport";
// Create Express server
const app = express();
app.use(expressUseragent.express());
// Connect to MongoDB
const mongoUrl = MONGODB_URI +(process.env.TESTNET==="1"? process.env.DB_NAME_TESTNET:process.env.DB_NAME_MANNET);
mongoose.Promise = bluebird;
console.log("db"+process.env.TESTNET+mongoUrl);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// signed:true,secure:true
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,

    cookie:{maxAge:parseInt(process.env.MAXAGE),signed:true},
    store: new MongoStore({
        mongoUrl,
        mongoOptions: {
            autoReconnect: true
        }
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
    req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});

app.use(
    express.static(path.join(__dirname, "public"), { })
);

/**
 * Primary app routes.
 */
app.get("/", homeController.index);


app.get("/index.html", homeController.index);
app.get("/refresh", (req: Request, res: Response) =>{
    res.render("refresh", {
        title: "refresh"
    });
});

app.use(routerPrimary());
/**
 * routes login/signup and OAuth authentication routes. (Sign in)
 */
app.use(routerAuthe());
/**
 * routes apis
 */
// app.use(routerApi());

app.get("/backup/file/:fileName",passportConfig.isAuthenticated, function(req, res){
    const options = {
        root: getPathFile()
    };
        console.log(req.user,"check");
    const fileName = req.params.fileName;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            res.send("error");
        } else {
            console.log("Sent:", fileName);
        }
    });
});

app.use("/debug",(req, res, next) => {

    res.send(process.env.NODE_APP_INSTANCE);
});


export default app;
