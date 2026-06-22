import "./globals.css";

export const metadata = {
  title: "Jay Jalaram Sales",
  description: "Fullstack invoice generator built with Next.js",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
