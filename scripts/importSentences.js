import { importSentences } from "../src/app/sentenceController.js";
import { loadDataset } from "../src/infra/sentences/loadSentences.js";

async function main() {
    let dataset = await loadDataset();
    await importSentences(dataset);
    console.log('Process complete.');
    process.exit(0);
}

(async function() {
    await main();
})();