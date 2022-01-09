import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";
export interface TFA {
        secret?: string;
       tempSecret: string;
        dataURL:string;
        done?:Date;
        tfaURL: string;
}
export interface IUser {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    facebook?: string;
    google?:string;
    tfa?:TFA;
    rules?:string;
    discord?: string;
    accountRTM:string;
    addressRTM:string;
    enableTfa:boolean;
    balance?:number;
    status:boolean;
    accountRTMError?:boolean;
    tokenJWT?: string;
    tokens: AuthToken[];
    profile: {
        name: string;
        discordName?: string;
        discordAvatar?:string;
        gender: string;
        location: string;
        website: string;
        picture: string;
    };

    comparePassword: comparePasswordFunction;
    gravatar: (size: number) => string;
}
export type UserDocument = mongoose.Document & IUser

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

export interface AuthToken {
    accessToken: string;
    kind: string;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true },
        password: String,
        passwordResetToken: String,
        passwordResetExpires: Date,
        accountRTM:String,
        addressRTM:String,
        accountRTMError:Boolean,
        tokenJWT:String,
        status:{ type: Boolean, default: true },
        rules:{ type: String, default: "User" },
        tfa:{
            secret: String,
            tempSecret: String,
            dataURL:String,
            done:Date,
            tfaURL: String
        },
        enableTfa:Boolean,
        facebook: String,
        twitter: String,
        google: String,
        tokens: Array,
        discord: String,
        profile: {
            name: String,
            discordName: String,
            discordAvatar:String,
            gender: String,
            location: String,
            website: String,
            picture: String
        }
    },
    { timestamps: true },
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<UserDocument>("User", userSchema);
