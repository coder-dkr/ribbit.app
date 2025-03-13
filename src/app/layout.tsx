import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/contexts/AuthContext";
import PostContextProvider from "@/contexts/PostContext";
import CameraProvider from "@/contexts/CameraContext";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar/Navbar";
import PostModal from "@/components/Post/PostModal/PostModal";
import QueryProvider from "@/lib/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ribbit",
  description:
    "Ribbit is a Social Media web application where People can make posts , follow communities and Chat in Realtime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
        <AuthProvider>
          <CameraProvider>
            <PostContextProvider>
              <Header />
              <PostModal />
              <div className="w-full flex items-start">
                <aside className="fixed left-0 w-64 border-r border-r-gray-800 px-5 py-8">
                  <Navbar />
                </aside>
                <main className="md:ml-64 flex-1 px-5 py-3">{children}</main>
              </div>
            </PostContextProvider>
          </CameraProvider>
        </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
