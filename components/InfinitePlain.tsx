"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  visibility: string;
  hasBuildingSelected: boolean;
  ChangeState: () => void;
  animationVariables: {
    SpeedPlane: number;
    CameraRotationState: number;
    CameraMovement: number;
  };
};

export default function InfinitePlain({
  visibility,
  hasBuildingSelected,
  ChangeState,
  animationVariables,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Animation variables as refs
  const speedRef = useRef(animationVariables.SpeedPlane);
  const rotationRef = useRef(animationVariables.CameraRotationState);
  const movementRef = useRef(animationVariables.CameraMovement);

  useEffect(() => {
    speedRef.current = animationVariables.SpeedPlane;
    rotationRef.current = animationVariables.CameraRotationState;
    movementRef.current = animationVariables.CameraMovement;
  }, [
    animationVariables.SpeedPlane,
    animationVariables.CameraRotationState,
    animationVariables.CameraMovement,
  ]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1c1c1c, 10, 50);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, movementRef.current, 10);
    camera.rotateX(rotationRef.current);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color);
    mountRef.current.appendChild(renderer.domElement);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(150, 100, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(100, 20, 0x000000, 0x000000);
    gridHelper.position.y += 2;
    scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);

      // Update based on refs
      const speed = speedRef.current;
      const cameraMove = movementRef.current;
      const cameraRot = rotationRef.current;

      plane.position.z = (plane.position.z + speed) % 10;
      gridHelper.position.z = plane.position.z;

      camera.position.y = cameraMove;
      camera.rotation.x = cameraRot;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full overflow-x-hidden relative ${visibility}`}
    >
      <div className="absolute w-full h-full flex flex-col justify-center items-center">
        <h1 className="text-[10em] drop-shadow-md text-yellow-300 font-bold">
          LINE9
        </h1>
        <p className="text-2xl max-w-[960px] text-center mb-5 font-thin">
          Welcome to the interactive portfolio of LINE9.
        </p>
        {hasBuildingSelected ? (
          <button
            onClick={ChangeState}
            className="border-2 border-white px-4 py-2 rounded-md my-2 hover:bg-yellow-300"
          >
            View in 3D
          </button>
        ) : (
          <a href="#catalogue" className="border-2 border-white px-4 py-2">
            Catalogue
          </a>
        )}
      </div>
    </div>
  );
}
