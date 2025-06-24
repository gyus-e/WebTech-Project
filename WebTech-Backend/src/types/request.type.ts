import express from 'express';
import { Cat } from '../models/Cat.js';
import { Photo } from '../models/Photo.js';

export interface CatRequest<params> extends express.Request<params> {
    cat: Cat | null;
}

export interface PhotoRequest<params> extends CatRequest<params> {
    photo: Photo | null;
}
