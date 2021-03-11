import React from "react";
import styles from "../styles/Connect.module.css";
import Image from "next/image"

interface ConnectProps {
  name: string;
}

export const Connect: React.FC<ConnectProps> = ({ name }) => {
  return (
    <div className={styles.container + " fade-in"}>
      <div className={styles.title}>hi {name}</div>
      <div className={styles.title}>connect to worlds to continue</div>
      <div className = {styles.image}>
        <Image src = "/connect.png" alt="connect" width="600" height="600"/>
      </div>
    </div>
  );
};
