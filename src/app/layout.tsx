import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Auth from "../components/auth/Auth";
import NavBar from "../components/NavBar";
import { isAuthenticated } from "../utils/amplify-utils";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Project Manager",
  description: "Manage projects and tasks with ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar isSignedIn={await isAuthenticated()} />
        <Auth>{children}</Auth>
      </body>
    </html>
  );
}
