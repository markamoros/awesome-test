import express from 'express';
import { checkAuth } from "../../infra/middlewere/authVerifier.js";
import {
  addSentence,
  getAllSentences,
  getSentence,
  removeSentence, translateSentence,
  updateSentence
} from "../../app/sentenceController.js";
import { checkParams } from "../../infra/middlewere/paramSanitizer.js";

const router = express.Router();

router.get('/:id', [checkAuth], async (req, res) => {
  try {
    let sentence = await getSentence(req.params.id);
    res.status(200).send(sentence);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id/translate', [checkAuth], async (req, res) => {
  try {
    let sentence = await translateSentence(req.params.id);
    res.status(200).send(sentence);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/', [checkAuth, checkParams], async (req, res) => {
  try {
    let sentences = await getAllSentences(req.query);
    res.status(200).send(sentences);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/', [checkAuth], async (req, res) => {

  const body = req.body;

  try {
    let id = await addSentence(body);
    res.status(200).send({ id });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/:id', [checkAuth], async (req, res) => {
  try {
    await removeSentence(req.params.id);
    res.status(200).send({
      message: "Sentence correctly deleted."
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.put('/:id', [checkAuth], async (req, res) => {

  const id = req.params.id;
  const body = req.body;

  try {
    let newData = await updateSentence(id, body);
    res.status(200).send(newData);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
