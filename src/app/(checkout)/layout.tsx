// import "@/app/global.css";
import Container from "@/components/Global/Container";
import Footer from "@/components/Global/Footer";
import Navbar from "@/components/Global/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../providers";
const inter = Inter({
  variable: "--font-inter",
  weight: ["100", "300", "200", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Overlanding outpost",
  description: "Buy sell explore",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} `}>
        <Providers>
          <Navbar />
          <Container className="flex min-h-[70vh] w-full items-center justify-center pt-24 pb-20 md:px-10 lg:pt-40">
            <div className="flex min-h-full w-full flex-col items-center justify-center gap-5">
              {children}
            </div>
            {/* Right Column: Promotional Section */}
          </Container>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
