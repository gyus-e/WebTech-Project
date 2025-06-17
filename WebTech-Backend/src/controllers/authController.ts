import express from "express";
import { User } from "../models/User.js"
import Jwt from "jsonwebtoken";

export async function postLogin(req: express.Request, res: express.Response) {
    async function checkCredentials(req: express.Request, res: express.Response){
        let found = await User.findOne({
            where: { username: req.body.usr, password: req.body.pwd } //assuming password is already hashed
        });
        if(found === null) {
            return false;
        } else {
            req.session.isAuthenticated = true; 
            req.session.username = found.username;
            return true;
        }
    }

    function issueToken(username: string){
        return Jwt.sign({user:username}, process.env.TOKEN_SECRET ?? (() => { throw new Error("TOKEN_SECRET is not defined"); })(), {
            expiresIn: `${24*60*60}s`
        });
    }

    // function isTokenValid(token, callback){
    //     Jwt.verify(token, process.env.TOKEN_SECRET, callback);
    // }

    let isAuthenticated = await checkCredentials(req, res);
    if(isAuthenticated){
        res.json(issueToken(req.body.usr));
    } else {
        res.status(401);
        res.json( {error: "Invalid credentials. Try again."});
    }
}
