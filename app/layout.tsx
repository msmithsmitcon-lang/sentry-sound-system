import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "../src/app/globals.css";

export const metadata: Metadata = {
  title: "Sentry Sound",
  description: "Enterprise Music Rights & Royalty Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
