import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "../providers";
import Image from "next/image";
import logo from '@/assets/logo.jpg'
const inter = Inter({
  variable: "--font-inter",
  weight: ['100', '300', '200', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: "Overlanding outpost",
  description: "Buy sell explore",
};
import img from '@/assets/auth.png'
import Container from "@/components/Global/Container";
import Title from "@/components/Global/Title";
import Subtitle from "@/components/Global/Subtitle";
import Link from "next/link";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} `}>
        <Providers>
          <Container className="w-full grid lg:grid-cols-2 gap-20 min-h-screen md:p-10">

            <div className="flex justify-center items-center flex-col gap-5">
              <Link href="/" className='flex gap-2 justify-center items-center'>
                <div className="flex-shrink-0 transition-transform">
                  <Image
                    src={logo}
                    placeholder='blur'
                    alt="Company Logo"
                    width={200}
                    height={200}
                    className="rounded-lg size-16"
                    priority
                  />
                </div>
                <h1 className='font-bold text-xl xl:text-2xl '>Kahf Collective</h1>
              </Link>
              {children}
            </div>
            {/* Right Column: Promotional Section */}
            <div className="relative min-h-full rounded-4xl overflow-hidden hidden lg:block">
              <div className="relative z-10 text-center px-5  xl:px-20 pt-20">
                <Title>Qualified Islamic Scholars Ready to Guide You</Title>
                <Subtitle className="text-accent max-w-[400px] mx-auto pt-4">Learn authentic Islam from qualified scholars—beginner to advanced.</Subtitle>
              </div>
              <Image
                src={img}
                alt="Tablet displaying an online course"
                fill
                className="object-cover h-full"

              />
            </div>
          </Container>
        </Providers>
      </body>
    </html>
  );
}