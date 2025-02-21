import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { IoPartlySunnySharp } from "react-icons/io5";
import { IoIosSunny } from "react-icons/io";
import { MdSunnySnowing } from "react-icons/md";
import { RiArrowGoBackFill } from "react-icons/ri";
import { gsap } from "gsap";

// A module-level cache to store preloaded models so they load only once.
let preloadedModelsCache: { [key: string]: THREE.Object3D } | null = null;

type Props = {
  visibility: string;
  modelToRender: string;
  ChangeState: () => void;
  setModelsLoaded: (loaded: boolean) => void; // Add this prop to pass the state setter
};

export default function SimulatedGame({
  visibility,
  modelToRender,
  ChangeState,
  setModelsLoaded, // Add this prop to pass the state setter
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<PointerLockControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const skyboxRef = useRef<THREE.Mesh | null>(null);

  // Preloaded models reference.
  const modelsRef = useRef<{ [key: string]: THREE.Object3D }>({});
  const currentModelRef = useRef<THREE.Object3D | null>(null);

  const modelPaths: { [key: string]: string } = {
    Asian: "/objects/asian/scene.gltf",
    Classic: "/objects/small_brick_house/scene.gltf",
    Modern: "/objects/modern/scene.gltf",
  };

  const loadModelsAsync = async () => {
    if (preloadedModelsCache) {
      return preloadedModelsCache;
    }

    const loader = new GLTFLoader();
    const modelsToLoad = Object.keys(modelPaths);

    const loadModel = (modelName: string, path: string) =>
      new Promise<THREE.Object3D>((resolve, reject) => {
        loader.load(
          path,
          (gltf) => {
            resolve(gltf.scene);
          },
          undefined,
          (error) => {
            console.error(`Error loading ${modelName} model:`, error);
            reject(error);
          }
        );
      });

    const newModels: { [key: string]: THREE.Object3D } = {};
    await Promise.all(
      modelsToLoad.map((modelName) =>
        loadModel(modelName, modelPaths[modelName]).then((model) => {
          newModels[modelName] = model;
          console.log(`${modelName} model preloaded.`);
        })
      )
    );

    preloadedModelsCache = newModels;
    return newModels;
  };

  // --- Preload models asynchronously on first mount ---
  useEffect(() => {
    let isMounted = true;

    const loadModels = async () => {
      try {
        const models = await loadModelsAsync();
        if (isMounted) {
          modelsRef.current = models;
          setModelsLoaded(true); // Set modelsLoaded state
        }
      } catch (error) {
        console.error("Error preloading models", error);
      }
    };

    loadModels();

    return () => {
      isMounted = false;
    };
  }, [setModelsLoaded]);

  // --- Preload skybox textures ---
  const skyboxTexturesRef = useRef<{ [key: string]: THREE.CubeTexture }>({});
  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    const atmospheres = ["foggy", "sunny", "sunset"];
    atmospheres.forEach((atmo) => {
      const basePath = `/cubeMapTextures/${atmo}/`;
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
          skyboxTexturesRef.current[atmo] = cubeTexture;
          console.log(`${atmo} skybox texture loaded.`);
        },
        undefined,
        (error) => {
          console.error(`Error loading ${atmo} skybox texture:`, error);
        }
      );
    });
  }, []);

  // --- Fog and Sky state ---
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
  const [currentAtmosphere, setCurrentAtmosphere] = useState<string>("foggy");

  const fogParamsRef = useRef(fogParams);
  const skyColorRef = useRef(skyColor);
  useEffect(() => {
    fogParamsRef.current = fogParams;
  }, [fogParams]);
  useEffect(() => {
    skyColorRef.current = skyColor;
  }, [skyColor]);

  // GSAP tween references.
  const fogTweenRef = useRef<gsap.core.Tween | null>(null);
  const skyTweenRef = useRef<gsap.core.Tween | null>(null);

  // --- Model transform presets ---
  const modelTransforms: Record<
    string,
    { scale: THREE.Vector3; position: THREE.Vector3; rotationY?: number }
  > = {
    Asian: {
      scale: new THREE.Vector3(1.5, 1.5, 1.5),
      position: new THREE.Vector3(0, 0.1, -15),
    },
    Classic: {
      scale: new THREE.Vector3(0.05, 0.05, 0.05),
      position: new THREE.Vector3(0, 0, -30),
      rotationY: Math.PI,
    },
    Modern: {
      scale: new THREE.Vector3(2, 2, 2),
      position: new THREE.Vector3(315, 0.01, -45),
    },
  };

  // --- Declare WASD key state at the top level ---
  const keysPressed = useRef<{ [key: string]: boolean }>({
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
  });

  // --- Scene setup and animation loop ---
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
    renderer.setClearColor(scene.fog.color);
    mountRef.current.appendChild(renderer.domElement);

    // Ground plane, grid, and lighting.
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

    // Set up PointerLockControls.
    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;
    const onClick = () => controls.lock();
    mountRef.current.addEventListener("click", onClick);

    // Keyboard event handlers.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code in keysPressed.current) {
        keysPressed.current[e.code] = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code in keysPressed.current) {
        keysPressed.current[e.code] = false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const moveSpeed = 5; // units per second

      // Update camera movement using WASD if pointer lock is enabled.
      if (controls.isLocked === true) {
        if (keysPressed.current["KeyW"]) {
          controls.moveForward(moveSpeed * delta);
        }
        if (keysPressed.current["KeyS"]) {
          controls.moveForward(-moveSpeed * delta);
        }
        if (keysPressed.current["KeyA"]) {
          controls.moveRight(-moveSpeed * delta);
        }
        if (keysPressed.current["KeyD"]) {
          controls.moveRight(moveSpeed * delta);
        }
      }

      // Update fog and ambient light.
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
      if (
        skyboxRef.current &&
        skyboxRef.current.material &&
        "uniforms" in skyboxRef.current.material
      ) {
        (skyboxRef.current.material as any).uniforms.fogColor.value =
          new THREE.Color(fogParamsRef.current.color);
      }
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
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      mountRef.current?.removeEventListener("click", onClick);
      renderer.dispose();
    };
  }, []);

  // --- Update model when modelToRender changes ---
  useEffect(() => {
    if (!sceneRef.current) return;
    if (currentModelRef.current) {
      // Dispose geometries and materials before removal.
      currentModelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).geometry) {
          (child as THREE.Mesh).geometry.dispose();
        }
        if ((child as THREE.Mesh).material) {
          const material = (child as THREE.Mesh).material;
          if (Array.isArray(material)) {
            material.forEach((mat) => mat.dispose());
          } else {
            material.dispose();
          }
        }
      });
      sceneRef.current.remove(currentModelRef.current);
      currentModelRef.current = null;
    }
    const loadedModel = modelsRef.current[modelToRender];
    if (loadedModel) {
      const modelClone = loadedModel.clone();
      const transform = modelTransforms[modelToRender];
      if (transform) {
        modelClone.scale.copy(transform.scale);
        modelClone.position.copy(transform.position);
        if (transform.rotationY) {
          modelClone.rotation.y = transform.rotationY;
        }
      }
      sceneRef.current.add(modelClone);
      currentModelRef.current = modelClone;
    } else {
      console.warn(`Model ${modelToRender} not loaded yet.`);
    }
  }, [modelToRender]);

  // --- Reusable atmosphere change function ---
  const changeAtmosphere = (
    targetFogColorHex: number,
    targetSkyColorHex: number,
    fogNear: number,
    fogFar: number,
    atmosphere: string
  ) => {
    if (fogTweenRef.current) fogTweenRef.current.kill();
    if (skyTweenRef.current) skyTweenRef.current.kill();

    const currentFogColor = new THREE.Color(fogParamsRef.current.color);
    const targetFogColor = new THREE.Color(targetFogColorHex);
    const fogObject = {
      r: currentFogColor.r,
      g: currentFogColor.g,
      b: currentFogColor.b,
      near: fogParamsRef.current.near,
      far: fogParamsRef.current.far,
    };

    fogTweenRef.current = gsap.to(fogObject, {
      duration: 1,
      ease: "power1.out",
      r: targetFogColor.r,
      g: targetFogColor.g,
      b: targetFogColor.b,
      near: fogNear,
      far: fogFar,
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
    const targetSkyColor = new THREE.Color(targetSkyColorHex);
    const skyObject = {
      r: currentSkyColor.r,
      g: currentSkyColor.g,
      b: currentSkyColor.b,
    };

    skyTweenRef.current = gsap.to(skyObject, {
      duration: 1,
      ease: "power1.out",
      r: targetSkyColor.r,
      g: targetSkyColor.g,
      b: targetSkyColor.b,
      onUpdate: () => {
        const newSky = new THREE.Color(skyObject.r, skyObject.g, skyObject.b);
        setSkyColor(newSky.getHex());
      },
    });

    setCurrentAtmosphere(atmosphere);
  };

  const changeAtmosphereToFog = () => {
    changeAtmosphere(0x1c1c1c, 0xffffff, 10, 50, "foggy");
  };

  const changeAtmosphereToSunny = () => {
    changeAtmosphere(0x87ceeb, 0x87ceeb, 20, 150, "sunny");
  };

  const changeAtmosphereToSunset = () => {
    changeAtmosphere(0xffa500, 0xffa500, 15, 100, "sunset");
  };

  // --- Update skybox when currentAtmosphere changes ---
  useEffect(() => {
    if (!sceneRef.current) return;
    const cubeTexture = skyboxTexturesRef.current[currentAtmosphere];
    if (!cubeTexture) return;

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
        float blendFactor = smoothstep(0.0, 0.3, direction.y);
        vec3 finalColor = mix(fogColor, envColor.rgb, blendFactor);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const skyGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    const skyMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        envMap: { value: cubeTexture },
        fogColor: { value: new THREE.Color(fogParamsRef.current.color) },
      },
      side: THREE.BackSide,
      fog: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyboxRef.current = skyMesh;
    sceneRef.current.add(skyMesh);
  }, [currentAtmosphere]);

  const handleGoBack = () => {
    // Kill any ongoing fog and sky animations
    if (fogTweenRef.current) fogTweenRef.current.kill();
    if (skyTweenRef.current) skyTweenRef.current.kill();

    const defaultFogParams = { color: 0x1c1c1c, near: 10, far: 50 };
    setFogParams(defaultFogParams);
    setSkyColor(0xffffff);
    setCurrentAtmosphere("foggy");

    // Update the scene fog parameters directly
    if (sceneRef.current) {
      sceneRef.current.fog = new THREE.Fog(
        defaultFogParams.color,
        defaultFogParams.near,
        defaultFogParams.far
      );
    }

    ChangeState();
  };

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
