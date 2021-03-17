import ReactDOM from "react-dom";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "react-three-fiber";
import styles from "../styles/Scene.module.css";
import Stars from "./Stars";
import Effects from "./post/Effects";
import Plane from "./Plane"

interface SceneProps {
  tempo: any;
  track: any;
}

export const Scene: React.FC<SceneProps> = React.memo(({ track, tempo }) => {
  const img_url = track.track_window.current_track.album.images[2].url;
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );
  console.log(track.track_window.current_track.album.images[2].url);
  return (
    <>
      <img className={styles.album + " fade-in"} src={img_url} />
      <Canvas
        className={styles.canvas + " fade-in"}
        camera={{ fov: 50, position: [0, 0, 300] }}
      >
        {/* <World1/> */}
        <Suspense fallback={null}>
          <fog attach="fog" args={["white", 0, 26]} />
          {/* <ambientLight /> */}
          <pointLight args={[0xff0000, 1, 100]} position={[10, 10, 10]} />
          <Plane tempo={tempo} paused={track.paused} />
          <Stars />
          <Effects />
        </Suspense>
      </Canvas>
    </>
  );
});
