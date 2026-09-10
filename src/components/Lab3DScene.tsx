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
  CheckCircle2,
  Scissors,
  FileText,
  Pipette,
  FlaskConical,
  Layers,
  Hand,
  MousePointer,
  Grab
} from "lucide-react";

export interface Lab3DProps {
  experimentId: string;
  stepIndex: number;
  apparatusType?: "beaker" | "test_tubes" | "gas_prep" | "electrolysis" | "magnetic_balance" | "glass_basin";
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
  activeAlkali?: "none" | "na" | "k";
  hasWater?: boolean;
  isIndicatorAdded?: boolean;
  isCutAndDried?: boolean;
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
  phValue = 7.0,
  gasVolume = 0,
  apparentWeight,
  magneticFieldOn = false,
  activeSubstance,
  activeAlkali = "none",
  hasWater = true,
  isIndicatorAdded = false,
  isCutAndDried = false,
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

  // Drag and drop interactive state
  const [dragFeedback, setDragFeedback] = useState<string | null>(null);
  const [isCurrentlyDragging, setIsCurrentlyDragging] = useState<boolean>(false);

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
  const alkaliBallRef = useRef<THREE.Group | null>(null);
  const dropZoneRingRef = useRef<THREE.Mesh | null>(null);

  // Draggable tool groups and physics references
  const draggableToolsRef = useRef<THREE.Group[]>([]);
  const draggedObjectRef = useRef<THREE.Group | null>(null);
  const dragPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), -2.2));
  const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseVecRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Orbit rotation controls
  const isDraggingCameraRef = useRef<boolean>(false);
  const isDraggingToolRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
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
  }, [temperature, phValue, gasVolume, apparentWeight]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen && !isModalFullscreen) {
        if (containerRef.current?.requestFullscreen) {
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
  }, [isFullscreen, isModalFullscreen]);

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
    scene.background = new THREE.Color("#0B1329");
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

    const benchGlow = new THREE.PointLight(0x10b981, 0.35, 12);
    benchGlow.position.set(0, -0.5, 2);
    scene.add(benchGlow);

    // Laboratory Table / Benchtop
    const tableGeo = new THREE.CylinderGeometry(8, 8, 0.4, 64);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.2
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, -0.2, 0);
    table.receiveShadow = true;
    scene.add(table);

    // Sleek Lab Safety Grid Pattern on Table
    const grid = new THREE.GridHelper(12, 24, 0x1e293b, 0x0f172a);
    grid.position.set(0, 0.005, 0);
    scene.add(grid);

    // Window / Container Resize Observer
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(mountRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
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

    // Reset draggable objects
    draggableToolsRef.current = [];

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
    // 🧲 CASE A: GOUY MAGNETIC BALANCE & ELECTROMAGNET
    // ==============================================================
    if (apparatusType === "magnetic_balance") {
      const magnetBalanceGroup = new THREE.Group();

      const yokeBase = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.45, 1.8), darkIronMat);
      yokeBase.position.set(0, 0.225, 0);
      yokeBase.castShadow = true;
      magnetBalanceGroup.add(yokeBase);

      const pillarGeo = new THREE.CylinderGeometry(0.48, 0.48, 2.2, 32);
      const leftPillar = new THREE.Mesh(pillarGeo, darkIronMat);
      leftPillar.position.set(-1.4, 1.35, 0);
      magnetBalanceGroup.add(leftPillar);

      const rightPillar = new THREE.Mesh(pillarGeo, darkIronMat);
      rightPillar.position.set(1.4, 1.35, 0);
      magnetBalanceGroup.add(rightPillar);

      const coilGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.5, 32);
      const leftCoil = new THREE.Mesh(coilGeo, copperMat);
      leftCoil.position.set(-1.4, 1.35, 0);
      magnetBalanceGroup.add(leftCoil);

      const rightCoil = new THREE.Mesh(coilGeo, copperMat);
      rightCoil.position.set(1.4, 1.35, 0);
      magnetBalanceGroup.add(rightCoil);

      const leftPole = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.48, 0.65, 32), darkIronMat);
      leftPole.rotation.z = -Math.PI / 2;
      leftPole.position.set(-0.6, 2.0, 0);
      magnetBalanceGroup.add(leftPole);

      const rightPole = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.48, 0.65, 32), darkIronMat);
      rightPole.rotation.z = Math.PI / 2;
      rightPole.position.set(0.6, 2.0, 0);
      magnetBalanceGroup.add(rightPole);

      const poleN = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.25), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      poleN.position.set(-0.65, 2.35, 0);
      magnetBalanceGroup.add(poleN);

      const poleS = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.25), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
      poleS.position.set(0.65, 2.35, 0);
      magnetBalanceGroup.add(poleS);

      const magFieldGroup = new THREE.Group();
      magFieldGroup.position.set(0, 2.0, 0);

      const fieldRings = 7;
      for (let f = 0; f < fieldRings; f++) {
        const ringRadius = 0.15 + f * 0.06;
        const ringGeo = new THREE.TorusGeometry(ringRadius, 0.015, 16, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.y = Math.PI / 2;
        ringMesh.position.set((Math.random() - 0.5) * 0.3, 0, 0);
        magFieldGroup.add(ringMesh);
      }
      magFieldGroup.visible = !!magneticFieldOn;
      magneticFieldGroupRef.current = magFieldGroup;
      magnetBalanceGroup.add(magFieldGroup);

      const balanceStand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.6, 24), metalMat);
      balanceStand.position.set(0, 3.7, -0.6);
      magnetBalanceGroup.add(balanceStand);

      const balanceFulcrum = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.25, 16), metalMat);
      balanceFulcrum.position.set(0, 4.85, 0);
      balanceFulcrum.rotation.x = Math.PI;
      magnetBalanceGroup.add(balanceFulcrum);

      const beamGeo = new THREE.BoxGeometry(3.6, 0.08, 0.08);
      const beamMesh = new THREE.Mesh(beamGeo, copperMat);
      beamMesh.position.set(0, 4.95, 0);
      balanceBeamRef.current = beamMesh;
      magnetBalanceGroup.add(beamMesh);

      const pointer = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 12), metalMat);
      pointer.position.set(0, 4.6, 0.05);
      magnetBalanceGroup.add(pointer);

      const scalePlate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.02), darkIronMat);
      scalePlate.position.set(0, 4.3, 0.06);
      magnetBalanceGroup.add(scalePlate);

      const leftWire = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.8, 8), metalMat);
      leftWire.position.set(-1.7, 4.0, 0);
      magnetBalanceGroup.add(leftWire);

      const leftPan = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 0.05, 32), copperMat);
      leftPan.position.set(-1.7, 3.1, 0);
      magnetBalanceGroup.add(leftPan);

      const weight1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.25, 16), darkIronMat);
      weight1.position.set(-1.7, 3.25, 0);
      magnetBalanceGroup.add(weight1);

      const tubeGroup = new THREE.Group();
      tubeGroup.position.set(1.7, 0, 0);

      const rightWire = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.4, 8), metalMat);
      rightWire.position.set(0, 3.7, 0);
      tubeGroup.add(rightWire);

      const sampleTube = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.6, 24), glassMaterial);
      sampleTube.position.set(0, 2.0, 0);
      tubeGroup.add(sampleTube);

      let sampleColor = 0x86efac;
      if (activeSubstance === "CuSO4") sampleColor = 0x38bdf8;
      if (activeSubstance === "ZnCl2") sampleColor = 0xf8fafc;

      const powderGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 24);
      const powderMat = new THREE.MeshStandardMaterial({
        color: sampleColor,
        roughness: 0.8,
        metalness: 0.1
      });
      const powderMesh = new THREE.Mesh(powderGeo, powderMat);
      powderMesh.position.set(0, 1.9, 0);
      tubeGroup.add(powderMesh);

      tubeGroup.position.set(0, 0, 0);
      sampleTubeGroupRef.current = tubeGroup;
      magnetBalanceGroup.add(tubeGroup);

      appGroup.add(magnetBalanceGroup);
    }

    // ==============================================================
    // 🥣 CASE B: LARGE GLASS BASIN & INTERACTIVE WORKBENCH TRAY
    // ==============================================================
    else if (apparatusType === "glass_basin") {
      const basinGroup = new THREE.Group();

      const basinRadius = 1.9;
      const basinHeight = 1.35;
      const basinWallGeo = new THREE.CylinderGeometry(basinRadius, basinRadius * 0.96, basinHeight, 48, 1, true);
      const basinWall = new THREE.Mesh(basinWallGeo, glassMaterial);
      basinWall.position.set(0.6, basinHeight / 2 + 0.05, 0);
      basinWall.castShadow = true;
      basinGroup.add(basinWall);

      const basinBottom = new THREE.Mesh(new THREE.CylinderGeometry(basinRadius * 0.96, basinRadius * 0.96, 0.08, 48), glassMaterial);
      basinBottom.position.set(0.6, 0.08, 0);
      basinGroup.add(basinBottom);

      const basinRim = new THREE.Mesh(new THREE.TorusGeometry(basinRadius, 0.05, 16, 48), glassMaterial);
      basinRim.rotation.x = Math.PI / 2;
      basinRim.position.set(0.6, basinHeight + 0.05, 0);
      basinGroup.add(basinRim);

      // 🎯 Glowing Drop Zone Target Ring
      const dropZoneGeo = new THREE.TorusGeometry(basinRadius * 0.98, 0.045, 16, 48);
      const dropZoneMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const dropZoneMesh = new THREE.Mesh(dropZoneGeo, dropZoneMat);
      dropZoneMesh.rotation.x = Math.PI / 2;
      dropZoneMesh.position.set(0.6, basinHeight + 0.1, 0);
      dropZoneMesh.visible = false;
      dropZoneRingRef.current = dropZoneMesh;
      basinGroup.add(dropZoneMesh);

      const waterHeight = hasWater !== false ? Math.max(0.4, liquidHeight * 1.1) : 0.05;
      const waterGeo = new THREE.CylinderGeometry(basinRadius * 0.94, basinRadius * 0.94, waterHeight, 48);
      waterGeo.translate(0, waterHeight / 2, 0);
      const waterColorVal = isIndicatorAdded ? (activeAlkali === "k" ? "#c084fc" : "#ec4899") : liquidColor;
      const waterMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(waterColorVal),
        transparent: true,
        opacity: 0.78,
        roughness: 0.1,
        transmission: 0.85,
        ior: 1.33
      });
      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.position.set(0.6, 0.09, 0);
      basinGroup.add(waterMesh);
      liquidMeshRef.current = waterMesh;

      // 2. Side Laboratory Workbench Tray Base
      const trayGroup = new THREE.Group();
      trayGroup.position.set(-2.5, 0, 0);

      const trayBase = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.08, 3.4),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.2 })
      );
      trayBase.position.set(0, 0.04, 0);
      trayBase.castShadow = true;
      trayGroup.add(trayBase);

      const rimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
      const rimFront = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 0.06), rimMat);
      rimFront.position.set(0, 0.09, 1.67);
      trayGroup.add(rimFront);
      const rimBack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 0.06), rimMat);
      rimBack.position.set(0, 0.09, -1.67);
      trayGroup.add(rimBack);
      const rimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 3.4), rimMat);
      rimLeft.position.set(-1.17, 0.09, 0);
      trayGroup.add(rimLeft);
      const rimRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 3.4), rimMat);
      rimRight.position.set(1.17, 0.09, 0);
      trayGroup.add(rimRight);

      // Ceramic cutting tile
      const tile = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.72, 0.05, 32),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2 })
      );
      tile.position.set(-0.2, 0.1, 0.6);
      trayGroup.add(tile);

      // Filter Paper Disc
      const filterPaper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 0.015, 32),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
      );
      filterPaper.position.set(-0.2, 0.13, 0.6);
      trayGroup.add(filterPaper);

      // ==============================================================
      // 🖐️ DRAGGABLE TOOL 1: Cut Metal Piece (قطعة الصوديوم على ورق الترشيح)
      // ==============================================================
      const metalPieceGroup = new THREE.Group();
      const cutPieceHome = new THREE.Vector3(-2.7, 0.18, 0.6);
      metalPieceGroup.position.copy(cutPieceHome);
      metalPieceGroup.userData = {
        id: "drop_sodium",
        label: "قطعة صوديوم Na 🟡",
        homePos: cutPieceHome.clone()
      };

      const cutPiece = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.12, 0.18),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.98, roughness: 0.08 })
      );
      cutPiece.castShadow = true;
      metalPieceGroup.add(cutPiece);

      const metalAura = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.4, wireframe: true })
      );
      metalPieceGroup.add(metalAura);

      appGroup.add(metalPieceGroup);
      draggableToolsRef.current.push(metalPieceGroup);

      // ==============================================================
      // 🖐️ DRAGGABLE TOOL 2: Sharp Scalpel / Knife (سكين حاد)
      // ==============================================================
      const knifeGroup = new THREE.Group();
      const knifeHome = new THREE.Vector3(-1.9, 0.14, 0.6);
      knifeGroup.position.copy(knifeHome);
      knifeGroup.rotation.y = -0.3;
      knifeGroup.userData = {
        id: "cut_metal",
        label: "سكين حاد 🔪",
        homePos: knifeHome.clone()
      };

      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.12, 0.7),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.08 })
      );
      blade.position.set(0, 0.06, -0.35);
      knifeGroup.add(blade);

      const knifeHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.7, 16),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 })
      );
      knifeHandle.rotation.x = Math.PI / 2;
      knifeHandle.position.set(0, 0.06, 0.35);
      knifeGroup.add(knifeHandle);

      appGroup.add(knifeGroup);
      draggableToolsRef.current.push(knifeGroup);

      // ==============================================================
      // 🖐️ DRAGGABLE TOOL 3: Metallic Forceps with Sodium (ملقط معدني)
      // ==============================================================
      const forcepsGroup = new THREE.Group();
      const forcepsHome = new THREE.Vector3(-3.1, 0.14, -0.7);
      forcepsGroup.position.copy(forcepsHome);
      forcepsGroup.rotation.y = 0.4;
      forcepsGroup.userData = {
        id: "drop_sodium",
        label: "ملقط معدني بالصوديوم 🥢",
        homePos: forcepsHome.clone()
      };

      const prongMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.95, roughness: 0.1 });
      const leftProng = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 1.2), prongMat);
      leftProng.position.set(-0.03, 0.02, 0);
      leftProng.rotation.y = 0.05;
      forcepsGroup.add(leftProng);

      const rightProng = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 1.2), prongMat);
      rightProng.position.set(0.03, 0.02, 0);
      rightProng.rotation.y = -0.05;
      forcepsGroup.add(rightProng);

      const forcepsJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16), prongMat);
      forcepsJoint.position.set(0, 0.02, -0.6);
      forcepsGroup.add(forcepsJoint);

      const graspedNa = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 })
      );
      graspedNa.position.set(0, 0.02, 0.55);
      forcepsGroup.add(graspedNa);

      appGroup.add(forcepsGroup);
      draggableToolsRef.current.push(forcepsGroup);

      // ==============================================================
      // 🖐️ DRAGGABLE TOOL 4: Dropper Bottle with Indicator (قطارة دليل الفينول)
      // ==============================================================
      const dropperGroup = new THREE.Group();
      const dropperHome = new THREE.Vector3(-2.0, 0.1, -0.8);
      dropperGroup.position.copy(dropperHome);
      dropperGroup.userData = {
        id: "add_indicator",
        label: "قطارة الفينول فثالين 🌸",
        homePos: dropperHome.clone()
      };

      const bottleBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.7, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x78350f, transparent: true, opacity: 0.85, roughness: 0.2 })
      );
      bottleBody.position.set(0, 0.35, 0);
      dropperGroup.add(bottleBody);

      const bottleCap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.15, 24), darkIronMat);
      bottleCap.position.set(0, 0.75, 0);
      dropperGroup.add(bottleCap);

      const rubberTeat = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.7 })
      );
      rubberTeat.position.set(0, 0.9, 0);
      dropperGroup.add(rubberTeat);

      const pipetteTube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 0.8, 16), glassMaterial);
      pipetteTube.position.set(0, -0.2, 0);
      dropperGroup.add(pipetteTube);

      const dropIndicator = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.6 })
      );
      dropIndicator.position.set(0, 1.25, 0);
      dropperGroup.add(dropIndicator);

      appGroup.add(dropperGroup);
      draggableToolsRef.current.push(dropperGroup);

      // ==============================================================
      // 🖐️ DRAGGABLE TOOL 5: Potassium Reagent Jar (وعاء البوتاسيوم K)
      // ==============================================================
      const kJarGroup = new THREE.Group();
      const kJarHome = new THREE.Vector3(-2.7, 0.1, -0.8);
      kJarGroup.position.copy(kJarHome);
      kJarGroup.userData = {
        id: "drop_potassium",
        label: "قطعة بوتاسيوم K 🟣",
        homePos: kJarHome.clone()
      };

      const kJar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.6, 24),
        new THREE.MeshPhysicalMaterial({ color: 0xc084fc, transparent: true, opacity: 0.75 })
      );
      kJar.position.set(0, 0.3, 0);
      kJarGroup.add(kJar);

      const kCap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.1, 24), darkIronMat);
      kCap.position.set(0, 0.65, 0);
      kJarGroup.add(kCap);

      const kBeacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.6 })
      );
      kBeacon.position.set(0, 0.95, 0);
      kJarGroup.add(kBeacon);

      appGroup.add(kJarGroup);
      draggableToolsRef.current.push(kJarGroup);

      basinGroup.add(trayGroup);

      // 3. Floating & Darting Molten Alkali Metal Sphere
      const effectiveAlkali = activeAlkali !== "none" ? activeAlkali : (stepIndex >= 2 ? (stepIndex === 2 ? "na" : "k") : "none");
      if (effectiveAlkali !== "none") {
        const alkaliSphereGroup = new THREE.Group();
        alkaliSphereGroup.position.set(0.6, waterHeight + 0.12, 0);

        const metalBall = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.98, roughness: 0.05 })
        );
        alkaliSphereGroup.add(metalBall);

        const alkaliFlameColor = effectiveAlkali === "k" ? 0xa855f7 : 0xfbbf24;
        const ballFlame = new THREE.Mesh(
          new THREE.ConeGeometry(0.16, 0.65, 16),
          new THREE.MeshBasicMaterial({ color: alkaliFlameColor, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
        );
        ballFlame.geometry.translate(0, 0.32, 0);
        alkaliSphereGroup.add(ballFlame);

        const ballLight = new THREE.PointLight(alkaliFlameColor, effectiveAlkali === "k" ? 4.5 : 3.0, 3.5);
        ballLight.position.set(0, 0.2, 0);
        alkaliSphereGroup.add(ballLight);

        basinGroup.add(alkaliSphereGroup);
        alkaliBallRef.current = alkaliSphereGroup;
      }

      // Bubbles & Smoke in the basin
      const bubbleGeo = new THREE.BufferGeometry();
      const bubbleCount = 40;
      const bubblePos = new Float32Array(bubbleCount * 3);
      const bubbleSpeeds = new Float32Array(bubbleCount);
      for (let b = 0; b < bubbleCount; b++) {
        bubblePos[b * 3] = 0.6 + (Math.random() - 0.5) * 1.5;
        bubblePos[b * 3 + 1] = 0.1 + Math.random() * waterHeight;
        bubblePos[b * 3 + 2] = (Math.random() - 0.5) * 1.5;
        bubbleSpeeds[b] = 0.015 + Math.random() * 0.025;
      }
      bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePos, 3));
      bubbleGeo.setAttribute("speed", new THREE.BufferAttribute(bubbleSpeeds, 1));
      const bubbles = new THREE.Points(
        bubbleGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })
      );
      bubbles.visible = isBubbling || effectiveAlkali !== "none";
      bubblesGroupRef.current = bubbles;
      basinGroup.add(bubbles);

      const smokeCount = 50;
      const smokeGeo = new THREE.BufferGeometry();
      const smokePos = new Float32Array(smokeCount * 3);
      for (let s = 0; s < smokeCount; s++) {
        smokePos[s * 3] = 0.6 + (Math.random() - 0.5) * 1.2;
        smokePos[s * 3 + 1] = waterHeight + Math.random() * 2.0;
        smokePos[s * 3 + 2] = (Math.random() - 0.5) * 1.2;
      }
      smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3));
      const smoke = new THREE.Points(
        smokeGeo,
        new THREE.PointsMaterial({ color: 0xe2e8f0, size: 0.2, transparent: true, opacity: 0.4 })
      );
      smoke.visible = isSmoking || effectiveAlkali !== "none";
      smokeGroupRef.current = smoke;
      basinGroup.add(smoke);

      appGroup.add(basinGroup);
    }

    // ==============================================================
    // 🧪 CASE C: STANDARD BEAKER / BURNER / RACK / GAS PREP APPARATUS
    // ==============================================================
    else {
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

      const burnerGroup = new THREE.Group();
      burnerGroup.position.set(0, 0, 0);

      const burnerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.15, 32), copperMat);
      burnerBase.position.set(0, 0.075, 0);
      burnerGroup.add(burnerBase);

      const burnerBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 24), metalMat);
      burnerBarrel.position.set(0, 0.7, 0);
      burnerGroup.add(burnerBarrel);

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

      const tripodRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 16, 32), metalMat);
      tripodRing.rotation.x = Math.PI / 2;
      tripodRing.position.set(0, 1.5, 0);
      appGroup.add(tripodRing);

      const gauze = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.02, 32), new THREE.MeshStandardMaterial({ color: 0x64748b, wireframe: true }));
      gauze.position.set(0, 1.51, 0);
      appGroup.add(gauze);

      for (let leg = 0; leg < 3; leg++) {
        const angle = (leg * Math.PI * 2) / 3;
        const tripodLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.6, 16), metalMat);
        tripodLeg.position.set(Math.cos(angle) * 0.85, 0.75, Math.sin(angle) * 0.85);
        tripodLeg.rotation.z = Math.cos(angle) * -0.15;
        tripodLeg.rotation.x = Math.sin(angle) * 0.15;
        appGroup.add(tripodLeg);
      }

      const beakerRadius = 0.8;
      const beakerHeight = 1.8;
      const beakerGeo = new THREE.CylinderGeometry(beakerRadius, beakerRadius * 0.95, beakerHeight, 32, 1, true);
      const beaker = new THREE.Mesh(beakerGeo, glassMaterial);
      beaker.position.set(0, 1.52 + beakerHeight / 2, 0);
      beaker.castShadow = true;
      appGroup.add(beaker);

      const beakerBottom = new THREE.Mesh(new THREE.CylinderGeometry(beakerRadius * 0.95, beakerRadius * 0.95, 0.04, 32), glassMaterial);
      beakerBottom.position.set(0, 1.53, 0);
      appGroup.add(beakerBottom);

      const realLiquidHeight = Math.max(0.1, liquidHeight * 1.5);
      const liquidGeo = new THREE.CylinderGeometry(beakerRadius * 0.93, beakerRadius * 0.93, realLiquidHeight, 32);
      liquidGeo.translate(0, realLiquidHeight / 2, 0);
      const liquidMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(liquidColor),
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        transmission: 0.75,
        ior: 1.33
      });
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
      liquidMesh.position.set(0, 1.54, 0);
      liquidMeshRef.current = liquidMesh;
      appGroup.add(liquidMesh);

      const bubbleGeo = new THREE.BufferGeometry();
      const bubbleCount = 35;
      const bubblePos = new Float32Array(bubbleCount * 3);
      const bubbleSpeeds = new Float32Array(bubbleCount);
      for (let b = 0; b < bubbleCount; b++) {
        bubblePos[b * 3] = (Math.random() - 0.5) * (beakerRadius * 1.5);
        bubblePos[b * 3 + 1] = 1.54 + Math.random() * realLiquidHeight;
        bubblePos[b * 3 + 2] = (Math.random() - 0.5) * (beakerRadius * 1.5);
        bubbleSpeeds[b] = 0.01 + Math.random() * 0.02;
      }
      bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePos, 3));
      bubbleGeo.setAttribute("speed", new THREE.BufferAttribute(bubbleSpeeds, 1));
      const bubbles = new THREE.Points(
        bubbleGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })
      );
      bubbles.visible = isBubbling || isHeating;
      bubblesGroupRef.current = bubbles;
      appGroup.add(bubbles);

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
  }, [apparatusType, liquidColor, liquidHeight, flameColor, isHeating, isBubbling, isSmoking, magneticFieldOn, activeSubstance, activeAlkali, hasWater, isIndicatorAdded, isCutAndDried, stepIndex]);

  // 3. Dynamic Animation Loop
  useEffect(() => {
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Flame flicker for Bunsen burner
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

        if (sampleTubeGroupRef.current && balanceBeamRef.current) {
          let targetDeflection = 0;
          let beamTilt = 0;

          if (magneticFieldOn) {
            if (activeSubstance === "FeSO4") {
              targetDeflection = -0.22;
              beamTilt = -0.06;
            } else if (activeSubstance === "CuSO4") {
              targetDeflection = -0.10;
              beamTilt = -0.03;
            } else if (activeSubstance === "ZnCl2") {
              targetDeflection = 0.07;
              beamTilt = 0.02;
            }
          }

          sampleTubeGroupRef.current.position.y += (targetDeflection - sampleTubeGroupRef.current.position.y) * 0.1;
          balanceBeamRef.current.rotation.z += (beamTilt - balanceBeamRef.current.rotation.z) * 0.1;
        }
      }

      // Glass Basin: Molten Alkali Metal Sphere darting on water surface
      if (apparatusType === "glass_basin" && alkaliBallRef.current) {
        const effectiveAlkali = activeAlkali !== "none" ? activeAlkali : (stepIndex >= 2 ? (stepIndex === 2 ? "na" : "k") : "none");
        const speed = effectiveAlkali === "k" ? 4.8 : 3.2;
        const radiusVal = 1.15 + Math.sin(elapsedTime * 3) * 0.35;
        const angle = elapsedTime * speed;
        
        alkaliBallRef.current.position.x = 0.6 + Math.cos(angle) * radiusVal;
        alkaliBallRef.current.position.z = Math.sin(angle) * radiusVal;
        const waterTop = (hasWater !== false ? Math.max(0.4, liquidHeight * 1.1) : 0.05) + 0.12;
        alkaliBallRef.current.position.y = waterTop + Math.sin(elapsedTime * 14) * 0.02;
      }

      // Smooth return for non-dragged tools back to their home positions
      if (!isDraggingToolRef.current) {
        draggableToolsRef.current.forEach((tool) => {
          if (tool.userData && tool.userData.homePos) {
            const home = tool.userData.homePos as THREE.Vector3;
            tool.position.lerp(home, 0.12);
            tool.rotation.x = THREE.MathUtils.lerp(tool.rotation.x, 0, 0.12);
            tool.rotation.z = THREE.MathUtils.lerp(tool.rotation.z, 0, 0.12);
          }
        });
      }

      // Pulsing Drop Zone Ring
      if (dropZoneRingRef.current && dropZoneRingRef.current.visible) {
        const ringPulse = 1.0 + Math.sin(elapsedTime * 10) * 0.04;
        dropZoneRingRef.current.scale.set(ringPulse, ringPulse, ringPulse);
      }

      // Bubbles animation
      if (bubblesGroupRef.current && bubblesGroupRef.current.visible) {
        const positions = bubblesGroupRef.current.geometry.attributes.position.array as Float32Array;
        const speeds = bubblesGroupRef.current.geometry.attributes.speed.array as Float32Array;
        const count = positions.length / 3;

        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += speeds[i];
          positions[i * 3] += Math.sin(elapsedTime * 5 + i) * 0.003;
          const topLimit = apparatusType === "glass_basin" ? (liquidHeight * 1.1 + 0.1) : (1.54 + liquidHeight * 1.8);
          if (positions[i * 3 + 1] > topLimit) {
            positions[i * 3 + 1] = apparatusType === "glass_basin" ? 0.12 : 1.55;
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
            sPos[s * 3 + 1] = apparatusType === "glass_basin" ? (liquidHeight * 1.1 + 0.2) : 3.32;
            sPos[s * 3] = (apparatusType === "glass_basin" ? 0.6 : 0) + (Math.random() - 0.5) * 0.5;
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
  }, [isHeating, liquidHeight, magneticFieldOn, activeSubstance, apparatusType, activeAlkali, hasWater, stepIndex]);

  // Helper to find root draggable group from intersected child mesh
  const findDraggableGroup = (object: THREE.Object3D | null): THREE.Group | null => {
    let curr = object;
    while (curr && curr.parent) {
      if (curr.userData && curr.userData.id) {
        return curr as THREE.Group;
      }
      curr = curr.parent;
    }
    return null;
  };

  // 4. Unified Pointer Drag & Drop Engine (Mouse + Touch on Mobile)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!mountRef.current || !cameraRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseVecRef.current.set(mouseX, mouseY);
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Check if clicked an interactive tool
    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(draggableToolsRef.current, true);

    if (intersects.length > 0) {
      const hitTool = findDraggableGroup(intersects[0].object);
      if (hitTool) {
        isDraggingToolRef.current = true;
        draggedObjectRef.current = hitTool;
        setIsCurrentlyDragging(true);

        const planeIntersect = new THREE.Vector3();
        if (raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, planeIntersect)) {
          dragOffsetRef.current.copy(hitTool.position).sub(planeIntersect);
          hitTool.position.y = 2.4;
        }

        if (dropZoneRingRef.current) {
          dropZoneRingRef.current.visible = true;
        }

        setDragFeedback("🎯 اسحب " + hitTool.userData.label + " وأفلتها فوق الحوض للسكب والتفاعل!");
        return;
      }
    }

    // Otherwise, drag camera orbit
    isDraggingCameraRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!mountRef.current || !cameraRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseVecRef.current.set(mouseX, mouseY);

    // If dragging a 3D physical tool
    if (isDraggingToolRef.current && draggedObjectRef.current) {
      raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);
      const planeIntersect = new THREE.Vector3();

      if (raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, planeIntersect)) {
        draggedObjectRef.current.position.x = planeIntersect.x + dragOffsetRef.current.x;
        draggedObjectRef.current.position.z = planeIntersect.z + dragOffsetRef.current.z;

        if (draggedObjectRef.current.userData.id === "add_indicator") {
          draggedObjectRef.current.rotation.z = -0.4;
        } else if (draggedObjectRef.current.userData.id === "drop_sodium") {
          draggedObjectRef.current.rotation.x = 0.2;
        }

        const distToBasin = Math.hypot(draggedObjectRef.current.position.x - 0.6, draggedObjectRef.current.position.z - 0);
        const isOverBasin = distToBasin < 2.1;

        if (isOverBasin) {
          if (dropZoneRingRef.current) {
            (dropZoneRingRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x22c55e);
          }
          setDragFeedback("✨ حرر الآن لسكب وإسقاط " + draggedObjectRef.current.userData.label + " في الحوض!");
        } else {
          if (dropZoneRingRef.current) {
            (dropZoneRingRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8);
          }
          setDragFeedback("🎯 اسحب " + draggedObjectRef.current.userData.label + " نحو الحوض الكبير");
        }
      }
      return;
    }

    // Camera Orbit drag
    if (isDraggingCameraRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      cameraAngleRef.current.theta -= deltaX * 0.008;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi - deltaY * 0.008));
      updateCameraPos();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingToolRef.current && draggedObjectRef.current) {
      const tool = draggedObjectRef.current;
      const actionId = tool.userData.id as string;
      const distToBasin = Math.hypot(tool.position.x - 0.6, tool.position.z - 0);
      const isOverBasin = distToBasin < 2.1;

      const dragDistance = Math.hypot(e.clientX - pointerDownPosRef.current.x, e.clientY - pointerDownPosRef.current.y);
      const isQuickClick = dragDistance < 10;

      if (isOverBasin || isQuickClick) {
        if (onActionTrigger) {
          onActionTrigger(actionId);
        }

        if (dropZoneRingRef.current) {
          (dropZoneRingRef.current.material as THREE.MeshBasicMaterial).color.setHex(0xfbbf24);
          setTimeout(() => {
            if (dropZoneRingRef.current) dropZoneRingRef.current.visible = false;
          }, 450);
        }
      } else {
        if (dropZoneRingRef.current) {
          dropZoneRingRef.current.visible = false;
        }
      }

      isDraggingToolRef.current = false;
      draggedObjectRef.current = null;
      setIsCurrentlyDragging(false);
      setDragFeedback(null);
    }

    isDraggingCameraRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraAngleRef.current.radius = Math.max(3.0, Math.min(13.0, cameraAngleRef.current.radius + e.deltaY * 0.005));
    updateCameraPos();
  };

  const isFullView = isFullscreen || isModalFullscreen;

  return (
    <div
      ref={containerRef}
      className={
        isFullView
          ? "fixed inset-0 z-50 w-screen h-screen bg-[#0B1329] flex flex-col justify-between overflow-hidden select-none"
          : "relative w-full h-[450px] sm:h-[490px] rounded-xl overflow-hidden shadow-inner border border-slate-800 bg-[#0B1329] select-none"
      }
      style={{ touchAction: "none" }}
    >
      {/* 3D Canvas Mount Point with Unified Pointer Events */}
      <div
        ref={mountRef}
        className={"w-full h-full " + (isCurrentlyDragging ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        {/* Left: Camera Presets */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => setCameraPreset("front")}
            title="منظور أمامي"
            className="px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            أمامي
          </button>
          <button
            onClick={() => setCameraPreset("close")}
            title="تقريب للكأس"
            className="px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            مقرب
          </button>
          <button
            onClick={() => setCameraPreset("top")}
            title="منظور علوي"
            className="px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            علوي
          </button>
          <button
            onClick={() => setCameraPreset("reset")}
            title="إعادة التوجيه الافتراضي"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Experiment Title in Fullscreen */}
        {isFullView && (
          <div className="hidden md:flex flex-col items-center pointer-events-auto bg-slate-900/85 backdrop-blur-md px-4 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-center">
            <span className="text-xs font-bold text-white font-serif">{experimentTitle}</span>
            <span className="text-[10px] text-emerald-400">{unitName}</span>
          </div>
        )}

        {/* Right: Fullscreen Toggle & Reflection Drawer Toggle */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {isFullView && (
            <button
              onClick={() => setShowReflectionDrawer(prev => !prev)}
              className="bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-400/50 shadow-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showReflectionDrawer ? "إخفاء لوحة الانعكاس" : "عرض لوحة الانعكاس"}</span>
            </button>
          )}

          {isFullView && onReset && (
            <button
              onClick={onReset}
              title="إعادة بدء التجربة"
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-700 shadow-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إعادة البدء</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            title={isFullView ? "الخروج من ملء الشاشة (Esc)" : "تكبير ملء الشاشة"}
            className="bg-slate-900/90 hover:bg-slate-800 text-white p-2 rounded-xl border border-slate-700/80 shadow-lg transition-all cursor-pointer hover:border-emerald-500/50 group"
          >
            {isFullView ? (
              <div className="flex items-center gap-1 text-xs text-rose-400 font-bold px-1">
                <Minimize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>خروج من ملء الشاشة</span>
              </div>
            ) : (
              <Maximize2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* 🖐️ Top Interactive Drag-and-Drop Guidance Banner */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-lg w-[90%] text-center">
        {dragFeedback ? (
          <div className="bg-emerald-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-400 text-emerald-200 text-xs font-bold shadow-2xl flex items-center justify-center gap-2 animate-bounce">
            <Grab className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{dragFeedback}</span>
          </div>
        ) : (
          apparatusType === "glass_basin" && (
            <div className="bg-slate-900/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-700/70 text-slate-300 text-[11px] font-sans font-medium flex items-center justify-center gap-1.5 shadow-lg">
              <Hand className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>ميزة الالتقاط والسحب 3D: يمكنك سحب أي أداة بالماوس أو بيدك وسكبها فوق الحوض!</span>
            </div>
          )
        )}
      </div>

      {/* Floating Real-time Telemetry HUD (Left Side) */}
      <div className="absolute top-24 left-3 z-20 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/70 text-right shadow-xl min-w-[130px]">
        <div className="text-[10px] text-emerald-400 font-bold border-b border-slate-800 pb-1 flex items-center gap-1 justify-end">
          <span>
            {apparatusType === "magnetic_balance" ? "ميزان غوي المغناطيسي 🧲" :
             apparatusType === "glass_basin" ? "حوض زجاجي وصينية الأدوات 🥣" :
             apparatusType === "gas_prep" ? "جهاز إزاحة الغاز 💨" :
             apparatusType === "test_tubes" ? "أنابيب المقارنة 🧪" :
             "كأس تفاعل معملي ⚗️"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold">
          <span className="text-amber-400">{currentTemp}°C</span>
          <div className="flex items-center gap-1 text-slate-300">
            <span className="font-sans text-[10px]">الحرارة</span>
            <Thermometer className="w-3 h-3 text-amber-400" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold">
          <span className={currentPh > 7 ? "text-emerald-400" : currentPh < 7 ? "text-rose-400" : "text-sky-400"}>
            {currentPh.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 text-slate-300">
            <span className="font-sans text-[10px]">الرقم pH</span>
            <Gauge className="w-3 h-3 text-indigo-400" />
          </div>
        </div>

        {gasVolume > 0 && (
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold">
            <span className="text-sky-300">{currentGas} mL</span>
            <div className="flex items-center gap-1 text-slate-300">
              <span className="font-sans text-[10px]">الغاز</span>
              <Sparkles className="w-3 h-3 text-sky-400" />
            </div>
          </div>
        )}

        {currentWeight !== undefined && (
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold pt-1 border-t border-slate-800">
            <span className="text-emerald-300">{currentWeight.toFixed(2)} g</span>
            <div className="flex items-center gap-1 text-slate-300">
              <span className="font-sans text-[10px]">الوزن الظاهري</span>
              <Scale className="w-3 h-3 text-emerald-400" />
            </div>
          </div>
        )}

        {apparatusType === "magnetic_balance" && (
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-[10px]">
            <span className="text-slate-400">المغناطيس:</span>
            <span className={"font-bold px-1.5 py-0.5 rounded " + (magneticFieldOn ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "bg-slate-800 text-slate-400")}>
              {magneticFieldOn ? "مشغل ⚡" : "مطفأ"}
            </span>
          </div>
        )}

        {apparatusType === "glass_basin" && (
          <div className="pt-1 border-t border-slate-800 space-y-1 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">الفلز النشط:</span>
              <span className="font-bold text-amber-300">
                {activeAlkali === "na" ? "صوديوم Na 🟡" : activeAlkali === "k" ? "بوتاسيوم K 🟣" : "في الانتظار"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">دليل الفينول:</span>
              <span className={"font-bold px-1 rounded " + (isIndicatorAdded ? "text-pink-400 bg-pink-950" : "text-slate-400")}>
                {isIndicatorAdded ? "مُضاف (وردي) 🌸" : "غير مضاف"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 🌟 Floating Live Reflection Drawer */}
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

      {/* 🔬 Live Chemical State & Note Badge */}
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
        <span className="text-[10px] text-slate-400 font-sans hidden md:inline flex items-center gap-1">
          <MousePointer className="w-3 h-3 text-sky-400" />
          <span>اسحب أي أداة بالماوس أو إصبعك وأسقطها فوق الحوض • انقر واسحب في الفراغ للتدوير 360°</span>
        </span>

        {/* Action Triggers */}
        <div className="flex items-center gap-1.5 mr-auto">
          {onActionTrigger && (
            <>
              {apparatusType === "glass_basin" ? (
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    onClick={() => onActionTrigger("pour_water")}
                    title="صب الماء المقطر في الحوض"
                    className="px-2.5 py-1 bg-sky-700 hover:bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  >
                    <Droplet className="w-3 h-3 text-sky-300" />
                    <span>ماء مقطر</span>
                  </button>

                  <button
                    onClick={() => onActionTrigger("cut_metal")}
                    title="قطع الفلز بالسكين وتجفيفه بورق الترشيح"
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  >
                    <Scissors className="w-3 h-3 text-amber-400" />
                    <span>سكين + ورق</span>
                  </button>

                  <button
                    onClick={() => onActionTrigger("drop_sodium")}
                    title="التقاط قطعة الصوديوم Na بالملقط وإسقاطها في الحوض"
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    <span>ملقط + Na 🟡</span>
                  </button>

                  <button
                    onClick={() => onActionTrigger("drop_potassium")}
                    title="التقاط قطعة البوتاسيوم K بالملقط وإسقاطها في الحوض"
                    className="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-purple-200" />
                    <span>ملقط + K 🟣</span>
                  </button>

                  <button
                    onClick={() => onActionTrigger("add_indicator")}
                    title="إضافة قطرات دليل الفينول فثالين"
                    className="px-2.5 py-1 bg-pink-700 hover:bg-pink-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  >
                    <Pipette className="w-3 h-3 text-pink-200" />
                    <span>دليل الفينول 🌸</span>
                  </button>

                  <button
                    onClick={() => onActionTrigger("clean_basin")}
                    title="تفريغ الحوض وغسيله بماء جديد"
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              ) : apparatusType === "magnetic_balance" ? (
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
                <>
                  <button
                    onClick={() => onActionTrigger("add_reagent")}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  >
                    <Droplet className="w-3 h-3" />
                    <span>إضافة كاشف</span>
                  </button>

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

                  <button
                    onClick={() => onActionTrigger("stir")}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>رج المحلول</span>
                  </button>
                </>
              )}
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
