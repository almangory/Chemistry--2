import React, { useState, useEffect, useRef } from "react";
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
  Award
} from "lucide-react";

interface Particle {
  id: number;
  type: string; // "Ag+", "Cl-", "Na+", "NO3-", "Zn", "Cu2+", "SO42-", "H+", "OH-", "H2O", "Cu", "Zn2+"
  label: string;
  charge: string;
  color: string;
  x: number; // percentage width
  y: number; // percentage height
  vx: number;
  vy: number;
  size: number;
  isFlipped?: boolean;
}

export const MolecularSimulator: React.FC = () => {
  const [reactionType, setReactionType] = useState<string>("double_displacement");
  const [simulationState, setSimulationState] = useState<"idle" | "reacting" | "paused" | "completed">("idle");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [narration, setNarration] = useState<string>("اختر تفاعلاً من القائمة واضغط على زر بدء التفاعل لمشاهدة حركة الجزيئات والروابط!");
  const [electronTransferActive, setElectronTransferActive] = useState<boolean>(false);
  const [solutionColor, setSolutionColor] = useState<string>("bg-blue-100/40");
  const [showExplanationCard, setShowExplanationCard] = useState<boolean>(true);
  const [clickedParticleId, setClickedParticleId] = useState<number | null>(null);

  const reactionIntervalRef = useRef<any>(null);

  // Helper functions for particle details
  const getParticleName = (type: string): string => {
    switch (type) {
      case "Ag+": return "أيون الفضة الموجب";
      case "Cl-": return "أيون الكلوريد السالب";
      case "Na+": return "أيون الصوديوم الموجب";
      case "NO3-": return "أيون النترات السالب";
      case "Zn": return "ذرة خارصين صلبة";
      case "Cu2+": return "أيون النحاس الثنائي";
      case "SO42-": return "أيون الكبريتات السالب";
      case "H+": return "أيون هيدروجين موجب";
      case "OH-": return "أيون هيدروكسيد سالب";
      case "H2O": return "جزيء ماء متعادل";
      case "Cu": return "ذرة نحاس صلبة";
      case "Zn2+": return "أيون خارصين ثنائي";
      case "AgCl": return "كلوريد الفضة (صلب)";
      default: return "جسيم تفاعلي";
    }
  };

  const getParticleDescription = (type: string): string => {
    switch (type) {
      case "Ag+": return "أيون فضة موجب (Ag⁺) نشط جداً كيميائياً، يبحث عن أيونات الكلوريد السالبة ليرتبط بها على الفور ويكون راسباً أبيض.";
      case "Cl-": return "أيون كلوريد سالب (Cl⁻) ينجذب بقوة وبقوة كهروستاتيكية هائلة نحو أيونات الفضة لتكوين ملح مستقر غير ذياب.";
      case "Na+": return "أيون صوديوم متفرج (Spectator Ion) لا يساهم ولا يتغير كيميائياً في هذا التفاعل، يظل ذائباً قبل التفاعل وبعده.";
      case "NO3-": return "أيون نترات متفرج يحمل شحنة سالبة، متميز بقابليته الفائقة للذوبان بالماء دون التفاعل مع مكونات الكأس.";
      case "Zn": return "ذرة خارصين صلبة نشطة جداً (أقوى عامل مختزل هنا)، تفقد إلكترونين بسهولة لتذوب كأيونات Zn²⁺ في المحلول.";
      case "Cu2+": return "أيون نحاس ثنائي يعطي المحلول لونه الأزرق الجميل، يكتسب إلكترونين ليختزل ويترسب كبقع نحاس صلب حمراء.";
      case "SO42-": return "أيون كبريتات متفرج ينظم التعادل الكهربائي العام للكأس المائي دون الدخول في تفاعل أكسدة أو اختزال.";
      case "H+": return "بروتون هيدروجين يمثل الصفة الحمضية القوية، سريع الحركة ينجذب فوراً للهيدروكسيد لتكوين الماء المتعادل.";
      case "OH-": return "أيون هيدروكسيد سالب يمثل الصفة القلوية، يتحد مع الهيدروجين مطلقاً حرارة عالية تسمى حرارة التعادل.";
      case "H2O": return "جزيء ماء مستقر ومتعادل الشحنة، تشكل من الاتحاد التام والتعادل الكيميائي بين أيونات الحمض والقاعدة.";
      case "Cu": return "ذرات فلز النحاس الصلبة ذات اللون الأحمر الطوبي المترسبة على لوح الخارصين نتيجة اختزال أيونات النحاس.";
      case "Zn2+": return "أيون خارصين ثنائي الشحنة عديم اللون، ذاب في الماء بعد تفاعل الأكسدة وفقدان الإلكترونات من لوح الخارصين.";
      case "AgCl": return "مركب كلوريد الفضة الصلب، تشكل على شكل راسب أبيض ناصع لا يذوب في الماء نظراً لقوة ترابط شبكته البلورية.";
      default: return "مكون كيميائي أساسي مشارك في حركة التفاعلات المجهرية.";
    }
  };

  const handleParticleClick = (id: number) => {
    setClickedParticleId(id);
    // Add extra narration when a particle is clicked
    const p = particles.find(part => part.id === id);
    if (p) {
      setNarration(`أنت تتفاعل الآن مع [${getParticleName(p.type)}]: ${getParticleDescription(p.type)}`);
    }
    // Auto clear after 4.5 seconds so it has time to read
    const timer = setTimeout(() => {
      setClickedParticleId(prev => prev === id ? null : prev);
    }, 4500);
  };

  // Initialize Particles based on Reaction Type
  const initParticles = (type: string) => {
    setSimulationState("idle");
    setElectronTransferActive(false);
    if (reactionIntervalRef.current) {
      clearInterval(reactionIntervalRef.current);
      reactionIntervalRef.current = null;
    }
    
    let initialParticles: Particle[] = [];
    
    if (type === "double_displacement") {
      setSolutionColor("bg-blue-50/20");
      setNarration("حالة ما قبل التفاعل: أيونات الفضة والكلوريد والصوديوم والنترات تسبح بحرية وتتصادم عشوائياً في المحلول المائي.");
      // 3 Ag+, 3 Cl-, 3 Na+, 3 NO3-
      const specs = [
        { type: "Ag+", label: "Ag⁺", charge: "+", color: "bg-slate-300 shadow-cyan-300/50" },
        { type: "Cl-", label: "Cl⁻", charge: "−", color: "bg-emerald-400 shadow-emerald-400/50" },
        { type: "Na+", label: "Na⁺", charge: "+", color: "bg-blue-400 shadow-blue-400/50" },
        { type: "NO3-", label: "NO₃⁻", charge: "−", color: "bg-orange-400 shadow-orange-400/50" }
      ];
      
      let id = 1;
      specs.forEach(spec => {
        for (let i = 0; i < 3; i++) {
          initialParticles.push({
            id: id++,
            type: spec.type,
            label: spec.label,
            charge: spec.charge,
            color: spec.color,
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 50,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: 32
          });
        }
      });
    } 
    else if (type === "redox") {
      setSolutionColor("bg-cyan-500/30"); // CuSO4 is blue
      setNarration("حالة ما قبل التفاعل: صفيحة من فلز الخارصين Zn (الرمادي) مغمورة في محلول كبريتات النحاس CuSO₄ الأزرق البراق.");
      // Solid Zn atoms at the bottom
      let id = 1;
      for (let i = 0; i < 4; i++) {
        initialParticles.push({
          id: id++,
          type: "Zn",
          label: "Zn",
          charge: "0",
          color: "bg-slate-500 border-2 border-slate-400 shadow-slate-500/50",
          x: 25 + i * 16,
          y: 75, // Bottom solid plate representation
          vx: 0,
          vy: 0,
          size: 38
        });
      }
      // Floating Cu2+ and SO42-
      for (let i = 0; i < 3; i++) {
        initialParticles.push({
          id: id++,
          type: "Cu2+",
          label: "Cu²⁺",
          charge: "2+",
          color: "bg-cyan-600 shadow-cyan-400/80 animate-pulse",
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 40,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: 32
        });
        initialParticles.push({
          id: id++,
          type: "SO42-",
          label: "SO₄²⁻",
          charge: "2−",
          color: "bg-yellow-500 shadow-yellow-500/50",
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 40,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: 36
        });
      }
    } 
    else if (type === "acid_base") {
      setSolutionColor("bg-purple-100/20");
      setNarration("حالة ما قبل التفاعل: أيونات الهيدروجين الموجبة H⁺ من الحمض وأيونات الهيدروكسيد السالبة OH⁻ من القلوي في وسط واحد.");
      // 4 H+, 4 OH-, 2 Na+, 2 Cl-
      let id = 1;
      for (let i = 0; i < 3; i++) {
        initialParticles.push({
          id: id++,
          type: "H+",
          label: "H⁺",
          charge: "+",
          color: "bg-red-500 shadow-red-500/50",
          x: 15 + Math.random() * 30, // left side mostly
          y: 20 + Math.random() * 40,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 26
        });
        initialParticles.push({
          id: id++,
          type: "OH-",
          label: "OH⁻",
          charge: "−",
          color: "bg-purple-500 shadow-purple-500/50",
          x: 55 + Math.random() * 30, // right side mostly
          y: 20 + Math.random() * 40,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 32
        });
      }
      // Spectators
      for (let i = 0; i < 2; i++) {
        initialParticles.push({
          id: id++,
          type: "Na+",
          label: "Na⁺",
          charge: "+",
          color: "bg-blue-400 shadow-blue-400/50",
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: 32
        });
        initialParticles.push({
          id: id++,
          type: "Cl-",
          label: "Cl⁻",
          charge: "−",
          color: "bg-emerald-400 shadow-emerald-400/50",
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: 32
        });
      }
    }
    
    setParticles(initialParticles);
  };

  useEffect(() => {
    initParticles(reactionType);
  }, [reactionType]);

  // Particle floating physical loop
  useEffect(() => {
    if (simulationState === "idle" || (simulationState === "reacting" && reactionType === "redox" && electronTransferActive)) {
      // Just normal drift
      const interval = setInterval(() => {
        setParticles(prev => prev.map(p => {
          if (p.type === "Zn" || p.type === "Cu") return p; // solid plate atoms don't float
          
          let nextX = p.x + p.vx;
          let nextY = p.y + p.vy;
          let nextVx = p.vx;
          let nextVy = p.vy;
          
          // bounce off container boundaries
          if (nextX < 10 || nextX > 90) {
            nextVx = -p.vx;
            nextX = p.x + nextVx;
          }
          if (nextY < 12 || nextY > 70) {
            nextVy = -p.vy;
            nextY = p.y + nextVy;
          }
          
          return { ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
        }));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [simulationState, reactionType, electronTransferActive]);

  // Handle Double Displacement reacting phase
  const runDoubleDisplacement = () => {
    setNarration("مرحلة الاصطدام الفعال: تقترب كاتيونات الفضة Ag⁺ الموجبة الشحنة من أنيونات الكلوريد Cl⁻ سالبة الشحنة بسبب قوى الجذب الكهربي الساكن.");
    
    if (reactionIntervalRef.current) clearInterval(reactionIntervalRef.current);
    
    // Animate Ag+ and Cl- to pair up
    reactionIntervalRef.current = setInterval(() => {
      setParticles(prev => {
        // Find Ag+ and Cl- particles
        const ags = prev.filter(p => p.type === "Ag+");
        const cls = prev.filter(p => p.type === "Cl-");
        
        let updated = prev.map(p => {
          if (p.type === "Na+" || p.type === "NO3-") {
            // normal float
            let nextX = p.x + p.vx;
            let nextY = p.y + p.vy;
            let nextVx = p.vx;
            let nextVy = p.vy;
            if (nextX < 10 || nextX > 90) nextVx = -p.vx;
            if (nextY < 15 || nextY > 75) nextVy = -p.vy;
            return { ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
          }
          
          if (p.type === "Ag+") {
            // Seek Cl-
            const targetCl = cls[0]; // simple matchmaking
            if (targetCl) {
              const dx = targetCl.x - p.x;
              const dy = targetCl.y - p.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist > 3) {
                return {
                  ...p,
                  x: p.x + dx / dist * 1.5,
                  y: p.y + dy / dist * 1.5
                };
              } else {
                // Fused!
                return {
                  ...p,
                  type: "AgCl",
                  label: "AgCl↓",
                  color: "bg-slate-100 border border-slate-300 text-slate-800 shadow-sm animate-pulse",
                  vx: 0,
                  vy: 0.8 // start sinking
                };
              }
            }
          }
          
          if (p.type === "Cl-") {
            // Seek Ag+
            const targetAg = ags[0];
            if (targetAg) {
              const dx = targetAg.x - p.x;
              const dy = targetAg.y - p.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist > 3) {
                return {
                  ...p,
                  x: p.x + dx / dist * 1.5,
                  y: p.y + dy / dist * 1.5
                };
              } else {
                // Destroy Cl- because it fuses to become AgCl with Ag+
                return null;
              }
            }
          }
          
          if (p.type === "AgCl") {
            // sink to the bottom
            let nextY = p.y + p.vy;
            if (nextY > 76) {
              nextY = 76; // settled precipitate
              return { ...p, y: nextY, vy: 0 };
            }
            return { ...p, y: nextY };
          }
          
          return p;
        }).filter(Boolean) as Particle[];
        
        // If all AgCl settled and no floating Ag+/Cl-
        const remainingAgClSinking = updated.some(p => p.type === "AgCl" && p.y < 76);
        const hasReactants = updated.some(p => p.type === "Ag+" || p.type === "Cl-");
        
        if (!remainingAgClSinking && !hasReactants) {
          if (reactionIntervalRef.current) {
            clearInterval(reactionIntervalRef.current);
            reactionIntervalRef.current = null;
          }
          setSimulationState("completed");
          setNarration("اكتمال التفاعل: ترسب ملح كلوريد الفضة AgCl الصلب بالكامل في قاع الكأس كراسب أبيض ناصع، بينما ظلت أيونات الصوديوم Na⁺ والنترات NO₃⁻ سابحة كأيونات متفرجة.");
        }
        
        return updated;
      });
    }, 40);
  };

  // Handle Redox reacting phase (electron transfer)
  const runRedox = () => {
    setNarration("انتقال الإلكترونات: تقترب أيونات النحاس الثنائي Cu²⁺ الزرقاء من ذرات الخارصين Zn الصلبة لتنتزع منها الإلكترونات.");
    
    if (reactionIntervalRef.current) clearInterval(reactionIntervalRef.current);
    
    reactionIntervalRef.current = setInterval(() => {
      setParticles(prev => {
        const zns = prev.filter(p => p.type === "Zn");
        const cu2s = prev.filter(p => p.type === "Cu2+");
        
        let updated = prev.map(p => {
          if (p.type === "SO42-") {
            // Spectator float
            let nextX = p.x + p.vx;
            let nextY = p.y + p.vy;
            let nextVx = p.vx;
            let nextVy = p.vy;
            if (nextX < 10 || nextX > 90) nextVx = -p.vx;
            if (nextY < 15 || nextY > 70) nextVy = -p.vy;
            return { ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
          }
          
          if (p.type === "Cu2+") {
            // Seek a solid Zn atom at the bottom
            const targetZn = zns.find(z => z.type === "Zn");
            if (targetZn) {
              const dx = targetZn.x - p.x;
              const dy = targetZn.y - p.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist > 3) {
                return {
                  ...p,
                  x: p.x + dx / dist * 1.2,
                  y: p.y + dy / dist * 1.2
                };
              } else {
                // Collision! Initiate electron transfer effect
                setElectronTransferActive(true);
                // Turn Cu2+ into Solid Cu and Zn into dissolved Zn2+
                targetZn.type = "Zn2+";
                targetZn.label = "Zn²⁺";
                targetZn.color = "bg-slate-200 border border-slate-300 text-slate-600 shadow-inner";
                targetZn.vx = (Math.random() - 0.5) * 1.2;
                targetZn.vy = -1.0; // Dissolves upward!
                
                return {
                  ...p,
                  type: "Cu",
                  label: "Cu",
                  charge: "0",
                  color: "bg-amber-700 border-2 border-amber-600 text-white shadow-md shadow-orange-700/50",
                  x: targetZn.x, // plated at bottom
                  y: 75,
                  vx: 0,
                  vy: 0
                };
              }
            }
          }
          
          if (p.type === "Zn2+") {
            // Dissolved zinc drifts upward
            let nextY = p.y + p.vy;
            let nextX = p.x + p.vx;
            let nextVy = p.vy;
            let nextVx = p.vx;
            
            if (nextY < 15 || nextY > 70) {
              nextVy = -p.vy;
              nextY = p.y + nextVy;
            }
            if (nextX < 10 || nextX > 90) {
              nextVx = -p.vx;
              nextX = p.x + nextVx;
            }
            
            return { ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
          }
          
          return p;
        });
        
        // Solution fades from blue to colorless as CuSO4 decreases and ZnSO4 increases
        const remainingCu2 = updated.filter(p => p.type === "Cu2+").length;
        if (remainingCu2 === 2) setSolutionColor("bg-cyan-400/20");
        if (remainingCu2 === 1) setSolutionColor("bg-cyan-300/10");
        if (remainingCu2 === 0) setSolutionColor("bg-slate-50/10 border-slate-300/35");
        
        if (remainingCu2 === 0) {
          if (reactionIntervalRef.current) {
            clearInterval(reactionIntervalRef.current);
            reactionIntervalRef.current = null;
          }
          setSimulationState("completed");
          setElectronTransferActive(false);
          setNarration("اكتمال التفاعل: ذابت ذرات الخارصين الخارجي وتحولت إلى أيونات خارصين عديمة اللون Zn²⁺، بينما اكتسبت أيونات النحاس الثنائي الإلكترونات واختزلت لترسب فلز النحاس الأحمر Cu.");
        }
        
        return updated;
      });
    }, 45);
  };

  // Handle Acid-Base Neutralization reacting phase
  const runAcidBase = () => {
    setNarration("تفاعل التعادل: أيونات الهيدروجين الحامضية H⁺ سريعة الحركة تنجذب فوراً لأيونات الهيدروكسيد القلوية OH⁻ السابحة لتتحد معها بقوة.");
    
    if (reactionIntervalRef.current) clearInterval(reactionIntervalRef.current);
    
    reactionIntervalRef.current = setInterval(() => {
      setParticles(prev => {
        const hs = prev.filter(p => p.type === "H+");
        const ohs = prev.filter(p => p.type === "OH-");
        
        let updated = prev.map(p => {
          if (p.type === "Na+" || p.type === "Cl-") {
            // Spectator float
            let nextX = p.x + p.vx;
            let nextY = p.y + p.vy;
            let nextVx = p.vx;
            let nextVy = p.vy;
            if (nextX < 10 || nextX > 90) nextVx = -p.vx;
            if (nextY < 15 || nextY > 70) nextVy = -p.vy;
            return { ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
          }
          
          if (p.type === "H+") {
            // Seek an OH-
            const targetOH = ohs[0];
            if (targetOH) {
              const dx = targetOH.x - p.x;
              const dy = targetOH.y - p.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist > 3) {
                return {
                  ...p,
                  x: p.x + dx / dist * 1.8,
                  y: p.y + dy / dist * 1.8
                };
              } else {
                // Combined into H2O!
                return {
                  ...p,
                  type: "H2O",
                  label: "H₂O",
                  charge: "0",
                  color: "bg-cyan-200 border border-cyan-400 text-cyan-800 shadow-md font-bold text-xs animate-bounce",
                  vx: (Math.random() - 0.5) * 0.8,
                  vy: (Math.random() - 0.5) * 0.8
                };
              }
            }
          }
          
          if (p.type === "OH-") {
            // Seek an H+
            const targetH = hs[0];
            if (targetH) {
              const dx = targetH.x - p.x;
              const dy = targetH.y - p.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist > 3) {
                return {
                  ...p,
                  x: p.x + dx / dist * 1.8,
                  y: p.y + dy / dist * 1.8
                };
              } else {
                return null; // disappear, merged into H2O
              }
            }
          }
          
          if (p.type === "H2O") {
            // Slowly float around
            let nextX = p.x + p.vx;
            let nextY = p.y + p.vy;
            let nextVx = p.vx;
            let nextVy = p.vy;
            if (nextX < 10 || nextX > 90) nextVx = -p.vx;
            if (nextY < 15 || nextY > 70) nextVy = -p.vy;
            return { ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
          }
          
          return p;
        }).filter(Boolean) as Particle[];
        
        const remainingReactants = updated.some(p => p.type === "H+" || p.type === "OH-");
        
        if (!remainingReactants) {
          if (reactionIntervalRef.current) {
            clearInterval(reactionIntervalRef.current);
            reactionIntervalRef.current = null;
          }
          setSimulationState("completed");
          setNarration("اكتمال التفاعل: تعادلت جميع أيونات H⁺ الحامضية مع OH⁻ القلوية وتكونت جزيئات ماء مستقرة H₂O، بينما تلاشت صفتا الحمضية والقلوية تماماً مع انطلاق حرارة التعادل الكبيرة.");
        }
        
        return updated;
      });
    }, 40);
  };

  const startSimulation = () => {
    if (simulationState !== "idle") return;
    setSimulationState("reacting");
    
    if (reactionType === "double_displacement") {
      runDoubleDisplacement();
    } else if (reactionType === "redox") {
      runRedox();
    } else if (reactionType === "acid_base") {
      runAcidBase();
    }
  };

  const pauseSimulation = () => {
    if (simulationState !== "reacting") return;
    setSimulationState("paused");
    if (reactionIntervalRef.current) {
      clearInterval(reactionIntervalRef.current);
      reactionIntervalRef.current = null;
    }
    setNarration("تم إيقاف التفاعل مؤقتاً. يمكنك استئنافه بالضغط على 'استئناف التفاعل' أو إعادة التعيين.");
  };

  const resumeSimulation = () => {
    if (simulationState !== "paused") return;
    setSimulationState("reacting");
    if (reactionType === "double_displacement") {
      runDoubleDisplacement();
    } else if (reactionType === "redox") {
      runRedox();
    } else if (reactionType === "acid_base") {
      runAcidBase();
    }
  };

  const handleReset = () => {
    initParticles(reactionType);
  };

  useEffect(() => {
    return () => {
      if (reactionIntervalRef.current) {
        clearInterval(reactionIntervalRef.current);
      }
    };
  }, []);

  return (
    <div id="molecular_simulator_panel" className="bg-[#FAF9F5] border border-[#E5E2DE] rounded-xl p-5 md:p-6 space-y-6 shadow-xs text-right mt-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E5E2DE] pb-4 gap-4">
        <div className="order-2 md:order-1 flex-1">
          <h3 className="text-lg font-serif font-bold text-[#2C3E50] tracking-tight flex items-center justify-end gap-2">
            <span>أداة المحاكاة الجزيئية التفاعلية للتفاعلات الأساسية</span>
            <Sparkles className="w-5 h-5 text-[#E67E22] animate-pulse" />
          </h3>
          <p className="text-xs text-[#7F8C8D] mt-1">
            شاهد كيفية تصادم الجزيئات، وتبادل الأيونات، وانتقال الإلكترونات بصرياً تحت المجهر الافتراضي للمنهج السوداني.
          </p>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 order-1 md:order-2">
          <ArrowRightLeft className="w-5 h-5 text-indigo-600 animate-pulse" />
        </div>
      </div>

      {/* Control Selection Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        {/* Dropdown 1: Reaction type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#7F8C8D]">اختر التفاعل الكيميائي للمشاهدة الجزيئية:</label>
          <select
            value={reactionType}
            onChange={(e) => setReactionType(e.target.value)}
            disabled={simulationState === "reacting" || simulationState === "paused"}
            className="bg-white border border-[#E5E2DE] text-[#2C3E50] rounded-lg px-3 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-[#E67E22] transition-all cursor-pointer shadow-xs text-right"
            dir="rtl"
          >
            <option value="double_displacement">🔄 تفاعل إحلال مزدوج (ترسيب AgCl)</option>
            <option value="redox">⚡ تفاعل أكسدة واختزال (إزاحة النحاس بالخارصين)</option>
            <option value="acid_base">🧪 تفاعل تعادل (حمض وقاعدة لإنتاج الماء والملح)</option>
          </select>
        </div>

        {/* Info or visual statistics */}
        <div className="bg-white border border-[#E5E2DE] p-2 rounded-lg text-center font-mono text-[10px] text-[#2C3E50] font-bold h-10 flex items-center justify-center gap-2" dir="ltr">
          {reactionType === "double_displacement" && (
            <span>NaCl (aq) + AgNO₃ (aq) ⟶ NaNO₃ (aq) + AgCl (s)↓</span>
          )}
          {reactionType === "redox" && (
            <span>Zn (s) + CuSO₄ (aq) ⟶ ZnSO₄ (aq) + Cu (s)↓</span>
          )}
          {reactionType === "acid_base" && (
            <span>HCl (aq) + NaOH (aq) ⟶ NaCl (aq) + H₂O (l)</span>
          )}
        </div>

        {/* Action button triggers */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white hover:bg-[#F9F8F6] active:bg-[#EDECDF] text-[#2C3E50] border border-[#E5E2DE] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة تعيين
          </button>
          
          {simulationState === "idle" && (
            <button
              onClick={startSimulation}
              className="flex-1 px-5 py-2 bg-[#E67E22] text-white font-bold rounded-lg text-xs hover:bg-[#d6721b] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              بدء التفاعل الجزيئي
            </button>
          )}

          {simulationState === "reacting" && (
            <button
              onClick={pauseSimulation}
              className="flex-1 px-5 py-2 bg-[#E74C3C] text-white font-bold rounded-lg text-xs hover:bg-[#c0392b] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Pause className="w-3.5 h-3.5 fill-white" />
              إيقاف مؤقت للتفاعل
            </button>
          )}

          {simulationState === "paused" && (
            <button
              onClick={resumeSimulation}
              className="flex-1 px-5 py-2 bg-[#2ECC71] text-white font-bold rounded-lg text-xs hover:bg-[#27AE60] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              استئناف التفاعل
            </button>
          )}

          {simulationState === "completed" && (
            <button
              disabled
              className="flex-1 px-5 py-2 bg-[#95A5A6] text-white font-bold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <Award className="w-3.5 h-3.5" />
              اكتمل التفاعل الكيميائي
            </button>
          )}
        </div>
      </div>

      {/* Main Molecular Beaker Canvas */}
      <div className="relative border-2 border-dashed border-[#E5E2DE] rounded-2xl bg-white p-4 overflow-hidden h-72 md:h-80 flex items-center justify-center shadow-inner">
        {/* Solution Fluid Water representation */}
        <motion.div 
          animate={{
            height: ["74%", "76%", "74%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute bottom-0 left-0 right-0 w-full rounded-b-2xl transition-all duration-1000 ${solutionColor}`} 
        />

        {/* Beaker Lip Marks */}
        <div className="absolute left-6 top-8 bottom-8 flex flex-col justify-between text-[8px] font-mono font-bold text-slate-300 pointer-events-none z-10 border-l border-slate-200 pl-1">
          <span>400 mL</span>
          <span>300 mL</span>
          <span>200 mL</span>
          <span>100 mL</span>
        </div>

        {/* Floating / Static Particles */}
        <div className="absolute inset-0 w-full h-full p-6">
          <AnimatePresence>
            {particles.map((p) => {
              const isClicked = clickedParticleId === p.id;
              return (
                <div 
                  key={p.id} 
                  className="absolute" 
                  style={{ 
                    left: `${p.x}%`, 
                    top: `${p.y}%`, 
                    transform: "translate(-50%, -50%)", 
                    zIndex: isClicked ? 50 : 20 
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    animate={{
                      scale: isClicked 
                        ? [1, 1.35, 1.15, 1.25, 1.2] 
                        : (simulationState === "reacting" && (p.type === "AgCl" || p.type === "Cu" || p.type === "H2O") ? [1, 1.2, 1] : 1),
                      x: isClicked ? [0, -6, 6, -6, 6, -3, 3, 0] : 0,
                      y: p.type === "Zn2+" 
                        ? [0, -10, 0] 
                        : (isClicked ? [0, 5, -5, 5, -5, 2, -2, 0] : 0),
                      rotate: isClicked ? [0, -12, 12, -12, 12, 0] : 0,
                    }}
                    transition={{
                      duration: isClicked ? 0.6 : 0.3,
                      type: "tween",
                      ease: "easeInOut"
                    }}
                    onClick={() => handleParticleClick(p.id)}
                    className={`rounded-full flex flex-col items-center justify-center select-none shadow-md border-2 text-white font-bold cursor-pointer transition-all duration-300 ${
                      isClicked ? "border-amber-400 ring-4 ring-amber-400/60 shadow-xl scale-120" : "border-white"
                    } ${p.color}`}
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                    }}
                  >
                    {showLabels ? (
                      <span className="text-[10px] font-sans font-extrabold tracking-tighter leading-none mt-0.5">{p.label}</span>
                    ) : (
                      <span className="text-xs">{p.charge}</span>
                    )}
                  </motion.div>

                  {/* Speech bubble pointing to clicked particle */}
                  <AnimatePresence>
                    {isClicked && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900/95 text-white text-[10px] p-2.5 rounded-lg shadow-xl border border-slate-700 w-48 text-right font-sans pointer-events-none z-50"
                        style={{
                          transform: "translate(-50%, 0)",
                        }}
                      >
                        <div className="font-bold text-[#E67E22] mb-1 border-b border-slate-700 pb-1 flex items-center justify-between gap-1" dir="rtl">
                          <span>{getParticleName(p.type)}</span>
                          <span className="bg-slate-800 text-slate-300 px-1 rounded text-[8px] font-mono">{p.label}</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed font-medium" dir="rtl">{getParticleDescription(p.type)}</p>
                        {/* Little arrow pointing down */}
                        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900/95" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </AnimatePresence>

          {/* Electron Transfer sparkle effects */}
          {electronTransferActive && (
            <motion.div
              animate={{
                x: [180, 240, 180],
                y: [160, 220, 160],
                scale: [1, 1.5, 1],
                opacity: [0, 1, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8
              }}
              className="absolute pointer-events-none z-40 text-yellow-500"
              style={{ left: "45%", top: "65%" }}
            >
              <Zap className="w-8 h-8 fill-yellow-300 text-yellow-500 animate-ping" />
            </motion.div>
          )}

          {/* Heat spark for acid base */}
          {simulationState === "reacting" && reactionType === "acid_base" && (
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center z-10">
              <motion.div
                animate={{ scale: [1, 1.4, 0.8], opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="p-8 bg-orange-500/15 rounded-full border border-orange-400 text-orange-600 flex flex-col items-center gap-1"
              >
                <Flame className="w-6 h-6 text-orange-500 animate-bounce" />
                <span className="text-[8px] font-bold text-orange-700">حرارة التعادل 🌡️</span>
              </motion.div>
            </div>
          )}

          {/* Static solid markers or titles inside beaker */}
          {reactionType === "redox" && (
            <div className="absolute bottom-3 right-1/2 translate-x-1/2 pointer-events-none z-10">
              <span className="text-[9px] font-bold bg-[#2C3E50]/75 text-white px-2 py-0.5 rounded-full border border-white/20">
                صفيحة الفلز الصلب المغمور
              </span>
            </div>
          )}
          {reactionType === "double_displacement" && simulationState === "completed" && (
            <div className="absolute bottom-5 right-12 pointer-events-none z-30">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/95 border border-emerald-200 text-emerald-800 p-1.5 rounded shadow-sm text-[9px] font-bold leading-tight"
              >
                ⚪ راسب AgCl صلب مستقر
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Narration and Explanation Bar */}
      <div className="bg-[#E67E22]/5 border border-[#E67E22]/20 p-3.5 rounded-xl text-right">
        <div className="flex items-start gap-2.5 justify-end">
          <p className="text-xs text-[#2C3E50] font-sans font-semibold leading-relaxed flex-1">
            {narration}
          </p>
          <div className="p-1.5 bg-[#E67E22]/10 rounded text-[#E67E22]">
            <Info className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Accordion Explanation section */}
      <div className="border border-[#E5E2DE] rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => setShowExplanationCard(!showExplanationCard)}
          className="w-full flex justify-between items-center px-4 py-3 bg-[#F9F8F6] border-b border-[#E5E2DE] text-right"
        >
          <span className="text-xs font-bold text-[#7F8C8D]">
            {showExplanationCard ? "إخفاء التفاصيل الأكاديمية" : "عرض التفاصيل الأكاديمية"}
          </span>
          <span className="text-xs font-bold text-[#2C3E50] font-serif flex items-center gap-1.5">
            التفسير العلمي حسب مقرر الثاني الثانوي (السوداني)
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
                    <strong>تفاعلات الإحلال المزدوج (Double Displacement)</strong>: هي تفاعلات تتم بين مركبين أيونيين في محاليلهما المائية، حيث يتبادل المركبان الأيونات لتكوين مركبين جديدين، ويكون أحد النواتج عادةً راسباً غير قابل للذوبان، أو غازاً، أو ماءً متعادلاً.
                  </p>
                  <p className="bg-slate-50 p-2.5 rounded border border-slate-150 font-mono text-[10px] text-slate-700" dir="ltr">
                    Na⁺(aq) + Cl⁻(aq) + Ag⁺(aq) + NO₃⁻(aq) ⟶ AgCl(s)↓ + Na⁺(aq) + NO₃⁻(aq)
                  </p>
                  <p>
                    أيونات الصوديوم <span className="text-blue-500 font-bold">Na⁺</span> والنترات <span className="text-orange-500 font-bold">NO₃⁻</span> لم تشارك فعلياً في التفاعل ولذلك تسمى <strong>أيونات متفرجة (Spectator Ions)</strong>، في حين أن المعادلة الأيونية الصافية تعبر فقط عن تكون راسب كلوريد الفضة غير الذائب:
                  </p>
                  <p className="font-mono text-center font-bold text-[#E67E22]" dir="ltr">Ag⁺(aq) + Cl⁻(aq) ⟶ AgCl(s)↓</p>
                </>
              )}

              {reactionType === "redox" && (
                <>
                  <p>
                    <strong>تفاعلات الأكسدة والاختزال (Redox Reactions)</strong>: هي تفاعلات تنتقل فيها الإلكترونات بشكل كامل من المادة المؤكسَدة (العامل المختزل) إلى المادة المختزَلة (العامل المؤكسد).
                  </p>
                  <p>
                    1. <strong>الأكسدة (Oxidation)</strong>: فقد الإلكترونات من ذرات فلز الخارصين النشط <span className="text-slate-600 font-bold">Zn</span>، مما يؤدي إلى تآكل الصفيحة وتحوله لأيونات تذوب في الماء:
                  </p>
                  <p className="bg-slate-50 p-2 rounded border border-slate-150 font-mono text-[10px] text-center" dir="ltr">
                    Zn(s) ⟶ Zn²⁺(aq) + 2e⁻  (نصف تفاعل الأكسدة)
                  </p>
                  <p>
                    2. <strong>الاختزال (Reduction)</strong>: كسب الإلكترونات بواسطة أيونات النحاس الثنائي <span className="text-cyan-600 font-bold">Cu²⁺</span> الزرقاء السابحة لتترسب كفلز نحاس أحمر/بني مستقر على اللوح:
                  </p>
                  <p className="bg-slate-50 p-2 rounded border border-slate-150 font-mono text-[10px] text-center" dir="ltr">
                    Cu²⁺(aq) + 2e⁻ ⟶ Cu(s)  (نصف تفاعل الاختزال)
                  </p>
                  <p>
                    أيونات الكبريتات <span className="text-yellow-600 font-bold">SO₄²⁻</span> تظل كأيونات متفرجة ثابتة لا يطرأ عليها تغير كيميائي.
                  </p>
                </>
              )}

              {reactionType === "acid_base" && (
                <>
                  <p>
                    <strong>تفاعل التعادل (Neutralization)</strong>: هو تفاعل حمض مع قاعدة لإنتاج ملح وماء. يمثل هذا التفاعل شكلاً من أشكال الإحلال المزدوج السريع والطارد للحرارة بشدة.
                  </p>
                  <p className="bg-slate-50 p-2.5 rounded border border-slate-150 font-mono text-[10px] text-slate-700" dir="ltr">
                    H⁺(aq) + Cl⁻(aq) + Na⁺(aq) + OH⁻(aq) ⟶ Na⁺(aq) + Cl⁻(aq) + H₂O(l) + Heat
                  </p>
                  <p>
                    تتحد أيونات الهيدروجين الحامضية المسؤولة عن الصفة الحمضية مع أيونات الهيدروكسيد القلوية المسؤولة عن الصفة القاعدية، فتتشكل جزيئات الماء المتعادل بالكامل، وتبقى أيونات الملح (الكلوريد والصوديوم) ذائبة متفرجة. وتسمى طاقة التفاعل بـ <strong>حرارة التعادل</strong>.
                  </p>
                  <p className="font-mono text-center font-bold text-[#E67E22]" dir="ltr">H⁺(aq) + OH⁻(aq) ⟶ H₂O(l)</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
