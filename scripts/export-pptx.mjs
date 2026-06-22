#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error("Usage: export-pptx.mjs <path-or-url-to-index.html> <output.pptx>");
  console.error("Example: node scripts/export-pptx.mjs ./demo-pinboard/ppt/index.html ./demo-pinboard.pptx");
  process.exit(1);
}

const { chromium, pptxgen } = await loadDependencies();
const inputUrl = toUrl(input);
const outputPath = path.resolve(output);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const browser = await launchBrowser(chromium);
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
});

try {
  await page.goto(inputUrl, { waitUntil: "networkidle" });
  await page.waitForSelector("#deck .slide", { timeout: 10000 });
  await page.addStyleTag({ content: exportCss() });
  await page.evaluate(() => {
    document.body.classList.add("low-power");
    document.querySelectorAll("[contenteditable]").forEach((el) => {
      el.removeAttribute("contenteditable");
      el.removeAttribute("spellcheck");
    });
  });

  const slideCount = await page.evaluate(() => document.querySelectorAll("#deck .slide").length);
  if (!slideCount) throw new Error("No slides found in #deck.");

  const pptx = new pptxgen();
  pptx.defineLayout({ name: "CYBERBIN_WIDE", width: 13.333333, height: 7.5 });
  pptx.layout = "CYBERBIN_WIDE";
  pptx.author = "CyberBin";
  pptx.company = "CyberBin";
  pptx.subject = "CyberBin image-only PowerPoint export";
  pptx.title = await page.title();

  for (let index = 0; index < slideCount; index += 1) {
    await page.evaluate((target) => {
      const buttons = [...document.querySelectorAll("#nav button")];
      buttons[target]?.click();
    }, index);
    await page.waitForTimeout(90);
    const png = await page.screenshot({ type: "png", fullPage: false });

    const slide = pptx.addSlide();
    slide.addImage({
      data: `data:image/png;base64,${png.toString("base64")}`,
      x: 0,
      y: 0,
      w: 13.333333,
      h: 7.5,
    });
  }

  await pptx.writeFile({ fileName: outputPath });
  console.log(`PPTX exported: ${outputPath}`);
  console.log(`Slides: ${slideCount}`);
  console.log("Mode: image-only slides");
} finally {
  await browser.close();
}

async function loadDependencies() {
  try {
    const playwright = await import("playwright");
    const pptxModule = await import("pptxgenjs");
    return {
      chromium: playwright.chromium,
      pptxgen: pptxModule.default || pptxModule,
    };
  } catch (error) {
    console.error("Missing dependencies. Run `npm install` in the CyberBin skill folder, then try again.");
    console.error(error.message);
    process.exit(1);
  }
}

function toUrl(value) {
  if (/^https?:\/\//i.test(value) || /^file:\/\//i.test(value)) return value;
  return pathToFileURL(path.resolve(value)).href;
}

async function launchBrowser(chromium) {
  try {
    return await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    return await chromium.launch({ headless: true });
  }
}

function exportCss() {
  return `
    #tools, #hint, #nav, #overview { display: none !important; }
    #deck { transition: none !important; }
    * { caret-color: transparent !important; }
  `;
}
