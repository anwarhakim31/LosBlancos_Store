"use client";

import React, { Fragment, useEffect, useState } from "react";
import styles from "./header.module.scss";
import { usePathname } from "next/navigation";
import NavbarView from "@/components/views/header";

export const authRender = [
  "/register",
  "/login",
  "/forget-password",
  "/reset-password",
  "/admin",
];
const Header = () => {
  const pathname = usePathname();

  const [isActive, setIsActive] = useState(false);
  const [isNonActive, setIsNonActive] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 400) {
        setIsActive(true);
        setIsNonActive(false);
      }

      if (currentScrollY < 400 && currentScrollY < lastScrollY) {
        setIsActive(false);
        setIsNonActive(true);
      }

      if (currentScrollY < 200 && currentScrollY < lastScrollY) {
        setIsActive(false);
        setIsNonActive(false);
      }

      lastScrollY = currentScrollY;
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Fragment>
      {!authRender.includes(pathname) && <div className={styles.top}></div>}
      <header
        className={`${styles.header}  ${isActive ? styles.active : ""} ${
          isNonActive ? styles.nonactive : ""
        }`}
      >
        <NavbarView />
      </header>
    </Fragment>
  );
};

export default Header;
