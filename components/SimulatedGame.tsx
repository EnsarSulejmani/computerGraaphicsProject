import { render } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
type Props = {
  visibility: string;
  modelToRender: string;
};

export default function SimulatedGame({ visibility, modelToRender }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<PointerLockControls | null>(null);
  const [BuildingName, setBuilidngName] = useState(modelToRender); // State to track scenes
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1c1c1c, 10, 50);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 0);
    cameraRef.current = camera;

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
    gridHelper.position.y += 0.1;
    scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);

    // Camera Lock
    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;

    mountRef.current.addEventListener("click", () => controls.lock());

    //Models
    const loader = new GLTFLoader();
    setBuilidngName(modelToRender);
    switch (BuildingName) {
      case "baroque":
        //Model 1
        loader.load("/buildings/baroque/scene.gltf", (gltf) => {
          gltf.scene.scale.set(1, 1, 1);
          gltf.scene.position.set(5, 1.6, 0);

          scene.add(gltf.scene);
        });
        break;
      case "classic":
        //Model 2
        break;
      case "modern":
        //model 3
        break;
      default:
        console.log(BuildingName);
        console.log("No model was found");
    }

    // Movement handling
    let moveForward = false,
      moveBackward = false,
      moveLeft = false,
      moveRight = false;

    const handleKeyDown = (event: any) => {
      switch (event.code) {
        case "KeyW":
          moveForward = true;
          break;
        case "KeyS":
          moveBackward = true;
          break;
        case "KeyA":
          moveLeft = true;
          break;
        case "KeyD":
          moveRight = true;
          break;
      }
    };

    const handleKeyUp = (event: any) => {
      switch (event.code) {
        case "KeyW":
          moveForward = false;
          break;
        case "KeyS":
          moveBackward = false;
          break;
        case "KeyA":
          moveLeft = false;
          break;
        case "KeyD":
          moveRight = false;
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    const animate = () => {
      requestAnimationFrame(animate);
      if (moveForward) controls.moveForward(0.1);
      if (moveBackward) controls.moveForward(-0.1);
      if (moveLeft) controls.moveRight(-0.1);
      if (moveRight) controls.moveRight(0.1);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full overflow-x-hidden ${visibility}`}
    >
      <div className={`text-lg${visibility}`}>
        {modelToRender}, {BuildingName}
      </div>
    </div>
  );
}
