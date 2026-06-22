import { buildInvoicePdfFilename } from "@/lib/invoice-html-document";
import { generateInvoicePdf } from "@/lib/generate-invoice-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  try {
    const payload = await request.json();
    const pdfBuffer = await generateInvoicePdf(payload);
    const filename = buildInvoicePdfFilename(payload);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    console.error("Unable to generate invoice PDF", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to generate invoice PDF.";

    return Response.json({ error: message }, { status: 500 });
  }
}