import ReactDOM from "react-dom";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import { TextureLoader } from "../node_modules/three/src/loaders/TextureLoader.js";
import { LandscapeShader } from "./shaders";
import * as THREE from "three";
import Stars from "./Stars";
import Effects from "./post/Effects";

const Plane = React.memo((props) => {
  const mesh = useRef(null);
  const shader = useRef(null);

  var geometry = new THREE.PlaneBufferGeometry(200, 500, 200, 200);

  const pallete = useLoader(TextureLoader, "/pallete.png");

  const uniforms = useMemo(()=>({
    time: { type: "f", value: 0.0 },
    distortCenter: { type: "f", value: 0.1 },
    roadWidth: { type: "f", value: 0.5 },
    pallete: { type: "t", value: pallete },
    speed: { type: "f", value: 1 },
    maxHeight: { type: "f", value: 15.0 },
    color: new THREE.Color(1, 1, 1),
  }), []);

  useFrame((state) => {
    if (shader && shader.current) {
      // console.log(shader.current)
      var t = performance.now() * 0.0005;
      shader.current.uniforms.time.value = t;
    }
  });

  return (
    <mesh {...props} ref={mesh} rotation={[4.8, 0, 0]} position={[0, -5, -10]}>
      <planeBufferGeometry attach="geometry" args={[100, 500, 400, 300]} />
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

export const Scene = React.memo((tempo: any) => {
  return (
    <Canvas camera={{ fov: 50, position: [0, 0, 20] }}>
      {/* <World1/> */}
      <Suspense fallback={null}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Plane />
        <Stars />
        <Effects />
      </Suspense>
    </Canvas>
  );
});
