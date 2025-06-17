import express from "express";
import { User } from "../models/User.js"
import Jwt from "jsonwebtoken";

export async function postLogin(req: express.Request, res: express.Response) {
    let isAuthenticated = await checkCredentials(req, res);
    if(isAuthenticated){
        res.json(issueToken(req.body.usr));
    } else {
        res.status(401).json( {error: "Invalid credentials. Try again."} );
    }
}

export async function postSignup(req: express.Request, res: express.Response) {
    try {
        const user = await User.create({
            username: req.body.usr, 
            password: req.body.pwd
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user.' });
        console.error(error);
    }
}

async function checkCredentials(req: express.Request, res: express.Response){
        let found = await User.findOne({
            where: { 
                username: req.body.usr, 
                password: req.body.pwd 
            }
        });
    return found !== null;
}

function issueToken(username: string){
    return Jwt.sign(
        {user:username}, 
        process.env.TOKEN_SECRET ?? (() => { throw new Error("TOKEN_SECRET is not defined"); })(), 
        {expiresIn: `${24*60*60}s`}
    );
}

