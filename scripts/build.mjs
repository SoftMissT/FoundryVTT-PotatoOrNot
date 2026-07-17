import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const output = "dist";
const files = ["module.json", "LICENSE", "README.md"];
const directories = ["docs", "languages", "scripts", "styles", "templates"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of files) await cp(file, join(output, basename(file)));
for (const directory of directories) {
    await cp(directory, join(output, directory), {
        recursive: true,
        filter: (source) => !source.endsWith("validate-package.mjs") && !source.endsWith("build.mjs")
    });
}

const manifest = JSON.parse(await readFile(join(output, "module.json"), "utf8"));
if (process.env.RELEASE_VERSION) manifest.version = process.env.RELEASE_VERSION.replace(/^v/, "");
if (process.env.GITHUB_REPOSITORY) {
    const repository = `https://github.com/${process.env.GITHUB_REPOSITORY}`;
    const rawRepository = `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/main`;
    manifest.url = repository;
    manifest.manifest = `${rawRepository}/module.json`;
    manifest.download = `${repository}/releases/download/${process.env.RELEASE_VERSION}/module.zip`;
    manifest.readme = `${repository}/blob/main/README.md`;
    manifest.bugs = `${repository}/issues`;
}
await writeFile(join(output, "module.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.info(`Built ${manifest.id} v${manifest.version} in ${output}/`);
