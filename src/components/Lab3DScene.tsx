import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { 
  Flame, 
  Droplet, 
  Rotate3D, 
  Thermometer, 
  Sparkles, 
  RotateCcw,
  Gauge,
  Maximize2,
  Minimize2,
  Scale,
  Magnet,
  Zap,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle2
} from "lucide-react";

export interface Lab3DProps {
  experimentId: string;
  stepIndex: number;
  apparatusType?: "beaker" | "test_tubes" | "gas_prep" | "electrolysis" | "magnetic_balance";
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
  apparentWeight?: number; // g
  magneticFieldOn?: boolean;
  activeSubstance?: string;
  chemicalNote?: string;
  scientificObservation?: string;
  scientificReason?: string;
  experimentTitle?: string;
  unitName?: string;
  totalSteps?: number;
  onNextStep?: () => void;
  onPrevStep?: () => void;
  onReset?: () => void;
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
  apparentWeight,
  magneticFieldOn = false,
  activeSubstance,
  chemicalNote,
  scientificObservation,
  scientificReason,
  experimentTitle,
  unitName,
  totalSteps = 4,
  onNextStep,
  onPrevStep,
  onReset,
  onActionTrigger
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isModalFullscreen, setIsModalFullscreen] = useState<boolean>(false);
  const [showReflectionDrawer, setShowReflectionDrawer] = useState<boolean>(true);

  // Object references for real-time updates
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const flameMeshRef = useRef<THREE.Group | null>(null);
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const bubblesGroupRef = useRef<THREE.Points | null>(null);
  const smokeGroupRef = useRef<THREE.Points | null>(null);
  const apparatusGroupRef = useRef<THREE.Group | null>(null);
  const magneticFieldGroupRef = useRef<THREE.Group | null>(null);
  const sampleTubeGroupRef = useRef<THREE.Group | null>(null);
  const balanceBeamRef = useRef<THREE.Mesh | null>(null);

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
  const [currentWeight, setCurrentWeight] = useState<number | undefined>(apparentWeight);

  // Sync telemetry values smoothly
  useEffect(() => {
    setCurrentTemp(temperature);
    setCurrentPh(phValue);
    setCurrentGas(gasVolume);
    setCurrentWeight(apparentWeight);
  }, [temperature, phValue, gasVolume, apparentWeight, stepIndex]);

  // Fullscreen Toggle
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else {
          setIsModalFullscreen(prev => !prev);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
        setIsModalFullscreen(false);
      }
    } catch {
      setIsModalFullscreen(prev => !prev);
    }
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active) setIsModalFullscreen(false);
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 80);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalFullscreen) {
        setIsModalFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalFullscreen]);

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
    scene.background = new THREE.Color("#0B1329"); // Deep sleek laboratory background
    scene.fog = new THREE.FogExp2("#0B1329", 0.035);
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
    renderer.toneMappingExposure = 1.15;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.85);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Bench Surface
    const benchGeo = new THREE.BoxGeometry(14, 0.4, 9);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.15
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, -0.2, 0);
    bench.receiveShadow = true;
    scene.add(bench);

    // Bench Grid Reflection Tile Lines
    const gridHelper = new THREE.GridHelper(12, 12, 0x334155, 0x1e293b);
    gridHelper.position.set(0, 0.01, 0);
    scene.add(gridHelper);

    // Handle Resize with ResizeObserver
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(mountRef.current);
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
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

    // Metallic material for stands & frames
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25
    });

    const darkIronMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.3
    });

    // Brass/copper material
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.8,
      roughness: 0.3
    });

    // ==============================================================
    // 🧲 CASE A: GOUY MAGNETIC BALANCE & ELECTROMAGNET (ميزان غوي والمغناطيس)
    // ==============================================================
    if (apparatusType === "magnetic_balance") {
      const magnetBalanceGroup = new THREE.Group();

      // 1. Heavy Electromagnet U-Yoke Frame
      const yokeBase = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.45, 1.8), darkIronMat);
      yokeBase.position.set(0, 0.225, 0);
      yokeBase.castShadow = true;
      magnetBalanceGroup.add(yokeBase);

      // Left & Right Core Pillars
      const pillarGeo = new THREE.CylinderGeometry(0.48, 0.48, 2.2, 32);
      const leftPillar = new THREE.Mesh(pillarGeo, darkIronMat);
      leftPillar.position.set(-1.4, 1.35, 0);
      magnetBalanceGroup.add(leftPillar);

      const rightPillar = new THREE.Mesh(pillarGeo, darkIronMat);
      rightPillar.position.set(1.4, 1.35, 0);
      magnetBalanceGroup.add(rightPillar);

      // Copper Windings / Coils
      const coilGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.5, 32);
      const leftCoil = new THREE.Mesh(coilGeo, copperMat);
      leftCoil.position.set(-1.4, 1.35, 0);
      magnetBalanceGroup.add(leftCoil);

      const rightCoil = new THREE.Mesh(coilGeo, copperMat);
      rightCoil.position.set(1.4, 1.35, 0);
      magnetBalanceGroup.add(rightCoil);

      // Tapered Pole Shoes facing each other
      const poleGeo = new THREE.BoxGeometry(0.7, 0.8, 0.8);
      const leftPole = new THREE.Mesh(poleGeo, darkIronMat);
      leftPole.position.set(-0.85, 2.1, 0);
      magnetBalanceGroup.add(leftPole);

      // Pole Markers: North (Red) & South (Blue)
      const nMarker = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      nMarker.position.set(-0.5, 2.1, 0);
      magnetBalanceGroup.add(nMarker);

      const rightPole = new THREE.Mesh(poleGeo, darkIronMat);
      rightPole.position.set(0.85, 2.1, 0);
      magnetBalanceGroup.add(rightPole);

      const sMarker = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
      sMarker.position.set(0.5, 2.1, 0);
      magnetBalanceGroup.add(sMarker);

      // Glowing Magnetic Flux Field Lines (Between poles)
      const fieldGroup = new THREE.Group();
      fieldGroup.position.set(0, 2.1, 0);
      for (let f = 0; f < 5; f++) {
        const ringGeo = new THREE.TorusGeometry(0.35 + f * 0.05, 0.015, 12, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(0, (f - 2) * 0.1, 0);
        fieldGroup.add(ring);
      }
      fieldGroup.visible = !!magneticFieldOn;
      magneticFieldGroupRef.current = fieldGroup;
      magnetBalanceGroup.add(fieldGroup);

      // 2. Overhead Gouy Analytical Balance
      // Vertical Tower Pillar
      const towerPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4.4, 16), metalMat);
      towerPillar.position.set(-2.2, 2.4, -0.6);
      magnetBalanceGroup.add(towerPillar);

      // Top Crossbar
      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.08), metalMat);
      crossbar.position.set(-1.1, 4.6, -0.3);
      crossbar.rotation.y = -Math.PI / 8;
      magnetBalanceGroup.add(crossbar);

      // Central Balance Knife-Edge Fulcrum
      const fulcrum = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 16), metalMat);
      fulcrum.position.set(-0.6, 4.5, 0);
      magnetBalanceGroup.add(fulcrum);

      // Balance Beam (Lever)
      const beam = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.06, 0.06), metalMat);
      beam.position.set(-0.6, 4.6, 0);
      balanceBeamRef.current = beam;
      magnetBalanceGroup.add(beam);

      // Left Counterweight Pan
      const leftWire = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.8, 8), metalMat);
      leftWire.position.set(-1.9, 3.7, 0);
      magnetBalanceGroup.add(leftWire);

      const leftPan = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 0.05, 24), metalMat);
      leftPan.position.set(-1.9, 2.8, 0);
      magnetBalanceGroup.add(leftPan);

      // Small reference brass weights on pan
      const weight1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16), copperMat);
      weight1.position.set(-1.9, 2.92, 0);
      magnetBalanceGroup.add(weight1);

      // 3. Right Suspended Sample Tube (Hanging right into magnetic gap!)
      const sampleGroup = new THREE.Group();
      sampleGroup.position.set(0, 0, 0);
      sampleTubeGroupRef.current = sampleGroup;

      // Suspension wire from beam right tip (x = 0.7) down into magnetic gap
      const rightWire = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.5, 8), metalMat);
      rightWire.position.set(0.7, 3.35, 0);
      sampleGroup.add(rightWire);

      // Hook connecting to sample tube
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16), metalMat);
      hook.position.set(0.7, 2.7, 0);
      sampleGroup.add(hook);

      // Glass Sample Tube
      const tubeHeight = 1.3;
      const tubeRadius = 0.14;
      const sampleTube = new THREE.Mesh(new THREE.CylinderGeometry(tubeRadius, tubeRadius, tubeHeight, 24, 1, true), glassMaterial);
      sampleTube.position.set(0.7, 2.05, 0);
      sampleGroup.add(sampleTube);

      const tubeBottom = new THREE.Mesh(new THREE.SphereGeometry(tubeRadius, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glassMaterial);
      tubeBottom.position.set(0.7, 2.05 - tubeHeight / 2, 0);
      sampleGroup.add(tubeBottom);

      // Sample substance filling inside tube
      const sampleColorHex = activeSubstance === "FeSO4" ? 0x10b981 : activeSubstance === "CuSO4" ? 0x0284c7 : 0xf8fafc;
      const sampleMat = new THREE.MeshStandardMaterial({
        color: sampleColorHex,
        roughness: 0.5,
        metalness: 0.1
      });
      const sampleFilling = new THREE.Mesh(new THREE.CylinderGeometry(tubeRadius * 0.88, tubeRadius * 0.88, tubeHeight * 0.8, 24), sampleMat);
      sampleFilling.position.set(0.7, 2.0, 0);
      sampleGroup.add(sampleFilling);

      magnetBalanceGroup.add(sampleGroup);

      // Digital Balance Display Box on the bench
      const displayBox = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.0), darkIronMat);
      displayBox.position.set(-2.2, 0.3, 1.2);
      magnetBalanceGroup.add(displayBox);

      const screenMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 0.35),
        new THREE.MeshBasicMaterial({ color: 0x0f172a })
      );
      screenMesh.position.set(-2.2, 0.35, 1.71);
      screenMesh.rotation.x = -Math.PI / 12;
      magnetBalanceGroup.add(screenMesh);

      appGroup.add(magnetBalanceGroup);

    } else {
      // ==============================================================
      // 🧪 STANDARD BEAKER / BURNER / RACK / GAS PREP APPARATUS
      // ==============================================================

      // Retort stand
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.4), metalMat);
      standBase.position.set(-1.8, 0.05, 0);
      standBase.castShadow = true;
      appGroup.add(standBase);

      const standRod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.5, 16), metalMat);
      standRod.position.set(-1.8, 2.3, -0.4);
      appGroup.add(standRod);

      const bossHead = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), metalMat);
      bossHead.position.set(-1.8, 2.4, -0.4);
      appGroup.add(bossHead);

      const clampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 16), metalMat);
      clampArm.rotation.z = Math.PI / 2;
      clampArm.position.set(-0.9, 2.4, -0.4);
      appGroup.add(clampArm);

      // Bunsen Burner
      const burnerGroup = new THREE.Group();
      burnerGroup.position.set(0, 0, 0);

      const burnerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.15, 32), copperMat);
      burnerBase.position.set(0, 0.075, 0);
      burnerGroup.add(burnerBase);

      const burnerBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 24), metalMat);
      burnerBarrel.position.set(0, 0.7, 0);
      burnerGroup.add(burnerBarrel);

      // Bunsen Flame
      const flameGroup = new THREE.Group();
      flameGroup.position.set(0, 1.25, 0);

      const innerFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.5, 16),
        new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.95 })
      );
      innerFlame.geometry.translate(0, 0.25, 0);
      flameGroup.add(innerFlame);

      const outerFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.16, 0.9, 16),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(flameColor), transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
      );
      outerFlame.geometry.translate(0, 0.45, 0);
      flameGroup.add(outerFlame);

      const flameLight = new THREE.PointLight(new THREE.Color(flameColor), 0, 4);
      flameLight.position.set(0, 0.5, 0);
      flameGroup.add(flameLight);
      flameLightRef.current = flameLight;

      burnerGroup.add(flameGroup);
      flameMeshRef.current = flameGroup;
      appGroup.add(burnerGroup);

      // Tripod & Gauze
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

      // Beaker Glassware
      const beakerHeight = 1.8;
      const beakerRadius = 0.8;
      const beakerMesh = new THREE.Mesh(new THREE.CylinderGeometry(beakerRadius, beakerRadius * 0.95, beakerHeight, 32, 1, true), glassMaterial);
      beakerMesh.position.set(0, 1.52 + beakerHeight / 2, 0);
      appGroup.add(beakerMesh);

      const beakerBottom = new THREE.Mesh(new THREE.CircleGeometry(beakerRadius * 0.95, 32), glassMaterial);
      beakerBottom.rotation.x = Math.PI / 2;
      beakerBottom.position.set(0, 1.52, 0);
      appGroup.add(beakerBottom);

      const beakerRim = new THREE.Mesh(new THREE.TorusGeometry(beakerRadius, 0.025, 16, 32), glassMaterial);
      beakerRim.rotation.x = Math.PI / 2;
      beakerRim.position.set(0, 1.52 + beakerHeight, 0);
      appGroup.add(beakerRim);

      // Measurement lines
      for (let m = 1; m <= 4; m++) {
        const lineMesh = new THREE.Mesh(
          new THREE.RingGeometry(beakerRadius - 0.005, beakerRadius + 0.005, 32, 1, 0, Math.PI / 3),
          new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.6, transparent: true })
        );
        lineMesh.rotation.x = Math.PI / 2;
        lineMesh.position.set(0, 1.52 + (beakerHeight * m) / 5, 0);
        appGroup.add(lineMesh);
      }

      // Liquid Volume
      const effectiveHeight = Math.max(0.1, Math.min(0.85, liquidHeight)) * beakerHeight;
      const liquidGeo = new THREE.CylinderGeometry(beakerRadius * 0.92, beakerRadius * 0.92, effectiveHeight, 32);
      liquidGeo.translate(0, effectiveHeight / 2, 0);
      const liquidMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(liquidColor),
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        transmission: 0.5,
        ior: 1.33
      });
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
      liquidMesh.position.set(0, 1.53, 0);
      liquidMeshRef.current = liquidMesh;
      appGroup.add(liquidMesh);

      // Bubbles Particle System
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
      const bubbles = new THREE.Points(
        bubbleGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })
      );
      bubbles.visible = isBubbling || isHeating;
      bubblesGroupRef.current = bubbles;
      appGroup.add(bubbles);

      // Smoke Particle System
      const smokeCount = 45;
      const smokeGeo = new THREE.BufferGeometry();
      const smokePos = new Float32Array(smokeCount * 3);
      for (let s = 0; s < smokeCount; s++) {
        smokePos[s * 3] = (Math.random() - 0.5) * 0.6;
        smokePos[s * 3 + 1] = 1.52 + beakerHeight + Math.random() * 2.5;
        smokePos[s * 3 + 2] = (Math.random() - 0.5) * 0.6;
      }
      smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3));
      const smoke = new THREE.Points(
        smokeGeo,
        new THREE.PointsMaterial({ color: 0xe2e8f0, size: 0.18, transparent: true, opacity: 0.35 })
      );
      smoke.visible = isSmoking || isHeating;
      smokeGroupRef.current = smoke;
      appGroup.add(smoke);

      // Secondary apparatus: Gas prep trough
      if (apparatusType === "gas_prep") {
        const troughGroup = new THREE.Group();
        troughGroup.position.set(2.8, 0, 0);

        const trough = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 1.4), glassMaterial);
        trough.position.set(0, 0.4, 0);
        troughGroup.add(trough);

        const troughWater = new THREE.Mesh(
          new THREE.BoxGeometry(2.1, 0.5, 1.3),
          new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transparent: true, opacity: 0.65, transmission: 0.8 })
        );
        troughWater.position.set(0, 0.28, 0);
        troughGroup.add(troughWater);

        const gasJar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 24), glassMaterial);
        gasJar.position.set(0, 0.9, 0);
        troughGroup.add(gasJar);

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

      // Secondary apparatus: Test tubes rack
      if (apparatusType === "test_tubes") {
        const rackGroup = new THREE.Group();
        rackGroup.position.set(2.4, 0, 0);

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

        const tLiquidColors = ["#f43f5e", "#10b981", "#8b5cf6"];
        for (let t = -1; t <= 1; t++) {
          const tubeGroup = new THREE.Group();
          tubeGroup.position.set(t * 0.6, 0.4, 0);

          const tubeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.6, 24, 1, true), glassMaterial);
          tubeMesh.position.set(0, 0.8, 0);
          tubeGroup.add(tubeMesh);

          const tubeCap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glassMaterial);
          tubeCap.position.set(0, 0, 0);
          tubeGroup.add(tubeCap);

          const tLiquidGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.8, 24);
          tLiquidGeo.translate(0, 0.4, 0);
          const tLiquidMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(tLiquidColors[t + 1]), transparent: true, opacity: 0.8 });
          tubeGroup.add(new THREE.Mesh(tLiquidGeo, tLiquidMat));

          rackGroup.add(tubeGroup);
        }
        appGroup.add(rackGroup);
      }
    }

    scene.add(appGroup);
  }, [apparatusType, liquidColor, liquidHeight, flameColor, isHeating, isBubbling, isSmoking, magneticFieldOn, activeSubstance]);

  // 3. Dynamic Animation Loop
  useEffect(() => {
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Flame flicker
      if (flameMeshRef.current) {
        if (isHeating) {
          flameMeshRef.current.visible = true;
          const flicker = 1.0 + Math.sin(elapsedTime * 25) * 0.08 + Math.cos(elapsedTime * 40) * 0.05;
          flameMeshRef.current.scale.set(flicker, flicker * 1.05, flicker);
          if (flameLightRef.current) flameLightRef.current.intensity = 2.5 + Math.sin(elapsedTime * 30) * 0.6;
        } else {
          flameMeshRef.current.visible = false;
          if (flameLightRef.current) flameLightRef.current.intensity = 0;
        }
      }

      // Magnetic field pulsing & Sample Tube physical deflection
      if (apparatusType === "magnetic_balance") {
        if (magneticFieldGroupRef.current) {
          magneticFieldGroupRef.current.visible = !!magneticFieldOn;
          if (magneticFieldOn) {
            const pulse = 0.5 + Math.sin(elapsedTime * 8) * 0.25;
            magneticFieldGroupRef.current.children.forEach((child) => {
              const mesh = child as THREE.Mesh;
              if (mesh.material && (mesh.material as THREE.Material).opacity !== undefined) {
                (mesh.material as THREE.MeshBasicMaterial).opacity = pulse;
              }
            });
          }
        }

        // Deflect sample tube & balance beam according to substance and magnetism!
        if (sampleTubeGroupRef.current && balanceBeamRef.current) {
          let targetDeflection = 0;
          let beamTilt = 0;

          if (magneticFieldOn) {
            if (activeSubstance === "FeSO4") {
              // Strong paramagnetism (4 unpaired electrons): Pulls down hard!
              targetDeflection = -0.22;
              beamTilt = -0.06;
            } else if (activeSubstance === "CuSO4") {
              // Moderate paramagnetism (1 unpaired electron): Pulls down slightly
              targetDeflection = -0.10;
              beamTilt = -0.03;
            } else if (activeSubstance === "ZnCl2") {
              // Diamagnetism (0 unpaired electrons): Repels upwards slightly!
              targetDeflection = 0.07;
              beamTilt = 0.02;
            }
          }

          // Smooth interpolation
          sampleTubeGroupRef.current.position.y += (targetDeflection - sampleTubeGroupRef.current.position.y) * 0.1;
          balanceBeamRef.current.rotation.z += (beamTilt - balanceBeamRef.current.rotation.z) * 0.1;
        }
      }

      // Bubbles animation
      if (bubblesGroupRef.current && bubblesGroupRef.current.visible) {
        const positions = bubblesGroupRef.current.geometry.attributes.position.array as Float32Array;
        const speeds = bubblesGroupRef.current.geometry.attributes.speed.array as Float32Array;
        const count = positions.length / 3;

        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += speeds[i];
          positions[i * 3] += Math.sin(elapsedTime * 5 + i) * 0.003;
          if (positions[i * 3 + 1] > 1.54 + liquidHeight * 1.8) {
            positions[i * 3 + 1] = 1.55;
          }
        }
        bubblesGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smoke animation
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
  }, [isHeating, liquidHeight, magneticFieldOn, activeSubstance, apparatusType]);

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

  const isFullView = isFullscreen || isModalFullscreen;

  return (
    <div
      ref={containerRef}
      className={
        isFullView
          ? "fixed inset-0 z-50 w-screen h-screen bg-slate-950 flex flex-col select-none overflow-hidden"
          : "relative w-full h-[470px] sm:h-[500px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none"
      }
    >
      {/* 🌟 Top Navigation Bar in Fullscreen Mode */}
      {isFullView && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-slate-800 text-slate-100 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="خروج من وضع ملء الشاشة (Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>خروج من ملء الشاشة</span>
            </button>

            {onReset && (
              <button
                onClick={onReset}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة البدء</span>
              </button>
            )}
          </div>

          <div className="text-center">
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{experimentTitle || "المختبر الافتراضي ثلاثي الأبعاد 3D"}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                الخطوة {stepIndex + 1} من {totalSteps}
              </span>
            </h2>
            {unitName && <p className="text-[11px] text-amber-400 font-medium">{unitName}</p>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReflectionDrawer(prev => !prev)}
              className={
                showReflectionDrawer
                  ? "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border bg-indigo-600 text-white border-indigo-500"
                  : "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showReflectionDrawer ? "إخفاء لوحة الانعكاس" : "إظهار لوحة الانعكاس"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full flex-1 cursor-grab active:cursor-grabbing relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* 🎮 3D Camera Controls & Presets (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg text-[10px] text-slate-200">
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

      {/* 🧭 Telemetry HUD & Fullscreen Trigger (Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 shadow-lg text-right min-w-[160px]">
        {/* Fullscreen Button in non-fullscreen mode */}
        {!isFullView && (
          <button
            onClick={toggleFullscreen}
            className="w-full mb-1 py-1.5 px-2.5 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm border border-indigo-400/30"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>تكبير ملء الشاشة</span>
          </button>
        )}

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
          <span className={"font-mono text-xs font-bold " + (currentPh > 7 ? "text-blue-400" : currentPh < 7 ? "text-rose-400" : "text-emerald-400")}>
            pH {currentPh.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-sky-400">
            <Gauge className="w-3.5 h-3.5" />
            <span>الغاز المتجمع:</span>
          </div>
          <span className="font-mono text-xs font-bold text-slate-100">
            {currentGas} mL
          </span>
        </div>

        {/* ⚖️ Gouy Magnetic Balance Weight / Telemetry */}
        {currentWeight !== undefined && (
          <div className="flex items-center justify-between gap-3 pt-0.5 animate-pulse">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <Scale className="w-3.5 h-3.5" />
              <span>الوزن الحساس:</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-300">
              {currentWeight.toFixed(2)} g
            </span>
          </div>
        )}

        {/* Magnet State Tag */}
        {apparatusType === "magnetic_balance" && (
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-[10px]">
            <span className="text-slate-400">المغناطيس:</span>
            <span className={"font-bold px-1.5 py-0.5 rounded " + (magneticFieldOn ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "bg-slate-800 text-slate-400")}>
              {magneticFieldOn ? "مشغل ⚡" : "مطفأ"}
            </span>
          </div>
        )}
      </div>

      {/* 🌟 Floating Live Reflection Drawer (In Fullscreen Mode or on request) */}
      {isFullView && showReflectionDrawer && (
        <div className="absolute top-16 right-3 max-w-sm w-[92%] sm:w-96 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-indigo-500/30 text-right shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>انعكاس ومشاهدة الخطوة الحالية</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold">
              الخطوة {stepIndex + 1}
            </span>
          </div>

          {scientificObservation && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 block">🔬 المشاهدة المخبرية في المشهد:</span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {scientificObservation}
              </p>
            </div>
          )}

          {scientificReason && (
            <div className="space-y-1 border-t border-slate-800/80 pt-2">
              <span className="text-[10px] font-bold text-amber-400 block">💡 التفسير العلمي (منهج السودان):</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {scientificReason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 🔬 Live Chemical State & Note Badge (Floating Clean Pill) */}
      {chemicalNote && !isFullView && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 max-w-lg w-[92%] bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-emerald-500/40 text-center shadow-2xl">
          <p className="text-xs text-emerald-300 font-bold font-sans flex items-center justify-center gap-1.5 leading-relaxed">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <span>{chemicalNote}</span>
          </p>
        </div>
      )}

      {/* 🧪 Laboratory Action Triggers & Step Navigation (Bottom Bar) */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80">
        <span className="text-[10px] text-slate-400 font-sans hidden md:inline">
          💡 انقر واسحب بالماوس للتدوير 360° • عجلة الماوس للتقريب
        </span>

        {/* Action Triggers */}
        <div className="flex items-center gap-1.5 mr-auto">
          {onActionTrigger && (
            <>
              <button
                onClick={() => onActionTrigger("add_reagent")}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
              >
                <Droplet className="w-3 h-3" />
                <span>إضافة كاشف</span>
              </button>

              {apparatusType === "magnetic_balance" ? (
                <button
                  onClick={() => onActionTrigger("toggle_magnet")}
                  className={
                    "px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm " +
                    (magneticFieldOn
                      ? "bg-rose-600 text-white hover:bg-rose-500"
                      : "bg-cyan-600 text-white hover:bg-cyan-500")
                  }
                >
                  <Magnet className="w-3 h-3" />
                  <span>{magneticFieldOn ? "إيقاف المغناطيس" : "تشغيل المغناطيس ⚡"}</span>
                </button>
              ) : (
                <button
                  onClick={() => onActionTrigger("toggle_heat")}
                  className={
                    "px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm " +
                    (isHeating
                      ? "bg-rose-600 text-white hover:bg-rose-500"
                      : "bg-amber-600 text-white hover:bg-amber-500")
                  }
                >
                  <Flame className="w-3 h-3" />
                  <span>{isHeating ? "إطفاء الموقد" : "إشعال بنسن"}</span>
                </button>
              )}

              <button
                onClick={() => onActionTrigger("stir")}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>رج المحلول</span>
              </button>
            </>
          )}

          {/* Step Navigation in Fullscreen */}
          {isFullView && (
            <div className="flex items-center gap-1 mr-2 border-r border-slate-700 pr-2">
              {onPrevStep && (
                <button
                  onClick={onPrevStep}
                  disabled={stepIndex === 0}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>السابق</span>
                </button>
              )}
              {onNextStep && (
                <button
                  onClick={onNextStep}
                  disabled={stepIndex >= totalSteps - 1}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                >
                  <span>الخطوة التالية</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
