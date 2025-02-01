import { useEffect, useRef } from "react";
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
      new THREE.PlaneGeometry(450, 450, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(450, 50, 0x000000, 0x000000);
    gridHelper.position.y += 0.1;
    scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xefefff, 1.5);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);

    // Camera Lock
    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;

    mountRef.current.addEventListener("click", () => controls.lock());

    //Models
    const loader = new GLTFLoader();
    switch (modelToRender) {
      case "Asian":
        //Model 1 - Asian - Approved and ready!
        loader.load("/objects/asian/scene.gltf", (gltf) => {
          gltf.scene.scale.set(1.5, 1.5, 1.5);
          gltf.scene.position.set(0, 0.1, -15);

          scene.add(gltf.scene);
        });
        break;
      case "Classic":
        //Model 2 small_brick_house - Approved and ready!
        loader.load("/objects/small_brick_house/scene.gltf", (gltf) => {
          gltf.scene.scale.set(0.05, 0.05, 0.05);
          gltf.scene.position.set(0, 0, -30);
          gltf.scene.rotation.y = Math.PI;

          scene.add(gltf.scene);
        });
        break;
      case "Modern":
        //model 3 modern - Approved and ready!
        loader.load("/objects/modern/scene.gltf", (gltf1) => {
          gltf1.scene.scale.set(2, 2, 2);
          gltf1.scene.position.set(315, 0.01, -45);

          scene.add(gltf1.scene);
        });
        break;
      default:
        console.log(modelToRender);
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
  }, [modelToRender]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full overflow-x-hidden ${visibility}`}
    ></div>
  );
}
