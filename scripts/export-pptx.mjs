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
  pptx.subject = "CyberBin editable PowerPoint export";
  pptx.title = await page.title();
  pptx.lang = "zh-CN";
  pptx.theme = {
    headFontFace: "Arial",
    bodyFontFace: "Arial",
    lang: "zh-CN",
  };

  for (let index = 0; index < slideCount; index += 1) {
    await page.evaluate((target) => {
      const buttons = [...document.querySelectorAll("#nav button")];
      buttons[target]?.click();
    }, index);
    await page.waitForTimeout(90);
    const textItems = await page.evaluate(collectTextItems, index);
    await page.evaluate(() => document.body.classList.add("pptx-hide-text"));
    const png = await page.screenshot({ type: "png", fullPage: false });
    await page.evaluate(() => document.body.classList.remove("pptx-hide-text"));

    const slide = pptx.addSlide();
    slide.background = { color: "F4EE55" };
    slide.addImage({
      data: `data:image/png;base64,${png.toString("base64")}`,
      x: 0,
      y: 0,
      w: 13.333333,
      h: 7.5,
    });
    for (const item of textItems) addEditableText(slide, item);
  }

  await pptx.writeFile({ fileName: outputPath });
  console.log(`PPTX exported: ${outputPath}`);
  console.log(`Slides: ${slideCount}`);
  console.log("Text: editable PowerPoint text boxes");
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
    * { caret-color: transparent !important; }
    body.pptx-hide-text h1,
    body.pptx-hide-text h2,
    body.pptx-hide-text h3,
    body.pptx-hide-text h4,
    body.pptx-hide-text p,
    body.pptx-hide-text li,
    body.pptx-hide-text td,
    body.pptx-hide-text th,
    body.pptx-hide-text .title,
    body.pptx-hide-text .meta,
    body.pptx-hide-text .tiny,
    body.pptx-hide-text .kicker,
    body.pptx-hide-text .notice,
    body.pptx-hide-text .card-tag,
    body.pptx-hide-text .note,
    body.pptx-hide-text .lead,
    body.pptx-hide-text .small,
    body.pptx-hide-text .topline div,
    body.pptx-hide-text .footline div,
    body.pptx-hide-text .metric {
      visibility: hidden !important;
    }
  `;
}

function collectTextItems(activeIndex) {
  const slide = document.querySelectorAll("#deck .slide")[activeIndex];
  const selector = [
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "li",
    "td",
    "th",
    ".title",
    ".meta",
    ".tiny",
    ".kicker",
    ".notice",
    ".card-tag",
    ".note",
    ".lead",
    ".small",
    ".topline div",
    ".footline div",
    ".metric",
  ].join(",");
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const selected = [...slide.querySelectorAll(selector)];
  return selected
    .filter((el) => !el.closest("svg") && !selected.some((parent) => parent !== el && parent.contains(el)))
    .map((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const text = (el.innerText || el.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
      return {
        text,
        left: rect.left / viewport.width,
        top: rect.top / viewport.height,
        width: rect.width / viewport.width,
        height: rect.height / viewport.height,
        fontSize: Number.parseFloat(style.fontSize) || 16,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        color: style.color,
        align: style.textAlign,
        lineHeight: style.lineHeight,
        opacity: Number.parseFloat(style.opacity || "1"),
      };
    })
    .filter((item) => item.text && item.width > 0.002 && item.height > 0.002 && item.opacity !== 0);
}

function addEditableText(slide, item) {
  const width = 13.333333;
  const height = 7.5;
  const fontSizePt = Math.max(5, Math.min(110, item.fontSize * 0.72));
  slide.addText(item.text, {
    x: round(item.left * width),
    y: round(item.top * height),
    w: round(item.width * width + 0.05),
    h: round(item.height * height + 0.04),
    margin: 0,
    fit: "shrink",
    fontFace: fontFace(item),
    fontSize: fontSizePt,
    bold: isBold(item.fontWeight),
    italic: /Segoe Print|Comic Sans|Marker Felt|cursive/i.test(item.fontFamily),
    color: rgbToHex(item.color),
    align: align(item.align),
    valign: "top",
    paraSpaceAfterPt: 0,
    breakLine: false,
  });
}

function fontFace(item) {
  if (/mono|plex mono|menlo|consolas|courier/i.test(item.fontFamily)) return "Courier New";
  if (/Segoe Print|Comic Sans|Marker Felt|cursive/i.test(item.fontFamily)) return "Comic Sans MS";
  if (/[\u3400-\u9fff]/.test(item.text)) return "Microsoft YaHei";
  return "Arial";
}

function isBold(weight) {
  const numeric = Number.parseInt(weight, 10);
  return Number.isFinite(numeric) ? numeric >= 650 : /bold|black/i.test(weight);
}

function align(value) {
  if (value === "center") return "center";
  if (value === "right" || value === "end") return "right";
  return "left";
}

function rgbToHex(value) {
  const match = String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return "1E3F9D";
  return [match[1], match[2], match[3]]
    .map((part) => Number(part).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}
