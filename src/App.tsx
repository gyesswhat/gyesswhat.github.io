import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AsciiRabbit from "./components/AsciiRabbit";
import MainScreen from "./components/MainScreen";
import AboutTab from "./components/tabs/AboutTab";
import ContactTab from "./components/tabs/ContactTab";
import ExperienceTab from "./components/tabs/ExperienceTab";
import ProjectsTab from "./components/tabs/ProjectsTab";
import TabNav, { TABS } from "./components/TabNav";

const LAST_INDEX = TABS.length - 1;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};

export default function App() {
  const [tab, setTab] = useState(0);
  const direction = useRef(1);

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(LAST_INDEX, next));
    setTab((current) => {
      direction.current = clamped === current ? direction.current : clamped > current ? 1 : -1;
      return clamped;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(tab + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(tab - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tab, goTo]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[var(--bg)]">
      <AsciiRabbit stopped={tab === LAST_INDEX} />

      <AnimatePresence initial={false} custom={direction.current}>
        <motion.div
          key={tab}
          custom={direction.current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0"
        >
          {tab === 0 ? (
            <MainScreen onFollow={() => goTo(1)} />
          ) : tab === 1 ? (
            <AboutTab />
          ) : tab === 2 ? (
            <ExperienceTab />
          ) : tab === 3 ? (
            <ProjectsTab />
          ) : (
            <ContactTab />
          )}
        </motion.div>
      </AnimatePresence>

      <TabNav current={tab} onSelect={goTo} />
    </div>
  );
}
