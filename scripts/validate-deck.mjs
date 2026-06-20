#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const validTemplates = new Set([
  "pinboard",
]);

const args = process.argv.slice(2);
const file = args[0];
if (!file) {
  console.error("Usage: validate-deck.mjs <path/to/index.html> [--expected-slides N] [--template template-id]");
  process.exit(1);
}

const expectedSlides = readOptionalInt("--expected-slides");
const expectedTemplate = readOption("--template");
if (expectedTemplate && !validTemplates.has(expectedTemplate)) {
  console.error(`Unknown template '${expectedTemplate}'. Valid templates: ${[...validTemplates].join(", ")}`);
  process.exit(1);
}

const htmlPath = path.resolve(file);
const root = path.dirname(htmlPath);
const html = fs.readFileSync(htmlPath, "utf8");
const visibleHtml = html.replace(/<!--[\s\S]*?-->/g, "");
const errors = [];
const warnings = [];

if (!/<title>(?!\s*\[必填\])[^<]{2,}<\/title>/.test(visibleHtml)) errors.push("Missing real <title>.");
if (/\[必填\]|TODO|SLIDES_HERE/.test(visibleHtml)) errors.push("Unresolved placeholder remains.");
if (!/<div\s+id=["']deck["']/.test(visibleHtml)) errors.push("Missing #deck runtime container.");
if (!/<div\s+id=["']hint["']/.test(visibleHtml)) errors.push("Missing #hint control text.");
if (!/<div\s+id=["']tools["']/.test(visibleHtml)) errors.push("Missing #tools edit/export toolbar.");
if (!/data-action=["']edit["'][\s\S]*data-action=["']save["'][\s\S]*data-action=["']pptx["']/.test(visibleHtml)) {
  errors.push("Missing Edit / Save HTML / PPTX toolbar actions.");
}
if (!/low-power|lowPower|低功耗|B 静态/.test(html)) errors.push("Low-power B mode text/code not found.");
if (!/overview|ESC|Escape/.test(html)) errors.push("ESC overview code/text not found.");
if (!/is-current|transition|translateY/.test(html)) errors.push("Simple slide animation code not found.");

const slideCount = [...visibleHtml.matchAll(/<section\s+class=["'][^"']*\bslide\b/gi)].length;
if (slideCount < 5) errors.push(`Expected at least 5 slides, found ${slideCount}.`);
if (expectedSlides !== undefined && slideCount !== expectedSlides) {
  errors.push(`Expected ${expectedSlides} slides, found ${slideCount}.`);
}

const templateMeta = readMeta("cyberbin-template");
if (expectedTemplate && templateMeta !== expectedTemplate) {
  errors.push(`Expected template '${expectedTemplate}', found '${templateMeta || "missing"}'.`);
}
if (templateMeta && !validTemplates.has(templateMeta)) {
  errors.push(`Invalid cyberbin-template meta value: ${templateMeta}`);
}

const targetMeta = readMeta("cyberbin-slide-target");
if (targetMeta && !/^\d+$/.test(targetMeta)) {
  errors.push(`Invalid cyberbin-slide-target meta value: ${targetMeta}`);
}

const blockedDomains = [
  "gamma.app",
  "beautiful.ai",
  "tome.app",
  "canva.com",
  "slidesgo.com",
  "slidesmodel.com",
  "envato.com",
  "pitch.com",
];
for (const domain of blockedDomains) {
  if (visibleHtml.includes(domain)) errors.push(`Blocked paid/reference-site domain found: ${domain}`);
}

const imageRefs = [...visibleHtml.matchAll(/(?:src|href)=["'](images\/[^"']+)["']/g)].map((m) => m[1]);
for (const ref of imageRefs) {
  const imagePath = path.join(root, ref);
  if (!fs.existsSync(imagePath)) errors.push(`Missing local image: ${ref}`);
}

if (/<section\s+class=["'][^"']*\bslide\b(?![^>]*\b(light|dark|accent|split|hero)\b)/i.test(visibleHtml)) {
  warnings.push("At least one slide may be missing an explicit theme class.");
}

if (errors.length) {
  console.error("Deck validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  if (warnings.length) {
    console.error("Warnings:");
    for (const warning of warnings) console.error(`- ${warning}`);
  }
  process.exit(1);
}

console.log(`Deck validation passed: ${htmlPath}`);
console.log(`Slides: ${slideCount}`);
if (templateMeta) console.log(`Template: ${templateMeta}`);
if (targetMeta) console.log(`Slide target: ${targetMeta}`);
if (imageRefs.length) console.log(`Images checked: ${imageRefs.length}`);
if (warnings.length) {
  console.log("Warnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

function readOption(name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`${name} requires a value.`);
    process.exit(1);
  }
  return value;
}

function readOptionalInt(name) {
  const raw = readOption(name);
  if (raw === undefined) return undefined;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 1 || value > 80) {
    console.error(`${name} must be an integer from 1 to 80.`);
    process.exit(1);
  }
  return value;
}

function readMeta(name) {
  const pattern = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, "i");
  return html.match(pattern)?.[1];
}
