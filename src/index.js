import express from 'express';
import sentenceRoutes from './interface/routes/sentence.route.js';
import * as bodyParser from "express";

let index = express();
index.use(express.json());
index.use(bodyParser.urlencoded({ extended: true }));
index.use('/sentence', sentenceRoutes);

export default index;
