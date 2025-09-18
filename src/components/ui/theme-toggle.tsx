"use client"

import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "./button"

export function ThemeToggle({ isOpen }: { isOpen: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const isDark = theme === "dark"
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  if (!mounted) {
    return null
  }

  if (isOpen) {

    return (
      <div
        onClick={toggleTheme}
        className="flex justify-start items-center gap-2 bg-muted/50 p-2 rounded-lg cursor-pointer">

        <Button

          variant={"outline"}
          size={"icon"}
          aria-label="Toggle theme"
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-200 dark:to-gray-800 opacity-50" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isDark ? "dark" : "light"}
              className="absolute inset-0 flex items-center justify-center"
            >
              {isDark ? (
                // Moon Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="!w-5 !h-5"
                >
                  <motion.path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    stroke="#fff"
                    fill="#00000000"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="moon-gradient" x1="12" y1="3" x2="16" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366F1" />
                      <stop offset="1" stopColor="#4338CA" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="!w-5 !h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M7.28451 10.3333C7.10026 10.8546 7 11.4156 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C11.4156 7 10.8546 7.10026 10.3333 7.28451" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                      <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M12 2V4" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                      <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M12 20V22" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                      <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M4 12L2 12" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                      <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M22 12L20 12" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                      <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M19.7778 4.22266L17.5558 6.25424" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                      <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M4.22217 4.22266L6.44418 6.25424" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                      <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M6.44434 17.5557L4.22211 19.7779" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                      <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M19.7778 19.7773L17.5558 17.5551" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                    </g>
                    <defs>
                      <linearGradient id="moon-gradient" x1="12" y1="3" x2="16" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6366F1" />
                        <stop offset="1" stopColor="#4338CA" />
                      </linearGradient>
                    </defs>
                  </svg>




                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className={`absolute w-0.5 h-0.5 rounded-full ${isDark ? 'bg-white' : 'bg-black/30'}`}
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </Button>
        Change Theme
      </div>
    )
  }

  return <Button
    onClick={toggleTheme}
    variant={"outline"}
    size={"icon"}
    aria-label="Toggle theme"
    className="relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-200 dark:to-gray-800 opacity-50" />

    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={isDark ? "dark" : "light"}
        className="absolute inset-0 flex items-center justify-center"
      >
        {isDark ? (
          // Moon Icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="!w-5 !h-5"
          >
            <motion.path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="#fff"
              fill="#00000000"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
            <defs>
              <linearGradient id="moon-gradient" x1="12" y1="3" x2="16" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#4338CA" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="!w-5 !h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M7.28451 10.3333C7.10026 10.8546 7 11.4156 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C11.4156 7 10.8546 7.10026 10.3333 7.28451" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M12 2V4" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M12 20V22" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M4 12L2 12" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M22 12L20 12" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M19.7778 4.22266L17.5558 6.25424" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M4.22217 4.22266L6.44418 6.25424" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M6.44434 17.5557L4.22211 19.7779" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }} d="M19.7778 19.7773L17.5558 17.5551" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></motion.path>
              </g>
              <defs>
                <linearGradient id="moon-gradient" x1="12" y1="3" x2="16" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" />
                  <stop offset="1" stopColor="#4338CA" />
                </linearGradient>
              </defs>
            </svg>




          </>
        )}
      </motion.div>
    </AnimatePresence>

    <div className="absolute inset-0 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className={`absolute w-0.5 h-0.5 rounded-full ${isDark ? 'bg-white' : 'bg-black/30'}`}
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  </Button>

}