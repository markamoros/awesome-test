import * as deepl from 'deepl-node';
import {getEnv} from "../environment/environment.js";

const API_KEY = getEnv("DEEP_L_KEY");
const translator = new deepl.Translator(API_KEY);

export async function translate(text) {
    const result = await translator.translateText('Hello, world!', null, 'en-US');
    return result.text;
}