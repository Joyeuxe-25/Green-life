"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

type MobileNavMenuProps = {
  actionItems: NavItem[];
  logoUrl: string;
  navigationItems: NavItem[];
  siteName: string;
};

export function MobileNavMenu({
  actionItems,
  logoUrl,
  navigationItems,
  siteName
}: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="mobile-nav-shell">
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label="Open navigation menu"
        className="mobile-menu-button"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Menu aria-hidden="true" size={24} />
      </button>

      <div className={`mobile-menu-layer ${isOpen ? "is-open" : ""}`}>
        <button
          aria-label="Close navigation menu"
          className="mobile-menu-overlay"
          onClick={closeMenu}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        />
        <aside
          aria-label="Mobile navigation"
          aria-hidden={!isOpen}
          className="mobile-menu-panel"
          id={menuId}
        >
          <div className="mobile-menu-header">
            <Link className="mobile-menu-brand" href="/" onClick={closeMenu}>
              {logoUrl ? (
                <img alt={`${siteName} logo`} src={logoUrl} />
              ) : null}
              <span>{siteName}</span>
            </Link>
            <button
              aria-label="Close navigation menu"
              className="mobile-menu-close"
              onClick={closeMenu}
              type="button"
            >
              <X aria-hidden="true" size={22} />
            </button>
          </div>

          <nav aria-label="Mobile site links" className="mobile-menu-nav">
            {navigationItems.map((item) => (
              <Link href={item.href} key={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-actions">
            {actionItems.map((item) => (
              <Link
                className={
                  item.href === "/donate" ? "mobile-menu-donate" : "mobile-menu-action"
                }
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
