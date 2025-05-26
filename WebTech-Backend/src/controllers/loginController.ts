import express from "express";
import { User } from "../models/User.js";

export function getLogin(req: express.Request, res: express.Response) {
    res.send("login");
}

export async function postLogin(req: express.Request, res: express.Response) {
    async function validate(){
        let found = await User.findOne({
            where: { username: req.body.usr, password: req.body.pwd }
        });
        if(found !== null) {
            req.session.isAuthenticated = true; 
            req.session.username = found.dataValues.username;
            return true;
        }
        return false;
    }

    if (await validate()) {
        res.send("OK!");
    } else {
        res.status(400).send("LOGIN FAILED");
    }
}