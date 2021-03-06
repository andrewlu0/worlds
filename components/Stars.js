import * as THREE from "three"
import { useRef, useMemo } from "react";
import { useFrame } from "react-three-fiber";
import React from "react";

const Stars = React.memo(() => {
  let group = useRef();
  let theta = 0;
  
  useFrame(() => {
    // Some things maybe shouldn't be declarative, we're in the render-loop here with full access to the instance
    const r = 0.5 * Math.sin(THREE.Math.degToRad((theta += 0.1)));
    const s = 2 * Math.cos(THREE.Math.degToRad(theta * 2));
    if (group && group.current){
      group.current.rotation.set(r, r, r);
      group.current.scale.set(s, s, s);
    }
  });
  const [geo, mat, vertices, coords] = useMemo(() => {
    const geo = new THREE.SphereBufferGeometry(0.3, 10, 10);
    const mat = new THREE.MeshPhongMaterial({ color: new THREE.Color('#fa7500') });
    const coords = new Array(2000)
      .fill()
      .map((i) => [
        Math.random() * 800 - 400,
        Math.random() * 800 - 400,
        Math.random() * 800 - 400,
      ]);
    return [geo, mat, vertices, coords];
  }, []);
  return (
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </group>
  );
});

export default Stars;