import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIRECTORY, "invoices.json");
const FIRST_INVOICE_NUMBER = 1000;

export const defaultProducts = [
  "Dining Table",
  "Office Chair",
  "Sofa Set",
  "Bed Frame",
  "Cupboard",
];

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

const parseAmount = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const formatDate = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return new Date().toISOString().split("T")[0];
};

const calculateLineItem = (lineItem) => {
  const product = String(lineItem?.product || "").trim();
  const quantity = parseAmount(lineItem?.quantity);
  const rate = parseAmount(lineItem?.rate);
  const gstPercent = parseAmount(lineItem?.gstPercent);
  const discount = parseAmount(lineItem?.discount);

  if (!product) {
    throw new ValidationError("Each line item must include a product name.");
  }

  if (quantity <= 0) {
    throw new ValidationError("Each line item must have a quantity greater than zero.");
  }

  const baseAmount = quantity * rate;
  const gstAmount = (baseAmount * gstPercent) / 100;
  const lineTotal = Math.max(baseAmount + gstAmount - discount, 0);

  return {
    product,
    quantity,
    rate,
    gstPercent,
    discount,
    lineTotal,
  };
};

const calculateInvoiceSummary = (lineItems, additionalDiscount, amountPaid) => {
  const subtotal = lineItems.reduce(
    (total, item) => total + item.quantity * item.rate,
    0,
  );
  const gstTotal = lineItems.reduce(
    (total, item) => total + (item.quantity * item.rate * item.gstPercent) / 100,
    0,
  );
  const lineDiscountTotal = lineItems.reduce(
    (total, item) => total + item.discount,
    0,
  );
  const totalDiscount = lineDiscountTotal + additionalDiscount;
  const grandTotal = Math.max(subtotal + gstTotal - totalDiscount, 0);
  const balanceDue = Math.max(grandTotal - amountPaid, 0);

  return {
    subtotal,
    gstTotal,
    totalDiscount,
    grandTotal,
    balanceDue,
  };
};

const readInvoicesFile = async () => {
  await mkdir(DATA_DIRECTORY, { recursive: true });

  try {
    const fileContents = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(fileContents);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(DATA_FILE, "[]\n", "utf8");
      return [];
    }

    throw error;
  }
};

const writeInvoicesFile = async (invoices) => {
  await mkdir(DATA_DIRECTORY, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(invoices, null, 2)}\n`, "utf8");
};

export const getNextInvoiceNumber = (invoices) => {
  const highestInvoiceNumber = invoices.reduce((highest, invoice) => {
    const match = /^INV-(\d+)$/.exec(invoice.invoiceNumber || "");

    if (!match) {
      return highest;
    }

    return Math.max(highest, Number.parseInt(match[1], 10));
  }, FIRST_INVOICE_NUMBER - 1);

  return `INV-${highestInvoiceNumber + 1}`;
};

export const listInvoices = async () => {
  const invoices = await readInvoicesFile();

  return invoices.sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
  );
};

export const createInvoice = async (payload) => {
  const customerName = String(payload?.customerName || "").trim();
  const rawLineItems = Array.isArray(payload?.lineItems) ? payload.lineItems : [];
  const additionalDiscount = parseAmount(payload?.additionalDiscount);
  const amountPaid = parseAmount(payload?.amountPaid);

  if (!customerName) {
    throw new ValidationError("Customer name is required.");
  }

  if (rawLineItems.length === 0) {
    throw new ValidationError("At least one line item is required.");
  }

  const lineItems = rawLineItems.map(calculateLineItem);
  const invoices = await readInvoicesFile();
  const invoiceNumber = getNextInvoiceNumber(invoices);
  const summary = calculateInvoiceSummary(lineItems, additionalDiscount, amountPaid);

  const invoice = {
    invoiceNumber,
    date: formatDate(payload?.date),
    customerName,
    lineItems,
    additionalDiscount,
    amountPaid,
    ...summary,
    createdAt: new Date().toISOString(),
  };

  const nextInvoices = [invoice, ...invoices];
  await writeInvoicesFile(nextInvoices);

  return {
    invoice,
    nextInvoiceNumber: getNextInvoiceNumber(nextInvoices),
  };
};
