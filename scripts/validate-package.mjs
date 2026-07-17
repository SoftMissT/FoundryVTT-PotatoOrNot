import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile("module.json", "utf8"));
const english = JSON.parse(await readFile("languages/en.json", "utf8"));
const main = await readFile("scripts/main.js", "utf8");

if (manifest.compatibility.verified !== "14") throw new Error("Foundry v14 is not verified in module.json.");
if ("maximum" in manifest.compatibility) throw new Error("module.json must not cap compatibility at v13.");
if (manifest.title !== "Batata ou Não") throw new Error("The module title must be displayed in Portuguese.");
if (!manifest.description.includes("computador")) throw new Error("The module description must be written in Portuguese.");
if (manifest.version !== JSON.parse(await readFile("package.json", "utf8")).version) {
    throw new Error("package.json and module.json versions differ.");
}
if (manifest.manifest !== "https://raw.githubusercontent.com/SoftMissT/FoundryVTT-PotatoOrNot/main/module.json") {
    throw new Error("The install manifest must use the stable raw main URL.");
}
if (manifest.download !== `https://github.com/SoftMissT/FoundryVTT-PotatoOrNot/releases/download/v${manifest.version}/module.zip`) {
    throw new Error("The download URL must point to the module.zip asset for the current version.");
}

for (const path of manifest.languages.map(({ path }) => path)) {
    const translations = JSON.parse(await readFile(path, "utf8"));
    for (const key of Object.keys(english)) {
        if (!(key in translations)) throw new Error(`${path} is missing translation key: ${key}`);
    }
}

for (const required of ["Hooks.once(\"init\"", "Hooks.once(\"ready\"", "render({ force: true })"]) {
    if (!main.includes(required)) throw new Error(`Missing v14 lifecycle pattern: ${required}`);
}
for (const obsolete of ["render(true)", "setTimeout("]) {
    if (main.includes(obsolete)) throw new Error(`Obsolete lifecycle pattern remains: ${obsolete}`);
}

console.info("Package validation passed: Foundry v14 lifecycle, manifest, versions, and language keys.");
