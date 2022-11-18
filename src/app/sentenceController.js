import { mapSentence, toEntity } from "../infra/mappers/sentence/sentence.mapper.js";
import { findAll, findOne, remove, save, saveBatch, update } from "../infra/firestore/sentence.repository.js";
import { translate } from "../infra/translator/deepl.js";

export async function getSentence(id) {
    try {
        let sentenceData = await findOne(id);
        return mapSentence(sentenceData.data());
    } catch (e) {
        console.error(e);
        throw new Error('Unable to get data from the repository.');
    }
}

export async function translateSentence(id) {
    try {
        let sentenceData = await findOne(id);
        let sentence = sentenceData.data();
        sentence.text = await translate(sentence.text);
        return mapSentence(sentence);
    } catch (e) {
        console.error(e);
        throw new Error('Unable to get data from the repository.');
    }
}

export async function getAllSentences(params) {
    try {
        let sentenceData = await findAll(params);
        return sentenceData.map(mapSentence);
    } catch (e) {
        console.error(e);
        throw new Error('Unable to get data from the repository.');
    }
}

export async function addSentence(data) {
    try {
        let sentence = mapSentence(data);
        return await save(sentence);
    } catch (e) {
        console.error(e);
        throw new Error('Unable to add data to repository.');
    }
}

export async function importSentences(sentences) {
    try {
        await saveBatch(sentences.slice(0,100)); // I set a limit to avoid exceeding the firestore quota
    } catch (e) {
        console.error(e);
        throw new Error('Unable to import data.');
    }
}

export async function updateSentence(id, newData) {
    try {
        let sentence = mapSentence(newData);
        let newEntity = toEntity(sentence); // We make sure newEntity don't include null values
        await update(id, newEntity);
        return newEntity;
    } catch (e) {
        console.error(e);
        throw new Error('Unable to update repository data.');
    }
}

export async function removeSentence(id) {
    try {
        await remove(id);
    } catch (e) {
        console.error(e);
        throw new Error('Unable to remove data from repository.');
    }
}