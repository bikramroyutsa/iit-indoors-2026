"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function QuickNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "home", href: "/" },
    { name: "the resultz", href: "/results" },
    { name: "the wallz", href: "/wall" },
    { name: "the hallz", href: "/hall" },
  ];

  return (
    <div className="fixed top-6 right-6 z-[1000] flex flex-col items-end gap-3">
      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pixel-button !p-2 md:!p-3 group relative transition-all duration-300 ${
          isOpen ? "rotate-90 !bg-white !text-black shadow-[4px_4px_0px_#000]" : "bg-opacity-90"
        }`}
        title="Quick Navigation"
      >
        <div className="flex flex-col gap-0.5 md:gap-1 w-5 h-5 md:w-6 md:h-6 items-center justify-center">
          <div className={`h-0.5 md:h-1 w-full bg-current transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <div className={`h-0.5 md:h-1 w-full bg-current transition-all duration-300 ${isOpen ? "rotate-45 translate-y-0" : ""}`} />
          <div className={`h-0.5 md:h-1 w-full bg-current transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-1 md:-translate-y-2" : ""}`} />
          <div className={`h-0.5 md:h-1 w-full bg-current transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
        </div>
        
        {/* Label on Hover */}
        {!isOpen && (
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 text-white text-[10px] py-1 px-2 font-pixelify whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none lowercase tracking-widest border border-white/20 shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
            navigate...
          </span>
        )}
      </button>

      {/* Navigation Menu */}
      <div className={`flex flex-col gap-2 transition-all duration-300 transform origin-top-right ${
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 -translate-y-4 pointer-events-none"
      }`}>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <button 
              className={`pixel-button !py-2 !px-4 text-xs w-32 tracking-widest lowercase transition-all ${
                pathname === link.href 
                  ? "!bg-white !text-black !shadow-[4px_4px_0px_rgba(255,255,255,0.3)]" 
                  : "bg-opacity-80 hover:bg-opacity-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </button>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .bg-current {
          background-color: currentColor;
        }
      `}</style>
    </div>
  );
}
