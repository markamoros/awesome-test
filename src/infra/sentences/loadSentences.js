import {createInterface} from "readline";
import {createReadStream} from "fs";
import {once} from "events";
import {mapSentence} from "../mappers/sentence/sentence.mapper.js";
import {catsEnum} from "../../domain/enums/cats.enum.js";

const DATASET_PATH = "../assets/data/sentences.jsonl.txt";

export async function loadDataset() {

    const dataset = [];

    try {

        const readLine = createInterface({
            input: createReadStream(DATASET_PATH),
            crlfDelay: Infinity
        });

        readLine.on("line", (line) => {
            dataset.push(JSON.parse(line));
        });

        await once(readLine, 'close');

    } catch (err) {
        console.error('Error loading dataset.');
        throw err;
    }

    return dataset.map(parseSentence);
}

function parseSentence(sentence) {
    let category = Object.keys(sentence.cats).filter(cat => sentence.cats[cat])[0];
    return mapSentence({ text: sentence.text, category: catsEnum[category] || null });
}