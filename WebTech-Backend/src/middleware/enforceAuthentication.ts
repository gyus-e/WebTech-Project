import express from "express";
import Jwt from "jsonwebtoken";

export function enforceAuthentication(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if (!token) {
        next({ status: 401, message: "Unauthorized" });
        return;
    }
    Jwt.verify(
        token,
        process.env.TOKEN_SECRET ?? (() => { throw new Error("TOKEN_SECRET is not defined"); })(),
        (err: any, decodedToken: any) => {
            if (err) {
                next({ status: 401, message: "Unauthorized" });
            } else {
                req.username = decodedToken.user;
                next();
            }
        }
    );
}