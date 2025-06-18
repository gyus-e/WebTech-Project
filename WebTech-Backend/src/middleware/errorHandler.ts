import express from "express";

export function errorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(err.stack);
    res.status(err.status ?? 500).json({
        code: err.status ?? 500,
        description: err.message ?? "An error occurred"
    });
}