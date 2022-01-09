import * as contactController from "../controllers/contact";
import {Router} from "express";
export default function ():Router {
    const newRouter = Router();
    newRouter.get("/contact", contactController.getContact);
    newRouter.post("/contact", contactController.postContact);
    return newRouter;
}
