// Set this component as a client component
"use client";
// Nav Requirements
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import MainLogo from "./main-logo";
// Nav Main Function
function Nav() {
  // Nav Hooks
  const [open, SetOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const CURRENT_PAGE = usePathname();
  // Nav Pages List to use in Mobile Nav and Desktop Nav
  const NAV_PAGES_LIST = [
    { href: "/", name: "Inicio", reload: false },
    { href: "/how-it-works", name: "¿Cómo Funciona?", reload: false },
    { href: "/movies", name: "Películas", reload: true },
    { href: "/series", name: "Series", reload: true },
    { href: "/report-bug", name: "Reportar Problema", reload: false },
    { href: "/content-app", name: "Solicitar Contenido", reload: false },
  ];
  // Execute this use effect to close the menu when clicking outside it
  useEffect(() => {
    const ClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        menuRef.current.contains(event.target as Node) === false
      ) {
        SetOpen(false);
      }
    };
    document.addEventListener("click", ClickOutside);
    return () => {
      document.removeEventListener("click", ClickOutside);
    };
  }, [menuRef]);
  // Function that Sets the Opposite Value in Open Hook to Open and Close the Burger Menu
  const OnClickButton = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => SetOpen(!open));
    } else {
      SetOpen(!open);
    }
  };
  // Returns Nav Component
  return (
    <nav>
      <div
        ref={menuRef}
        className={`p-2 grid grid-cols-3 items-center relative min-[1035px]:flex min-[1035px]:px-6 ${
          open ? "bg-gray-900" : "bg-gray-950"
        }`}
      >
        {/* Burger Menu Button to Mobile Nav */}
        <button
          className="w-10 h-10 place-content-center rounded-md text-gray-300 focus:outline-hidden focus:ring-2 focus:ring-white min-[1035px]:hidden"
          onClick={OnClickButton}
        >
          {/* If the burger menu is closed, it shows the bars icon; if open, shows the X Mark icon */}
          <Bars3Icon
            className={`w-7 mx-auto ${open ? "hidden" : ""}`.trimEnd()}
          />
          <XMarkIcon
            className={`w-7 mx-auto ${open ? "" : "hidden"}`.trimEnd()}
          />
        </button>
        <Link href="/" className="min-[1035px]:m-3">
          <MainLogo
            width={120}
            height={32}
            className="w-[120px] h-[32px] mx-auto"
          />
        </Link>
        {/* Desktop Nav */}
        <div className="hidden min-[1035px]:block">
          {NAV_PAGES_LIST.map((page) =>
            page.reload === true ? (
              <a
                key={page.href}
                href={page.href}
                className={`font-medium mx-2 px-3 py-2 rounded-md select-none ${
                  CURRENT_PAGE === page.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {page.name}
              </a>
            ) : (
              <Link
                key={page.href}
                href={page.href}
                className={`font-medium mx-2 px-3 py-2 rounded-md select-none ${
                  CURRENT_PAGE === page.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {page.name}
              </Link>
            )
          )}
        </div>
      </div>
      {/* Mobile Nav */}
      <div
        className={`flex flex-col text-white absolute bg-gray-900 w-full py-2 z-20 min-[1035px]:hidden ${
          open ? "" : "hidden"
        }`.trimEnd()}
      >
        {NAV_PAGES_LIST.map((page) =>
          page.reload === true ? (
            <a
              key={page.href}
              href={page.href}
              onClick={() => SetOpen(false)}
              className={`mx-2 my-1 px-3 py-2 font-medium ${
                CURRENT_PAGE === page.href ? "bg-gray-700 rounded-md" : ""
              }`}
            >
              {page.name}
            </a>
          ) : (
            <Link
              key={page.href}
              href={page.href}
              onClick={() => SetOpen(false)}
              className={`mx-2 my-1 px-3 py-2 font-medium ${
                CURRENT_PAGE === page.href ? "bg-gray-700 rounded-md" : ""
              }`}
            >
              {page.name}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}

export default Nav;
