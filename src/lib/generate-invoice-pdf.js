import puppeteer from "puppeteer-core";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { buildInvoiceHtmlDocument } from "./invoice-html-document";
import { renderInvoicePreview } from "./invoice-preview";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const CHROMIUM_PACK_URL =
  process.env.CHROMIUM_REMOTE_EXEC_PATH ||
  "https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar";

const IS_SERVERLESS = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION
);

async function resolveLocalChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    "Chrome/Chromium not found. Install google-chrome or set CHROME_PATH."
  );
}

async function launchBrowser() {
  if (IS_SERVERLESS) {
    const chromium = await import("@sparticuz/chromium-min");

    chromium.default.setGraphicsMode = false;

    return puppeteer.launch({
      args: await puppeteer.defaultArgs({
        args: chromium.default.args,
        headless: "shell",
      }),
      defaultViewport: {
        width: 794,
        height: 1123,
        deviceScaleFactor: 1,
      },
      executablePath: await chromium.default.executablePath(CHROMIUM_PACK_URL),
      headless: "shell",
    });
  }

  return puppeteer.launch({
    executablePath: await resolveLocalChrome(),
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });
}

export async function generateInvoicePdf(invoiceData) {
  const { html } = renderInvoicePreview(invoiceData);
  const documentHtml = buildInvoiceHtmlDocument(html);
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setContent(documentHtml, { waitUntil: "domcontentloaded" });
    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}