"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "span" | "li" | "h2" | "h3";
};

/** Révélation standard : translateY 20px → 0, opacité 0 → 1. */
export default function Reveal({ children, delay = 0, className = "", as = "div" }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
