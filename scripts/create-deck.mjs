#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, "..");

const templates = {
  "pinboard": { file: "pinboard.html", family: "pinboard", label: "Pinboard Deck" },
};

function usage() {
  console.error("Usage: create-deck.mjs <template-id> <output-dir> --title \"Deck Title\" [--slides 20] [--demo] [--language zh|en]");
  console.error(`Templates: ${Object.keys(templates).join(", ")}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const templateId = args[0];
const outputDir = args[1];
const title = readOption("--title", "Untitled Deck");
const demo = args.includes("--demo");
const slides = readPositiveInt("--slides", demo ? 5 : 20);
const language = normalizeLanguage(readOption("--language", "")) || (containsCjk(title) ? "zh" : "en");

if (!templateId || !outputDir || !templates[templateId]) usage();

const template = templates[templateId];
const templatePath = path.join(skillRoot, "assets", "templates", template.file);
const indexPath = path.join(outputDir, "index.html");

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(path.join(outputDir, "images"), { recursive: true });
fs.mkdirSync(path.join(outputDir, "assets"), { recursive: true });
fs.copyFileSync(
  path.join(skillRoot, "assets", "motion.min.js"),
  path.join(outputDir, "assets", "motion.min.js")
);
copyBundledPaperclips(path.join(outputDir, "images"));

let html = fs.readFileSync(templatePath, "utf8");
html = html.replace(/<html\s+lang=["'][^"']+["']>/, `<html lang="${language === "zh" ? "zh-CN" : "en"}">`);
html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
html = html.replace(
  /<meta\s+name=["']viewport["'][^>]*>/,
  `$&\n<meta name="cyberbin-template" content="${templateId}">\n<meta name="cyberbin-slide-target" content="${slides}">`
);
html = html.replaceAll("__CYBERBIN_SKILL_ROOT__", "CYBERBIN_SKILL_DIR");
html = html.replace("[必填] 替换为 PPT 标题 · Deck Title", escapeHtml(title));
html = html.replace("←/→ · ESC overview · B 静态", language === "zh" ? "←/→ · ESC overview · B 静态" : "←/→ · ESC overview · B static");

const rhythm = [
  ["Cover", "封面", "这页定义整份 deck 的语气和承诺。"],
  ["Agenda", "目录", "列出这次分享会走过的主要路径。"],
  ["Why Now", "为什么现在", "说明这个主题今天值得被重新讨论。"],
  ["Context", "现状", "给出用户、行业或团队正在面对的背景。"],
  ["Problem", "核心问题", "把分散的现象收束成一个清晰问题。"],
  ["Insight", "关键洞察", "提出整份 deck 的核心判断。"],
  ["Chapter 1", "第一章", "进入第一个论点或模块。"],
  ["Explain", "解释", "展开第一章的逻辑。"],
  ["Evidence", "证据", "用案例、数据或场景支撑第一章。"],
  ["Chapter 2", "第二章", "进入第二个论点或模块。"],
  ["Explain", "解释", "展开第二章的逻辑。"],
  ["Evidence", "证据", "用案例、数据或场景支撑第二章。"],
  ["Chapter 3", "第三章", "进入第三个论点或模块。"],
  ["Explain", "解释", "展开第三章的逻辑。"],
  ["Evidence", "证据", "用案例、数据或场景支撑第三章。"],
  ["Method", "方法", "把观点转成可执行步骤。"],
  ["Before / After", "前后对比", "展示采用方法前后的差异。"],
  ["Risks", "风险与决策", "说明边界、取舍和下一步判断。"],
  ["Takeaways", "总结", "收束成三到五个关键要点。"],
  ["Closing", "收尾", "给出最终行动或提问。"],
];

if (demo) {
  const slideHtml = pinboardDemoSlides(title, slides, template, language);
  html = insertSlides(html, slideHtml);
  html = html.replaceAll("[必填]", "示例");
}

fs.writeFileSync(indexPath, html);
console.log(`Created ${indexPath}`);
console.log(`Template: ${templateId}`);
console.log(`Slides target: ${slides}`);
console.log(`Language: ${language}`);
console.log(`Images: ${path.join(outputDir, "images")}`);

function readOption(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) usage();
  return value;
}

function readPositiveInt(name, fallback) {
  const raw = readOption(name, String(fallback));
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 1 || value > 80) {
    console.error(`${name} must be an integer from 1 to 80.`);
    process.exit(1);
  }
  return value;
}

function normalizeLanguage(raw) {
  const value = String(raw || "").trim().toLowerCase();
  if (!value) return "";
  if (["zh", "cn", "chinese", "中文"].includes(value)) return "zh";
  if (["en", "english", "英文"].includes(value)) return "en";
  console.error("--language must be zh or en.");
  process.exit(1);
}

function containsCjk(value) {
  return /[\u3400-\u9fff]/.test(String(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function insertSlides(source, slideHtml) {
  const replaced = source.replace(
    /<div id="deck">[\s\S]*?(?=<div id="nav">)/,
    `<div id="deck">\n\n${slideHtml}\n\n</div>\n\n`
  );
  if (replaced !== source) return replaced;
  return source
    .replace("<!-- SLIDES_HERE -->", slideHtml)
    .replace(/<!-- SLIDES_HERE[\s\S]*?-->/, slideHtml);
}

function pad(number) {
  return String(number).padStart(2, "0");
}

function roleFor(index, total) {
  if (index <= rhythm.length) return rhythm[index - 1];
  if (index === total) return rhythm[rhythm.length - 1];
  return ["Appendix", `补充 ${pad(index)}`, "补充材料、案例或备用讨论页。"];
}

function copyBundledPaperclips(imagesDir) {
  const sourceDir = path.join(skillRoot, "assets", "paperclips");
  for (const file of fs.readdirSync(sourceDir)) {
    if (!file.endsWith(".svg")) continue;
    fs.copyFileSync(path.join(sourceDir, file), path.join(imagesDir, file));
  }
}

function pinSvg(className = "pin-mark pin-large", variant = "large") {
  const files = {
    large: "paperclip_01_transparent.svg",
    cover2: "paperclip_02_transparent.svg",
    small: "paperclip_03_transparent_no_line.svg",
  };
  const file = files[variant] || files.large;
  const extraClass = variant === "small" ? "pin-small" : "pin-large";
  return `<img class="${className} ${extraClass} pin-img" src="images/${file}" alt="">`;
}

function pinboardChrome(left, right) {
  return `<div class="topline"><div>${escapeHtml(left)}</div><div>${escapeHtml(right)}</div></div>`;
}

function pinboardFoot(n, total, left = "CyberBin Field Office") {
  return `<div class="footline"><div>${escapeHtml(left)}</div><div>${pad(n)} / ${pad(total)}</div></div>`;
}

function splitChineseTitle(value) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  const match = clean.match(/^([A-Za-z0-9]+)\s*(.+)$/);
  if (match && match[2].length > 6) {
    const rest = match[2].replace(/\s+/g, "");
    const cut = Math.min(4, Math.max(2, Math.ceil(rest.length / 2)));
    return `${escapeHtml(match[1])} ${escapeHtml(rest.slice(0, cut))}<br><span class="hand">${escapeHtml(rest.slice(cut))}</span>`;
  }
  const chars = Array.from(clean.replace(/\s+/g, ""));
  if (chars.length <= 8) return escapeHtml(clean);
  const cut = Math.ceil(chars.length / 2);
  return `${escapeHtml(chars.slice(0, cut).join(""))}<br><span class="hand">${escapeHtml(chars.slice(cut).join(""))}</span>`;
}

function inlineChineseTitle(value) {
  return escapeHtml(String(value || "").replace(/\s+/g, " ").trim());
}

function pinboardDemoSlides(deckTitle, total, template, language = "en") {
  if (language === "zh") return pinboardChineseDemoSlides(deckTitle, total, template);
  return loadConfirmedEnglishDemoSlides(total);
}

function loadConfirmedEnglishDemoSlides(total) {
  const examplePath = path.join(skillRoot, "assets", "examples", "pinboard-en-confirmed-slides.html");
  const source = fs.readFileSync(examplePath, "utf8");
  const sections = [...source.matchAll(/<section class="slide[\s\S]*?<\/section>/g)].map((m) => m[0]);
  if (!sections.length) throw new Error("Missing confirmed English demo slides.");
  const selected = sections.slice(0, Math.min(total, sections.length)).map((section, index) =>
    section.replace(/>\d{2} \/ 20</g, `>${pad(index + 1)} / ${pad(total)}<`)
  );
  while (selected.length < total) selected.push(pinboardEnglishAppendixSlide(selected.length + 1, total));
  return selected.join("\n");
}

function pinboardEnglishAppendixSlide(n, total) {
  const [label] = roleFor(n, total);
  return `
<section class="slide light" data-layout="pin-detail">
  ${pinboardChrome(`←O ${label.toUpperCase()}`, "CYBERBIN FIELD OFFICE APPENDIX")}
  <div style="margin-top:4vh">
    <h2 class="headline">Keep this page <span class="hand">clear.</span></h2>
    <p class="lead" style="margin-top:2vh">Use one claim, one proof shape, and one next move. Compress extra detail before it enters the slide.</p>
  </div>
  <div class="cards-3">
    <div class="card">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">Point · 01</div><h3>One concrete claim.</h3><p class="small">Replace this with the strongest sentence for this page role.</p><div class="bottom-note note">make it sayable.</div></div>
    <div class="card yellow">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">Point · 02</div><h3>One proof shape.</h3><p class="small">Use a metric, scene, quote, or before/after contrast.</p><div class="bottom-note note">show the receipt.</div></div>
    <div class="card warm">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">Point · 03</div><h3>One next move.</h3><p class="small">End the slide with a decision the team can make.</p><div class="bottom-note note">ship the ask.</div></div>
  </div>
  ${pinboardFoot(n, total)}
</section>`;
}
function pinboardChineseDemoSlides(deckTitle, total, template) {
  const safeTitle = inlineChineseTitle(deckTitle);
  const topics = [
    "创作入口变了",
    "草稿方式变了",
    "修改与分发变了",
    "人该做什么",
  ];
  const pages = [
    (n) => `
<section class="slide light hero pin-cover zh-cover" data-layout="pin-cover">
  ${pinboardChrome("现场手册 · 第一卷", "CYBERBIN · 模板一")}
  ${pinSvg("pin-mark pin-cover-1", "large")}
  <div class="hero-main">
    <div class="hero-copy">
      <h1 class="display-tight zh-cover-title">${safeTitle}</h1>
    </div>
    <div class="hero-side">
      <div class="note">给：创作者<br><span class="underline">一套流程。一个起点。</span></div>
      ${pinSvg("pin-mark pin-cover-2", "cover2")}
    </div>
  </div>
  ${pinboardFoot(n, total, "由 CyberBin 生成")}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-agenda">
  ${pinboardChrome("←〇 目录", "创作流程实验室 · 第一阶段")}
  <div class="agenda-title">
    <h2 class="headline zh-inline-title">这份稿子 <span class="hand">讲什么。</span></h2>
  </div>
  <div class="agenda-list">
    ${topics.map((topic, i) => `
    <div class="agenda-row">
      <div class="num">${pad(i + 1)}</div>
      <div class="title">${escapeHtml(topic)}</div>
      ${pinSvg("pin-mark", "small")}
      <div class="tiny meta">${["背景 · 4页", "方法 · 6页", "证据 · 6页", "行动 · 4页"][i]}</div>
    </div>`).join("")}
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-rules">
  ${pinboardChrome("←〇 原则", "创作流程实验室 · 第二阶段")}
  <div style="margin-top:4.5vh">
    <h2 class="headline zh-inline-title">先守住三条 <span class="hand">创作线。</span></h2>
    <p class="lead" style="margin-top:1.4vh">AI 可以加速表达，但不能替你决定立场、判断和最终承诺。</p>
  </div>
  <div class="cards-3">
    <div class="card">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">原则 · 01</div><h3>先写真实句子。</h3><p class="small">如果你自己都不会这样说，这页就还没有写完。</p><div class="bottom-note note">先像人说话。</div></div>
    <div class="card yellow">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">原则 · 02</div><h3>先给结构。</h3><p class="small">让 AI 处理草稿之前，先把目标、读者和层级说清楚。</p><div class="bottom-note note">结构先行。</div></div>
    <div class="card warm">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">原则 · 03</div><h3>保留个人判断。</h3><p class="small">机器可以生成很多版本，但最终取舍仍然由发布者负责。</p><div class="bottom-note note">署名意味着负责。</div></div>
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
    (n) => `
<section class="slide dark blue" data-layout="pin-section">
  ${pinboardChrome("第二部分", "方向与方法")}
  ${pinSvg("pin-mark pin-corner pin-yellow", "large")}
  <div class="zh-section-center">
    <h2 class="zh-section-title-inline">从想法到发布，<span class="hand">流程变短。</span></h2>
    <p class="lead" style="color:var(--paper)">把想法、素材、草稿、修改和发布排进一条稳定链路。</p>
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-detail">
  ${pinboardChrome("←〇 观察 · 详情", "创作流程实验室 · 第三阶段")}
  <div class="detail-title">
    <div class="notice">观察 · ${pad(n)}<br>流程变化</div>
    <h2 class="headline zh-h1-long">AI 改变的不是一篇稿子，而是整条创作链路。</h2>
  </div>
  <div class="detail-cards">
    <div class="card"><h3>发现什么</h3><p class="small"><strong>创作入口变了。</strong>过去从空白页开始，现在从问题、素材和提示词开始。</p><ul class="small"><li>先收集素材。</li><li>再定义读者。</li><li>最后进入生成。</li></ul><div class="bottom-note tiny">样例 · 创作流程</div></div>
    <div class="card yellow"><h3>为什么重要</h3><p class="note">草稿速度变快，但判断成本没有消失。</p><p class="small">越容易生成，越需要在开头定义边界，否则后面会花更多时间返工。</p><div class="bottom-note tiny">方法 · 先定结构</div></div>
    <div class="card warm"><h3>应该怎么做</h3><ul class="small"><li><strong>先写目标</strong>，不要直接让 AI 写全文。</li><li><strong>先给素材</strong>，减少空泛表达。</li><li><strong>先定口吻</strong>，再进入改写。</li></ul><div class="bottom-note tiny">行动 · 今天就能用</div></div>
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
    (n) => `
<section class="slide dark blue" data-layout="pin-chart">
  ${pinboardChrome("←〇 修改次数", "第三阶段 · 证据")}
  ${pinSvg("pin-mark pin-corner pin-yellow", "large")}
  <div class="chart-layout">
    <div>
      <h2 class="section-title" style="font-size:clamp(50px,5.2vw,100px)">返工减少在 <span class="hand">第三轮。</span></h2>
      <p class="lead" style="margin-top:5vh;color:var(--paper)">当素材、结构和口吻先被定义，后续修改会从“重写全文”变成“局部校准”。</p>
      <div class="legend">
        <div class="legend-row"><span class="legend-line dash"></span>无结构生成</div>
        <div class="legend-row"><span class="legend-line thin"></span>有素材生成</div>
        <div class="legend-row"><span class="legend-line"></span>结构 + 素材 + 口吻</div>
      </div>
    </div>
    <div class="chart-box">
      <svg viewBox="0 0 820 520" fill="none" aria-label="修改次数示意图">
        <path d="M55 45V470H780" stroke="var(--ink)" stroke-width="2"/>
        <path d="M55 45H780M55 170H780M55 295H780M55 420H780" stroke="var(--ink)" stroke-opacity=".18" stroke-dasharray="3 5"/>
        <path d="M60 62C180 135 255 260 350 320C455 386 570 435 760 462" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" stroke-dasharray="16 14"/>
        <path d="M60 62C180 104 260 150 360 214C470 284 600 340 760 362" stroke="#2e57d7" stroke-width="9" stroke-linecap="round"/>
        <path d="M60 62C215 96 340 145 465 197C570 241 638 280 760 306" stroke="var(--ink)" stroke-width="13" stroke-linecap="round"/>
        <circle cx="60" cy="62" r="9" fill="var(--ink)"/>
      </svg>
    </div>
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-workflow">
  ${pinboardChrome("←〇 工作方式", "创作流程实验室 · 第四阶段")}
  <div style="margin-top:4.5vh;display:grid;grid-template-columns:1fr 28vw;gap:5vw">
    <h2 class="headline zh-inline-title">从<span class="hand">想法</span>到发布，分五步走。</h2>
    <p class="lead">这是一条可重复路径：先定方向，再让 AI 进入具体环节。</p>
  </div>
  <div class="cards-5">
    ${["定位","素材","草稿","修改","发布"].map((title, i) => `<div class="card ${i === 2 ? "warm" : i === 4 ? "" : "yellow"}">${pinSvg("pin-mark pin-card", "small")}<div class="step-no">${i + 1}</div><h3>${title}</h3><p class="small">${["定义对象、目的和读者状态。","整理观点、例子、数据和语气。","让 AI 先产出可修改版本。","按标题、结构、语气逐层检查。","按平台重新包装并交付。"][i]}</p>${i < 4 ? '<div class="arrow-link">→</div>' : ""}</div>`).join("")}
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-table">
  ${pinboardChrome("←〇 平台改写", "创作流程实验室 · 第四阶段")}
  <div style="margin-top:4vh;display:grid;grid-template-columns:1fr 28vw;gap:4vw">
    <h2 class="headline zh-inline-title">同一个观点，写成<span class="hand">不同形状。</span></h2>
    <p class="lead">AI 最适合做平台改写，但前提是你先定义读者状态和内容目的。</p>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>平台</th><th>开头方式</th><th>内容重心</th><th>结尾动作</th></tr></thead>
      <tbody>
        <tr><td>短视频</td><td>反常识一句话</td><td>场景和冲突</td><td>引导评论</td></tr>
        <tr><td>公众号</td><td>问题背景</td><td>完整论证</td><td>收藏转发</td></tr>
        <tr><td>小红书</td><td>痛点直给</td><td>步骤和清单</td><td>保存照做</td></tr>
        <tr><td>课程页</td><td>结果承诺</td><td>方法闭环</td><td>报名咨询</td></tr>
      </tbody>
    </table>
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-numbers">
  ${pinboardChrome("←〇 数字变化", "第四阶段 · 证据")}
  <div style="margin-top:4vh;display:grid;grid-template-columns:1fr 26vw;gap:5vw">
    <h2 class="headline zh-inline-title">流程收益，<span class="hand">看三个数。</span></h2>
    <p class="lead">不是追求一次生成完美，而是减少返工、提升稳定性。</p>
  </div>
  <div class="number-grid">
    <div class="number-card">${pinSvg("pin-mark pin-card", "small")}<div class="metric">3<span class="unit">层</span></div><h3>修改<br>检查</h3><p class="small">标题、结构、语气分开处理。</p></div>
    <div class="number-card yellow">${pinSvg("pin-mark pin-card", "small")}<div class="metric">5<span class="unit">步</span></div><h3>稳定<br>流程</h3><p class="small">定位、素材、草稿、修改、发布。</p></div>
    <div class="number-card warm">${pinSvg("pin-mark pin-card", "small")}<div class="metric">20<span class="unit">页</span></div><h3>默认<br>节奏</h3><p class="small">足够讲清背景、方法、证据和行动。</p></div>
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-quote">
  ${pinboardChrome("←〇 创作者反馈", "第四阶段 · 证据")}
  <div class="split-panel">
    ${pinSvg("pin-mark pin-card", "small")}
    <div class="split-side">
      <div class="kicker">拆成两部分</div>
      <h3 style="font-size:clamp(30px,2.6vw,52px);line-height:1.08;font-weight:900">判断在左，<br>证据在右。</h3>
      <p class="lead">遇到核心问题页，不用巨大引号抢空间，而是把结论和解释拆开。</p>
    </div>
    <div class="split-main">
      <h2>我不是让 AI 替我写，而是让它把每一步都变得<span class="hand">更容易检查。</span></h2>
      <p class="lead">左侧负责说明这页的判断，右侧承载主要观点、引用或行动。这样信息更清楚，也不会出现无意义的大符号。</p>
      <div class="tiny">内容创作者 · 课程 / 短视频 / 产品文案</div>
    </div>
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-closing">
  ${pinboardChrome("←〇 下一步", "创作流程实验室 · 第五阶段")}
  <div class="final-grid">
    <div class="final-blue">
      <div class="kicker">从这里开始</div>
      <h2 class="display-tight">先改<br>一条<br><span class="hand">流程。</span></h2>
      <p class="lead">不要一次重做所有内容。先选一个高频场景，把它变成可复用流程。</p>
      ${pinSvg("pin-mark pin-large", "large")}
    </div>
    <div class="final-white">
      <h3 style="font-size:clamp(24px,2vw,38px);font-weight:900">本周怎么推进</h3>
      ${["选一个场景","写出流程","连续复盘"].map((item, i) => `<div class="action-row"><div class="n">${i + 1}</div><div><h4 style="font-size:clamp(18px,1.28vw,26px);font-weight:900">${item}</h4><p class="small">${["比如短视频开头、课程大纲或产品说明。","记录输入、提示词、输出和修改规则。","每周保留一个版本，直到流程稳定。"][i]}</p></div></div>`).join("")}
    </div>
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`,
  ];

  const appendix = (n) => {
    const [, title, desc] = roleFor(n, total);
    return `
<section class="slide light" data-layout="pin-detail">
  ${pinboardChrome(`←〇 ${title}`, "创作流程实验室 · 补充页")}
  <div style="margin-top:4vh">
    <h2 class="headline zh-h1-long">${escapeHtml(title)} <span class="hand">保持清楚。</span></h2>
    <p class="lead" style="margin-top:2vh">${escapeHtml(desc)}</p>
  </div>
  <div class="cards-3">
    <div class="card">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">要点 · 01</div><h3>一句明确判断。</h3><p class="small">把这一页最重要的话写成观众能复述的句子。</p><div class="bottom-note note">先让人听懂。</div></div>
    <div class="card yellow">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">要点 · 02</div><h3>一个证明方式。</h3><p class="small">用数据、场景、对比或案例支撑这句话。</p><div class="bottom-note note">拿出证据。</div></div>
    <div class="card warm">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">要点 · 03</div><h3>一个下一步。</h3><p class="small">让这一页最后落到一个具体动作。</p><div class="bottom-note note">把动作说清。</div></div>
  </div>
  ${pinboardFoot(n, total, "创作流程实验室")}
</section>`;
  };

  return Array.from({ length: total }, (_, i) => {
    const n = i + 1;
    return (pages[i] || appendix)(n);
  }).join("\n");
}
