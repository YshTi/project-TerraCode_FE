"use client";

import Image from "next/image";

import Mountain from "./mountain-loader.svg";

import styles from "./loader.module.css";

type LoaderProps = {
  size?: number;
};

export function Loader({ size = 250 }: LoaderProps) {
  return (
    <div className={styles.overlay}>
      <div
        className={styles.loader}
        style={{ width: size }}
        role="status"
        aria-label="Loading"
      >
        <Image
          src={Mountain}
          alt=""
          className={styles.backgroundMountain}
          priority
        />

        <div className={styles.fillWrapper}>
          <Image
            src={Mountain}
            alt=""
            className={styles.fillMountain}
            priority
          />
        </div>
      </div>
    </div>
  );
}