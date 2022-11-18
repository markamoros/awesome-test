import { loadDataset } from "../src/infra/sentences/loadSentences.js";

async function main() {
    let dataset = await loadDataset();
    let occurrences = countWordOccurrences(dataset);
    console.log('Top 100 word occurrences:');
    console.log(occurrences.slice(0, 100).map(o => o.name));
    process.exit(0);
}

function countWordOccurrences(sentences) {
    let results = [];
    let hash = {};
    for (let sentence of sentences) {
        let words = sentence.text.toLowerCase().split(' ');
        for (let word of words) {
            if (!hash[word]) {
                hash[word] = { name: word, count: 0 };
                results.push(hash[word]);
            } else {
                hash[word].count++;
            }
        }
    }

    return results.sort((a, b) => b.count - a.count);
}

(async function() {
    await main();
})();