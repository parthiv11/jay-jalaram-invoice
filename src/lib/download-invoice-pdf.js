function collectInvoicePayload() {
  if (typeof window.getInvoicePayload === "function") {
    return window.getInvoicePayload();
  }

  const g = (id) => document.getElementById(id)?.value ?? "";

  return {
    seller: {
      name: g("sName"),
      address: g("sAddr"),
      phone: g("sPhone"),
      gstin: g("sGstin"),
      stateCode: g("sSC"),
      pan: g("sPan"),
    },
    inv: {
      number: g("iNum"),
      date: g("iDate"),
      state: g("iState"),
      rc: g("iRC"),
      vehicle: g("iVeh"),
    },
    buyer: {
      name: g("bName"),
      address: g("bAddr"),
      gstin: g("bGstin"),
      stateCode: g("bSC"),
      state: g("bState"),
    },
    bank: {
      accName: g("bkAccName"),
      accNo: g("bkAccNo"),
      ifsc: g("bkIfsc"),
      swift: g("bkSwift"),
      bank: g("bkBank"),
      branch: g("bkBranch"),
    },
    terms: g("terms")
      .split("\n")
      .map((term) => term.trim())
      .filter(Boolean),
    paid: parseFloat(g("amtPaid")) || 0,
    items: [],
  };
}

function parseFilenameFromDisposition(header) {
  if (!header) return null;

  const match = header.match(/filename="([^"]+)"/i);
  return match?.[1] ?? null;
}

export async function downloadInvoicePdf() {
  const buttons = [
    ...document.querySelectorAll(".mobile-bar-save, .btn-pdf"),
  ];
  const originalLabels = buttons.map((button) => button.textContent);

  try {
    buttons.forEach((button) => {
      button.disabled = true;
      button.textContent = "Generating…";
    });

    const payload = collectInvoicePayload();
    const response = await fetch("/api/invoice-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || "PDF generation failed.");
    }

    const blob = await response.blob();
    const filename =
      parseFilenameFromDisposition(response.headers.get("Content-Disposition")) ||
      "Tax_Invoice.pdf";

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert(error instanceof Error ? error.message : "Unable to download PDF.");
  } finally {
    buttons.forEach((button, index) => {
      button.disabled = false;
      button.textContent = originalLabels[index] || "Save PDF";
    });
  }
}