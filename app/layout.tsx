import "./globals.css";

export const metadata = {
  title: "Freeform Board",
  description: "Thinking-first interactive board",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
