import {
    getDoc, getDocs, deleteDoc, updateDoc, setDoc, doc, collection, query,
    getFirestore, writeBatch, orderBy, limit, startAt, endAt
} from "firebase/firestore";
import { v1 as uuidv1 } from "uuid";
import { readFileSync } from "fs";
import { initializeApp } from "firebase/app";
import { getEnv, getPath } from "../environment/environment.js";
import path from "path";
import { toEntity } from "../mappers/sentence/sentence.mapper.js";

const FIREBASE_CONFIG_PATH = "../config/firebase.config.json";
const MAX_BATCH_OPERATIONS = 500;
const COLLECTION_NAME = "sentences";

const firebaseConfig = JSON.parse(readFileSync(path.resolve(getPath(), FIREBASE_CONFIG_PATH)));
const app = initializeApp({
    apiKey: getEnv('FIREBASE_API_KEY'),
    ...firebaseConfig
});
const db = getFirestore(app);

const paramsList = {
    orderBy: { extraParam: 'order', constraint: orderBy, order: 0 },
    limit: { constraint: limit, order: 1 },
    startAt: { constraint: startAt, order: 2 },
    endAt: { constraint: endAt, order: 3 },
};

export async function findOne(id) {
    const ref = doc(db, COLLECTION_NAME, id);
    return await getDoc(ref);
}

export async function findAll(params) {

    // Converts query parameters to firestore constraints
    let constraints = [];
    let keys = Object.keys(params);
    keys = keys.sort((a, b) => paramsList[a]?.order - paramsList[b]?.order);
    for (let key of keys) {
        let paramInstance = paramsList[key];
        if (paramInstance) {
            let param = params[key];
            let extraParam = params[paramInstance.extraParam];
            if (extraParam) {
                constraints.push(paramInstance.constraint(param, extraParam));
            } else {
                constraints.push(paramInstance.constraint(param));
            }
        }
    }

    const ref = collection(db, COLLECTION_NAME);
    let result = [];
    let q = query(ref, ...constraints);

    const queryResult = await getDocs(q);
    queryResult.forEach(doc => { result.push(doc.data()) });

    return result;

}

export async function save(sentence) {
    let uuid = uuidv1();
    await setDoc(doc(db, COLLECTION_NAME, uuid), toEntity(sentence));
    return uuid;
}

export async function saveBatch(sentences) {

    let n = Math.ceil(sentences.length / MAX_BATCH_OPERATIONS);
    for (let x = 0; x < n; x++) {

        const batch = writeBatch(db);
        const subset = sentences.slice(x * MAX_BATCH_OPERATIONS, (x * MAX_BATCH_OPERATIONS) + MAX_BATCH_OPERATIONS);

        for (let sentence of subset) {
            let uuid = uuidv1();
            let ref = doc(db, COLLECTION_NAME, uuid);
            batch.set(ref, toEntity(sentence));
        }

        await batch.commit();
    }

}

export async function update(id, newEntity) {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, newEntity);
}

export async function remove(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}