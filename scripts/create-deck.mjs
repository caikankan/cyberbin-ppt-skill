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
  console.error("Usage: create-deck.mjs <template-id> <output-dir> --title \"Deck Title\" [--slides 20] [--demo]");
  console.error(`Templates: ${Object.keys(templates).join(", ")}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const templateId = args[0];
const outputDir = args[1];
const title = readOption("--title", "Untitled Deck");
const demo = args.includes("--demo");
const slides = readPositiveInt("--slides", demo ? 5 : 20);

if (!templateId || !outputDir || !templates[templateId]) usage();

const template = templates[templateId];
const templatePath = path.join(skillRoot, "assets", "templates", template.file);
const indexPath = path.join(outputDir, "index.html");

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(path.join(outputDir, "images"), { recursive: true });

let html = fs.readFileSync(templatePath, "utf8");
html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
html = html.replace(
  /<meta\s+name=["']viewport["'][^>]*>/,
  `$&\n<meta name="cyberbin-template" content="${templateId}">\n<meta name="cyberbin-slide-target" content="${slides}">`
);
html = html.replace("[必填] 替换为 PPT 标题 · Deck Title", escapeHtml(title));

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
  const slideHtml = pinboardDemoSlides(title, slides, template);
  html = insertSlides(html, slideHtml);
  html = html.replaceAll("[必填]", "示例");
}

fs.writeFileSync(indexPath, html);
console.log(`Created ${indexPath}`);
console.log(`Template: ${templateId}`);
console.log(`Slides target: ${slides}`);
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

function pinSvg(className = "pin-mark pin-large", variant = "large") {
  const files = {
    large: "paperclip_01_transparent.svg",
    cover2: "paperclip_02_transparent.svg",
    small: "paperclip_03_transparent_no_line.svg",
  };
  const file = files[variant] || files.large;
  const extraClass = variant === "small" ? "pin-small" : "pin-large";
  const svgPath = path.join(skillRoot, "assets", "paperclips", file);
  return fs.readFileSync(svgPath, "utf8")
    .replace(/<\?xml[\s\S]*?\?>\s*/i, "")
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<svg\b/, `<svg class="${className} ${extraClass}"`)
    .replaceAll(/fill=["']#1E3B8A["']/gi, 'fill="currentColor"')
    .replace(/\swidth=["'][^"']+["']/i, "")
    .replace(/\sheight=["'][^"']+["']/i, "")
    .replace(/<svg([^>]*)>/i, '<svg$1 aria-hidden="true">');
}

function pinboardChrome(left, right) {
  return `<div class="topline"><div>${escapeHtml(left)}</div><div>${escapeHtml(right)}</div></div>`;
}

function pinboardFoot(n, total, left = "CyberBin Field Office") {
  return `<div class="footline"><div>${escapeHtml(left)}</div><div>${pad(n)} / ${pad(total)}</div></div>`;
}

function pinboardDemoSlides(deckTitle, total, template) {
  const safeTitle = escapeHtml(deckTitle);
  const topics = [
    "The trust gap",
    "Three pilots, scored",
    "A way of working",
    "What we ship next",
  ];
  const pages = [
    (n) => `
<section class="slide light hero pin-cover" data-layout="pin-cover">
  ${pinboardChrome("A FIELD GUIDE · VOL. I", "CYBERBIN · TEMPLATE 1")}
  ${pinSvg("pin-mark pin-cover-1", "large")}
  <div class="hero-main">
    <div class="hero-copy">
      <h1 class="display">${safeTitle.split(/\s+/).slice(0, 2).join(" ")}<br><span class="hand">${safeTitle.split(/\s+/).slice(2).join(" ") || "kept things."}</span></h1>
    </div>
    <div class="hero-side">
      <div class="note">For: the room.<br><span class="underline">One deck. One ask.</span></div>
      ${pinSvg("pin-mark pin-cover-2", "cover2")}
    </div>
  </div>
  ${pinboardFoot(n, total, "Presented by CyberBin")}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-agenda">
  ${pinboardChrome("←O PIN & PAPER", "CYBERBIN FIELD OFFICE   PHASE I")}
  <div class="agenda-title">
    <h2 class="headline">What’s<br><span class="hand">inside.</span></h2>
  </div>
  <div class="agenda-list">
    ${topics.map((topic, i) => `
    <div class="agenda-row">
      <div class="num">${pad(i + 1)}</div>
      <div class="title">${escapeHtml(topic)}</div>
      ${pinSvg("pin-mark", "small")}
      <div class="tiny meta">${["Findings · 12 min", "Evidence · 9 min", "Method · 7 min", "Decisions · 8 min"][i]}</div>
    </div>`).join("")}
  </div>
  ${pinboardFoot(n, total)}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-rules">
  ${pinboardChrome("←O PRINCIPLES", "CYBERBIN FIELD OFFICE   PHASE II")}
  <div style="margin-top:4.5vh">
    <h2 class="headline">Three rules we’re <span class="hand">keeping.</span></h2>
    <p class="lead" style="margin-top:1.4vh">Pinned to the wall above every desk. We refer back to them when a decision feels too big to make from the seat we’re in.</p>
  </div>
  <div class="cards-3">
    <div class="card">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">Rule · 01</div><h3>Write the real sentence.</h3><p class="small">If the user would not repeat the claim, the slide is not the work.</p><div class="bottom-note note">- write it by hand first.</div></div>
    <div class="card yellow">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">Rule · 02</div><h3>Earn the second look.</h3><p class="small">Every interaction in the first cycle should do four times the work of a late correction.</p><div class="bottom-note note">no autoresponder, ever.</div></div>
    <div class="card warm">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">Rule · 03</div><h3>Keep the handwriting.</h3><p class="small">The system can scale while the voice stays small enough to know who wrote it.</p><div class="bottom-note note">200 names, max.</div></div>
  </div>
  ${pinboardFoot(n, total)}
</section>`,
    (n) => `
<section class="slide dark blue" data-layout="pin-section">
  ${pinboardChrome("SECTION II", "DIRECTION & DOCTRINE")}
  ${pinSvg("pin-mark pin-corner", "large")}
  <div style="margin:auto 0 10vh">
    <h2 class="section-title">Where we<br>are going,<br><span class="hand">and why.</span></h2>
    <div class="note" style="margin-top:5vh">- turn the page -</div>
  </div>
  ${pinboardFoot(n, total)}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-detail">
  ${pinboardChrome("←O FINDINGS · DETAIL", "CYBERBIN FIELD OFFICE   PHASE III")}
  <div class="detail-title">
    <div class="notice">Notice · ${pad(n)}<br>Action title</div>
    <h2 class="headline">The trust gap is built in the first 72 hours, <span class="hand">not</span> the first 7 days.</h2>
  </div>
  <div class="detail-cards">
    <div class="card"><h3>What we found</h3><p class="small"><strong>Three behavioural signals</strong> in the first 72 hours predict retention better than any feature metric we tracked.</p><ul class="small"><li>Email open #2 lifts retention.</li><li>Personal salutation changes replies.</li><li>Human reply within 24h is the lever.</li></ul><div class="bottom-note tiny">N = 14,200 · Q1 2026</div></div>
    <div class="card yellow"><h3>Why it matters</h3><p class="note">$4.1M projected retained ARR - current cohort.</p><p class="small">The first three days are the only window where customers are paying attention and willing to write back.</p><div class="bottom-note tiny">Modelled on FY24 cohort behaviour</div></div>
    <div class="card warm"><h3>What to do</h3><ul class="small"><li><strong>Rewrite emails 1-3</strong> in human voice.</li><li><strong>Route every signup</strong> to a named human.</li><li><strong>Instrument the 72-hour window</strong> as a first-class metric.</li></ul><div class="bottom-note tiny">Pilot scope: top-decile signups</div></div>
  </div>
  ${pinboardFoot(n, total)}
</section>`,
    (n) => `
<section class="slide dark blue" data-layout="pin-chart">
  ${pinboardChrome("←O RETENTION, BY COHORT", "PHASE III   EVIDENCE")}
  ${pinSvg("pin-mark pin-corner", "large")}
  <div class="chart-layout">
    <div>
      <h2 class="section-title" style="font-size:clamp(58px,6vw,116px)">Curve<br>bends at<br><span class="hand">day three.</span></h2>
      <p class="lead" style="margin-top:5vh;color:var(--paper)">Cohorts that received a written welcome and a human reply within 24 hours retain at roughly 2x the templated cohort.</p>
      <div class="legend">
        <div class="legend-row"><span class="legend-line dash"></span>Templated welcome</div>
        <div class="legend-row"><span class="legend-line thin"></span>Written welcome</div>
        <div class="legend-row"><span class="legend-line"></span>Written + human reply</div>
      </div>
    </div>
    <div class="chart-box">
      <svg viewBox="0 0 820 520" fill="none" aria-label="Retention curve mock chart">
        <path d="M55 45V470H780" stroke="var(--ink)" stroke-width="2"/>
        <path d="M55 45H780M55 170H780M55 295H780M55 420H780" stroke="var(--ink)" stroke-opacity=".18" stroke-dasharray="3 5"/>
        <path d="M60 62C180 135 255 260 350 320C455 386 570 435 760 462" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" stroke-dasharray="16 14"/>
        <path d="M60 62C180 104 260 150 360 214C470 284 600 340 760 362" stroke="#2e57d7" stroke-width="9" stroke-linecap="round"/>
        <path d="M60 62C215 96 340 145 465 197C570 241 638 280 760 306" stroke="var(--ink)" stroke-width="13" stroke-linecap="round"/>
        <circle cx="60" cy="62" r="9" fill="var(--ink)"/>
      </svg>
    </div>
  </div>
  ${pinboardFoot(n, total)}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-workflow">
  ${pinboardChrome("←O HOW WE'LL WORK", "CYBERBIN FIELD OFFICE   PHASE IV")}
  <div style="margin-top:4.5vh;display:grid;grid-template-columns:1fr 28vw;gap:5vw">
    <h2 class="headline">From <span class="hand">insight</span><br>to default,<br>in five moves.</h2>
    <p class="lead">A repeatable path each pilot follows, end to end, before it graduates to the default experience.</p>
  </div>
  <div class="cards-5">
    ${["Frame","Design","Pilot","Read","Default"].map((title, i) => `<div class="card ${i === 2 ? "warm" : i === 4 ? "" : "yellow"}">${pinSvg("pin-mark pin-card", "small")}<div class="step-no">${i + 1}</div><h3>${title}</h3><p class="small">${["Translate insight into one falsifiable sprint.","Smallest end-to-end change that tests cleanly.","Ship to a 50/50 holdout in one segment.","Kill, scale, or extend from metrics.","Retire the legacy path in the same release."][i]}</p>${i < 4 ? '<div class="arrow-link">→</div>' : ""}</div>`).join("")}
  </div>
  ${pinboardFoot(n, total)}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-table">
  ${pinboardChrome("←O THREE PILOTS, SIDE BY SIDE", "CYBERBIN FIELD OFFICE   PHASE IV")}
  <div style="margin-top:4vh;display:grid;grid-template-columns:1fr 28vw;gap:4vw">
    <h2 class="headline">Where each<br><span class="hand">pilot</span> earns<br>its keep.</h2>
    <p class="lead">Scored against the levers that matter most this cycle. We only carry forward bets that win on at least two.</p>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Lever</th><th>Rewrite welcome</th><th>Quiet upgrades</th><th>Inbox-as-search</th></tr></thead>
      <tbody>
        <tr><td>Time-to-impact</td><td><span class="pill fill">≤ 4 weeks</span></td><td><span class="pill">6-8 weeks</span></td><td><span class="pill fill">≤ 4 weeks</span></td></tr>
        <tr><td>Build cost</td><td><span class="pill fill">low</span></td><td><span class="pill">medium</span></td><td><span class="pill fill">low</span></td></tr>
        <tr><td>Retention lift</td><td><span class="pill fill">+19 pts D90</span></td><td><span class="pill">+7 pts D90</span></td><td><span class="pill">+5 pts D90</span></td></tr>
        <tr><td>Risk to power users</td><td><span class="pill fill">none</span></td><td><span class="pill red">Material</span></td><td><span class="pill">soft, reversible</span></td></tr>
      </tbody>
    </table>
  </div>
  ${pinboardFoot(n, total)}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-numbers">
  ${pinboardChrome("←O IN NUMBERS", "PHASE III   EVIDENCE")}
  <div style="margin-top:4vh;display:grid;grid-template-columns:1fr 26vw;gap:5vw">
    <h2 class="headline">The case,<br><span class="hand">by the numbers.</span></h2>
    <p class="lead">Three figures we will report against every cycle. If one of these stops moving, the bet is over.</p>
  </div>
  <div class="number-grid">
    <div class="number-card">${pinSvg("pin-mark pin-card", "small")}<div class="metric">2.4<span class="unit">x</span></div><h3>Retention<br>multiple</h3><p class="small">Written welcome plus human reply, sustained through D90.</p></div>
    <div class="number-card yellow">${pinSvg("pin-mark pin-card", "small")}<div class="metric">$4.1<span class="unit">M</span></div><h3>Projected<br>retained ARR</h3><p class="small">Modelled on the current quarter signup cohort.</p></div>
    <div class="number-card warm">${pinSvg("pin-mark pin-card", "small")}<div class="metric">72<span class="unit">hr</span></div><h3>The window<br>that matters</h3><p class="small">Behaviour after the first 72 hours predicts retention.</p></div>
  </div>
  ${pinboardFoot(n, total)}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-quote">
  ${pinboardChrome("←O CLIENT VOICE", "PHASE III   EVIDENCE")}
  <div class="quote-panel">
    ${pinSvg("pin-mark pin-card", "small")}
    <div class="quote-mark">”</div>
    <div>
      <div class="quote-text">Three days in, <span class="highlight">someone wrote me</span> a <span class="hand">real sentence.</span> I noticed I had never been a customer anywhere else again.</div>
      <div class="tiny" style="margin-top:4vh">MARGAUX LÉVÊQUE<br>CFO · MID-MARKET RETAILER · 14 MONTHS IN</div>
    </div>
  </div>
  ${pinboardFoot(n, total)}
</section>`,
    (n) => `
<section class="slide light" data-layout="pin-closing">
  ${pinboardChrome("←O WHAT'S NEXT", "CYBERBIN FIELD OFFICE   PHASE V")}
  <div class="final-grid">
    <div class="final-blue">
      <div class="kicker">From here</div>
      <h2 class="display-tight">Pick the<br>three<br><span class="hand">bets.</span></h2>
      <p class="lead">Three pilots in eight weeks. We bring back evidence the quarter after, and the question will not be whether to ship.</p>
      ${pinSvg("pin-mark pin-large", "large")}
    </div>
    <div class="final-white">
      <h3 style="font-size:clamp(24px,2vw,38px);font-weight:900">How we move this week</h3>
      ${["Pick the pilots","Pre-register the read","Stand a Friday review"].map((item, i) => `<div class="action-row"><div class="n">${i + 1}</div><div><h4 style="font-size:clamp(18px,1.28vw,26px);font-weight:900">${item}</h4><p class="small">${["Confirm two of three by Friday. Owners named in the same conversation.","Lock the metric, holdout, and kill criteria before code ships.","One slide each pilot, every Friday, until the best defaults or dies."][i]}</p></div></div>`).join("")}
    </div>
  </div>
  ${pinboardFoot(n, total)}
</section>`,
  ];

  const appendix = (n) => {
    const [label, , desc] = roleFor(n, total);
    const englishDesc = {
      Evidence: "Use a concrete proof point, metric, scene, or example to support the argument.",
      "Chapter 3": "Open the third module with a clear claim before adding detail.",
      Explain: "Expand the logic behind the current section in plain language.",
      Method: "Turn the argument into steps the audience can actually use.",
      "Before / After": "Show what changes once the method is applied.",
      Risks: "Name the boundary conditions, tradeoffs, and decision rules.",
      Takeaways: "Collect the points the audience should remember.",
      Closing: "End with a clear next move or question.",
      Appendix: "Add optional support material without changing the main storyline.",
    };
    const englishTitle = label;
    return `
<section class="slide light" data-layout="pin-detail">
  ${pinboardChrome(`←O ${label.toUpperCase()}`, "CYBERBIN FIELD OFFICE   APPENDIX")}
  <div style="margin-top:4vh">
    <h2 class="headline">${escapeHtml(englishTitle)} <span class="hand">kept clear.</span></h2>
    <p class="lead" style="margin-top:2vh">${escapeHtml(englishDesc[label] || desc)}</p>
  </div>
  <div class="cards-3">
    <div class="card">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">Point · 01</div><h3>One concrete claim.</h3><p class="small">Replace this with the strongest sentence for this page role.</p><div class="bottom-note note">make it sayable.</div></div>
    <div class="card yellow">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">Point · 02</div><h3>One proof shape.</h3><p class="small">Use a metric, scene, quote, or before/after contrast.</p><div class="bottom-note note">show the receipt.</div></div>
    <div class="card warm">${pinSvg("pin-mark pin-card", "small")}<div class="card-tag">Point · 03</div><h3>One next move.</h3><p class="small">End the slide with a decision the team can make.</p><div class="bottom-note note">ship the ask.</div></div>
  </div>
  ${pinboardFoot(n, total)}
</section>`;
  };

  return Array.from({ length: total }, (_, i) => {
    const n = i + 1;
    return (pages[i] || appendix)(n);
  }).join("\n");
}
