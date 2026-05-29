"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { defaultProducts } from "@/lib/invoices";

const parseNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const formatCurrency = (value) => Number(value || 0).toFixed(2);

const createLineItem = () => ({
  id: crypto.randomUUID(),
  product: defaultProducts[0],
  quantity: 1,
  rate: 0,
  gstPercent: 18,
  discount: 0,
});

export default function InvoiceBuilderPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("Loading...");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [customerName, setCustomerName] = useState("");
  const [lineItems, setLineItems] = useState([createLineItem()]);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce(
      (total, item) => total + parseNumber(item.quantity) * parseNumber(item.rate),
      0,
    );
    const gstTotal = lineItems.reduce((total, item) => {
      const baseAmount = parseNumber(item.quantity) * parseNumber(item.rate);
      return total + (baseAmount * parseNumber(item.gstPercent)) / 100;
    }, 0);
    const lineDiscountTotal = lineItems.reduce(
      (total, item) => total + parseNumber(item.discount),
      0,
    );
    const totalDiscount = lineDiscountTotal + parseNumber(additionalDiscount);
    const grandTotal = Math.max(subtotal + gstTotal - totalDiscount, 0);
    const balanceDue = Math.max(grandTotal - parseNumber(amountPaid), 0);

    return {
      subtotal,
      gstTotal,
      totalDiscount,
      grandTotal,
      balanceDue,
    };
  }, [additionalDiscount, amountPaid, lineItems]);

  const customerOptions = useMemo(
    () =>
      [...new Set(invoices.map((invoice) => invoice.customerName))]
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right)),
    [invoices],
  );

  const historyInvoices = useMemo(() => {
    if (!selectedCustomer) {
      return [];
    }

    return invoices.filter((invoice) => invoice.customerName === selectedCustomer);
  }, [invoices, selectedCustomer]);

  const loadInvoices = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/invoices", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load invoices.");
      }

      setInvoices(data.invoices || []);
      setInvoiceNumber(data.nextInvoiceNumber || "INV-1000");
      setStatus((currentStatus) =>
        currentStatus.type === "success" ? currentStatus : { type: "", message: "" },
      );
    } catch (error) {
      setStatus({ type: "error", message: error.message });
      setInvoiceNumber("Unavailable");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const updateLineItem = (lineItemId, fieldName, value) => {
    setLineItems((currentLineItems) =>
      currentLineItems.map((lineItem) =>
        lineItem.id === lineItemId ? { ...lineItem, [fieldName]: value } : lineItem,
      ),
    );
  };

  const removeLineItem = (lineItemId) => {
    setLineItems((currentLineItems) => {
      if (currentLineItems.length === 1) {
        return currentLineItems;
      }

      return currentLineItems.filter((lineItem) => lineItem.id !== lineItemId);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!customerName.trim()) {
      setStatus({ type: "error", message: "Customer name is required." });
      return;
    }

    setIsSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: invoiceDate,
          customerName: customerName.trim(),
          lineItems,
          additionalDiscount,
          amountPaid,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create invoice.");
      }

      setInvoices((currentInvoices) => [data.invoice, ...currentInvoices]);
      setInvoiceNumber(data.nextInvoiceNumber);
      setSelectedCustomer(data.invoice.customerName);
      setCustomerName("");
      setLineItems([createLineItem()]);
      setAdditionalDiscount(0);
      setAmountPaid(0);
      setInvoiceDate(new Date().toISOString().split("T")[0]);
      setStatus({
        type: "success",
        message: `Invoice ${data.invoice.invoiceNumber} saved successfully.`,
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="page-header">
        <div>
          <h1>Create Invoice</h1>
          <p className="subtitle">Add products, calculate totals, and save with the API</p>
        </div>
        <Link className="text-link" href="/">
          ← Back to dashboard
        </Link>
      </header>

      <main>
        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label>
              Invoice No.
              <input readOnly type="text" value={invoiceNumber} />
            </label>
            <label>
              Date
              <input
                onChange={(event) => setInvoiceDate(event.target.value)}
                required
                type="date"
                value={invoiceDate}
              />
            </label>
            <label>
              Customer Name
              <input
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Enter customer name"
                required
                type="text"
                value={customerName}
              />
            </label>
          </div>

          <section aria-labelledby="line-items-heading" className="line-items-section">
            <div className="section-header">
              <h2 id="line-items-heading">Line items</h2>
              <button
                className="button secondary"
                onClick={() => setLineItems((currentLineItems) => [...currentLineItems, createLineItem()])}
                type="button"
              >
                + Add item
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Rate (₹)</th>
                    <th>GST %</th>
                    <th>Discount (₹)</th>
                    <th>Line Total (₹)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((lineItem) => {
                    const baseAmount =
                      parseNumber(lineItem.quantity) * parseNumber(lineItem.rate);
                    const gstAmount =
                      (baseAmount * parseNumber(lineItem.gstPercent)) / 100;
                    const lineTotal = Math.max(
                      baseAmount + gstAmount - parseNumber(lineItem.discount),
                      0,
                    );

                    return (
                      <tr key={lineItem.id}>
                        <td>
                          <select
                            className="line-product"
                            onChange={(event) =>
                              updateLineItem(lineItem.id, "product", event.target.value)
                            }
                            value={lineItem.product}
                          >
                            {defaultProducts.map((product) => (
                              <option key={product} value={product}>
                                {product}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            className="line-qty"
                            min="1"
                            onChange={(event) =>
                              updateLineItem(lineItem.id, "quantity", event.target.value)
                            }
                            required
                            type="number"
                            value={lineItem.quantity}
                          />
                        </td>
                        <td>
                          <input
                            className="line-rate"
                            min="0"
                            onChange={(event) =>
                              updateLineItem(lineItem.id, "rate", event.target.value)
                            }
                            required
                            type="number"
                            value={lineItem.rate}
                          />
                        </td>
                        <td>
                          <input
                            className="line-gst"
                            min="0"
                            onChange={(event) =>
                              updateLineItem(lineItem.id, "gstPercent", event.target.value)
                            }
                            required
                            type="number"
                            value={lineItem.gstPercent}
                          />
                        </td>
                        <td>
                          <input
                            className="line-discount"
                            min="0"
                            onChange={(event) =>
                              updateLineItem(lineItem.id, "discount", event.target.value)
                            }
                            type="number"
                            value={lineItem.discount}
                          />
                        </td>
                        <td className="line-total">{formatCurrency(lineTotal)}</td>
                        <td>
                          <button
                            className="button danger"
                            onClick={() => removeLineItem(lineItem.id)}
                            type="button"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="summary-grid">
            <label>
              Additional Discount (₹)
              <input
                min="0"
                onChange={(event) => setAdditionalDiscount(event.target.value)}
                type="number"
                value={additionalDiscount}
              />
            </label>
            <label>
              Amount Paid (₹)
              <input
                min="0"
                onChange={(event) => setAmountPaid(event.target.value)}
                type="number"
                value={amountPaid}
              />
            </label>
          </div>

          <section aria-labelledby="totals-heading" className="card totals-card">
            <h2 id="totals-heading">Totals</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>₹{formatCurrency(totals.subtotal)}</dd>
              </div>
              <div>
                <dt>Total GST</dt>
                <dd>₹{formatCurrency(totals.gstTotal)}</dd>
              </div>
              <div>
                <dt>Total Discount</dt>
                <dd>₹{formatCurrency(totals.totalDiscount)}</dd>
              </div>
              <div className="highlight">
                <dt>Grand Total</dt>
                <dd>₹{formatCurrency(totals.grandTotal)}</dd>
              </div>
              <div>
                <dt>Balance Due</dt>
                <dd>₹{formatCurrency(totals.balanceDue)}</dd>
              </div>
            </dl>
          </section>

          {status.message ? (
            <p className={`status-message ${status.type}`}>{status.message}</p>
          ) : null}

          <div className="form-actions">
            <button className="button" disabled={isSaving || isLoading} type="submit">
              {isSaving ? "Saving..." : "Save Invoice"}
            </button>
            <button
              className="button secondary"
              onClick={() => window.print()}
              type="button"
            >
              Print Invoice
            </button>
          </div>
        </form>

        <section aria-labelledby="history-heading" className="card history-card">
          <div className="section-header">
            <h2 id="history-heading">Customer invoice history</h2>
            <button className="button secondary" onClick={loadInvoices} type="button">
              Refresh
            </button>
          </div>
          <div className="history-controls">
            <label>
              Select Customer
              <select
                onChange={(event) => setSelectedCustomer(event.target.value)}
                value={selectedCustomer}
              >
                <option value="">Choose customer</option>
                {customerOptions.map((customer) => (
                  <option key={customer} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <ul className="history-list">
            {!selectedCustomer ? (
              <li>Select a customer to view invoice history.</li>
            ) : historyInvoices.length === 0 ? (
              <li>No invoices found for this customer.</li>
            ) : (
              historyInvoices.map((invoice) => (
                <li key={invoice.invoiceNumber}>
                  <span>
                    {invoice.invoiceNumber} · {invoice.date}
                  </span>
                  <strong>₹{formatCurrency(invoice.grandTotal)}</strong>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
