import express from 'express';
import { Cat } from '../models/Cat.js';

export interface CatRequest<params> extends express.Request<params> {
    cat: Cat | null;
}

