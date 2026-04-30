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

const CONTACTS = [
  {
    name: "Md. Shamsul Arefin",
    email: "bsse1732@iit.du.ac.bd",
    phone: "01568169498",
    facebook: "https://www.facebook.com/arefin.adeeb",
  },
  {
    name: "Abdul Zoher Imon",
    email: "bsse1743@iit.du.ac.bd",
    phone: "01707984667",
    facebook: "https://www.facebook.com/abdul.zoher.imon",
  },
  {
    name: "Al Araf Apon",
    email: "bsse1742@iit.du.ac.bd",
    phone: "01603464470",
    facebook: "https://www.facebook.com/al.araf.apon.2025",
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
      className={`w-full max-w-3xl flex flex-col items-center gap-4 md:gap-12 px-4 py-8 md:p-0 transition-all duration-700 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      aria-label="contact page"
    >


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
      {/* <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
      </div> */}

      <div className="w-full space-y-3 md:space-y-4">
        <h2 className="text-center text-lg md:text-xl tracking-[0.35em] uppercase" style={{ color: "var(--mint-soft)", opacity: 0.75 }}>
          contact persons
        </h2>
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {CONTACTS.map((person, index) => (
            <div
              key={person.email}
              className="group flex flex-col gap-3 p-4 md:p-5 rounded-lg border transition-all duration-300"
              style={{
                background: "rgba(22, 219, 171, 0.04)",
                borderColor: "rgba(22, 219, 171, 0.2)",
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div className="space-y-1">
                <p className="text-sm md:text-base tracking-widest uppercase" style={{ color: "var(--mint-soft)", opacity: 0.6 }}>
                  name
                </p>
                <p className="text-lg md:text-xl font-bold tracking-wide" style={{ color: "var(--foreground)" }}>
                  {person.name}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`mailto:${person.email}`}
                  className="rounded-md border px-3 py-2 transition-colors duration-300 hover:border-[rgba(102,245,207,0.6)]"
                  style={{ borderColor: "rgba(22, 219, 171, 0.2)" }}
                >
                  <span className="block text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--mint-soft)", opacity: 0.6 }}>
                    email
                  </span>
                  <span className="block text-sm md:text-base break-all" style={{ color: "var(--foreground)" }}>
                    {person.email}
                  </span>
                </a>

                <a
                  href={`tel:${person.phone}`}
                  className="rounded-md border px-3 py-2 transition-colors duration-300 hover:border-[rgba(102,245,207,0.6)]"
                  style={{ borderColor: "rgba(22, 219, 171, 0.2)" }}
                >
                  <span className="block text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--mint-soft)", opacity: 0.6 }}>
                    contact no
                  </span>
                  <span className="block text-sm md:text-base" style={{ color: "var(--foreground)" }}>
                    {person.phone}
                  </span>
                </a>
              </div>

              <a
                href={person.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border px-3 py-2 transition-colors duration-300 hover:border-[rgba(102,245,207,0.6)]"
                style={{ borderColor: "rgba(22, 219, 171, 0.2)" }}
              >
                <span className="block text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--mint-soft)", opacity: 0.6 }}>
                  fb id link
                </span>
                <span className="block text-sm md:text-base break-all" style={{ color: "var(--foreground)" }}>
                  {person.facebook}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ hidden to save space */}

      {/* footer note */}
      <p
        className="text-sm md:text-base tracking-widest text-center pb-4"
        style={{ color: "var(--mint-soft)", opacity: 0.35 }}
      >
        iit indoors 2026
      </p>
    </section>
  );
}
