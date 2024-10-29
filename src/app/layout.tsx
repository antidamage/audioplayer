import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poppy and Buddy",
  description: "Read along with Poppy and Buddy as they go on adventures!",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Theme accentColor="teal" radius="small" className="background">
          {children}
        </Theme>
      </body>
    </html>
  );
}
