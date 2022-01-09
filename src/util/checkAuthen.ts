import {UserDocument} from "../models/User";
import {ApolloError} from "apollo-server-express";

export const checkIsAuthen=(user:UserDocument)=>{
    if(user){
        return true;
    }else{
        throw new ApolloError("No session login");

    }
};

export const checkIsAdmin=(user:UserDocument)=>{
    if(user &&user.rules==="Admin"){
        return true;
    } else{
        throw new ApolloError(user?"No session login":"you not have permissiom");
    }
};
