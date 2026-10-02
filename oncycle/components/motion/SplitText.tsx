"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type Segment = string | { text: string; className?: string };

type Props = {
  /** Lignes du titre ; une ligne peut mélanger texte simple et segments stylés (italique…). */
  lines: Segment[][];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Si fourni, l'animation se joue à ce signal plutôt qu'à l'entrée dans le viewport. */
  play?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
};

/** Chaque mot sort d'un masque et monte l'un après l'autre. */
export default function SplitText({ lines, className = "", lineClassName = "", delay = 0, stagger = 0.06, play, as = "h2" }: Props) {
  const Tag = motion[as];
  let index = 0;
  const label = lines.map((l) => l.map((s) => (typeof s === "string" ? s : s.text)).join("")).join(" ");

  const controlled = play !== undefined;
  return (
    <Tag
      className={className}
      aria-label={label}
      initial="hidden"
      {...(controlled ? { animate: play ? "show" : "hidden" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden className={`block ${lineClassName}`}>
          {line.map((seg, si) => {
            const text = typeof seg === "string" ? seg : seg.text;
            const cls = typeof seg === "string" ? "" : seg.className ?? "";
            return (
              <Fragment key={si}>
                {text.split(/(\s+)/).map((word, wi) => {
                  if (!word) return null;
                  if (/^\s+$/.test(word)) return " ";
                  const i = index++;
                  return (
                    <span key={wi} className="inline-block overflow-hidden pb-[0.12em] align-top -mb-[0.12em]">
                      <motion.span
                        className={`inline-block will-change-transform ${cls}`}
                        variants={{
                          hidden: { y: "110%", opacity: 0 },
                          show: { y: "0%", opacity: 1, transition: { duration: 1.1, delay: delay + i * stagger, ease: EASE } },
                        }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
