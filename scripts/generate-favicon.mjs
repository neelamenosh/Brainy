import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import pngToIco from "png-to-ico";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const svgPath = path.join(repoRoot, "public", "favicon.svg");
const outIcoPath = path.join(repoRoot, "public", "favicon.ico");

const sizes = [16, 32, 48, 64, 128, 256];

const svg = await fs.readFile(svgPath, "utf8");

const pngBuffers = sizes.map((size) => {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
  });
  return resvg.render().asPng();
});

const ico = await pngToIco(pngBuffers);
await fs.writeFile(outIcoPath, ico);

console.log(`✅ Generated ${path.relative(repoRoot, outIcoPath)} from ${path.relative(repoRoot, svgPath)}`);
