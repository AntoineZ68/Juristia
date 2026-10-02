"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = "a, button, img, input, [data-cursor]";

/** Point framboise qui suit la souris ; grossit et passe en `exclusion` sur les éléments interactifs. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      setHover(Boolean(el) && !(el instanceof HTMLInputElement));
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] rounded-full"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: hover ? "exclusion" : "normal",
      }}
      animate={{
        width: hover ? 64 : 10,
        height: hover ? 64 : 10,
        backgroundColor: hover ? "#FAF7F2" : "#832232",
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    />
  );
}
