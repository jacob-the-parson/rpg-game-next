'use client';

import { ReactNode } from 'react';
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function GameLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className={`game-layout ${geistSans.variable}`}>
      {children}
    </section>
  );
} 