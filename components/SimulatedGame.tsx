import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { IoPartlySunnySharp } from "react-icons/io5";
import { IoIosSunny } from "react-icons/io";
import { MdSunnySnowing } from "react-icons/md";
import { RiArrowGoBackFill } from "react-icons/ri";
import { gsap } from "gsap";

type Props = {
  visibility: string;
  modelToRender: string;
  ChangeState: () => void;
};

export default function SimulatedGame({
  visibility,
  modelToRender,
  ChangeState,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<PointerLockControls | null>(null);

  // Ambient light ref (so we can update its color from animate)
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // State for fog parameters and sky (ambient) color
  const [fogParams, setFogParams] = useState<{
    color: THREE.ColorRepresentation;
    near: number;
    far: number;
  }>({
    color: 0x1c1c1c,
    near: 10,
    far: 50,
  });
  const [skyColor, setSkyColor] = useState<THREE.ColorRepresentation>(0xffffff);

  // Refs to store latest fog and sky values (to be used in the animate loop)
  const fogParamsRef = useRef(fogParams);
  const skyColorRef = useRef(skyColor);

  // Update the refs whenever state changes
  useEffect(() => {
    fogParamsRef.current = fogParams;
  }, [fogParams]);

  useEffect(() => {
    skyColorRef.current = skyColor;
  }, [skyColor]);

  // Atmosphere change functions with GSAP
  const changeAtmosphereToFog = () => {
    // Animate fog values to default (0x1c1c1c, near:10, far:50)
    const currentFogColor = new THREE.Color(fogParamsRef.current.color);
    const targetFogColor = new THREE.Color(0x1c1c1c);
    const fogObject = {
      r: currentFogColor.r,
      g: currentFogColor.g,
      b: currentFogColor.b,
      near: fogParamsRef.current.near,
      far: fogParamsRef.current.far,
    };

    gsap.to(fogObject, {
      duration: 0.3, // 300ms
      r: targetFogColor.r,
      g: targetFogColor.g,
      b: targetFogColor.b,
      near: 10,
      far: 50,
      onUpdate: () => {
        const newColor = new THREE.Color(fogObject.r, fogObject.g, fogObject.b);
        setFogParams({
          color: newColor.getHex(),
          near: fogObject.near,
          far: fogObject.far,
        });
      },
    });

    // Animate sky color to default (0xffffff)
    const currentSkyColor = new THREE.Color(skyColorRef.current);
    const targetSkyColor = new THREE.Color(0xffffff);
    const skyObject = {
      r: currentSkyColor.r,
      g: currentSkyColor.g,
      b: currentSkyColor.b,
    };

    gsap.to(skyObject, {
      duration: 0.3, // 300ms
      r: targetSkyColor.r,
      g: targetSkyColor.g,
      b: targetSkyColor.b,
      onUpdate: () => {
        const newSky = new THREE.Color(skyObject.r, skyObject.g, skyObject.b);
        setSkyColor(newSky.getHex());
      },
    });
  };

  const changeAtmosphereToSunny = () => {
    // For sunny weather, use a sky-blue tint and extend fog distances
    const targetFogColor = new THREE.Color(0x87ceeb); // sky blue
    const currentFogColor = new THREE.Color(fogParamsRef.current.color);
    const fogObject = {
      r: currentFogColor.r,
      g: currentFogColor.g,
      b: currentFogColor.b,
      near: fogParamsRef.current.near,
      far: fogParamsRef.current.far,
    };

    gsap.to(fogObject, {
      duration: 0.5, // 500ms
      r: targetFogColor.r,
      g: targetFogColor.g,
      b: targetFogColor.b,
      near: 20,
      far: 300,
      onUpdate: () => {
        const newColor = new THREE.Color(fogObject.r, fogObject.g, fogObject.b);
        setFogParams({
          color: newColor.getHex(),
          near: fogObject.near,
          far: fogObject.far,
        });
      },
    });

    // Animate sky color to the same sunny blue
    const targetSkyColor = new THREE.Color(0x87ceeb);
    const currentSkyColor = new THREE.Color(skyColorRef.current);
    const skyObject = {
      r: currentSkyColor.r,
      g: currentSkyColor.g,
      b: currentSkyColor.b,
    };

    gsap.to(skyObject, {
      duration: 0.5, // 500ms
      r: targetSkyColor.r,
      g: targetSkyColor.g,
      b: targetSkyColor.b,
      onUpdate: () => {
        const newSky = new THREE.Color(skyObject.r, skyObject.g, skyObject.b);
        setSkyColor(newSky.getHex());
      },
    });
  };

  const changeAtmosphereToSunset = () => {
    // For sunset, use a warm orange tint and extend fog distances even more
    const targetFogColor = new THREE.Color(0xffa500); // warm orange
    const currentFogColor = new THREE.Color(fogParamsRef.current.color);
    const fogObject = {
      r: currentFogColor.r,
      g: currentFogColor.g,
      b: currentFogColor.b,
      near: fogParamsRef.current.near,
      far: fogParamsRef.current.far,
    };

    gsap.to(fogObject, {
      duration: 0.5, // 500ms
      r: targetFogColor.r,
      g: targetFogColor.g,
      b: targetFogColor.b,
      near: 30,
      far: 400,
      onUpdate: () => {
        const newColor = new THREE.Color(fogObject.r, fogObject.g, fogObject.b);
        setFogParams({
          color: newColor.getHex(),
          near: fogObject.near,
          far: fogObject.far,
        });
      },
    });

    // Animate sky color to a warm sunset tone
    const targetSkyColor = new THREE.Color(0xffa500);
    const currentSkyColor = new THREE.Color(skyColorRef.current);
    const skyObject = {
      r: currentSkyColor.r,
      g: currentSkyColor.g,
      b: currentSkyColor.b,
    };

    gsap.to(skyObject, {
      duration: 0.5, // 500ms
      r: targetSkyColor.r,
      g: targetSkyColor.g,
      b: targetSkyColor.b,
      onUpdate: () => {
        const newSky = new THREE.Color(skyObject.r, skyObject.g, skyObject.b);
        setSkyColor(newSky.getHex());
      },
    });
  };

  // Main scene setup and animation loop
  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene and set initial fog from state (via the ref)
    const scene = new THREE.Scene();
    const fog = new THREE.Fog(
      fogParamsRef.current.color,
      fogParamsRef.current.near,
      fogParamsRef.current.far
    );
    scene.fog = fog;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 0);
    cameraRef.current = camera;

    // Create renderer and add it to our mountRef container
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color);
    mountRef.current.appendChild(renderer.domElement);

    // Ground plane and grid helper
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(450, 450, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(450, 50, 0x000000, 0x000000);
    gridHelper.position.y += 0.1;
    scene.add(gridHelper);

    // Ambient light (using current sky color) and directional lights
    const ambientLight = new THREE.AmbientLight(skyColorRef.current, 0.5);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xefefff, 1.5);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);

    // Set up pointer lock controls
    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;
    mountRef.current.addEventListener("click", () => controls.lock());

    // Load model based on modelToRender prop
    const loader = new GLTFLoader();
    switch (modelToRender) {
      case "Asian":
        loader.load("/objects/asian/scene.gltf", (gltf) => {
          gltf.scene.scale.set(1.5, 1.5, 1.5);
          gltf.scene.position.set(0, 0.1, -15);
          scene.add(gltf.scene);
        });
        break;
      case "Classic":
        loader.load("/objects/small_brick_house/scene.gltf", (gltf) => {
          gltf.scene.scale.set(0.05, 0.05, 0.05);
          gltf.scene.position.set(0, 0, -30);
          gltf.scene.rotation.y = Math.PI;
          scene.add(gltf.scene);
        });
        break;
      case "Modern":
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

    // Movement handling variables and event listeners
    let moveForward = false,
      moveBackward = false,
      moveLeft = false,
      moveRight = false;

    const handleKeyDown = (event: KeyboardEvent) => {
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

    const handleKeyUp = (event: KeyboardEvent) => {
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

    // Animation loop: update fog and ambient light with the latest state from our refs
    const animate = () => {
      requestAnimationFrame(animate);

      // Update fog properties
      fog.color.setHex(
        typeof fogParamsRef.current.color === "number"
          ? fogParamsRef.current.color
          : 0x1c1c1c
      );
      fog.near = fogParamsRef.current.near;
      fog.far = fogParamsRef.current.far;

      // Update ambient light color (if available)
      ambientLightRef.current?.color.setHex(
        typeof skyColorRef.current === "number" ? skyColorRef.current : 0xffffff
      );

      // Handle movement
      if (moveForward) controls.moveForward(0.1);
      if (moveBackward) controls.moveForward(-0.1);
      if (moveLeft) controls.moveRight(-0.1);
      if (moveRight) controls.moveRight(0.1);

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [modelToRender]);

  return (
    <div
      className={`w-full h-full overflow-x-hidden flex justify-center ${visibility}`}
    >
      <div
        ref={mountRef}
        className={`w-full h-full overflow-x-hidden ${visibility}`}
      ></div>

      {/* Change scene weather buttons */}
      <div className="w-fit fixed top-0 mt-5 bg-black min-w-40 border-[#808080] border rounded-md flex items-start justify-around text-lg">
        <div
          className="bg-[#1c1c1c] min-w-20 px-4 py-2 flex justify-center border-r border-[#808080] rounded-l-md hover:bg-gradient-to-r from-red-500 to-orange-500 ease-in-out duration-300"
          onClick={changeAtmosphereToFog}
        >
          <IoPartlySunnySharp className="text-yellow-300" />
        </div>
        <div
          className="bg-[#1c1c1c] min-w-20 px-4 py-2 flex justify-center border-r border-[#808080] hover:bg-gradient-to-r from-red-500 to-orange-500 ease-in-out duration-300"
          onClick={changeAtmosphereToSunny}
        >
          <IoIosSunny className="text-yellow-300" />
        </div>
        <div
          className="bg-[#1c1c1c] min-w-20 px-4 py-2 flex justify-center border-r border-[#808080] hover:bg-gradient-to-r from-red-500 to-orange-500 ease-in-out duration-300"
          onClick={changeAtmosphereToSunset}
        >
          <MdSunnySnowing className="text-yellow-300" />
        </div>
        {/* Go back */}
        <div
          className="bg-[#1c1c1c] min-w-20 px-4 py-2 flex justify-center rounded-r-md hover:bg-[#808080] ease-in-out duration-300"
          onClick={ChangeState}
        >
          <RiArrowGoBackFill className="text-red-500" />
        </div>
      </div>

      {/* Movement instructions */}
      <div className="w-fit fixed top-5 mt-10 text-sm font-light animate-pulse">
        W A S D to move!, Left click to look around
      </div>
    </div>
  );
}
