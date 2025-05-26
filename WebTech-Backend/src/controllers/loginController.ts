import express from "express";

export function getLogin(req: express.Request, res: express.Response) {
    res.send("login");
}

export function postLogin(req: express.Request, res: express.Response) {
    res.send("login post"); 
}