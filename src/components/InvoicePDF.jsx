"use client";

import { useEffect } from "react";
import { downloadInvoicePdf } from "@/lib/download-invoice-pdf";

export default function InvoicePDF() {
  useEffect(() => {
    window.downloadPDF = downloadInvoicePdf;
  }, []);

  return null;
}