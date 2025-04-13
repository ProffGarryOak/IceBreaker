import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ice Breaker",
  description:
    "The ultimate platform for content tracking and social discovery",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`bg-gray-900 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
          <Header />

          <Toaster position="top-center" reverseOrder={false} />
          <main>{children}</main>
          <Footer />
       
      </body>
    </html>
    </ClerkProvider>
  );
}
