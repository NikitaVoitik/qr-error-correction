"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export default function Header() {
  // The current URL, used to make the link for this page bold
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface p-4">
      <nav className="flex gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-primary hover:text-primary-dark ${
              pathname === link.href ? "font-bold" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
