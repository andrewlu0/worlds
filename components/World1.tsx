import * as THREE from "three";
import React, { useState, useRef, Suspense, useEffect } from "react";
import { TextureLoader } from "../node_modules/three/src/loaders/TextureLoader.js";
import { useFrame, useLoader } from "react-three-fiber";
import { LandscapeShader } from "./shaders";
import Effects from "./post/Effects";
import Stars from "./Stars";

const Box = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef(null);

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh && mesh.current) {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    }
  });

  let uniforms = {
    colorB: { type: "vec3", value: new THREE.Color(0xacb6e5) },
    colorA: { type: "vec3", value: new THREE.Color(0x74ebd5) },
  };

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

const Plane = React.memo((props) => {
  const mesh = useRef(null);
  const shader = useRef(null);

  var geometry = new THREE.PlaneBufferGeometry(200, 500, 200, 200);

  const pallete = useLoader(TextureLoader, "/pallete.png");


  var uniforms = {
    time: { type: "f", value: 0.0 },
    distortCenter: { type: "f", value: 0.1 },
    roadWidth: { type: "f", value: 0.5 },
    pallete: { type: "t", value: pallete },
    speed: { type: "f", value: 1 },
    maxHeight: { type: "f", value: 15.0 },
    color: new THREE.Color(1, 1, 1),
  };

  useFrame(() => {
    if (shader && shader.current){
      var time = performance.now() * 0.0005;
      shader.current.uniforms.time.value = time;
      shader.current.uniformsNeedUpdate = true;
    }
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      rotation={[4.8, 0, 0]}
      position={[0, -5, -10]}
    >
      <planeBufferGeometry attach="geometry" args={[100, 500, 400, 300]} />
      <shaderMaterial
        ref = {shader}
        uniforms={uniforms}
        vertexShader={LandscapeShader.vertexShader}
        fragmentShader = {LandscapeShader.fragmentShader}
        wireframe={false}
        flatShading = {true}
      />
    </mesh>
  );
});

const World1 = React.memo(() => {
  console.log("RENDER")
  return (
    <>
      <Suspense fallback={null}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Plane />
        <Stars/>
        <Effects />
      </Suspense>
    </>
  );
});

export default World1;
