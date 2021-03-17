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
import { TextureLoader } from "../node_modules/three/src/loaders/TextureLoader";
import styles from "../styles/Scene.module.css";
import { LandscapeShader } from "./shaders";
import * as THREE from "three";
import Stars from "./Stars";
import Effects from "./post/Effects";

const Plane = React.memo((props) => {
  const mesh = useRef(null);
  const shader = useRef(null);
  console.log(props);

  const pallete = useLoader(TextureLoader, "/pallete.png");

  const uniforms = useMemo(
    () => ({
      time: { type: "f", value: 0.0 },
      distortCenter: { type: "f", value: 0.1 },
      roadWidth: { type: "f", value: 0.5 },
      pallete: { type: "t", value: pallete },
      speed: { type: "f", value: 1 },
      maxHeight: { type: "f", value: 15.0 },
      color: new THREE.Color(1, 1, 1),
    }),
    []
  );
  useFrame((state) => {
    if (shader && shader.current) {
      var period = 60000 / props.tempo;
      const B = (2 * Math.PI) / period;
      var speed = Math.cos(B * performance.now()) + 1;
      var t;
      if (speed > 1.5 && !props.paused) {
        // console.log(speed)
        t = 0.06;
      } else {
        t = 0.01;
      }
      shader.current.uniforms.time.value += t;
    }
  });

  return (
    <mesh {...props} ref={mesh} rotation={[4.8, 0, 0]} position={[0, -5, -10]}>
      <planeBufferGeometry attach="geometry" args={[100, 700, 400, 300]} />
      <shaderMaterial
        ref={shader}
        uniforms={uniforms}
        vertexShader={LandscapeShader.vertexShader}
        fragmentShader={LandscapeShader.fragmentShader}
        wireframe={false}
        flatShading={true}
      />
    </mesh>
  );
});

export default Plane;