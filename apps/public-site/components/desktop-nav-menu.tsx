"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

type DesktopNavMenuProps = {
  moreItems: NavItem[];
  primaryItems: NavItem[];
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNavMenu({ moreItems, primaryItems }: DesktopNavMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const isMoreActive = moreItems.some((item) => isActivePath(pathname, item.href));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <nav aria-label="Public navigation">
      <ul className="nav-list">
        {primaryItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <li key={item.href}>
              <Link aria-current={isActive ? "page" : undefined} href={item.href}>
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="nav-more" ref={menuRef}>
          <button
            aria-current={isMoreActive ? "page" : undefined}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            className="nav-more-button"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            More ▼
          </button>
          <div className={`nav-more-menu ${isOpen ? "is-open" : ""}`} role="menu">
            {moreItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  href={item.href}
                  key={item.href}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </li>
      </ul>
    </nav>
  );
}
