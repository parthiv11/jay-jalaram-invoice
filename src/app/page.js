import Link from "next/link";
import { listInvoices } from "@/lib/invoices";

export const dynamic = "force-dynamic";

const formatCurrency = (value) => Number(value || 0).toFixed(2);

export default async function HomePage() {
  const invoices = await listInvoices();
  const today = new Date().toISOString().split("T")[0];
  const todayInvoices = invoices.filter((invoice) => invoice.date === today);
  const todayRevenue = todayInvoices.reduce(
    (total, invoice) => total + Number(invoice.grandTotal || 0),
    0,
  );
  const activeCustomers = new Set(invoices.map((invoice) => invoice.customerName)).size;
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="app-shell">
      <header className="page-header">
        <div>
          <h1>Jay Jalaram Sales</h1>
          <p className="subtitle">Retail billing and customer history in one place</p>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="card quick-actions" aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading">Quick actions</h2>
          <div className="button-row">
            <Link className="button" href="/invoice-builder">
              Create Invoice
            </Link>
            <button className="button secondary" disabled type="button">
              Manage Stock
            </button>
          </div>
        </section>

        <section className="card metrics" aria-labelledby="today-summary-heading">
          <h2 id="today-summary-heading">Today summary</h2>
          <ul>
            <li>
              <strong>Invoices generated:</strong> <span>{todayInvoices.length}</span>
            </li>
            <li>
              <strong>Revenue:</strong> ₹<span>{formatCurrency(todayRevenue)}</span>
            </li>
            <li>
              <strong>Active customers:</strong> <span>{activeCustomers}</span>
            </li>
          </ul>
        </section>

        <section className="card recent-customers" aria-labelledby="recent-customers-heading">
          <div className="section-header">
            <h2 id="recent-customers-heading">Recent customers</h2>
            <Link className="text-link" href="/invoice-builder">
              Open invoices
            </Link>
          </div>
          <ul className="recent-list">
            {recentInvoices.length === 0 ? (
              <li>No invoices yet</li>
            ) : (
              recentInvoices.map((invoice) => (
                <li key={invoice.invoiceNumber}>
                  <span>{invoice.customerName}</span>
                  <small>
                    {invoice.invoiceNumber} · ₹{formatCurrency(invoice.grandTotal)}
                  </small>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
