import {Request, Response, Router} from "express";
import passport from "passport";
import pick from "lodash/pick";
import {CHECK_FH} from "../util/secrets";
import * as userController from "../controllers/user";
import * as passportConfig from "../config/passport";
// const speakeasy = require('speakeasy');
// const QRCode = require('qrcode');
export default function ():Router {
    const routerAuth = Router();

    routerAuth.get("/refesh", (req: Request, res: Response): void => {
        res.send(CHECK_FH);
    });
    routerAuth.get("/login", userController.getLogin);
    routerAuth.post("/login", userController.postLogin);
    routerAuth.get("/logout", userController.logout);
    routerAuth.get("/forgot", userController.getForgot);
    routerAuth.post("/forgot", userController.postForgot);
    routerAuth.get("/reset/:token", userController.getReset);
    routerAuth.post("/reset/:token", userController.postReset);
    routerAuth.get("/signup", userController.getSignup);
    routerAuth.post("/signup", userController.postSignup);
    routerAuth.get("/account", passportConfig.isAuthenticated, userController.getAccount);
    routerAuth.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
    routerAuth.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
    routerAuth.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
    routerAuth.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);
    routerAuth.get("/info", passportConfig.isAuthenticated, (req, res) =>{
        //console.log(req.user)
        res.json(pick(req.user,["email","_id","profile","createdAt","updatedAt"]));
    });


    /**
     * OAuth google authentication routes. (Sign in)
     */
    routerAuth.get("/auth/google", (req, res,next) => {
      //  console.log("vào đây check");
        if(req.query.checkauthen){
            if (req.isAuthenticated()) {
                const u:any = req.user;
                return res.redirect(process.env.NODE_ENV==="production"?"/#":"http://localhost:8080/#/login?token="+(u.tokenJWT||""));
            } else{
                next();
            }
        }else {
            next();
        }
    },passport.authenticate("google", { scope: ["profile","email"] }));
    routerAuth.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login"}), (req, res) => {
        // console.log(res);
        const u:any = req.user;

        res.redirect( process.env.NODE_ENV==="production"?"/#dashboard":"http://localhost:8080/#/login?token="+(u.tokenJWT||""));
        // res.redirect( req.session.returnTo || "/");
    });
    /**
     * OAuth discord authentication routes.
     */
    if(process.env.AUTHENDISCORD){
        routerAuth.get("/auth/discord",(req, res,next) => {
            {
                console.log("vào đây check", req.user);

                next();
            }
        }, passport.authenticate("discord", { scope: ["email", "identify"] }));
        routerAuth.get("/auth/discord/callback", passport.authenticate("discord", { failureRedirect: "/login"
        }), (req, res) => {
            // console.log(res);
            res.redirect( process.env.NODE_ENV==="production"?"/#dashboard":"http://localhost:8080/#/settings?refresh=1");
            // res.redirect(req.session.returnTo || "/");
        });
    }
    return routerAuth;
}
