import * as THREE from "three";
import React, { useState, Suspense, useMemo, useRef } from "react";
import { Canvas, useLoader, useThree, useFrame } from "react-three-fiber";
import Stars from "./Stars"
import Effects from "./post/Effects"

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

  let geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.Mesh({
    uniforms: uniforms,
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "blue"} />
    </mesh>
  );
};

const World2 = (props) => {
  const tempo = props.tempo;
  console.log("rendered world 2")
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 1, 0]} />
      <Box position={[1.2, 1, 0]} />
      <Stars />
      <Effects/>
    </>
  );
};

export default World2;
