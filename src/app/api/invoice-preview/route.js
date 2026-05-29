import { renderInvoicePreview } from "@/lib/invoice-preview";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = renderInvoicePreview(payload);

    return Response.json(result);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    console.error("Unable to render invoice preview", error);
    return Response.json({ error: "Unable to render invoice preview." }, { status: 500 });
  }
}
