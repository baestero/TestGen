import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <nav className={styles.nav}>
      <h1>
        TestGen<p>| Automatize a criação dos seus casos de teste.</p>
      </h1>
    </nav>
  );
};

export default Header;
