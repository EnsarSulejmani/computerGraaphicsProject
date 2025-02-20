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
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const skyboxRef = useRef<THREE.Mesh | null>(null);

  // --- Preload models ---
  const modelsRef = useRef<{ [key: string]: THREE.Object3D }>({});
  const currentModelRef = useRef<THREE.Object3D | null>(null);

  // --- Preload skybox textures ---
  // This will store CubeTextures for each atmosphere: "foggy", "sunny", "sunset"
  const skyboxTexturesRef = useRef<{ [key: string]: THREE.CubeTexture }>({});

  // Preload skybox textures on mount.
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

  // GSAP tween references to manage concurrent animations.
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

  // --- Preload models on mount ---
  useEffect(() => {
    const loader = new GLTFLoader();
    const modelsToLoad = ["Asian", "Classic", "Modern"];
    modelsToLoad.forEach((modelName) => {
      let path = "";
      switch (modelName) {
        case "Asian":
          path = "/objects/asian/scene.gltf";
          break;
        case "Classic":
          path = "/objects/small_brick_house/scene.gltf";
          break;
        case "Modern":
          path = "/objects/modern/scene.gltf";
          break;
        default:
          break;
      }
      loader.load(path, (gltf) => {
        modelsRef.current[modelName] = gltf.scene;
        console.log(`${modelName} model loaded.`);
      });
    });
  }, []);

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

    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;
    mountRef.current.addEventListener("click", () => controls.lock());

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

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // --- Update model when modelToRender changes ---
  useEffect(() => {
    if (!sceneRef.current) return;
    // Remove the current model if present.
    if (currentModelRef.current) {
      sceneRef.current.remove(currentModelRef.current);
      currentModelRef.current = null;
    }
    // Retrieve the preloaded model.
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

  // --- Atmosphere (fog/sky) change functions with tween cancellation ---
  const changeAtmosphereToFog = () => {
    // Kill any existing tweens.
    if (fogTweenRef.current) fogTweenRef.current.kill();
    if (skyTweenRef.current) skyTweenRef.current.kill();

    const currentFogColor = new THREE.Color(fogParamsRef.current.color);
    const targetFogColor = new THREE.Color(0x1c1c1c);
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

    skyTweenRef.current = gsap.to(skyObject, {
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

  const changeAtmosphereToSunny = () => {
    if (fogTweenRef.current) fogTweenRef.current.kill();
    if (skyTweenRef.current) skyTweenRef.current.kill();

    const targetFogColor = new THREE.Color(0x87ceeb);
    const currentFogColor = new THREE.Color(fogParamsRef.current.color);
    const fogObject = {
      r: currentFogColor.r,
      g: currentFogColor.g,
      b: currentFogColor.b,
      near: fogParamsRef.current.near,
      far: fogParamsRef.current.far,
    };

    fogTweenRef.current = gsap.to(fogObject, {
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

    skyTweenRef.current = gsap.to(skyObject, {
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

  const changeAtmosphereToSunset = () => {
    if (fogTweenRef.current) fogTweenRef.current.kill();
    if (skyTweenRef.current) skyTweenRef.current.kill();

    const targetFogColor = new THREE.Color(0xffa500);
    const currentFogColor = new THREE.Color(fogParamsRef.current.color);
    const fogObject = {
      r: currentFogColor.r,
      g: currentFogColor.g,
      b: currentFogColor.b,
      near: fogParamsRef.current.near,
      far: fogParamsRef.current.far,
    };

    fogTweenRef.current = gsap.to(fogObject, {
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

    skyTweenRef.current = gsap.to(skyObject, {
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

  // --- Update skybox when currentAtmosphere changes ---
  useEffect(() => {
    if (!sceneRef.current) return;
    // Use the preloaded cube texture if available.
    const cubeTexture = skyboxTexturesRef.current[currentAtmosphere];
    if (!cubeTexture) return; // Texture might not have loaded yet.

    // Remove previous skybox if present.
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
    setFogParams({ color: 0x1c1c1c, near: 10, far: 50 });
    setSkyColor(0xffffff);
    setCurrentAtmosphere("foggy");
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
