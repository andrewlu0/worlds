import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";
import { EffectComposer } from "../../node_modules/three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "../../node_modules/three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "../../node_modules/three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "../../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass";
import { FilmPass } from "../../node_modules/three/examples/jsm/postprocessing/FilmPass";

extend({ EffectComposer, ShaderPass, RenderPass, UnrealBloomPass, FilmPass });

export default function Effects() {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size,
  ]);
  useEffect(() => void composer.current.setSize(size.width, size.height), [
    size,
  ]);
  useFrame(() => composer.current.render(), 1);
  return (
    <>
      <mesh>
        <sphereBufferGeometry args={[40, 320, 320]} position={[0,90,100]}/>
        <meshBasicMaterial />
      </mesh>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        <unrealBloomPass attachArray="passes" args={[aspect, 0.6, 0.6, 0]} />
      </effectComposer>
    </>
  );
}
