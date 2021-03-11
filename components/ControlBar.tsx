import React, { useState } from "react";
import styles from "../styles/ControlBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";

interface ControlBarProps {
  play: any;
  pause: any;
  albumImage: string;
  track: string;
  artist: string;
  paused: boolean;
  next: any;
  back: any;
  full: any;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  play,
  pause,
  albumImage,
  track,
  artist,
  paused,
  next,
  back,
  full,
}) => {
  const [footerVisible, setFooterVisible] = useState(true);
  return (
    <div
      className={`${styles.ControlBar} + ${
        footerVisible ? styles.fadeIn : styles.fadeOut
      }`}
      onMouseEnter={() => setFooterVisible(true)}
      onMouseLeave={() => setFooterVisible(false)}
    >
      <img src = {albumImage} className={styles.album}/>
      <div className = {styles.songInfo}>
        <div className = {styles.track}>{track}</div>
        <div className = {styles.artist}>{artist}</div>
      </div>
      <div className={styles.controls}>
        <FontAwesomeIcon icon={faStepBackward} className={styles.button} onClick = {back}/>
        {paused ? (
          <FontAwesomeIcon icon={faPlay} className={styles.button} onClick={play}/>
        ) : (
          <FontAwesomeIcon icon={faPause} className={styles.button} onClick = {pause}/>
        )}
        <FontAwesomeIcon icon={faStepForward} className={styles.button} onClick = {next}/>
      </div>
      <div className={styles.fullscreen}>
        <FontAwesomeIcon icon={faExpand} className={styles.button} onClick = {full}/>
      </div>
    </div>
  );
};
