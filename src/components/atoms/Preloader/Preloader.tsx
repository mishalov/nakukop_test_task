import React from "react";
import styles from "./Preloader.module.scss";

interface IPreloaderProps {
  size: "100px" | "10px";
}

const Preloader: React.FC<IPreloaderProps> = ({ size }) => (
  <div className={styles.wrapper} style={{ height: size }}>
    <div className={styles.load} style={{ width: size, height: size }}>
      <hr />
      <hr />
      <hr />
      <hr />
    </div>
  </div>
);

export default Preloader;
