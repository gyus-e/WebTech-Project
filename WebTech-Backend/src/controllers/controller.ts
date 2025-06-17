import express from 'express';

export function getIndex(req: express.Request, res: express.Response) {
    res.json({
        message: 'Welcome to the WebTech Streetcats API',
    });
}