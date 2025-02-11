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

  // Save our scene so we can later add/update the skybox mesh.
  const sceneRef = useRef<THREE.Scene | null>(null);
  // Also keep a ref for ambient light.
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  // Ref to hold our skybox mesh.
  const skyboxRef = useRef<THREE.Mesh | null>(null);

  // State for fog parameters and ambient (sky) color.
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

  // New state to track the current atmosphere (corresponding to a folder name)
  // Possible values: "foggy", "sunny", or "sunset"
  const [currentAtmosphere, setCurrentAtmosphere] = useState<string>("foggy");

  // Refs to hold the latest fog/sky values (to avoid stale closures in animate)
  const fogParamsRef = useRef(fogParams);
  const skyColorRef = useRef(skyColor);

  useEffect(() => {
    fogParamsRef.current = fogParams;
  }, [fogParams]);

  useEffect(() => {
    skyColorRef.current = skyColor;
  }, [skyColor]);

  // ----- Atmosphere change functions using GSAP -----

  // "Foggy": dense fog
  const changeAtmosphereToFog = () => {
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
      duration: 1,
      ease: "power1.out",
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

    const currentSkyColor = new THREE.Color(skyColorRef.current);
    const targetSkyColor = new THREE.Color(0xffffff);
    const skyObject = {
      r: currentSkyColor.r,
      g: currentSkyColor.g,
      b: currentSkyColor.b,
    };

    gsap.to(skyObject, {
      duration: 3,
      ease: "power1.out",
      r: targetSkyColor.r,
      g: targetSkyColor.g,
      b: targetSkyColor.b,
      onUpdate: () => {
        const newSky = new THREE.Color(skyObject.r, skyObject.g, skyObject.b);
        setSkyColor(newSky.getHex());
      },
    });

    setCurrentAtmosphere("foggy");
  };

  // "Sunny": clear atmosphere—but with fog still visible near the horizon.
  // Fog parameters adjusted so the effect appears closer.
  const changeAtmosphereToSunny = () => {
    const targetFogColor = new THREE.Color(0x87ceeb);
    const currentFogColor = new THREE.Color(fogParamsRef.current.color);
    const fogObject = {
      r: currentFogColor.r,
      g: currentFogColor.g,
      b: currentFogColor.b,
      near: fogParamsRef.current.near,
      far: fogParamsRef.current.far,
    };

    // Adjusted to near: 20, far: 150 (instead of 30, 200) to move the fog effect closer.
    gsap.to(fogObject, {
      duration: 3,
      ease: "power1.out",
      r: targetFogColor.r,
      g: targetFogColor.g,
      b: targetFogColor.b,
      near: 20,
      far: 150,
      onUpdate: () => {
        const newColor = new THREE.Color(fogObject.r, fogObject.g, fogObject.b);
        setFogParams({
          color: newColor.getHex(),
          near: fogObject.near,
          far: fogObject.far,
        });
      },
    });

    const targetSkyColor = new THREE.Color(0x87ceeb);
    const currentSkyColor = new THREE.Color(skyColorRef.current);
    const skyObject = {
      r: currentSkyColor.r,
      g: currentSkyColor.g,
      b: currentSkyColor.b,
    };

    gsap.to(skyObject, {
      duration: 3,
      ease: "power1.out",
      r: targetSkyColor.r,
      g: targetSkyColor.g,
      b: targetSkyColor.b,
      onUpdate: () => {
        const newSky = new THREE.Color(skyObject.r, skyObject.g, skyObject.b);
        setSkyColor(newSky.getHex());
      },
    });

    setCurrentAtmosphere("sunny");
  };

  // "Sunset": warm tint with moderately transparent fog.
  // Fog parameters adjusted so the effect appears closer.
  const changeAtmosphereToSunset = () => {
    const targetFogColor = new THREE.Color(0xffa500);
    const currentFogColor = new THREE.Color(fogParamsRef.current.color);
    const fogObject = {
      r: currentFogColor.r,
      g: currentFogColor.g,
      b: currentFogColor.b,
      near: fogParamsRef.current.near,
      far: fogParamsRef.current.far,
    };

    // Adjusted to near: 15, far: 100 (instead of 20, 150) to move the fog effect closer.
    gsap.to(fogObject, {
      duration: 3,
      ease: "power1.out",
      r: targetFogColor.r,
      g: targetFogColor.g,
      b: targetFogColor.b,
      near: 15,
      far: 100,
      onUpdate: () => {
        const newColor = new THREE.Color(fogObject.r, fogObject.g, fogObject.b);
        setFogParams({
          color: newColor.getHex(),
          near: fogObject.near,
          far: fogObject.far,
        });
      },
    });

    const targetSkyColor = new THREE.Color(0xffa500);
    const currentSkyColor = new THREE.Color(skyColorRef.current);
    const skyObject = {
      r: currentSkyColor.r,
      g: currentSkyColor.g,
      b: currentSkyColor.b,
    };

    gsap.to(skyObject, {
      duration: 3,
      ease: "power1.out",
      r: targetSkyColor.r,
      g: targetSkyColor.g,
      b: targetSkyColor.b,
      onUpdate: () => {
        const newSky = new THREE.Color(skyObject.r, skyObject.g, skyObject.b);
        setSkyColor(newSky.getHex());
      },
    });

    setCurrentAtmosphere("sunset");
  };

  // ----- Reset function to restore initial fog/sky values when going back -----
  const handleGoBack = () => {
    // Reset to initial fog and sky colors and atmosphere.
    setFogParams({ color: 0x1c1c1c, near: 10, far: 50 });
    setSkyColor(0xffffff);
    setCurrentAtmosphere("foggy");
    // Call the provided callback to go back to model selection.
    ChangeState();
  };

  // ----- Scene setup and animation loop -----
  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(
      fogParamsRef.current.color,
      fogParamsRef.current.near,
      fogParamsRef.current.far
    );
    sceneRef.current = scene;

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
    // We do not set scene.background so that our custom skybox mesh shows.
    renderer.setClearColor(scene.fog.color);
    mountRef.current.appendChild(renderer.domElement);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(450, 450, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x808080, fog: true })
    );
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(450, 50, 0x000000, 0x000000);
    gridHelper.position.y += 0.1;
    scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(skyColorRef.current, 0.5);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xefefff, 1.5);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);

    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;
    mountRef.current.addEventListener("click", () => controls.lock());

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
        loader.load("/objects/modern/scene.gltf", (gltf) => {
          gltf.scene.scale.set(2, 2, 2);
          gltf.scene.position.set(315, 0.01, -45);
          scene.add(gltf.scene);
        });
        break;
      default:
        console.log(modelToRender);
        console.log("No model was found");
    }

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

    const animate = () => {
      requestAnimationFrame(animate);
      if (scene.fog) {
        scene.fog.color.setHex(
          typeof fogParamsRef.current.color === "number"
            ? fogParamsRef.current.color
            : 0x1c1c1c
        );
        if (scene.fog instanceof THREE.Fog) {
          scene.fog.near = fogParamsRef.current.near;
          scene.fog.far = fogParamsRef.current.far;
        }
      }
      ambientLightRef.current?.color.setHex(
        typeof skyColorRef.current === "number" ? skyColorRef.current : 0xffffff
      );
      // Update the skybox shader uniform (if exists) with the current fog color.
      if (
        skyboxRef.current &&
        skyboxRef.current.material &&
        "uniforms" in skyboxRef.current.material
      ) {
        (skyboxRef.current.material as any).uniforms.fogColor.value =
          new THREE.Color(fogParamsRef.current.color);
      }
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
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [modelToRender]);

  // ----- Create/update the skybox mesh when currentAtmosphere changes -----
  useEffect(() => {
    if (!sceneRef.current) return;
    const loader = new THREE.CubeTextureLoader();
    const basePath = `/cubeMapTextures/${currentAtmosphere}/`;
    loader.load(
      [
        `${basePath}px.jpg`,
        `${basePath}nx.jpg`,
        `${basePath}py.jpg`,
        `${basePath}ny.jpg`,
        `${basePath}pz.jpg`,
        `${basePath}nz.jpg`,
      ],
      (cubeTexture) => {
        // Define custom shaders for a skybox with a gradient effect:
        // The fragment shader blends the cube texture with the fog color based on the Y component.
        const vertexShader = `
          varying vec3 vWorldDirection;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldDirection = normalize(worldPosition.xyz - cameraPosition);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;
        const fragmentShader = `
          uniform samplerCube envMap;
          uniform vec3 fogColor;
          varying vec3 vWorldDirection;
          void main() {
            vec3 direction = normalize(vWorldDirection);
            vec4 envColor = textureCube(envMap, direction);
            // Compute a blend factor: near horizon (low direction.y) blends with fogColor,
            // at high Y, show full texture.
            float blendFactor = smoothstep(0.0, 0.3, direction.y);
            vec3 finalColor = mix(fogColor, envColor.rgb, blendFactor);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `;
        // Remove previous skybox if it exists.
        if (skyboxRef.current && sceneRef.current) {
          if (Array.isArray(skyboxRef.current.material)) {
            skyboxRef.current.material.forEach((mat) => {
              if (mat && "dispose" in mat) mat.dispose();
            });
          } else if (skyboxRef.current.material) {
            skyboxRef.current.material.dispose();
          }
          skyboxRef.current.geometry.dispose();
          sceneRef.current.remove(skyboxRef.current);
        }
        const skyGeo = new THREE.BoxGeometry(1000, 1000, 1000);
        const skyMat = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            envMap: { value: cubeTexture },
            fogColor: { value: new THREE.Color(fogParamsRef.current.color) },
          },
          side: THREE.BackSide,
          fog: false, // we're handling fog in the shader manually
        });
        const skyMesh = new THREE.Mesh(skyGeo, skyMat);
        skyboxRef.current = skyMesh;
        sceneRef.current?.add(skyMesh);
      }
    );
  }, [currentAtmosphere]);

  return (
    <div
      className={`w-full h-full overflow-x-hidden flex justify-center ${visibility}`}
    >
      <div
        ref={mountRef}
        className={`w-full h-full overflow-x-hidden ${visibility}`}
      ></div>
      <div className="w-fit fixed top-0 mt-5 bg-black min-w-40 border-[#808080] border rounded-md flex items-start justify-around text-lg">
        <div
          className="bg-[#1c1c1c] min-w-20 px-4 py-2 flex justify-center border-r border-[#808080] rounded-l-md hover:bg-gradient-to-r from-red-500 to-orange-500 ease-in-out duration-300"
          onClick={changeAtmosphereToFog}
        >
          <IoPartlySunnySharp
            className={
              currentAtmosphere === "foggy"
                ? "text-yellow-300"
                : "text-[#808080]"
            }
          />
        </div>
        <div
          className="bg-[#1c1c1c] min-w-20 px-4 py-2 flex justify-center border-r border-[#808080] hover:bg-gradient-to-r from-red-500 to-orange-500 ease-in-out duration-300"
          onClick={changeAtmosphereToSunny}
        >
          <IoIosSunny
            className={
              currentAtmosphere === "sunny"
                ? "text-yellow-300"
                : "text-[#808080]"
            }
          />
        </div>
        <div
          className="bg-[#1c1c1c] min-w-20 px-4 py-2 flex justify-center border-r border-[#808080] hover:bg-gradient-to-r from-red-500 to-orange-500 ease-in-out duration-300"
          onClick={changeAtmosphereToSunset}
        >
          <MdSunnySnowing
            className={
              currentAtmosphere === "sunset"
                ? "text-yellow-300"
                : "text-[#808080]"
            }
          />
        </div>
        <div
          className="bg-[#1c1c1c] min-w-20 px-4 py-2 flex justify-center rounded-r-md hover:bg-[#808080] ease-in-out duration-300"
          onClick={handleGoBack}
        >
          <RiArrowGoBackFill className="text-red-500" />
        </div>
      </div>
      <div className="w-fit fixed top-5 mt-10 text-sm font-light animate-pulse">
        W A S D to move!, Left click to look around
      </div>
    </div>
  );
}
