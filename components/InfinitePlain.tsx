"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Props = {
  visibility: string;
};

export default function InfinitePlain(props: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [SpeedPlane, setSpeedPlane] = useState(0.1);

  // Use a ref to store the current speed
  const speedRef = useRef(SpeedPlane);

  // Update the ref whenever SpeedPlane changes
  useEffect(() => {
    speedRef.current = SpeedPlane;
  }, [SpeedPlane]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1c1c1c, 10, 50);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Plane Geometry & Material (gray base color)
    const planeGeo = new THREE.PlaneGeometry(150, 100, 10, 10);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Add Grid Helper (to draw black lines)
    const gridHelper = new THREE.GridHelper(100, 20, 0x000000, 0x000000);
    gridHelper.position.y += 2;
    scene.add(gridHelper);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color);
    mountRef.current.appendChild(renderer.domElement);

    // Move Plane Toward Camera (infinite plane effect)
    const animate = () => {
      requestAnimationFrame(animate);

      // Use the latest speed from the ref
      const speed = speedRef.current;

      // Move the plane and grid along the z-axis smoothly
      const position = (plane.position.z + speed) % 10;
      plane.position.z = position;
      gridHelper.position.z = position;

      // Render the scene
      renderer.render(scene, camera);
    };
    animate();

    // Handle Window Resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  return (
    <div
      ref={mountRef}
      className={`w-full h-full overflow-x-hidden relative ${props.visibility}`}
    >
      <div
        className={`w-full h-[100vh] absolute overflow-x-hidden flex flex-col justify-center items-center`}
      >
        <h1 className="text-[10em] drop-shadow-md text-yellow-300 font-bold">
          LINE9
        </h1>
        <p className="text-2xl max-w-[960px] text-center mb-5">
          Welcome to the interactive portfolio of LINE9, your best architecture
          firm in all of North Macedonia
        </p>
        <a
          href="#catalogue"
          className="border-2 border-white px-4 py-2 rounded-md my-2 hover:bg-yellow-300 ease-in-out duration-300"
        >
          Catalogue
        </a>
      </div>
    </div>
  );
}
