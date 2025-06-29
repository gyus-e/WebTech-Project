import express from 'express';
import { Comment } from '../models/Comment.js';

export async function getComments(req: express.Request, res: express.Response) {
    const comments = await Comment.findAll({
        where: { photoId: req.params.photo_id }
    });
    res.json(comments);
}

export async function postComments(req: express.Request, res: express.Response) {
    try {
        const newComment = await Comment.create({
            text: req.body.text,
            photoId: req.body.photo_id,
            uploader: req.username
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment.' });
    }
}