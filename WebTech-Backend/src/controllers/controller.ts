import express from 'express';

export function getIndex(req: express.Request, res: express.Response) {
    res.render(`home`);
}