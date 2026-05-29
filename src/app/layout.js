import "./globals.css";

export const metadata = {
  title: "Jay Jalaram Sales",
  description: "Fullstack invoice generator built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
