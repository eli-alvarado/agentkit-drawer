#!/usr/bin/env node
// Headless checks for the post-Starter One-File upsell. Never fetches buy.stripe.com.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

async function loadChromium() {
  try {
    return (await import("playwright")).chromium;
  } catch (err) {
    const found = spawnSync(
      "bash",
      ["-lc", 'ls -d "$HOME"/.npm/_npx/*/node_modules/playwright/index.mjs 2>/dev/null | head -1'],
      { encoding: "utf8" }
    ).stdout.trim();
    if (!found) throw err;
    return (await import(pathToFileURL(found).href)).chromium;
  }
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "docs");
const BUY =
  "https://buy.stripe.com/fZu7sKdJ20oP7md93o7kc06?client_reference_id=drw-00_starter-dl&utm_source=agentkitdrawer&utm_medium=site&utm_campaign=starter&utm_content=starter-dl";
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

function fail(msg) {
  throw new Error(msg);
}

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let file = path.join(DOCS, urlPath === "/" ? "index.html" : urlPath);
    if (!file.startsWith(DOCS)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

function staticHtmlParses() {
  const files = walkHtml(DOCS);
  const py = `
import html.parser, pathlib, sys
class P(html.parser.HTMLParser):
    def error(self, message):
        raise RuntimeError(message)
root = pathlib.Path(sys.argv[1])
for p in sys.argv[2:]:
    t = pathlib.Path(p).read_text(encoding="utf-8")
    P().feed(t)
print("html.parser ok", len(sys.argv)-2)
`;
  const r = spawnSync("python3", ["-c", py, DOCS, ...files], { encoding: "utf8" });
  if (r.status !== 0) {
    fail(`html.parser: ${r.stderr || r.stdout}`);
    return;
  }
  console.log((r.stdout || "").trim());
}

async function clickStarterDownload(form) {
  await form.evaluate((f) => {
    const a = f.querySelector(".news-dl a.btn");
    if (a) a.addEventListener("click", (e) => e.preventDefault(), true);
  });
  await form.locator(".news-dl a.btn").click();
}

async function overflow(page, label) {
  const r = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    bw: document.body.scrollWidth,
  }));
  if (r.sw > r.cw + 1 || r.bw > r.cw + 1) {
    fail(`${label}: horizontal overflow scrollWidth=${r.sw} body=${r.bw} clientWidth=${r.cw}`);
  } else {
    console.log(`overflow ok ${label}: ${r.cw}px`);
  }
}

async function main() {
  staticHtmlParses();
  const { server, port } = await startServer();
  const origin = `http://127.0.0.1:${port}`;
  const chromium = await loadChromium();
  const browser = await chromium.launch({ channel: "chrome", args: ["--disable-gpu"] });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("popup", (p) => p.close().catch(() => {}));

  await page.route("https://buy.stripe.com/**", (route) => route.abort());
  await page.route("https://dl.agentkitdrawer.com/**", (route) => {
    const u = route.request().url();
    if (u.includes("/c")) {
      return route.fulfill({ status: 204, body: "" });
    }
    if (u.includes("/subscribe")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, sent: true }),
      });
    }
    // Cross-origin <a download> navigates; abort so the page JS success path stays visible.
    return route.abort();
  });
  await page.route("https://static.cloudflareinsights.com/**", (route) => route.abort());

  const beacons = [];
  await page.exposeFunction("akdCaptureBeacon", (url, body) => {
    beacons.push({ url, body });
  });
  await page.addInitScript(() => {
    const orig = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url, data) => {
      let body = "";
      if (typeof data === "string") body = data;
      else if (data && data.text) {
        /* Blob */
      }
      try {
        if (data instanceof Blob) {
          data.text().then((t) => window.akdCaptureBeacon(String(url), t));
        } else {
          window.akdCaptureBeacon(String(url), body);
        }
      } catch (e) {}
      return orig(url, data);
    };
  });

  // Download-click success path on the homepage hero form.
  await page.goto(origin + "/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("form.news-f .news-dl a.btn");
  const hero = page.locator("form.news-f").first();
  await clickStarterDownload(hero);
  await hero.locator(".news-up").waitFor();
  const heroBox = await hero.locator(".news-up").evaluate((el) => {
    const a = el.querySelector("a");
    return {
      html: el.outerHTML,
      href: a && a.getAttribute("href"),
      target: a && a.getAttribute("target"),
      rel: a && a.getAttribute("rel"),
      btn: a && a.classList.contains("btn"),
      text: el.textContent,
      stripeCount: el.querySelectorAll('a[href*="buy.stripe.com/"]').length,
    };
  });
  if (heroBox.href !== BUY) fail(`home hero: href ${heroBox.href}`);
  if (heroBox.target !== "_blank" || heroBox.rel !== "noopener noreferrer") fail("home hero: target/rel");
  if (!heroBox.btn) fail("home hero: not .btn");
  if (heroBox.stripeCount !== 1) fail("home hero: not one Stripe link");
  for (const bit of ["$9", "14-day refund", "Next.js + Supabase", "FastAPI", "Node", "Godot", "/plan", "/review", "/fix", "/test", "/ship", "self-review", "per-tool"]) {
    if (!heroBox.text.includes(bit)) fail(`home hero: copy missing ${bit}`);
  }
  console.log("home download path ok");

  // Email success path on a fresh page (no download click).
  await page.goto(origin + "/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("form.news-f .news-m");
  await page.evaluate(() => {
    document.querySelectorAll("form.news-f .news-m")[1].textContent =
      "Sent! Check your inbox for AGENTS.md (and spam, just in case).";
  });
  const freeForm = page.locator("#free form.news-f");
  await freeForm.locator(".news-up").waitFor();
  const freeHref = await freeForm.locator(".news-up a").getAttribute("href");
  if (freeHref !== BUY) fail(`home #free email success: href ${freeHref}`);
  const freeCount = await freeForm.locator(".news-up").count();
  if (freeCount !== 1) fail(`home #free: ${freeCount} upsells`);
  console.log("home email success path ok");

  // Guide with a kit ctabox must still upsell One-File (tagged), not the page kit.
  await page.goto(origin + "/cursor-rules-nextjs-supabase/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("form.news-f .news-dl a.btn");
  await clickStarterDownload(page.locator("form.news-f"));
  await page.locator("form.news-f .news-up").waitFor();
  const guide = await page.locator("form.news-f .news-up").evaluate((el) => ({
    href: el.querySelector("a") && el.querySelector("a").getAttribute("href"),
    text: el.textContent,
  }));
  if (guide.href !== BUY) fail(`guide: href ${guide.href}`);
  if (/Next step for this page/.test(guide.text)) fail("guide: still pointing at the page kit");
  console.log("guide kit page upsells One-File ok");

  // Buy-click beacon uses client_reference_id (p=drw-00, pg=starter-dl).
  beacons.length = 0;
  await page.locator("form.news-f .news-up a.btn").click({ modifiers: ["Alt"] });
  await page.waitForTimeout(200);
  const hit = beacons.find((b) => {
    try {
      const d = JSON.parse(b.body);
      return d.p === "drw-00" && d.pg === "starter-dl" && d.cr === "drw-00_starter-dl";
    } catch (e) {
      return false;
    }
  });
  if (!hit) fail(`beacon missing or wrong: ${JSON.stringify(beacons)}`);
  else console.log("buy-click beacon ok");

  for (const w of [320, 390, 1366]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto(origin + "/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("form.news-f .news-dl a.btn");
    await clickStarterDownload(page.locator("form.news-f").first());
    await page.locator("form.news-f").first().locator(".news-up").waitFor();
    await overflow(page, `home@${w}`);
    await page.goto(origin + "/cursor-rules-nextjs-supabase/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("form.news-f .news-dl a.btn");
    await clickStarterDownload(page.locator("form.news-f"));
    await page.locator("form.news-f .news-up").waitFor();
    await overflow(page, `guide@${w}`);
  }

  await browser.close();
  server.close();
  if (process.exitCode) process.exit(process.exitCode);
  console.log("all starter-upsell checks passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
