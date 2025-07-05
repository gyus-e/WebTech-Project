import express from 'express';
import { Comment } from '../models/Comment.js';
import { ErrorsJson } from "../ErrorsJson.js";

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
            photoId: req.params.photo_id,
            uploader: req.username
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment.' });
    }
}


export async function putComment(req: express.Request, res: express.Response) {
    try {
        const comment = await Comment.findByPk(req.params.comment_id);
        if (!comment) {
            res.status(404).json(ErrorsJson.fromMessage(`Comment not found.`));
            return;
        }
        comment.text = req.body.text;
        await comment.save();
        res.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json(ErrorsJson.fromMessage('Failed to update comment.'));
    }
}


export async function deleteComment(req: express.Request, res: express.Response) {
    try {
        const comment = await Comment.findByPk(req.params.comment_id);
        if (!comment) {
            res.status(404).json(ErrorsJson.fromMessage(`Comment not found.`));
            return;
        }
        await comment.destroy();
        res.status(204).send();

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json(ErrorsJson.fromMessage('Failed to delete comment.'));
    }
}