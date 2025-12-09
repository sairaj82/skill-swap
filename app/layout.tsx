import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UsersProvider } from "@/context/UsersContext";
import { MessagesProvider } from "@/context/MessagesContext";
import { ConnectionsProvider } from "@/context/ConnectionsContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Swap - Exchange Skills, Learn Together",
  description: "A community-driven platform for skill exchange without monetary transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white`}
      >
        <AuthProvider>
          <UsersProvider>
            <MessagesProvider>
              <ConnectionsProvider>
                {children}
              </ConnectionsProvider>
            </MessagesProvider>
          </UsersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
