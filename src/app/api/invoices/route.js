import { createInvoice, getNextInvoiceNumber, listInvoices, ValidationError } from "@/lib/invoices";

export const dynamic = "force-dynamic";

export async function GET() {
  const invoices = await listInvoices();

  return Response.json({
    invoices,
    nextInvoiceNumber: getNextInvoiceNumber(invoices),
  });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await createInvoice(payload);

    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof SyntaxError) {
      return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    console.error("Unable to create invoice", error);
    return Response.json({ error: "Unable to create invoice." }, { status: 500 });
  }
}
