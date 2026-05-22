"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navItems } from "@/lib/site";

const menuVariants = {
  closed: {
    y: "-100%",
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
    } as const,
  },
  open: {
    y: "0%",
    transition: {
      duration: 0.82,
      ease: [0.76, 0, 0.24, 1],
    } as const,
  },
};

const listVariants = {
  closed: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  closed: {
    y: -32,
    opacity: 0,
    filter: "blur(10px)",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    } as const,
  },
  open: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.64,
      ease: [0.16, 1, 0.3, 1],
    } as const,
  },
};

const buttonVariants = {
  closed: {
    y: 28,
    opacity: 0,
    filter: "blur(8px)",
    transition: {
      duration: 0.28,
      ease: [0.4, 0, 1, 1],
    } as const,
  },
  open: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.68,
      delay: 0.18,
      ease: [0.16, 1, 0.3, 1],
    } as const,
  },
};

const Header = () => {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      setIsOpen(false);
      previousPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-[80] h-18 bg-[#141414]">
        <div className="flex h-full items-center justify-between px-5">
          <div className="flex min-w-0 items-center">
            <Link
              href="/"
              aria-label="Home"
              className="group relative z-[90] mr-5 flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-[1.04]"
            >
              <div className="mx-auto rounded-2xl border border-white/10 bg-white p-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={44}
                  height={44}
                  priority
                  className="h-7.5 w-7.5 rounded-2xl object-cover animate-[logoHeader_2.2s_ease-in-out_infinite]"
                />
              </div>
            </Link>

            <nav className="-ml-4 hidden items-center gap-0 xl:flex">
              {navItems.map((item, index) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <React.Fragment key={item.label}>
                    {index === 1 || index === 4 || index === 6 ? (
                      <span className="mx-3 h-5 w-px bg-white/10" />
                    ) : null}

                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "group flex h-10 items-center gap-2 whitespace-nowrap rounded-xl px-2.5 text-[16px] font-medium tracking-[-0.01em] transition-colors duration-200",
                        isActive
                          ? "text-white"
                          : "text-[#a2a2a5] hover:text-white",
                      ].join(" ")}
                    >
                      <span>{item.label}</span>

                      {item.badge ? (
                        <span className="-ml-0.5 -mt-2 rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white/90">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="#"
              className="hidden h-11 items-center justify-center rounded-xl border border-white/10 px-4 text-[16px] font-semibold text-white transition-colors duration-200 hover:border-white/20 hover:bg-white/5 sm:flex"
            >
              Login
            </a>

            <a
              href="#"
              className="hidden h-11 items-center justify-center rounded-xl bg-white px-4 text-[16px] font-semibold text-[#141414] transition-colors duration-200 hover:bg-white/90 sm:flex"
            >
              Sign up
            </a>

            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((value) => !value)}
              className="relative z-[90] flex size-12 items-center justify-center rounded-2xl text-white outline-none transition-transform duration-300 hover:scale-105 active:scale-95 xl:hidden"
            >
              <span className="relative block h-8 w-8 overflow-visible">
                <motion.span
                  animate={
                    isOpen
                      ? {
                          y: 0,
                          rotate: 45,
                          width: 24,
                        }
                      : {
                          y: -7,
                          rotate: 0,
                          width: 22,
                        }
                  }
                  transition={{
                    duration: 0.36,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute left-1/2 top-1/2 h-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                />

                <motion.span
                  animate={
                    isOpen
                      ? {
                          opacity: 0,
                          scaleX: 0,
                        }
                      : {
                          opacity: 1,
                          scaleX: 1,
                        }
                  }
                  transition={{
                    duration: 0.28,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute left-1/2 top-1/2 h-0.5 w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                />

                <motion.span
                  animate={
                    isOpen
                      ? {
                          y: 0,
                          rotate: -45,
                          width: 24,
                        }
                      : {
                          y: 7,
                          rotate: 0,
                          width: 22,
                        }
                  }
                  transition={{
                    duration: 0.36,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute left-1/2 top-1/2 h-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[60] overflow-hidden bg-[#141414] xl:hidden"
          >
            <motion.div
              variants={listVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="relative flex min-h-svh flex-col bg-[#141414] px-5 pb-6 pt-[104px]"
            >
              <nav className="flex flex-1 flex-col">
                <motion.div
                  variants={listVariants}
                  className="flex flex-col gap-1"
                >
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                    return (
                      <motion.div key={item.label} variants={itemVariants}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={[
                            "group flex min-h-16 items-center justify-between rounded-2xl px-1 py-1 transition-all duration-300 ease-out",
                            isActive
                              ? "text-white"
                              : "text-[#9f9fa3] hover:text-white",
                          ].join(" ")}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span
                              className={[
                                "size-1.5 shrink-0 rounded-full transition-all duration-300",
                                isActive
                                  ? "bg-white opacity-100"
                                  : "bg-white/25 opacity-70 group-hover:bg-white/70",
                              ].join(" ")}
                            />

                            <span className="truncate text-[30px] font-semibold leading-none tracking-[-0.045em] sm:text-[36px]">
                              {item.label}
                            </span>
                          </span>

                          <span className="ml-4 flex shrink-0 items-center gap-2">
                            {item.badge ? (
                              <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold leading-none text-white/90">
                                {item.badge}
                              </span>
                            ) : null}

                            <span className="translate-x-0 text-[22px] leading-none text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                              →
                            </span>
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  className="mt-auto flex w-full flex-col gap-3 pt-8"
                >
                  <a
                    href="#"
                    className="flex h-[54px] w-full items-center justify-center rounded-2xl bg-white/[0.06] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-white/[0.1] active:scale-[0.98]"
                  >
                    Login
                  </a>

                  <a
                    href="#"
                    className="flex h-[54px] w-full items-center justify-center rounded-2xl bg-white text-[15px] font-semibold text-[#141414] transition-all duration-300 hover:bg-white/90 active:scale-[0.98]"
                  >
                    Sign up
                  </a>
                </motion.div>
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Header;
