"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  {
    id: "email",
    label: "email",
    value: "iitindoors2026@gmail.com",
    href: "mailto:iitindoors2026@gmail.com",
  },
  {
    id: "instagram",
    label: "instagram",
    value: "@iitindoors2026",
    href: "https://instagram.com/iitindoors2026",
  },
  {
    id: "twitter",
    label: "twitter / x",
    value: "@iitindoors",
    href: "https://twitter.com/iitindoors",
  },
  {
    id: "website",
    label: "website",
    value: "iitindoors.in",
    href: "https://iitindoors.in",
  },
];

const FAQ = [
  {
    q: "when is iit indoors 2026?",
    a: "the event is scheduled for early 2026. stay tuned on our socials for exact dates.",
  },
  {
    q: "how do i register?",
    a: "registration links will be published on our website and social media channels.",
  },
  {
    q: "who can participate?",
    a: "iit indoors is open to all iit students and invited guests. check the event page for eligibility.",
  },
  {
    q: "i have a sponsorship inquiry.",
    a: "reach out to us via email and we'll connect you with the sponsorship team.",
  },
];

export default function ContactSection() {
  const [entered, setEntered] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className={`w-full max-w-3xl flex flex-col items-center gap-8 md:gap-12 px-4 py-8 md:p-0 transition-all duration-700 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      aria-label="contact page"
    >
      {/* back link */}
      <div className="w-full">
        <Link
          href="/"
          className="text-base md:text-lg tracking-widest transition-opacity hover:opacity-60"
          style={{ color: "var(--mint-soft)" }}
        >
          ← back
        </Link>
      </div>

      {/* heading */}
      <div className="text-center space-y-2 md:space-y-3">
        <p
          className="tracking-widest text-lg md:text-xl lg:text-2xl"
          style={{
            color: "var(--mint-soft)",
            textShadow: "0 0 14px rgba(102, 245, 207, 0.55)",
            animation: "text-blink 2.8s steps(1, end) infinite",
          }}
        >
          get in touch
        </p>
        <h1
          className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-widest drop-shadow-lg"
          style={{ color: "var(--foreground)" }}
        >
          contact
        </h1>
      </div>

      {/* contact links */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {LINKS.map((link, i) => (
          <a
            key={link.id}
            href={link.href}
            target={link.id !== "email" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="group flex flex-col gap-1 p-4 md:p-5 rounded-lg border transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(22, 219, 171, 0.04)",
              borderColor: "rgba(22, 219, 171, 0.2)",
              animationDelay: `${i * 80}ms`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(102, 245, 207, 0.6)";
              (e.currentTarget as HTMLElement).style.background = "rgba(22, 219, 171, 0.08)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(22, 219, 171, 0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(22, 219, 171, 0.2)";
              (e.currentTarget as HTMLElement).style.background = "rgba(22, 219, 171, 0.04)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <span
              className="text-sm md:text-base tracking-widest uppercase"
              style={{ color: "var(--mint-soft)", opacity: 0.6 }}
            >
              {link.label}
            </span>
            <span
              className="text-lg md:text-xl lg:text-2xl font-bold tracking-wide transition-all group-hover:opacity-90"
              style={{ color: "var(--foreground)" }}
            >
              {link.value}
            </span>
          </a>
        ))}
      </div>

      {/* divider */}
      <div
        className="w-full h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(22,219,171,0.3), transparent)" }}
      />

      {/* faq */}
      <div className="w-full space-y-4 md:space-y-6">
        <p
          className="text-sm md:text-base tracking-widest uppercase"
          style={{ color: "var(--mint-soft)", opacity: 0.6 }}
        >
          frequently asked
        </p>

        {FAQ.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: "rgba(22, 219, 171, 0.15)" }}
          >
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-4 py-3 md:px-5 md:py-4 text-left tracking-wide transition-colors hover:opacity-80"
              style={{ color: "var(--foreground)" }}
              aria-expanded={openFaq === i}
            >
              <span className="text-base md:text-lg lg:text-xl">{item.q}</span>
              <span
                className="shrink-0 text-lg md:text-xl font-bold transition-transform duration-300"
                style={{
                  color: "var(--mint)",
                  display: "inline-block",
                  transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: openFaq === i ? "150px" : "0px", opacity: openFaq === i ? 1 : 0 }}
            >
              <p
                className="px-4 pb-4 md:px-5 md:pb-5 text-base md:text-lg leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.55 }}
              >
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* footer note */}
      <p
        className="text-sm md:text-base tracking-widest text-center pb-4"
        style={{ color: "var(--mint-soft)", opacity: 0.35 }}
      >
        iit indoors 2026 — we read every message
      </p>
    </section>
  );
}
