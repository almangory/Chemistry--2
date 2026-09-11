import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Droplet, 
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  Info, 
  ArrowRightLeft, 
  Sparkles, 
  Award,
  Thermometer,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  FastForward,
  Filter,
  CheckCircle2,
  ChevronDown
} from "lucide-react";

export type ReactionType = 
  | "double_displacement" 
  | "redox" 
  | "acid_base" 
  | "halogen_displacement" 
  | "alkali_water";

export interface Particle {
  id: number;
  type: string;
  label: string;
  charge: string;
  role: "reactant" | "spectator" | "product";
  gradient: string;
  glowColor: string;
  x: number; // in pixels
  y: number; // in pixels
  vx: number;
  vy: number;
  radius: number; // in pixels
  mass: number;
  ionicRadiusPm: number; // Picometers
  isFixed?: boolean;
  opacity?: number;
}

export const MolecularSimulator: React.FC = () => {
  const [reactionType, setReactionType] = useState<ReactionType>("double_displacement");
  const [simulationState, setSimulationState] = useState<"idle" | "reacting" | "paused" | "completed">("idle");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [temperature, setTemperature] = useState<number>(25); // Celsius 20 - 100
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 0.5, 1, 2
  const [filterSpectators, setFilterSpectators] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [narration, setNarration] = useState<string>("");
  const [solutionColor, setSolutionColor] = useState<string>("bg-sky-500/10");
  const [showExplanationCard, setShowExplanationCard] = useState<boolean>(true);
  const [clickedParticle, setClickedParticle] = useState<Particle | null>(null);
  const [reactionCounter, setReactionCounter] = useState<number>(0);
  const [sparkEffect, setSparkEffect] = useState<{ x: number; y: number; id: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(performance.now());

  // Sync ref with state
  particlesRef.current = particles;

  // Native Web Audio Synthesizer (Zero asset dependency, purely offline & high performance)
  const playSynthSound = useCallback((type: "bounce" | "react" | "spark" | "heat") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      if (type === "bounce") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "react") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === "spark") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.linearRampToValueAtTime(250, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "heat") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.2);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {}
  }, [soundEnabled]);

  // Scientific metadata for each particle type
  const getParticleMeta = (type: string) => {
    switch (type) {
      case "Ag+":
        return {
          name: "أيون الفضة الموجب",
          formula: "Ag⁺",
          charge: "+1",
          radius: "126 pm",
          roleDesc: "أيون متفاعل نشط يبحث عن أيونات الكلوريد السالبة لتكوين شبكة بلورية غير ذائبة من ملح كلوريد الفضة AgCl.",
          colorDesc: "كاتيون فلزي لامع ببريق فضي"
        };
      case "Cl-":
        return {
          name: "أيون الكلوريد السالب",
          formula: "Cl⁻",
          charge: "-1",
          radius: "181 pm",
          roleDesc: "أيون سالب محاط بسحابة إلكترونية ثمانية مستقرة، يتجاذب كهروستاتيكياً مع أيون الفضة لتكوين الراسب الأبيض الناصع.",
          colorDesc: "أنيون هالوجيني زمردي"
        };
      case "Na+":
        return {
          name: "أيون الصوديوم المتفرج",
          formula: "Na⁺",
          charge: "+1",
          radius: "102 pm",
          roleDesc: "أيون متفرج (Spectator Ion) ذائب في المحلول، لا يدخل في تفاعل الترسيب أو التغير الكيميائي ويظل سابحاً بحرية قبل وبعد التفاعل.",
          colorDesc: "كاتيون قلوي أزرق سماوي"
        };
      case "NO3-":
        return {
          name: "أيون النترات المتفرج",
          formula: "NO₃⁻",
          charge: "-1",
          radius: "179 pm",
          roleDesc: "أيون مركب متعدد الذرات متفرج (Spectator Ion) يتمتع بقابلية ذوبان فائقة في الماء ولا يرتبط بأي راسب في هذا التفاعل.",
          colorDesc: "أنيون نترات برتقالي هرمي مستقر"
        };
      case "AgCl":
        return {
          name: "كلوريد الفضة (راسب صلب)",
          formula: "AgCl↓",
          charge: "0 (متعادل)",
          radius: "بلورة صلبة",
          roleDesc: "راسب أبيض بلوري غير قابل للذوبان في الماء، ترسب في قاع الكأس بسبب طاقة الشبكة البلورية العالية.",
          colorDesc: "بلورة بيضاء متماسكة"
        };
      case "Zn":
        return {
          name: "ذرة خارصين صلبة (صفيحة)",
          formula: "Zn (s)",
          charge: "0",
          radius: "134 pm",
          roleDesc: "فلز نشط في السلسلة الكهروكيميائية يعمل كعامل مختزل قوي، يفقد إلكترونين (يتأكسد) ليعطيهما لأيونات النحاس.",
          colorDesc: "فلز انتقالي رمادي لامع"
        };
      case "Cu2+":
        return {
          name: "أيون النحاس الثنائي",
          formula: "Cu²⁺",
          charge: "+2",
          radius: "73 pm",
          roleDesc: "أيون مائي يعطي المحلول لونه الأزرق البراق، يكتسب إلكترونين (يختزل) عند اصطدامه بالخارصين ليتحول لذرات نحاس صلبة.",
          colorDesc: "كاتيون نحاسي أزرق سماوي مشع"
        };
      case "Zn2+":
        return {
          name: "أيون خارصين ثنائي ذائب",
          formula: "Zn²⁺",
          charge: "+2",
          radius: "74 pm",
          roleDesc: "أيون عديم اللون ناتج عن أكسدة فلز الخارصين، ذاب في المحلول بعد أن فقد إلكترونيه.",
          colorDesc: "كاتيون ذائب شفاف"
        };
      case "Cu":
        return {
          name: "فلز النحاس المترسب",
          formula: "Cu (s)↓",
          charge: "0",
          radius: "128 pm",
          roleDesc: "نحاس فلزي أحمر طوبي ترسب على صفيحة الخارصين نتيجة تفاعل الاختزال.",
          colorDesc: "فلز نحاس طوبي محمر"
        };
      case "SO42-":
        return {
          name: "أيون الكبريتات المتفرج",
          formula: "SO₄²⁻",
          charge: "-2",
          radius: "230 pm",
          roleDesc: "أيون متفرج يحافظ على التعادل الكهربائي العام للكأس المائي دون أن يتأكسد أو يختزل.",
          colorDesc: "أنيون كبريتات كهرماني مستقر"
        };
      case "H+":
        return {
          name: "أيون الهيدروجين الموجب (البروتون)",
          formula: "H⁺ / H₃O⁺",
          charge: "+1",
          radius: "سريع ومكثف",
          roleDesc: "يمثل حموضة المحلول، سريع الحركة وينجذب فورياً لهيدروكسيد القاعدة لتكوين جزيء الماء.",
          colorDesc: "بروتون ياقوتي متوهج"
        };
      case "OH-":
        return {
          name: "أيون الهيدروكسيد السالب",
          formula: "OH⁻",
          charge: "-1",
          radius: "137 pm",
          roleDesc: "يمثل قلوية المحلول، يتحد مع أيون الهيدروجين مطلقاً حرارة التعادل المميزة.",
          colorDesc: "أنيون هيدروكسيد بنفسجي ملكي"
        };
      case "H2O":
        return {
          name: "جزيء الماء المتعادل",
          formula: "H₂O (l)",
          charge: "0 (متعادل)",
          radius: "جزيء زاوي",
          roleDesc: "جزيء ماء مستقر ومتعادل الشحنة بزاوية 104.5° تشكل نتيجة الاتحاد التام بين الحمض والقاعدة.",
          colorDesc: "جزيء ماء نقي شفاف"
        };
      case "Cl2":
        return {
          name: "جزيء الكلور الحر المذاب",
          formula: "Cl₂ (aq)",
          charge: "0",
          radius: "ثنائي الذرة",
          roleDesc: "عامل مؤكسد قوي من المجموعة السابعة، يزيح البروم الأقل نشاطاً من أملاحه المائية.",
          colorDesc: "غاز مائي مخضر فاتح"
        };
      case "Br-":
        return {
          name: "أيون البروميد السالب",
          formula: "Br⁻",
          charge: "-1",
          radius: "196 pm",
          roleDesc: "أنيون هالوجيني يفقد إلكتروناً لصالح الكلور الأكثر كهروسالبية، ليتحول لماء البروم الحر.",
          colorDesc: "أنيون بروميد أحمر وردي"
        };
      case "Br2":
        return {
          name: "جزيء البروم الحر المائي",
          formula: "Br₂ (aq)",
          charge: "0",
          radius: "ثنائي الذرة",
          roleDesc: "بروم حر ملون يعطي المحلول لونه البرتقالي البني المميز بعد إزاحته بواسطة غاز الكلور.",
          colorDesc: "جزيء بروم برتقالي عنبري"
        };
      case "Na_metal":
        return {
          name: "ذرة صوديوم نشطة",
          formula: "Na (s)",
          charge: "0",
          radius: "186 pm",
          roleDesc: "فلز قلوي من المجموعة الأولى شديد النشاط، يتفاعل بعنف مع الماء مطلقا غاز الهيدروجين وقلوياً.",
          colorDesc: "فلز صوديوم ذهبي متوهج"
        };
      case "H2_gas":
        return {
          name: "غاز الهيدروجين المتصاعد",
          formula: "H₂ (g)↑",
          charge: "0",
          radius: "فقاعة غازية",
          roleDesc: "غاز الهيدروجين خفيف الوزن المتصاعد على شكل فقاعات حركية سريعة نحو السطح.",
          colorDesc: "فقاعة غازية صاعدة"
        };
      default:
        return {
          name: "جسيم كيميائي مجهري",
          formula: type,
          charge: "متغير",
          radius: "مجهري",
          roleDesc: "جسيم أولي يشارك في ديناميكا التفاعل الكيميائي تحت المجهر الافتراضي.",
          colorDesc: "جسيم تفاعلي"
        };
    }
  };

  // Initialize Particles based on Reaction Type with pixel coordinates
  const initParticles = useCallback((type: ReactionType) => {
    setSimulationState("idle");
    setReactionCounter(0);
    setSparkEffect(null);
    setClickedParticle(null);

    const width = containerRef.current?.clientWidth || 700;
    const height = containerRef.current?.clientHeight || 340;
    const meniscusY = height * 0.22;
    const activeHeight = height * 0.72;

    let newParticles: Particle[] = [];
    let id = 1;

    if (type === "double_displacement") {
      setSolutionColor("bg-sky-500/10");
      setNarration("حالة ما قبل التفاعل: أيونات الفضة Ag⁺، والكلوريد Cl⁻، والصوديوم Na⁺، والنترات NO₃⁻ تسبح وتتصادم بمرونة تامة في المحلول المائي.");

      // 3 Ag+, 3 Cl-, 3 Na+, 3 NO3-
      const specs = [
        {
          type: "Ag+",
          label: "Ag⁺",
          charge: "+",
          role: "reactant" as const,
          gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #cbd5e1 45%, #94a3b8 75%, #475569 100%)",
          glowColor: "rgba(203, 213, 225, 0.7)",
          radius: 22,
          mass: 107.8,
          ionicRadiusPm: 126
        },
        {
          type: "Cl-",
          label: "Cl⁻",
          charge: "−",
          role: "reactant" as const,
          gradient: "radial-gradient(circle at 35% 35%, #a7f3d0 0%, #10b981 50%, #047857 85%, #064e3b 100%)",
          glowColor: "rgba(16, 185, 129, 0.8)",
          radius: 24,
          mass: 35.45,
          ionicRadiusPm: 181
        },
        {
          type: "Na+",
          label: "Na⁺",
          charge: "+",
          role: "spectator" as const,
          gradient: "radial-gradient(circle at 35% 35%, #bfdbfe 0%, #3b82f6 50%, #1d4ed8 85%, #172554 100%)",
          glowColor: "rgba(59, 130, 246, 0.7)",
          radius: 21,
          mass: 22.99,
          ionicRadiusPm: 102
        },
        {
          type: "NO3-",
          label: "NO₃⁻",
          charge: "−",
          role: "spectator" as const,
          gradient: "radial-gradient(circle at 35% 35%, #fed7aa 0%, #f97316 55%, #c2410c 85%, #7c2d12 100%)",
          glowColor: "rgba(249, 115, 22, 0.7)",
          radius: 27,
          mass: 62.0,
          ionicRadiusPm: 179
        }
      ];

      specs.forEach(spec => {
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.0 + Math.random() * 0.8;
          newParticles.push({
            id: id++,
            type: spec.type,
            label: spec.label,
            charge: spec.charge,
            role: spec.role,
            gradient: spec.gradient,
            glowColor: spec.glowColor,
            x: 60 + Math.random() * (width - 120),
            y: meniscusY + 30 + Math.random() * (activeHeight - 60),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: spec.radius,
            mass: spec.mass,
            ionicRadiusPm: spec.ionicRadiusPm
          });
        }
      });
    } else if (type === "redox") {
      setSolutionColor("bg-cyan-500/25");
      setNarration("حالة ما قبل التفاعل: صفيحة فلز الخارصين Zn الصلب مغمورة في محلول كبريتات النحاس CuSO₄ الأزرق البراق المحتوي على أيونات Cu²⁺ و SO₄²⁻.");

      // Solid Zn plate at bottom (fixed atoms)
      const znCount = 5;
      const startX = width * 0.25;
      const stepX = (width * 0.5) / (znCount - 1);
      const plateY = height * 0.84;

      for (let i = 0; i < znCount; i++) {
        newParticles.push({
          id: id++,
          type: "Zn",
          label: "Zn",
          charge: "0",
          role: "reactant",
          gradient: "radial-gradient(circle at 35% 35%, #f1f5f9 0%, #94a3b8 55%, #475569 85%, #1e293b 100%)",
          glowColor: "rgba(148, 163, 184, 0.6)",
          x: startX + i * stepX,
          y: plateY,
          vx: 0,
          vy: 0,
          radius: 23,
          mass: 65.38,
          ionicRadiusPm: 134,
          isFixed: true
        });
      }

      // Cu2+ floating (3 items)
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.1 + Math.random() * 0.7;
        newParticles.push({
          id: id++,
          type: "Cu2+",
          label: "Cu²⁺",
          charge: "+2",
          role: "reactant",
          gradient: "radial-gradient(circle at 35% 35%, #a5f3fc 0%, #06b6d4 50%, #0891b2 85%, #164e63 100%)",
          glowColor: "rgba(6, 182, 212, 0.9)",
          x: 70 + Math.random() * (width - 140),
          y: meniscusY + 25 + Math.random() * (activeHeight * 0.5),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 22,
          mass: 63.55,
          ionicRadiusPm: 73
        });
      }

      // SO42- spectators (3 items)
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.0 + Math.random() * 0.6;
        newParticles.push({
          id: id++,
          type: "SO42-",
          label: "SO₄²⁻",
          charge: "−2",
          role: "spectator",
          gradient: "radial-gradient(circle at 35% 35%, #fef08a 0%, #eab308 50%, #ca8a04 85%, #713f12 100%)",
          glowColor: "rgba(234, 179, 8, 0.6)",
          x: 70 + Math.random() * (width - 140),
          y: meniscusY + 25 + Math.random() * (activeHeight * 0.5),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 27,
          mass: 96.06,
          ionicRadiusPm: 230
        });
      }
    } else if (type === "acid_base") {
      setSolutionColor("bg-purple-500/15");
      setNarration("حالة ما قبل التفاعل: حمض الهيدروكلوريك HCl وهيدروكسيد الصوديوم NaOH؛ أيونات H⁺ سريعة وأيونات OH⁻ تتصادم تمهيداً لإطلاق حرارة التعادل.");

      // H+ (3)
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.6 + Math.random() * 0.8;
        newParticles.push({
          id: id++,
          type: "H+",
          label: "H⁺",
          charge: "+",
          role: "reactant",
          gradient: "radial-gradient(circle at 35% 35%, #fecaca 0%, #ef4444 50%, #b91c1c 85%, #7f1d1d 100%)",
          glowColor: "rgba(239, 68, 68, 0.9)",
          x: 60 + Math.random() * (width * 0.4),
          y: meniscusY + 25 + Math.random() * (activeHeight - 50),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 18,
          mass: 1.008,
          ionicRadiusPm: 25
        });
      }

      // OH- (3)
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.3 + Math.random() * 0.7;
        newParticles.push({
          id: id++,
          type: "OH-",
          label: "OH⁻",
          charge: "−",
          role: "reactant",
          gradient: "radial-gradient(circle at 35% 35%, #e9d5ff 0%, #a855f7 50%, #7e22ce 85%, #581c87 100%)",
          glowColor: "rgba(168, 85, 247, 0.8)",
          x: width * 0.5 + Math.random() * (width * 0.4),
          y: meniscusY + 25 + Math.random() * (activeHeight - 50),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 23,
          mass: 17.01,
          ionicRadiusPm: 137
        });
      }

      // Na+ spectators (2) & Cl- spectators (2)
      for (let i = 0; i < 2; i++) {
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI * 2;
        newParticles.push({
          id: id++,
          type: "Na+",
          label: "Na⁺",
          charge: "+",
          role: "spectator",
          gradient: "radial-gradient(circle at 35% 35%, #bfdbfe 0%, #3b82f6 50%, #1d4ed8 85%, #172554 100%)",
          glowColor: "rgba(59, 130, 246, 0.6)",
          x: 70 + Math.random() * (width - 140),
          y: meniscusY + 25 + Math.random() * (activeHeight - 50),
          vx: Math.cos(angle1) * 1.2,
          vy: Math.sin(angle1) * 1.2,
          radius: 17,
          mass: 22.99,
          ionicRadiusPm: 102
        });
        newParticles.push({
          id: id++,
          type: "Cl-",
          label: "Cl⁻",
          charge: "−",
          role: "spectator",
          gradient: "radial-gradient(circle at 35% 35%, #a7f3d0 0%, #10b981 50%, #047857 85%, #064e3b 100%)",
          glowColor: "rgba(16, 185, 129, 0.6)",
          x: 70 + Math.random() * (width - 140),
          y: meniscusY + 25 + Math.random() * (activeHeight - 50),
          vx: Math.cos(angle2) * 1.2,
          vy: Math.sin(angle2) * 1.2,
          radius: 20,
          mass: 35.45,
          ionicRadiusPm: 181
        });
      }
    } else if (type === "halogen_displacement") {
      setSolutionColor("bg-amber-500/10");
      setNarration("حالة ما قبل التفاعل: غاز الكلور Cl₂ المذاب في الماء يتصادم مع أيونات البروميد Br⁻ في محلول بروميد البوتاسيوم KBr.");

      // Cl2 (2 molecules)
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        newParticles.push({
          id: id++,
          type: "Cl2",
          label: "Cl₂",
          charge: "0",
          role: "reactant",
          gradient: "radial-gradient(circle at 35% 35%, #d9f99d 0%, #84cc16 50%, #4d7c0f 85%, #1a2e05 100%)",
          glowColor: "rgba(132, 204, 22, 0.8)",
          x: 80 + Math.random() * (width * 0.4),
          y: meniscusY + 30 + Math.random() * (activeHeight - 60),
          vx: Math.cos(angle) * 1.2,
          vy: Math.sin(angle) * 1.2,
          radius: 25,
          mass: 70.9,
          ionicRadiusPm: 198
        });
      }

      // Br- (4 ions)
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        newParticles.push({
          id: id++,
          type: "Br-",
          label: "Br⁻",
          charge: "−",
          role: "reactant",
          gradient: "radial-gradient(circle at 35% 35%, #fca5a5 0%, #dc2626 50%, #991b1b 85%, #450a0a 100%)",
          glowColor: "rgba(220, 38, 38, 0.8)",
          x: width * 0.4 + Math.random() * (width * 0.5),
          y: meniscusY + 30 + Math.random() * (activeHeight - 60),
          vx: Math.cos(angle) * 1.2,
          vy: Math.sin(angle) * 1.2,
          radius: 24,
          mass: 79.9,
          ionicRadiusPm: 196
        });
      }

      // K+ spectators (4)
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        newParticles.push({
          id: id++,
          type: "Na+", // using same blue cation style for spectator K+
          label: "K⁺",
          charge: "+",
          role: "spectator",
          gradient: "radial-gradient(circle at 35% 35%, #ddd6fe 0%, #8b5cf6 50%, #6d28d9 85%, #2e1065 100%)",
          glowColor: "rgba(139, 92, 246, 0.6)",
          x: 60 + Math.random() * (width - 120),
          y: meniscusY + 30 + Math.random() * (activeHeight - 60),
          vx: Math.cos(angle) * 1.1,
          vy: Math.sin(angle) * 1.1,
          radius: 22,
          mass: 39.1,
          ionicRadiusPm: 138
        });
      }
    } else if (type === "alkali_water") {
      setSolutionColor("bg-sky-500/10");
      setNarration("حالة ما قبل التفاعل: ذرات صوديوم Na نشطة تلامس جزيئات الماء؛ يشتعل التفاعل القلوي مطلقاً الهيدروجين ويتلون الكاشف بالوردي.");

      // Sodium metal pieces floating on surface (2)
      for (let i = 0; i < 2; i++) {
        newParticles.push({
          id: id++,
          type: "Na_metal",
          label: "Na",
          charge: "0",
          role: "reactant",
          gradient: "radial-gradient(circle at 35% 35%, #fef08a 0%, #eab308 50%, #ca8a04 85%, #713f12 100%)",
          glowColor: "rgba(234, 179, 8, 0.9)",
          x: width * 0.3 + i * (width * 0.35),
          y: meniscusY + 15,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 0,
          radius: 26,
          mass: 22.99,
          ionicRadiusPm: 186
        });
      }

      // Water molecules (6)
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        newParticles.push({
          id: id++,
          type: "H2O",
          label: "H₂O",
          charge: "0",
          role: "reactant",
          gradient: "radial-gradient(circle at 35% 35%, #bae6fd 0%, #0284c7 55%, #0369a1 85%, #082f49 100%)",
          glowColor: "rgba(2, 132, 199, 0.6)",
          x: 60 + Math.random() * (width - 120),
          y: meniscusY + 35 + Math.random() * (activeHeight - 65),
          vx: Math.cos(angle) * 1.1,
          vy: Math.sin(angle) * 1.1,
          radius: 17,
          mass: 18.01,
          ionicRadiusPm: 140
        });
      }
    }

    setParticles(newParticles);
  }, []);

  // Initialize on mount or reactionType change
  useEffect(() => {
    initParticles(reactionType);
  }, [reactionType, initParticles]);

  // Main High-Precision Physics Loop with Elastic Collision Resolution
  useEffect(() => {
    const canvas = containerRef.current;
    if (!canvas) return;

    let isRunning = true;

    const tick = (now: number) => {
      if (!isRunning) return;

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.04);
      lastTimeRef.current = now;

      const width = canvas.clientWidth || 700;
      const height = canvas.clientHeight || 340;
      const meniscusY = height * 0.22;
      const floorY = height * 0.92;

      // Thermal speed scalar: sqrt(T_kelvin / 298.15)
      const thermalFactor = Math.sqrt((temperature + 273.15) / 298.15) * speedMultiplier;

      setParticles(prev => {
        if (prev.length === 0) return prev;

        // Clone particles for mutation
        const pts = prev.map(p => ({ ...p }));
        const n = pts.length;

        // 1. Move free particles
        for (let i = 0; i < n; i++) {
          const p = pts[i];
          if (p.isFixed) continue;

          // Precipitate gravity settling
          if (p.type === "AgCl" && p.y < floorY - p.radius - 2) {
            p.vy += 0.25;
            p.vx *= 0.92;
          }

          p.x += p.vx * thermalFactor;
          p.y += p.vy * thermalFactor;

          // Boundary bounce with damping
          const leftBound = 35 + p.radius;
          const rightBound = width - 35 - p.radius;
          const topBound = meniscusY + p.radius;
          const bottomBound = floorY - p.radius;

          if (p.x < leftBound) {
            p.x = leftBound;
            p.vx = Math.abs(p.vx);
          } else if (p.x > rightBound) {
            p.x = rightBound;
            p.vx = -Math.abs(p.vx);
          }

          if (p.y < topBound) {
            p.y = topBound;
            p.vy = Math.abs(p.vy);
          } else if (p.y > bottomBound) {
            p.y = bottomBound;
            if (p.type === "AgCl") {
              p.vy = 0;
              p.vx = 0;
            } else {
              p.vy = -Math.abs(p.vy);
            }
          }
        }

        // 2. Elastic Circle-Circle Collisions & Chemical Reaction Bindings
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const p1 = pts[i];
            const p2 = pts[j];

            if (!p1 || !p2) continue;

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distSq = dx * dx + dy * dy;
            const minDist = p1.radius + p2.radius;

            if (distSq < minDist * minDist && distSq > 0.001) {
              const dist = Math.sqrt(distSq);
              const overlap = minDist - dist;
              const nx = dx / dist;
              const ny = dy / dist;

              // --- REACTION PHASE TRIGGER CHECKS ---
              if (simulationState === "reacting") {
                // A. Double displacement: Ag+ + Cl- -> AgCl precipitate
                if (
                  (p1.type === "Ag+" && p2.type === "Cl-") ||
                  (p1.type === "Cl-" && p2.type === "Ag+")
                ) {
                  playSynthSound("react");
                  setSparkEffect({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, id: Date.now() });

                  // Transform p1 into solid AgCl crystal and remove p2
                  p1.type = "AgCl";
                  p1.label = "AgCl↓";
                  p1.role = "product";
                  p1.gradient = "radial-gradient(circle at 35% 35%, #ffffff 0%, #f1f5f9 45%, #cbd5e1 80%, #64748b 100%)";
                  p1.glowColor = "rgba(255, 255, 255, 0.9)";
                  p1.radius = 24;
                  p1.vx = 0;
                  p1.vy = 1.2; // Start sinking

                  pts.splice(j, 1);
                  setReactionCounter(prev => prev + 1);
                  continue;
                }

                // B. Redox: Cu2+ + Zn -> Cu(s) + Zn2+
                if (
                  (p1.type === "Cu2+" && p2.type === "Zn") ||
                  (p1.type === "Zn" && p2.type === "Cu2+")
                ) {
                  const cuParticle = p1.type === "Cu2+" ? p1 : p2;
                  const znParticle = p1.type === "Zn" ? p1 : p2;

                  playSynthSound("spark");
                  setSparkEffect({ x: znParticle.x, y: znParticle.y - 15, id: Date.now() });

                  // Zn dissolves into Zn2+
                  znParticle.type = "Zn2+";
                  znParticle.label = "Zn²⁺";
                  znParticle.role = "product";
                  znParticle.gradient = "radial-gradient(circle at 35% 35%, #ffffff 0%, #e2e8f0 60%, #cbd5e1 100%)";
                  znParticle.glowColor = "rgba(226, 232, 240, 0.7)";
                  znParticle.isFixed = false;
                  znParticle.vx = (Math.random() - 0.5) * 1.5;
                  znParticle.vy = -1.2; // Dissolves upward

                  // Cu2+ reduces into metallic Cu deposited on plate
                  cuParticle.type = "Cu";
                  cuParticle.label = "Cu↓";
                  cuParticle.role = "product";
                  cuParticle.gradient = "radial-gradient(circle at 35% 35%, #fdba74 0%, #b45309 60%, #78350f 100%)";
                  cuParticle.glowColor = "rgba(180, 83, 9, 0.8)";
                  cuParticle.x = znParticle.x;
                  cuParticle.y = floorY - cuParticle.radius - 4;
                  cuParticle.vx = 0;
                  cuParticle.vy = 0;
                  cuParticle.isFixed = true;

                  setReactionCounter(prev => prev + 1);
                  // Gradually fade solution color
                  setSolutionColor(prev => prev.includes("25") ? "bg-cyan-500/15" : "bg-cyan-500/5");
                  continue;
                }

                // C. Acid-Base: H+ + OH- -> H2O + Heat
                if (
                  (p1.type === "H+" && p2.type === "OH-") ||
                  (p1.type === "OH-" && p2.type === "H+")
                ) {
                  playSynthSound("heat");
                  setSparkEffect({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, id: Date.now() });

                  p1.type = "H2O";
                  p1.label = "H₂O";
                  p1.role = "product";
                  p1.gradient = "radial-gradient(circle at 35% 35%, #bae6fd 0%, #0284c7 55%, #0369a1 85%, #082f49 100%)";
                  p1.glowColor = "rgba(2, 132, 199, 0.7)";
                  p1.radius = 21;

                  pts.splice(j, 1);
                  setReactionCounter(prev => prev + 1);
                  continue;
                }

                // D. Halogen displacement: Cl2 + 2Br- -> 2Cl- + Br2
                if (
                  (p1.type === "Cl2" && p2.type === "Br-") ||
                  (p1.type === "Br-" && p2.type === "Cl2")
                ) {
                  const cl2 = p1.type === "Cl2" ? p1 : p2;
                  const br = p1.type === "Br-" ? p1 : p2;

                  playSynthSound("react");
                  setSparkEffect({ x: (cl2.x + br.x) / 2, y: (cl2.y + br.y) / 2, id: Date.now() });

                  // Turn Cl2 into Cl-
                  cl2.type = "Cl-";
                  cl2.label = "Cl⁻";
                  cl2.role = "product";
                  cl2.gradient = "radial-gradient(circle at 35% 35%, #a7f3d0 0%, #10b981 50%, #047857 85%, #064e3b 100%)";
                  cl2.glowColor = "rgba(16, 185, 129, 0.8)";
                  cl2.radius = 19;

                  // Turn Br- into Br2 (orange colored water)
                  br.type = "Br2";
                  br.label = "Br₂";
                  br.role = "product";
                  br.gradient = "radial-gradient(circle at 35% 35%, #fed7aa 0%, #f97316 55%, #c2410c 85%, #7c2d12 100%)";
                  br.glowColor = "rgba(249, 115, 22, 0.9)";
                  br.radius = 23;

                  setReactionCounter(prev => prev + 1);
                  setSolutionColor("bg-amber-600/25"); // Turns bromine amber!
                  continue;
                }

                // E. Alkali metal with water: Na_metal + H2O -> Na+ + OH- + H2
                if (
                  (p1.type === "Na_metal" && p2.type === "H2O") ||
                  (p1.type === "H2O" && p2.type === "Na_metal")
                ) {
                  const na = p1.type === "Na_metal" ? p1 : p2;
                  const h2o = p1.type === "H2O" ? p1 : p2;

                  playSynthSound("spark");
                  setSparkEffect({ x: na.x, y: na.y, id: Date.now() });

                  // Na oxidizes to Na+
                  na.type = "Na+";
                  na.label = "Na⁺";
                  na.role = "product";
                  na.gradient = "radial-gradient(circle at 35% 35%, #bfdbfe 0%, #3b82f6 50%, #1d4ed8 85%, #172554 100%)";
                  na.glowColor = "rgba(59, 130, 246, 0.7)";
                  na.radius = 17;
                  na.vy = 1.0;

                  // H2O turns into H2 gas bubble rising up
                  h2o.type = "H2_gas";
                  h2o.label = "H₂↑";
                  h2o.role = "product";
                  h2o.gradient = "radial-gradient(circle at 35% 35%, #ffffff 0%, #e0f2fe 50%, #7dd3fc 85%, #0284c7 100%)";
                  h2o.glowColor = "rgba(125, 211, 252, 0.8)";
                  h2o.radius = 16;
                  h2o.vy = -2.5; // Gas escapes rapidly

                  setReactionCounter(prev => prev + 1);
                  setSolutionColor("bg-pink-600/20"); // Phenolphthalein turns pink!
                  continue;
                }
              }

              // Normal Elastic Impulse Collision (no overlapping!)
              if (p1.isFixed && !p2.isFixed) {
                p2.x += nx * overlap;
                p2.y += ny * overlap;
                p2.vx = Math.abs(p2.vx) * (nx > 0 ? 1 : -1);
                p2.vy = Math.abs(p2.vy) * (ny > 0 ? 1 : -1);
              } else if (!p1.isFixed && p2.isFixed) {
                p1.x -= nx * overlap;
                p1.y -= ny * overlap;
                p1.vx = Math.abs(p1.vx) * (nx < 0 ? 1 : -1);
                p1.vy = Math.abs(p1.vy) * (ny < 0 ? 1 : -1);
              } else if (!p1.isFixed && !p2.isFixed) {
                // Separate positions
                p1.x -= (nx * overlap) / 2;
                p1.y -= (ny * overlap) / 2;
                p2.x += (nx * overlap) / 2;
                p2.y += (ny * overlap) / 2;

                // Impulse exchange
                const kx = p1.vx - p2.vx;
                const ky = p1.vy - p2.vy;
                const p = (2 * (nx * kx + ny * ky)) / (p1.mass + p2.mass);

                p1.vx -= p * p2.mass * nx;
                p1.vy -= p * p2.mass * ny;
                p2.vx += p * p1.mass * nx;
                p2.vy += p * p1.mass * ny;

                // Occasional subtle bounce sound
                if (Math.random() < 0.15) {
                  playSynthSound("bounce");
                }
              }
            }
          }
        }

        // Check completion criteria
        if (simulationState === "reacting") {
          const hasReactants = pts.some(p => p.role === "reactant");
          if (!hasReactants && reactionCounter > 0) {
            setSimulationState("completed");
            setNarration("✨ اكتمل التفاعل الكيميائي بالكامل! تحولت جميع المتفاعلات لنواتج مستقرة وتوقفت مرحلة التصادم الفعال.");
          }
        }

        return pts;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [simulationState, temperature, speedMultiplier, playSynthSound, reactionCounter]);

  // Handle Start, Pause, Resume & Reset
  const handleStartReaction = () => {
    setSimulationState("reacting");
    if (reactionType === "double_displacement") {
      setNarration("⚡ مرحلة التصادم الفعال: تتصادم أيونات الفضة Ag⁺ الموجبة مع أيونات الكلوريد Cl⁻ السالبة لتتحد وتترسب فورياً كبلورات AgCl بيضاء ناصعة!");
    } else if (reactionType === "redox") {
      setNarration("⚡ انتقال الإلكترونات 2e⁻: تصطدم أيونات Cu²⁺ الزرقاء بصفيحة الخارصين فتنتزع منها إلكترونين لتتحول لنحاس صلب أحمر ويذوب الخارصين!");
    } else if (reactionType === "acid_base") {
      setNarration("⚡ انطلاق حرارة التعادل: تتصادم بروتونات H⁺ مع أنيونات OH⁻ لتكون جزيئات الماء المتعادل H₂O وتنطلق طاقة حرارية طاردة!");
    } else if (reactionType === "halogen_displacement") {
      setNarration("⚡ إزاحة الهالوجين: الكلور Cl₂ الأكثر نشاطاً ينتزع الإلكترونات من البروميد Br⁻ فيتحول المحلول للون البروم العنبري!");
    } else if (reactionType === "alkali_water") {
      setNarration("⚡ فوران فلزات الأقلاء: يتفاعل الصوديوم بشدة مع الماء مطلقاً غاز الهيدروجين ويتلون الماء بالوردي القرمزي!");
    }
  };

  const handlePause = () => setSimulationState("paused");
  const handleResume = () => setSimulationState("reacting");
  const handleReset = () => initParticles(reactionType);

  // 🔬 High-Contrast Chemical Typography Renderer (Subscripts, Superscripts & Ionic Polarity)
  const renderParticleLabel = (p: Particle) => {
    switch (p.type) {
      case "Ag+":
        return (
          <span className="font-extrabold text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            Ag<sup className="text-[10px] font-black ml-0.5 text-blue-900">+</sup>
          </span>
        );
      case "Cl-":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            Cl<sup className="text-[11px] font-black ml-0.5 text-emerald-200">−</sup>
          </span>
        );
      case "Na+":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            Na<sup className="text-[11px] font-black ml-0.5 text-sky-200">+</sup>
          </span>
        );
      case "NO3-":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[11px] sm:text-[12px] flex items-center justify-center leading-none tracking-tight">
            NO<sub className="text-[9px] font-black -mb-1">3</sub><sup className="text-[10px] font-black ml-0.5 text-amber-200">−</sup>
          </span>
        );
      case "Cu2+":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            Cu<sup className="text-[10px] font-black ml-0.5 text-cyan-200">2+</sup>
          </span>
        );
      case "SO42-":
      case "SO4_2-":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[11px] sm:text-[12px] flex items-center justify-center leading-none tracking-tight">
            SO<sub className="text-[9px] font-black -mb-1">4</sub><sup className="text-[10px] font-black ml-0.5 text-yellow-200">2−</sup>
          </span>
        );
      case "Zn":
        return (
          <span className="font-extrabold text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-[11px] sm:text-[12px] flex items-center justify-center leading-none tracking-tight">
            Zn<span className="text-[8px] font-bold text-slate-700 ml-0.5">(s)</span>
          </span>
        );
      case "Zn2+":
        return (
          <span className="font-extrabold text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            Zn<sup className="text-[10px] font-black ml-0.5 text-indigo-900">2+</sup>
          </span>
        );
      case "H+":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            H<sup className="text-[11px] font-black ml-0.5 text-rose-200">+</sup>
          </span>
        );
      case "OH-":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            OH<sup className="text-[11px] font-black ml-0.5 text-purple-200">−</sup>
          </span>
        );
      case "H2O":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            H<sub className="text-[9px] font-black -mb-1">2</sub>O
          </span>
        );
      case "Cl2":
        return (
          <span className="font-extrabold text-lime-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            Cl<sub className="text-[9px] font-black -mb-1">2</sub>
          </span>
        );
      case "Br-":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            Br<sup className="text-[11px] font-black ml-0.5 text-red-200">−</sup>
          </span>
        );
      case "Br2":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            Br<sub className="text-[9px] font-black -mb-1">2</sub>
          </span>
        );
      case "K+":
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            K<sup className="text-[11px] font-black ml-0.5 text-purple-200">+</sup>
          </span>
        );
      case "Na_metal":
        return (
          <span className="font-extrabold text-amber-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] text-[12px] sm:text-[13px] flex items-center justify-center leading-none tracking-tight">
            Na<span className="text-[8px] font-bold text-amber-900 ml-0.5">(s)</span>
          </span>
        );
      case "AgCl":
        return (
          <span className="font-extrabold text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-[11px] sm:text-[12px] flex items-center justify-center leading-none tracking-tight">
            AgCl<span className="text-[10px] font-black text-emerald-800 ml-0.5">↓</span>
          </span>
        );
      case "Cu":
        return (
          <span className="font-extrabold text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-[11px] sm:text-[12px] flex items-center justify-center leading-none tracking-tight">
            Cu<span className="text-[9px] font-bold text-amber-300 ml-0.5">↓</span>
          </span>
        );
      case "H2_gas":
        return (
          <span className="font-extrabold text-sky-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-[11px] sm:text-[12px] flex items-center justify-center leading-none tracking-tight">
            H<sub className="text-[8px] font-black -mb-1">2</sub><span className="text-[9px] font-black text-sky-700 ml-0.5">↑</span>
          </span>
        );
      default:
        return (
          <span className="font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] text-xs flex items-center justify-center leading-none">
            {p.label}
          </span>
        );
    }
  };


  return (
    <div id="molecular_simulator_panel" className="bg-[#FAF9F5] border border-[#E5E2DE] rounded-2xl p-4 sm:p-6 space-y-5 shadow-xs text-right mt-6 select-none">
      
      {/* 1. Header & Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E5E2DE] pb-4 gap-3">
        <div className="order-2 md:order-1 flex-1">
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
              مجهر تصادم الجزيئات الافتراضي
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#2C3E50] tracking-tight flex items-center gap-1.5">
              <span>أداة المحاكاة الجزيئية التفاعلية للتفاعلات الأساسية</span>
              <Sparkles className="w-5 h-5 text-[#E67E22] animate-pulse" />
            </h3>
          </div>
          <p className="text-xs text-[#7F8C8D] mt-1">
            شاهد تصادم الأيونات المجهري، انتقال الإلكترونات، تكوّن الرواسب، وتمييز الأيونات المتفرجة (Spectator Ions) حسب منهج الكيمياء السوداني.
          </p>
        </div>

        <div className="flex items-center gap-2 order-1 md:order-2 self-end md:self-auto">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? "كتم المؤثرات الصوتية" : "تشغيل المؤثرات الصوتية"}
            className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-[#E5E2DE] shadow-2xs transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-100">
            <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* 2. Reaction Selector & Chemical Equation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Dropdown Selector */}
        <div className="md:col-span-6 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#7F8C8D] flex items-center justify-end gap-1">
            <span>اختر التفاعل الكيميائي المجهري:</span>
          </label>
          <div className="relative">
            <select
              value={reactionType}
              onChange={(e) => setReactionType(e.target.value as ReactionType)}
              disabled={simulationState === "reacting" || simulationState === "paused"}
              className="w-full appearance-none bg-white border border-[#E5E2DE] text-[#2C3E50] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-[#E67E22]/30 focus:border-[#E67E22] transition-all cursor-pointer shadow-2xs text-right pr-3 pl-8"
              dir="rtl"
            >
              <option value="double_displacement">🔄 1. إحلال مزدوج وترسيب (NaCl + AgNO₃ ⟶ AgCl↓ + NaNO₃)</option>
              <option value="redox">⚡ 2. أكسدة واختزال فلزات (Zn + CuSO₄ ⟶ ZnSO₄ + Cu↓)</option>
              <option value="acid_base">🧪 3. تعادل حمض وقاعدة (HCl + NaOH ⟶ NaCl + H₂O)</option>
              <option value="halogen_displacement">🟡 4. إزاحة الهالوجينات (Cl₂ + 2KBr ⟶ 2KCl + Br₂)</option>
              <option value="alkali_water">🔥 5. تفاعل الصوديوم مع الماء (2Na + 2H₂O ⟶ 2NaOH + H₂↑)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Live Equation Display */}
        <div className="md:col-span-6 bg-white border border-[#E5E2DE] p-2.5 rounded-xl text-center font-mono text-[11px] text-[#2C3E50] font-bold shadow-2xs flex items-center justify-center min-h-[42px]" dir="ltr">
          {reactionType === "double_displacement" && (
            <span className="text-emerald-800">NaCl (aq) + AgNO₃ (aq) ⟶ NaNO₃ (aq) + AgCl (s)↓</span>
          )}
          {reactionType === "redox" && (
            <span className="text-cyan-800">Zn (s) + CuSO₄ (aq) ⟶ ZnSO₄ (aq) + Cu (s)↓</span>
          )}
          {reactionType === "acid_base" && (
            <span className="text-purple-800">HCl (aq) + NaOH (aq) ⟶ NaCl (aq) + H₂O (l) + ΔH</span>
          )}
          {reactionType === "halogen_displacement" && (
            <span className="text-amber-800">Cl₂ (aq) + 2KBr (aq) ⟶ 2KCl (aq) + Br₂ (aq)</span>
          )}
          {reactionType === "alkali_water" && (
            <span className="text-rose-800">2Na (s) + 2H₂O (l) ⟶ 2NaOH (aq) + H₂ (g)↑</span>
          )}
        </div>
      </div>

      {/* 3. Interactive Physics Controls: Temperature & Spectator Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E5E2DE] p-3 rounded-xl shadow-2xs">
        {/* Temperature Kinetics Slider */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1 text-amber-600">
            <Thermometer className="w-4 h-4" />
            <span>الحرارة:</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-24 sm:w-32 accent-[#E67E22] cursor-pointer"
          />
          <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
            {temperature}°C
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">(تتحكم بسرعة التصادم)</span>
        </div>

        {/* Speed Controls (0.5x, 1x, 2x) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold px-1.5 flex items-center gap-1">
            <FastForward className="w-3 h-3" />
            <span>السرعة:</span>
          </span>
          {[0.5, 1, 2].map(speed => (
            <button
              key={speed}
              onClick={() => setSpeedMultiplier(speed)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                speedMultiplier === speed
                  ? "bg-[#E67E22] text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Spectator Ions Highlighting Filter */}
        <button
          onClick={() => setFilterSpectators(prev => !prev)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
            filterSpectators
              ? "bg-indigo-600 text-white shadow-indigo-200"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{filterSpectators ? "إلغاء عزل الأيونات" : "عزل الأيونات المتفرجة 🎯"}</span>
        </button>
      </div>

      {/* 4. Action Triggers Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-sky-500" />
          <span>انقر فوق أي أيون أو جزيء داخل الكأس لفحص مواصفاته وكتلته ودوره</span>
        </div>

        <div className="flex items-center gap-2 mr-auto">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-[#E5E2DE] rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة تعيين الكأس</span>
          </button>

          {simulationState === "idle" && (
            <button
              onClick={handleStartReaction}
              className="px-5 py-2 bg-[#E67E22] hover:bg-[#d6721b] text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>بدء التفاعل الجزيئي</span>
            </button>
          )}

          {simulationState === "reacting" && (
            <button
              onClick={handlePause}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>إيقاف مؤقت</span>
            </button>
          )}

          {simulationState === "paused" && (
            <button
              onClick={handleResume}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>استئناف التفاعل</span>
            </button>
          )}

          {simulationState === "completed" && (
            <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>اكتمل التفاعل الكيميائي ✓</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. Main High-Tech Laboratory Beaker Chamber */}
      <div 
        ref={containerRef}
        className="relative w-full h-[320px] sm:h-[380px] rounded-2xl bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] border-2 border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center select-none"
      >
        {/* Beaker Glassware Reflections & Inner Depth */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-black/40" />

        {/* Beaker Lip Rim at Top with Frosted Glass Edge */}
        <div className="absolute top-0 left-0 right-0 h-6 border-b border-white/20 bg-gradient-to-r from-slate-700/50 via-white/15 to-slate-700/50 backdrop-blur-sm flex items-center justify-between px-6 text-[10px] font-mono text-slate-300 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="font-bold text-emerald-400 tracking-wider">BOROSILICATE GLASS 3.3</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">DIN 12331 / ISO 3819 • 500 mL</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sky-300 font-bold font-mono">0.05 nm RESOLUTION</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              T = {temperature}°C
            </span>
          </div>
        </div>

        {/* Microscopic Grid Scale Lines (0.1 nm Grid) */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)", 
            backgroundSize: "28px 28px" 
          }} 
        />

        {/* Beaker Volumetric Graduation Marks on Left Glass Wall */}
        <div className="absolute left-4 top-14 bottom-10 flex flex-col justify-between text-[10px] font-mono font-bold text-slate-300 pointer-events-none z-20 border-l-2 border-slate-500/60 pl-2">
          <span className="flex items-center gap-1.5"><span className="w-4 h-[1.5px] bg-slate-300" /> 500 mL</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-slate-500" /> 450 mL</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-[1.5px] bg-slate-300" /> 400 mL</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-slate-500" /> 350 mL</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-[1.5px] bg-slate-300" /> 300 mL</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-slate-500" /> 250 mL</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-[1.5px] bg-slate-300" /> 200 mL</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-slate-500" /> 150 mL</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-[1.5px] bg-slate-300" /> 100 mL</span>
        </div>

        {/* Animated Fluid Meniscus & Solution Color */}
        <div 
          className={`absolute bottom-0 left-0 right-0 transition-colors duration-1000 ${solutionColor}`}
          style={{ height: "78%" }}
        >
          {/* Meniscus wave curve line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-400/30 via-white/50 to-sky-400/30 border-t border-white/40 shadow-xs" />
        </div>

        {/* 3D Glass Surface Reflections (diagonal specular glare) */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

        {/* 🌟 SPARK & ENERGY DISCHARGE EFFECT */}
        {sparkEffect && (
          <motion.div
            key={sparkEffect.id}
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute pointer-events-none z-40"
            style={{ left: sparkEffect.x - 20, top: sparkEffect.y - 20 }}
          >
            <div className="w-10 h-10 rounded-full bg-yellow-300 blur-sm flex items-center justify-center">
              <Zap className="w-6 h-6 text-white fill-yellow-200 animate-spin" />
            </div>
          </motion.div>
        )}

        {/* ⚛️ PARTICLES LAYER (3D VOLUMETRIC GLOSSY IONS & ATOMS) */}
        {particles.map(p => {
          const isDimmed = filterSpectators && p.role === "spectator";
          const isInspected = clickedParticle?.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => setClickedParticle(p)}
              className={`absolute transition-opacity duration-300 cursor-pointer ${
                isDimmed ? "opacity-20 grayscale" : "opacity-100"
              }`}
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: isInspected ? 45 : (p.isFixed ? 15 : 25)
              }}
            >
              {/* 3D Sphere Container with Radial Gradient, Dual Specular Highlights & Luminous Glow */}
              <div
                className={`relative rounded-full flex items-center justify-center select-none font-bold transition-all duration-200 ${
                  isInspected 
                    ? "scale-125 ring-4 ring-amber-400 shadow-2xl z-40" 
                    : "hover:scale-115 active:scale-95 shadow-lg hover:shadow-2xl"
                }`}
                style={{
                  width: `${p.radius * 2}px`,
                  height: `${p.radius * 2}px`,
                  background: p.gradient,
                  boxShadow: `0 0 20px ${p.glowColor}, inset 0 3px 6px rgba(255,255,255,0.85), inset 0 -4px 8px rgba(0,0,0,0.6)`
                }}
              >
                {/* Primary Top-Left Curved Specular Lens Highlight */}
                <div 
                  className="absolute top-1 left-1.5 rounded-full bg-gradient-to-br from-white/95 via-white/50 to-transparent pointer-events-none" 
                  style={{ 
                    width: `${Math.max(7, p.radius * 0.45)}px`, 
                    height: `${Math.max(5, p.radius * 0.32)}px`,
                    transform: "rotate(-28deg)"
                  }} 
                />

                {/* Secondary Bottom-Right Subsurface Bounce Light */}
                <div 
                  className="absolute bottom-1 right-1.5 rounded-full bg-white/30 pointer-events-none blur-[0.5px]" 
                  style={{ 
                    width: `${Math.max(6, p.radius * 0.35)}px`, 
                    height: `${Math.max(4, p.radius * 0.25)}px` 
                  }} 
                />

                {/* Chemical Symbol Label Rendered with High Contrast & Sub/Superscripts */}
                <div className="pointer-events-none select-none z-10 flex items-center justify-center">
                  {renderParticleLabel(p)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Static Solid Metal Plate Label for Redox */}
        {reactionType === "redox" && (
          <div className="absolute bottom-2 right-1/2 translate-x-1/2 pointer-events-none z-20">
            <span className="text-[10px] font-bold bg-slate-900/90 text-slate-300 px-3 py-0.5 rounded-full border border-slate-700 shadow-lg">
              صفيحة فلز الخارصين الصلب Zn (s)
            </span>
          </div>
        )}

        {/* Microscopic Scale Bar at Bottom Corner */}
        <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] font-mono text-slate-500 z-10 flex items-center gap-1.5">
          <div className="w-12 h-[2px] bg-slate-500 relative">
            <div className="absolute -left-0.5 -top-1 w-[1px] h-2.5 bg-slate-400" />
            <div className="absolute -right-0.5 -top-1 w-[1px] h-2.5 bg-slate-400" />
          </div>
          <span>0.2 nm (2 Å)</span>
        </div>
      </div>

      {/* 6. Clicked Particle Inspector Floating Drawer / Modal */}
      <AnimatePresence>
        {clickedParticle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-xl text-right space-y-2 relative"
          >
            <button
              onClick={() => setClickedParticle(null)}
              className="absolute left-3 top-3 text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-2 py-1 rounded cursor-pointer"
            >
              إغلاق ✕
            </button>

            {(() => {
              const meta = getParticleMeta(clickedParticle.type);
              return (
                <>
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md"
                      style={{ background: clickedParticle.gradient }}
                    >
                      {clickedParticle.label}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-400">{meta.name} ({meta.formula})</h4>
                      <span className="text-[10px] text-slate-400">
                        {clickedParticle.role === "spectator" ? "أيون متفرج (Spectator Ion)" : clickedParticle.role === "reactant" ? "مادة متفاعلة نشطة" : "ناتج تفاعل مستقر"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-1">
                    <div className="bg-slate-800/80 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">الشحنة الكهربائية:</span>
                      <span className="font-mono font-bold text-sky-300">{meta.charge}</span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">نصف القطر الأيوني:</span>
                      <span className="font-mono font-bold text-emerald-300">{meta.radius}</span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">المظهر المجهري:</span>
                      <span className="font-bold text-amber-200 text-[11px]">{meta.colorDesc}</span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">الحالة الحركية:</span>
                      <span className="font-mono font-bold text-purple-300">
                        {clickedParticle.isFixed ? "ثابت في الشبكة" : `${(Math.hypot(clickedParticle.vx, clickedParticle.vy) * 10).toFixed(1)} Å/fs`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                    <strong className="text-emerald-400">الدور الكيميائي في المنهج: </strong>
                    {meta.roleDesc}
                  </p>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Live Narration & Educational Observation Bar */}
      <div className="bg-[#E67E22]/10 border border-[#E67E22]/30 p-3.5 rounded-xl text-right">
        <div className="flex items-start gap-2.5 justify-end">
          <p className="text-xs text-[#2C3E50] font-sans font-bold leading-relaxed flex-1">
            {narration}
          </p>
          <div className="p-1.5 bg-[#E67E22]/20 rounded-lg text-[#E67E22] shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 8. Detailed Curriculum Chemistry Accordion */}
      <div className="border border-[#E5E2DE] rounded-xl overflow-hidden bg-white shadow-2xs">
        <button
          onClick={() => setShowExplanationCard(!showExplanationCard)}
          className="w-full flex justify-between items-center px-4 py-3 bg-[#F9F8F6] border-b border-[#E5E2DE] text-right cursor-pointer hover:bg-[#F2EFE9] transition-colors"
        >
          <span className="text-xs font-bold text-[#7F8C8D]">
            {showExplanationCard ? "إخفاء التفاصيل الأكاديمية" : "عرض التفاصيل الأكاديمية"}
          </span>
          <span className="text-xs font-bold text-[#2C3E50] font-serif flex items-center gap-1.5">
            التفسير العلمي والمطابقة مع كتاب الكيمياء (المركز القومي للمناهج - بخت الرضا)
            <Award className="w-4 h-4 text-amber-500" />
          </span>
        </button>

        <AnimatePresence>
          {showExplanationCard && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 space-y-3.5 text-right text-xs text-[#2C3E50] leading-relaxed"
            >
              {reactionType === "double_displacement" && (
                <>
                  <p>
                    <strong>تفاعلات الإحلال المزدوج والترسيب (Double Displacement & Precipitation)</strong>: تفاعلات تجري بين المركبات الأيونية في محاليلها المائية، حيث تتبادل الأيونات شركاءها، وتتحد الكاتيونات مع الأنيونات لتكوين راسب غير قابل للذوبان.
                  </p>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 text-center" dir="ltr">
                    Na⁺(aq) + Cl⁻(aq) + Ag⁺(aq) + NO₃⁻(aq) ⟶ AgCl(s)↓ + Na⁺(aq) + NO₃⁻(aq)
                  </p>
                  <p>
                    أيونات الصوديوم <span className="text-blue-600 font-bold">Na⁺</span> والنترات <span className="text-orange-600 font-bold">NO₃⁻</span> لم تشارك فعلياً في التفاعل ولذلك تسمى <strong>أيونات متفرجة (Spectator Ions)</strong>، في حين أن المعادلة الأيونية الصافية تعبر فقط عن تكون راسب كلوريد الفضة غير الذائب:
                  </p>
                  <p className="font-mono text-center font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-sm" dir="ltr">
                    Ag⁺(aq) + Cl⁻(aq) ⟶ AgCl(s)↓
                  </p>
                </>
              )}

              {reactionType === "redox" && (
                <>
                  <p>
                    <strong>تفاعلات الأكسدة والاختزال (Redox Reactions)</strong>: تفاعلات تتضمن انتقالاً حقيقياً للإلكترونات بين الذرات والأيونات استناداً إلى موقعها في السلسلة الكهروكيميائية.
                  </p>
                  <p>
                    1. <strong>الأكسدة (Oxidation)</strong>: فقد الإلكترونات بواسطة ذرات فلز الخارصين النشط <span className="text-slate-700 font-bold">Zn</span> وتآكل الصفيحة وتحولها لأيونات ذائبة:
                  </p>
                  <p className="bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[11px] text-center" dir="ltr">
                    Zn(s) ⟶ Zn²⁺(aq) + 2e⁻ (نصف تفاعل الأكسدة)
                  </p>
                  <p>
                    2. <strong>الاختزال (Reduction)</strong>: كسب الإلكترونات بواسطة أيونات النحاس الثنائي <span className="text-cyan-600 font-bold">Cu²⁺</span> الزرقاء لتترسب كفلز نحاس أحمر/بني طوبي على اللوح:
                  </p>
                  <p className="bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[11px] text-center" dir="ltr">
                    Cu²⁺(aq) + 2e⁻ ⟶ Cu(s)↓ (نصف تفاعل الاختزال)
                  </p>
                  <p>
                    أيونات الكبريتات <span className="text-yellow-600 font-bold">SO₄²⁻</span> تظل كأيونات متفرجة ثابتة لا يطرأ عليها تغير كيميائي.
                  </p>
                </>
              )}

              {reactionType === "acid_base" && (
                <>
                  <p>
                    <strong>تفاعل التعادل (Neutralization)</strong>: اتحاد أيونات الهيدروجين الحامضية المسؤولة عن الصفة الحمضية مع أيونات الهيدروكسيد القلوية المسؤولة عن الصفة القاعدية، مما ينتج ماءً متعادلاً وملحاً ذائباً مع انطلاق طاقة عالية تسمى <strong>حرارة التعادل</strong>.
                  </p>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 text-center" dir="ltr">
                    H⁺(aq) + Cl⁻(aq) + Na⁺(aq) + OH⁻(aq) ⟶ Na⁺(aq) + Cl⁻(aq) + H₂O(l) + Heat
                  </p>
                  <p className="font-mono text-center font-bold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200 text-sm" dir="ltr">
                    H⁺(aq) + OH⁻(aq) ⟶ H₂O(l) + ΔH (-57.1 kJ/mol)
                  </p>
                </>
              )}

              {reactionType === "halogen_displacement" && (
                <>
                  <p>
                    <strong>إزاحة الهالوجينات (Halogen Single Displacement)</strong>: الهالوجين الأكثر نشاطاً في المجموعة السابعة يزيح الهالوجين الأقل نشاطاً من محاليل أملاحه. الكلور <span className="text-lime-600 font-bold">Cl₂</span> أكثر كهروسالبية ونشاطاً من البروم <span className="text-rose-600 font-bold">Br₂</span>.
                  </p>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 text-center" dir="ltr">
                    Cl₂(aq) + 2K⁺(aq) + 2Br⁻(aq) ⟶ 2K⁺(aq) + 2Cl⁻(aq) + Br₂(aq)
                  </p>
                  <p className="font-mono text-center font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 text-sm" dir="ltr">
                    Cl₂(aq) + 2Br⁻(aq) ⟶ 2Cl⁻(aq) + Br₂(aq) [لون عنبري مميز]
                  </p>
                </>
              )}

              {reactionType === "alkali_water" && (
                <>
                  <p>
                    <strong>تفاعل فلزات الأقلاء مع الماء (Alkali Metals + Water)</strong>: تمتلك فلزات المجموعة الأولى إلكترون تكافؤ وحيد يسهل فقده، فتتفاعل بشدة مع الماء منتجة هيدروكسيد الفلز القلوي وغاز الهيدروجين القابل للاشتعال.
                  </p>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 text-center" dir="ltr">
                    2Na(s) + 2H₂O(l) ⟶ 2Na⁺(aq) + 2OH⁻(aq) + H₂(g)↑
                  </p>
                  <p>
                    تكوّن أيونات الهيدروكسيد <span className="text-pink-600 font-bold">OH⁻</span> يجعل الوسط قلوياً بقيمة pH &gt; 12، مما يفسر التلون الوردي الفوري عند إضافة قطرات من دليل الفينول فثالين.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
