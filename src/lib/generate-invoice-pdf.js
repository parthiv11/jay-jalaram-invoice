import { spawn } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildInvoiceHtmlDocument } from "./invoice-html-document";
import { renderInvoicePreview } from "./invoice-preview";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

async function resolveChromeLaunchConfig() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    const chromium = await import("@sparticuz/chromium");

    return {
      executablePath: await chromium.default.executablePath(),
      args: chromium.default.args,
    };
  }

  for (const candidate of CHROME_CANDIDATES) {
    try {
      await access(candidate, constants.X_OK);
      return { executablePath: candidate, args: [] };
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    "Chrome/Chromium not found. Install google-chrome or set CHROME_PATH."
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDevtools(port, timeoutMs = 15_000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        return;
      }
    } catch {
      // Chrome is still starting
    }

    await delay(100);
  }

  throw new Error("Chrome DevTools did not become ready in time.");
}

function createCdpClient(webSocketUrl) {
  let nextId = 1;
  const pending = new Map();
  const events = new Map();

  const ws = new WebSocket(webSocketUrl);

  return new Promise((resolve, reject) => {
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));

      if (message.method) {
        const handlers = events.get(message.method) || [];
        handlers.forEach((handler) => handler(message.params));
      }

      if (message.id && pending.has(message.id)) {
        const { resolve: settle, reject: fail } = pending.get(message.id);
        pending.delete(message.id);

        if (message.error) {
          fail(new Error(message.error.message || "CDP command failed"));
          return;
        }

        settle(message.result);
      }
    });

    ws.addEventListener("open", () => {
      const send = (method, params = {}) =>
        new Promise((res, rej) => {
          const id = nextId++;
          pending.set(id, { resolve: res, reject: rej });
          ws.send(JSON.stringify({ id, method, params }));
        });

      const on = (method, handler) => {
        const handlers = events.get(method) || [];
        handlers.push(handler);
        events.set(method, handlers);
      };

      const close = () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };

      resolve({ send, on, close });
    });

    ws.addEventListener("error", () => {
      reject(new Error("Unable to connect to Chrome DevTools."));
    });
  });
}

async function printHtmlToPdf({ htmlPath, pdfPath }) {
  const { executablePath, args: platformArgs } = await resolveChromeLaunchConfig();
  const port = 9300 + Math.floor(Math.random() * 400);
  const fileUrl = `file://${htmlPath}`;

  const chromeProcess = spawn(
    executablePath,
    [
      ...platformArgs,
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      `--remote-debugging-port=${port}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  let client;

  try {
    await waitForDevtools(port);

    const targetResponse = await fetch(
      `http://127.0.0.1:${port}/json/new?${encodeURIComponent(fileUrl)}`,
      { method: "PUT" }
    );

    if (!targetResponse.ok) {
      throw new Error("Unable to open invoice page in Chrome.");
    }

    const target = await targetResponse.json();
    client = await createCdpClient(target.webSocketDebuggerUrl);

    await client.send("Page.enable");
    await client.send("Emulation.setEmulatedMedia", { media: "print" });

    const pageLoaded = new Promise((resolve) => {
      client.on("Page.loadEventFired", resolve);
    });

    await client.send("Page.navigate", { url: fileUrl });
    await Promise.race([pageLoaded, delay(3000)]);
    await delay(150);

    const result = await client.send("Page.printToPDF", {
      displayHeaderFooter: false,
      printBackground: true,
      preferCSSPageSize: true,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      scale: 1,
    });

    const pdfBuffer = Buffer.from(result.data, "base64");
    await writeFile(pdfPath, pdfBuffer);
    return pdfBuffer;
  } finally {
    client?.close();

    if (!chromeProcess.killed) {
      chromeProcess.kill("SIGTERM");
      await delay(100);
      if (!chromeProcess.killed) {
        chromeProcess.kill("SIGKILL");
      }
    }
  }
}

export async function generateInvoicePdf(invoiceData) {
  const { html } = renderInvoicePreview(invoiceData);
  const documentHtml = buildInvoiceHtmlDocument(html);
  const workDir = path.join(os.tmpdir(), "jay-jalaram-invoice");
  await mkdir(workDir, { recursive: true });

  const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const htmlPath = path.join(workDir, `invoice_${stamp}.html`);
  const pdfPath = path.join(workDir, `invoice_${stamp}.pdf`);

  try {
    await writeFile(htmlPath, documentHtml, "utf8");
    return await printHtmlToPdf({ htmlPath, pdfPath });
  } finally {
    await Promise.allSettled([rm(htmlPath, { force: true }), rm(pdfPath, { force: true })]);
  }
}