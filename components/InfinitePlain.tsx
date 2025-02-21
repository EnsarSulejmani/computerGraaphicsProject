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
  modelsLoaded: boolean;
};

export default function InfinitePlain({
  visibility,
  hasBuildingSelected,
  ChangeState,
  animationVariables,
  modelsLoaded,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Animation variables as refs.
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

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
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

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      // Animate plane movement automatically.
      plane.position.z = (plane.position.z + speedRef.current * delta) % 10;
      gridHelper.position.z = plane.position.z;

      // Keep camera vertical position and rotation constant.
      camera.position.y = movementRef.current;
      camera.rotation.x = rotationRef.current;

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
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full overflow-x-hidden relative ${visibility}`}
    >
      <div className="absolute w-full h-full flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-5xl md:text-[10em] drop-shadow-md text-yellow-300 font-bold">
          SwanSpace
        </h1>
        <p className="text-lg md:text-2xl max-w-[960px] text-center mb-5 font-thin">
          Welcome to the interactive portfolio of SwanSpace Architecture.
          <br />
          Disclaimer! This is a computer science course project, and not a real
          architecture firm.
        </p>
        {hasBuildingSelected ? (
          modelsLoaded ? (
            <button
              onClick={ChangeState}
              className="border-2 border-white px-4 py-2 rounded-md my-2 hover:bg-yellow-300"
            >
              View in 3D
            </button>
          ) : (
            <button className="border-2 border-white px-4 py-2 rounded-md my-2">
              Loading...
            </button>
          )
        ) : (
          <a href="#catalogue" className="border-2 border-white px-4 py-2">
            Catalogue
          </a>
        )}
      </div>
    </div>
  );
}
