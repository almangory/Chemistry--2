import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { 
  Flame, 
  Droplet, 
  Rotate3D, 
  Thermometer, 
  Sparkles, 
  Eye, 
  ZoomIn, 
  RotateCcw,
  Play,
  Gauge
} from "lucide-react";

export interface Lab3DProps {
  experimentId: string;
  stepIndex: number;
  apparatusType?: "beaker" | "test_tubes" | "gas_prep" | "electrolysis";
  liquidColor?: string;
  liquidHeight?: number; // 0.1 to 0.8
  isHeating?: boolean;
  isBubbling?: boolean;
  isPrecipitating?: boolean;
  isSmoking?: boolean;
  flameColor?: string;
  temperature?: number;
  phValue?: number;
  gasVolume?: number; // mL
  chemicalNote?: string;
  onActionTrigger?: (action: string) => void;
}

export const Lab3DScene: React.FC<Lab3DProps> = ({
  experimentId,
  stepIndex,
  apparatusType = "beaker",
  liquidColor = "#38bdf8",
  liquidHeight = 0.5,
  isHeating = false,
  isBubbling = false,
  isPrecipitating = false,
  isSmoking = false,
  flameColor = "#3b82f6",
  temperature = 25,
  phValue = 7,
  gasVolume = 0,
  chemicalNote,
  onActionTrigger
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Object references for real-time updates
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const flameMeshRef = useRef<THREE.Group | null>(null);
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const bubblesGroupRef = useRef<THREE.Points | null>(null);
  const smokeGroupRef = useRef<THREE.Points | null>(null);
  const precipitateGroupRef = useRef<THREE.Points | null>(null);
  const apparatusGroupRef = useRef<THREE.Group | null>(null);

  // Orbit rotation controls
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAngleRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3,
    radius: 7.5
  });

  const [currentTemp, setCurrentTemp] = useState<number>(temperature);
  const [currentPh, setCurrentPh] = useState<number>(phValue);
  const [currentGas, setCurrentGas] = useState<number>(gasVolume);

  // Sync telemetry values smoothly
  useEffect(() => {
    setCurrentTemp(temperature);
    setCurrentPh(phValue);
    setCurrentGas(gasVolume);
  }, [temperature, phValue, gasVolume, stepIndex]);

  // Update Camera Position based on spherical coordinates
  const updateCameraPos = useCallback(() => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAngleRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi) + 1.2;
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 1.2, 0);
  }, []);

  // Camera presets
  const setCameraPreset = (preset: "front" | "close" | "top" | "reset") => {
    if (preset === "front") {
      cameraAngleRef.current = { theta: 0, phi: Math.PI / 2.3, radius: 6.5 };
    } else if (preset === "close") {
      cameraAngleRef.current = { theta: 0.2, phi: Math.PI / 2.5, radius: 4.2 };
    } else if (preset === "top") {
      cameraAngleRef.current = { theta: 0, phi: Math.PI / 6, radius: 7.0 };
    } else {
      cameraAngleRef.current = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 7.5 };
    }
    updateCameraPos();
  };

  // 1. Three.js Scene Setup & Initialization
  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0F172A"); // Dark sleek laboratory space
    scene.fog = new THREE.FogExp2("#0F172A", 0.04);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPos();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Bench Surface
    const benchGeo = new THREE.BoxGeometry(12, 0.4, 8);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.1
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, -0.2, 0);
    bench.receiveShadow = true;
    scene.add(bench);

    // Bench Grid Reflection Tile Lines
    const gridHelper = new THREE.GridHelper(10, 10, 0x334155, 0x1e293b);
    gridHelper.position.set(0, 0.01, 0);
    scene.add(gridHelper);

    // Handle Window Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [updateCameraPos]);

  // 2. Build Apparatus Models depending on apparatusType
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing apparatus if any
    if (apparatusGroupRef.current) {
      scene.remove(apparatusGroupRef.current);
      apparatusGroupRef.current = null;
    }

    const appGroup = new THREE.Group();
    apparatusGroupRef.current = appGroup;

    // Glass material with high-spec physical properties
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.05,
      metalness: 0.05,
      transmission: 0.9,
      ior: 1.5,
      thickness: 0.4,
      specularColor: new THREE.Color(0xffffff),
      side: THREE.DoubleSide
    });

    // Metallic material for stands & clamps
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25
    });

    // Brass/copper for burner
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.8,
      roughness: 0.3
    });

    // --- SETUP: RETORT STAND (حامل معملي) ---
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.4), metalMat);
    standBase.position.set(-1.8, 0.05, 0);
    standBase.castShadow = true;
    appGroup.add(standBase);

    const standRod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.5, 16), metalMat);
    standRod.position.set(-1.8, 2.3, -0.4);
    standRod.castShadow = true;
    appGroup.add(standRod);

    const bossHead = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), metalMat);
    bossHead.position.set(-1.8, 2.4, -0.4);
    appGroup.add(bossHead);

    const clampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 16), metalMat);
    clampArm.rotation.z = Math.PI / 2;
    clampArm.position.set(-0.9, 2.4, -0.4);
    appGroup.add(clampArm);

    // --- SETUP: BUNSEN BURNER (موقد بنسن 3D) ---
    const burnerGroup = new THREE.Group();
    burnerGroup.position.set(0, 0, 0);

    const burnerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.15, 32), brassMat);
    burnerBase.position.set(0, 0.075, 0);
    burnerGroup.add(burnerBase);

    const burnerBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 24), metalMat);
    burnerBarrel.position.set(0, 0.7, 0);
    burnerGroup.add(burnerBarrel);

    // Bunsen Flame (Dual cones)
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 1.25, 0);

    // Inner Cone (Hot core)
    const innerFlameGeo = new THREE.ConeGeometry(0.08, 0.5, 16);
    innerFlameGeo.translate(0, 0.25, 0);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.95
    });
    const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    flameGroup.add(innerFlame);

    // Outer Cone (Color varying cone)
    const outerFlameGeo = new THREE.ConeGeometry(0.16, 0.9, 16);
    outerFlameGeo.translate(0, 0.45, 0);
    const outerFlameMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(flameColor),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
    flameGroup.add(outerFlame);

    // Flame Point Light casting glow on glassware
    const flameLight = new THREE.PointLight(new THREE.Color(flameColor), 0, 4);
    flameLight.position.set(0, 0.5, 0);
    flameGroup.add(flameLight);
    flameLightRef.current = flameLight;

    burnerGroup.add(flameGroup);
    flameMeshRef.current = flameGroup;
    appGroup.add(burnerGroup);

    // Tripod & Gauze for beaker heating
    const tripodRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 16, 32), metalMat);
    tripodRing.rotation.x = Math.PI / 2;
    tripodRing.position.set(0, 1.5, 0);
    appGroup.add(tripodRing);

    const gauze = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.02, 32), new THREE.MeshStandardMaterial({ color: 0x64748b, wireframe: true }));
    gauze.position.set(0, 1.51, 0);
    appGroup.add(gauze);

    for (let i = 0; i < 3; i++) {
      const legAngle = (i * 2 * Math.PI) / 3;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.55, 12), metalMat);
      leg.position.set(Math.cos(legAngle) * 0.85, 0.77, Math.sin(legAngle) * 0.85);
      leg.rotation.z = -Math.cos(legAngle) * 0.12;
      leg.rotation.x = Math.sin(legAngle) * 0.12;
      appGroup.add(leg);
    }

    // --- MAIN GLASS APPARATUS: BEAKER (كأس زجاجي متقن) ---
    const beakerHeight = 1.8;
    const beakerRadius = 0.8;
    const beakerGeo = new THREE.CylinderGeometry(beakerRadius, beakerRadius * 0.95, beakerHeight, 32, 1, true);
    const beakerMesh = new THREE.Mesh(beakerGeo, glassMaterial);
    beakerMesh.position.set(0, 1.52 + beakerHeight / 2, 0);
    beakerMesh.castShadow = true;
    appGroup.add(beakerMesh);

    const beakerBottom = new THREE.Mesh(new THREE.CircleGeometry(beakerRadius * 0.95, 32), glassMaterial);
    beakerBottom.rotation.x = Math.PI / 2;
    beakerBottom.position.set(0, 1.52, 0);
    appGroup.add(beakerBottom);

    // Beaker Lip/Rim
    const beakerRim = new THREE.Mesh(new THREE.TorusGeometry(beakerRadius, 0.025, 16, 32), glassMaterial);
    beakerRim.rotation.x = Math.PI / 2;
    beakerRim.position.set(0, 1.52 + beakerHeight, 0);
    appGroup.add(beakerRim);

    // Measurement lines on beaker
    for (let m = 1; m <= 4; m++) {
      const lineMesh = new THREE.Mesh(
        new THREE.RingGeometry(beakerRadius - 0.005, beakerRadius + 0.005, 32, 1, 0, Math.PI / 3),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.6, transparent: true })
      );
      lineMesh.rotation.x = Math.PI / 2;
      lineMesh.position.set(0, 1.52 + (beakerHeight * m) / 5, 0);
      appGroup.add(lineMesh);
    }

    // --- LIQUID VOLUME (السائل الكيميائي ثلاثي الأبعاد) ---
    const effectiveHeight = Math.max(0.1, Math.min(0.85, liquidHeight)) * beakerHeight;
    const liquidGeo = new THREE.CylinderGeometry(beakerRadius * 0.92, beakerRadius * 0.92, effectiveHeight, 32);
    liquidGeo.translate(0, effectiveHeight / 2, 0);

    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(liquidColor),
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.5,
      ior: 1.33
    });

    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.set(0, 1.53, 0);
    liquidMeshRef.current = liquidMesh;
    appGroup.add(liquidMesh);

    // --- 3D PARTICLE SYSTEMS: BUBBLES (فقاعات الغاز المتصاعدة) ---
    const bubbleCount = 70;
    const bubbleGeo = new THREE.BufferGeometry();
    const bubblePositions = new Float32Array(bubbleCount * 3);
    const bubbleSpeeds = new Float32Array(bubbleCount);

    for (let b = 0; b < bubbleCount; b++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * (beakerRadius * 0.7);
      bubblePositions[b * 3] = Math.cos(angle) * r;
      bubblePositions[b * 3 + 1] = 1.54 + Math.random() * effectiveHeight;
      bubblePositions[b * 3 + 2] = Math.sin(angle) * r;
      bubbleSpeeds[b] = 0.015 + Math.random() * 0.025;
    }
    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
    bubbleGeo.setAttribute("speed", new THREE.BufferAttribute(bubbleSpeeds, 1));

    const bubbleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    bubbles.visible = isBubbling || isHeating;
    bubblesGroupRef.current = bubbles;
    appGroup.add(bubbles);

    // --- 3D PARTICLE SYSTEMS: SMOKE / STEAM (الأبخرة والدخان) ---
    const smokeCount = 45;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(smokeCount * 3);
    for (let s = 0; s < smokeCount; s++) {
      smokePos[s * 3] = (Math.random() - 0.5) * 0.6;
      smokePos[s * 3 + 1] = 1.52 + beakerHeight + Math.random() * 2.5;
      smokePos[s * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xe2e8f0,
      size: 0.18,
      transparent: true,
      opacity: 0.35,
      blending: THREE.NormalBlending
    });
    const smoke = new THREE.Points(smokeGeo, smokeMat);
    smoke.visible = isSmoking || isHeating;
    smokeGroupRef.current = smoke;
    appGroup.add(smoke);

    // --- SECONDARY APPARATUS: TEST TUBES RACK (حامل أنابيب المقارنة) ---
    if (apparatusType === "test_tubes") {
      const rackGroup = new THREE.Group();
      rackGroup.position.set(2.4, 0, 0);

      // Wooden rack base & uprights
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.6 });
      const rackBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 0.9), woodMat);
      rackBase.position.set(0, 0.075, 0);
      rackGroup.add(rackBase);

      const rackTop = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 0.9), woodMat);
      rackTop.position.set(0, 1.4, 0);
      rackGroup.add(rackTop);

      for (let side = -1; side <= 1; side += 2) {
        const upright = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.8), woodMat);
        upright.position.set(side * 1.05, 0.7, 0);
        rackGroup.add(upright);
      }

      // 3 Test tubes in rack
      for (let t = -1; t <= 1; t++) {
        const tubeGroup = new THREE.Group();
        tubeGroup.position.set(t * 0.6, 0.4, 0);

        const tubeGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.6, 24, 1, true);
        const tubeMesh = new THREE.Mesh(tubeGeo, glassMaterial);
        tubeMesh.position.set(0, 0.8, 0);
        tubeGroup.add(tubeMesh);

        const tubeCap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glassMaterial);
        tubeCap.position.set(0, 0, 0);
        tubeGroup.add(tubeCap);

        // Tube liquid
        const tLiquidColors = ["#f43f5e", "#10b981", "#8b5cf6"];
        const tLiquidGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.8, 24);
        tLiquidGeo.translate(0, 0.4, 0);
        const tLiquidMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(tLiquidColors[t + 1]),
          transparent: true,
          opacity: 0.8
        });
        const tLiquidMesh = new THREE.Mesh(tLiquidGeo, tLiquidMat);
        tubeGroup.add(tLiquidMesh);

        rackGroup.add(tubeGroup);
      }
      appGroup.add(rackGroup);
    }

    // --- SECONDARY APPARATUS: GAS COLLECTION TROUGH (حوض جمع الغاز) ---
    if (apparatusType === "gas_prep") {
      const troughGroup = new THREE.Group();
      troughGroup.position.set(2.8, 0, 0);

      // Glass trough
      const trough = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 1.4), glassMaterial);
      trough.position.set(0, 0.4, 0);
      troughGroup.add(trough);

      // Water in trough
      const troughWater = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.5, 1.3),
        new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transparent: true, opacity: 0.65, transmission: 0.8 })
      );
      troughWater.position.set(0, 0.28, 0);
      troughGroup.add(troughWater);

      // Inverted graduated gas jar collecting gas
      const gasJar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 24), glassMaterial);
      gasJar.position.set(0, 0.9, 0);
      troughGroup.add(gasJar);

      // Glass delivery tube connecting beaker/flask to trough
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.52 + beakerHeight, 0),
        new THREE.Vector3(0.5, 3.4, 0),
        new THREE.Vector3(1.8, 3.2, 0),
        new THREE.Vector3(2.8, 0.4, 0)
      ]);
      const tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.04, 12, false);
      const deliveryTube = new THREE.Mesh(tubeGeometry, glassMaterial);
      appGroup.add(deliveryTube);

      appGroup.add(troughGroup);
    }

    scene.add(appGroup);
  }, [apparatusType, liquidColor, liquidHeight, flameColor, isHeating, isBubbling, isSmoking]);

  // 3. Dynamic Animation Loop
  useEffect(() => {
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Flame flicker & pulsing light
      if (flameMeshRef.current) {
        if (isHeating) {
          flameMeshRef.current.visible = true;
          const flicker = 1.0 + Math.sin(elapsedTime * 25) * 0.08 + Math.cos(elapsedTime * 40) * 0.05;
          flameMeshRef.current.scale.set(flicker, flicker * 1.05, flicker);
          if (flameLightRef.current) {
            flameLightRef.current.intensity = 2.5 + Math.sin(elapsedTime * 30) * 0.6;
          }
        } else {
          flameMeshRef.current.visible = false;
          if (flameLightRef.current) flameLightRef.current.intensity = 0;
        }
      }

      // Bubbles rising animation
      if (bubblesGroupRef.current && bubblesGroupRef.current.visible) {
        const positions = bubblesGroupRef.current.geometry.attributes.position.array as Float32Array;
        const speeds = bubblesGroupRef.current.geometry.attributes.speed.array as Float32Array;
        const count = positions.length / 3;

        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += speeds[i];
          // Wobble slightly
          positions[i * 3] += Math.sin(elapsedTime * 5 + i) * 0.003;
          // Reset to bottom when reaching top
          if (positions[i * 3 + 1] > 1.54 + liquidHeight * 1.8) {
            positions[i * 3 + 1] = 1.55;
          }
        }
        bubblesGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smoke rising & spreading
      if (smokeGroupRef.current && smokeGroupRef.current.visible) {
        const sPos = smokeGroupRef.current.geometry.attributes.position.array as Float32Array;
        const sCount = sPos.length / 3;
        for (let s = 0; s < sCount; s++) {
          sPos[s * 3 + 1] += 0.015;
          sPos[s * 3] += Math.sin(elapsedTime * 2 + s) * 0.005;
          if (sPos[s * 3 + 1] > 4.5) {
            sPos[s * 3 + 1] = 3.32;
            sPos[s * 3] = (Math.random() - 0.5) * 0.4;
          }
        }
        smokeGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Render Scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isHeating, liquidHeight]);

  // 4. Mouse Orbit Interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    cameraAngleRef.current.theta -= deltaX * 0.008;
    cameraAngleRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2.05, cameraAngleRef.current.phi - deltaY * 0.008));
    updateCameraPos();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraAngleRef.current.radius = Math.max(3.5, Math.min(12, cameraAngleRef.current.radius + e.deltaY * 0.005));
    updateCameraPos();
  };

  return (
    <div className="relative w-full h-[450px] sm:h-[480px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* 🎮 3D Camera Controls & Presets (Top Left) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg text-[10px] text-slate-200">
        <span className="text-[9px] text-slate-400 font-bold px-1 flex items-center gap-1">
          <Rotate3D className="w-3 h-3 text-emerald-400" />
          <span>زوايا الكاميرا 3D:</span>
        </span>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setCameraPreset("front")}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold transition-colors cursor-pointer"
          >
            أمامي
          </button>
          <button
            onClick={() => setCameraPreset("close")}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold transition-colors cursor-pointer"
          >
            مقرب
          </button>
          <button
            onClick={() => setCameraPreset("top")}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold transition-colors cursor-pointer"
          >
            علوي
          </button>
          <button
            onClick={() => setCameraPreset("reset")}
            className="px-2 py-1 bg-emerald-800/80 hover:bg-emerald-700 rounded text-emerald-100 font-bold transition-colors cursor-pointer flex items-center justify-center gap-0.5"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>افتراضي</span>
          </button>
        </div>
      </div>

      {/* 🧭 Telemetry HUD: Temperature, pH & Gas Sensor Meters (Top Right) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 shadow-lg text-right min-w-[150px]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
            <Thermometer className="w-3.5 h-3.5" />
            <span>الحرارة:</span>
          </div>
          <span className="font-mono text-xs font-bold text-slate-100">
            {currentTemp}°C
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-purple-400">
            <Droplet className="w-3.5 h-3.5" />
            <span>الرقم الهيدروجيني:</span>
          </div>
          <span className={`font-mono text-xs font-bold ${currentPh > 7 ? "text-blue-400" : currentPh < 7 ? "text-rose-400" : "text-emerald-400"}`}>
            pH {currentPh.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-[11px] font-bold text-sky-400">
            <Gauge className="w-3.5 h-3.5" />
            <span>الغاز المتجمع:</span>
          </div>
          <span className="font-mono text-xs font-bold text-slate-100">
            {currentGas} mL
          </span>
        </div>
      </div>

      {/* 🔬 Live Chemical State & Note Badge (Bottom Center) */}
      {chemicalNote && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 max-w-md w-[90%] bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/40 text-center shadow-xl">
          <span className="text-xs text-emerald-300 font-bold font-sans flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{chemicalNote}</span>
          </span>
        </div>
      )}

      {/* 🧪 Laboratory Action Triggers (Bottom Bar) */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80">
        <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
          💡 يمكنك النقر والسحب بالماوس لتدوير المعمل 360°، وعجلة الماوس للتقريب
        </span>

        <div className="flex items-center gap-1.5 mr-auto">
          {onActionTrigger && (
            <>
              <button
                onClick={() => onActionTrigger("add_reagent")}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
              >
                <Droplet className="w-3 h-3" />
                <span>إضافة الكاشف</span>
              </button>

              <button
                onClick={() => onActionTrigger("toggle_heat")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm ${
                  isHeating
                    ? "bg-rose-600 text-white hover:bg-rose-500"
                    : "bg-amber-600 text-white hover:bg-amber-500"
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>{isHeating ? "إطفاء الموقد" : "إشعال بنسن"}</span>
              </button>

              <button
                onClick={() => onActionTrigger("stir")}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>رج المحلول</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
