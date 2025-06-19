import express from "express";
import { User } from "../models/User.js"
import Jwt from "jsonwebtoken";
import argon2 from "argon2";


export async function postSignup(req: express.Request, res: express.Response) {
    const hash = await argon2.hash(req.body.pwd);
    try {
        const user = await User.create({
            username: req.body.usr,
            password: hash,
        });
        res.json(issueToken(user.username));
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user.' });
        console.error(error);
    }
}


export async function postLogin(req: express.Request, res: express.Response) {
    let user = await User.findByPk(req.body.usr);
    if (user !== null) {
        if (await argon2.verify(user.password, req.body.pwd)) {
            res.json(issueToken(req.body.usr));
            return;
        }
    }
    res.status(401).json({ error: "Bad credentials." });
}


function issueToken(username: string) {
    return Jwt.sign(
        { user: username },
        process.env.TOKEN_SECRET ?? (() => { throw new Error("TOKEN_SECRET is not defined"); })(),
        { expiresIn: `${24 * 60 * 60}s` }
    );
}