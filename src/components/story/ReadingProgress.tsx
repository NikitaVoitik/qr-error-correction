"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

// A thin bar at the very top of the window that fills up as you scroll
export default function ReadingProgress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setPercent(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <Progress
      value={Math.round(percent)}
      aria-label="Reading progress"
      className="fixed inset-x-0 top-0 z-50"
    />
  );
}
