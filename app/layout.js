import "./globals.css";

export const metadata = {
  title: "theatre Library",
  description: "browse and read all classical theatre pieces",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body >{children}</body>
    </html>
  );
}
