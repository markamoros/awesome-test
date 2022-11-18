import { Sentence } from "../../../domain/sentence.js";
import { catsEnum } from "../../../domain/enums/cats.enum.js";

export function mapSentence(sentence) {
    return new Sentence(sentence.text, catsEnum[sentence.category]);
}
export function toEntity(sentence) {
    let entity = {};
    if (sentence.text) {
        entity.text = sentence.text;
    }
    if (sentence.category) {
        entity.category = sentence.category;
    }
    return entity;
}