import "./globals.css";

import ClientLayout from "@/client-layout";

export const metadata = {
  title: "WuWei Studio",
  description: "Creative Studio Website Template — Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
