import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  RotateCcw, 
  Droplets, 
  Thermometer, 
  Flame,
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Zap, 
  Plus, 
  Minus, 
  Atom 
} from "lucide-react";

interface DiagramProps {
  type: string;
}

export const InteractiveDiagram: React.FC<DiagramProps> = ({ type }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [factor, setFactor] = useState<number>(50); // slider control
  const [selectedElement, setSelectedElement] = useState<string>("Na");
  const [reactionLog, setReactionLog] = useState<string[]>([]);
  const [beakerColor, setBeakerColor] = useState<string>("bg-blue-100/40");
  const [fizzleState, setFactorState] = useState<"idle" | "fizzing" | "popping" | "explosion">("idle");
  const [carbonCount, setCarbonCount] = useState<number>(5);
  const [branchPos, setBranchPos] = useState<number>(2);
  const [branchType, setBranchType] = useState<"methyl" | "ethyl">("methyl");

  // Reset when diagram type changes
  useEffect(() => {
    setIsPlaying(false);
    setFactor(50);
    setReactionLog([]);
    setBeakerColor("bg-blue-100/40 border-blue-300");
    setFactorState("idle");
  }, [type]);

  const runAlkaliReaction = (element: string) => {
    setSelectedElement(element);
    setFactorState("idle");
    setReactionLog([]);
    setBeakerColor("bg-blue-100/40 border-blue-300");

    let logs: string[] = [];
    if (element === "Li") {
      setFactorState("fizzing");
      setBeakerColor("bg-purple-50/50 border-purple-300");
      logs = [
        "إضافة قطعة الليثيوم (Li)...",
        "تفاعل هادئ نسبياً.",
        "بدء تصاعد فقاعات غاز الهيدروجين (H2) ببطء.",
        "تحول المحلول تدريجياً لقلوي (هيدروكسيد الليثيوم LiOH).",
        "المعادلة: 2Li + 2H2O ⟶ 2LiOH + H2"
      ];
    } else if (element === "Na") {
      setFactorState("popping");
      setBeakerColor("bg-pink-50/50 border-pink-400");
      logs = [
        "إضافة قطعة الصوديوم (Na)...",
        "تفاعل سريع وطارد للحرارة.",
        "تنصهر قطعة الصوديوم وتتحرك ككرة فضية فوق الماء.",
        "اشتعال غاز الهيدروجين بلهب أصفر ساطع وفرقعات!",
        "المعادلة: 2Na + 2H2O ⟶ 2NaOH + H2"
      ];
    } else if (element === "K") {
      setFactorState("explosion");
      setBeakerColor("bg-rose-100/60 border-rose-500");
      logs = [
        "تحذير: إضافة قطعة البوتاسيوم (K)...",
        "تفاعل فوري عنيف جداً وطارد بشدة للحرارة!",
        "اشتعال فوري عنيف بلهب بنفسجي مميز وفرقعة شديدة.",
        "تكون فوري لهيدروكسيد البوتاسيوم KOH شديد الذوبان.",
        "المعادلة: 2K + 2H2O ⟶ 2KOH + H2"
      ];
    }

    // Output logs sequentially
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logs.length) {
        setReactionLog((prev) => [...prev, logs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 800);
  };

  const handleBromineTest = (isUnsaturated: boolean) => {
    setIsPlaying(true);
    setReactionLog(["إضافة قطرات ماء البروم الأحمر (Br2/H2O)..."]);

    setTimeout(() => {
      if (isUnsaturated) {
        setReactionLog((prev) => [
          ...prev,
          "يتفاعل البروم فوراً بالإضافة مع الإيثين كاسراً الرابطة باي الثنائية.",
          "تكون مركب 1,2-ثنائي برومو إيثان عديم اللون.",
          "النتيجة: يزول اللون الأحمر لماء البروم (تم إثبات عدم التشبع!).",
          "المعادلة: CH2=CH2 + Br2 ⟶ CH2Br-CH2Br"
        ]);
      } else {
        setReactionLog((prev) => [
          ...prev,
          "لا يتفاعل البروم مع الألكان (الإيثان) لغياب رابطة غير مشبعة.",
          "النتيجة: يبقى لون ماء البروم أحمراً برتقالياً كما هو.",
          "المعادلة: CH3-CH3 + Br2 ⟶ لا يوجد تفاعل (في الظلام)"
        ]);
      }
      setIsPlaying(false);
    }, 1200);
  };

  const handleAquaRegia = (mixType: "HCl" | "HNO3" | "Mix") => {
    setIsPlaying(true);
    setReactionLog(["إدخال سبيكة الذهب النقي (Au)..."]);

    setTimeout(() => {
      if (mixType === "HCl") {
        setReactionLog((prev) => [
          ...prev,
          "مفاعلة الذهب مع حمض الهيدروكلوريك HCl المركز بمفرده...",
          "النتيجة: لا يوجد أي تفاعل. الذهب فلز نبيل ومستقر للغاية."
        ]);
      } else if (mixType === "HNO3") {
        setReactionLog((prev) => [
          ...prev,
          "مفاعلة الذهب مع حمض النيتريك HNO3 المركز بمفرده...",
          "النتيجة: لا يوجد تفاعل. حمض النيتريك يؤكسد السطح ببطء ولكن الذهب يقاومه."
        ]);
      } else {
        setReactionLog((prev) => [
          ...prev,
          "مزج حمض HCl وحمض HNO3 بنسبة 3:1 (الماء الملكي - Aqua Regia)...",
          "تفاعل الحمضين ينتج غاز الكلور النشط [Cl] وكلوريد النيتروسيل الكاشف.",
          "الكلور النشط يهاجم الذهب بقوة مكوناً حمض الكلوروأوريك الذائب.",
          "النتيجة: تذوب سبيكة الذهب تماماً في المحلول لونه الأصفر البرتقالي!",
          "المعادلة: Au + HNO3 + 3HCl ⟶ AuCl3 + NO + 2H2O"
        ]);
      }
      setIsPlaying(false);
    }, 1500);
  };

  // Render components dynamically based on type
  switch (type) {
    case "dobereiner_triads":
      return (
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] rounded p-6 text-[#1A1A1A] my-4 shadow-sm text-right">
          <h4 className="text-sm font-bold text-[#2C3E50] mb-4 font-sans">توضيح توازن ثلاثيات دوبرينر (Dobereiner)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
            <div className="bg-white p-4 rounded border border-[#E5E2DE] shadow-sm">
              <span className="block text-xs text-[#7F8C8D]">العنصر الأول</span>
              <span className="block text-2xl font-bold text-[#E67E22] mt-1">Ca</span>
              <span className="block text-xs text-[#7F8C8D]">الكالسيوم</span>
              <span className="block text-sm font-mono text-[#2C3E50] font-bold mt-2">الكتلة: 40.0</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-[#7F8C8D] mb-2">المتوسط الحسابي للكتلة</span>
              <div className="text-sm font-mono bg-white px-4 py-2 rounded-full border border-[#E5E2DE] text-[#2C3E50] font-bold shadow-sm">
                (40.0 + 137.3) / 2 = <span className="text-emerald-700 font-bold">88.6</span>
              </div>
              <motion.div
                animate={{ rotate: [0, -3, 3, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-16 h-1 mt-4 bg-[#2C3E50] rounded-full"
              />
            </div>
            <div className="bg-white p-4 rounded border border-[#E5E2DE] shadow-sm">
              <span className="block text-xs text-[#7F8C8D]">العنصر الثالث</span>
              <span className="block text-2xl font-bold text-[#E67E22] mt-1">Ba</span>
              <span className="block text-xs text-[#7F8C8D]">الباريوم</span>
              <span className="block text-sm font-mono text-[#2C3E50] font-bold mt-2">الكتلة: 137.3</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded border border-[#E5E2DE] text-center shadow-sm">
            <span className="text-xs text-[#7F8C8D] block mb-1">العنصر الأوسط الحقيقي في الثلاثية</span>
            <span className="text-xl font-bold text-emerald-700 block">الاسترونشيوم Sr_88</span>
            <p className="text-xs text-[#7F8C8D] mt-2 max-w-lg mx-auto leading-relaxed">
              لاحظ كيف أن كتلة الاسترونشيوم الفعلية (88) قريبة جداً من المتوسط الحسابي (88.6)، وهو ما دعا العلماء للتفكير في دورية الخواص.
            </p>
          </div>
        </div>
      );

    case "periodic_blocks":
      const blocks = [
        { name: "الكتلة s (s-block)", desc: "تضم المجموعتين 1 و 2 يسار الجدول. المدار الخارجي ns.", color: "bg-blue-50 border-blue-200 text-blue-900", spec: "ns^1 to ns^2" },
        { name: "الكتلة p (p-block)", desc: "تضم المجموعات 13 إلى 18 يمين الجدول. المدار الخارجي np.", color: "bg-emerald-50 border-emerald-200 text-emerald-900", spec: "ns^2 np^1 to ns^2 np^6" },
        { name: "الكتلة d (d-block)", desc: "العناصر الانتقالية الرئيسية وسط الجدول. يملأ الغلاف nd.", color: "bg-amber-50 border-amber-200 text-amber-900", spec: "(n-1)d^1-10 ns^1-2" },
        { name: "الكتلة f (f-block)", desc: "العناصر الانتقالية الداخلية (اللانثنيدات والأكتنيدات). يملأ nf.", color: "bg-purple-50 border-purple-200 text-purple-900", spec: "(n-2)f^1-14 (n-1)d^0-1 ns^2" }
      ];
      return (
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] rounded p-6 text-[#1A1A1A] my-4 shadow-sm text-right">
          <h4 className="text-sm font-bold text-[#2C3E50] mb-4 font-sans">توزيع فئات وكتل الجدول الدوري الحديث</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {blocks.map((block, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`p-4 rounded border-2 cursor-pointer transition-all ${
                  activeTab === idx ? "scale-102 shadow bg-white border-[#E67E22]" : "hover:bg-white/50 border-[#E5E2DE]"
                } ${block.color}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{block.name}</span>
                  <span className="font-mono text-xs px-2 py-0.5 bg-white rounded border border-[#E5E2DE] font-bold text-[#2C3E50]">{block.spec}</span>
                </div>
                <p className="text-xs leading-relaxed mt-2">{block.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white rounded border border-[#E5E2DE] text-center text-xs text-[#7F8C8D] shadow-sm">
            انقر على أي من الكتل أعلاه لرؤية موقعها وتمثيلها البنيوي. لاحظ أن ذرات عناصر الفئة s تفقد الإلكترونات بسهولة فائقة، بينما عناصر الفئة p تكتسبها بشراهة.
          </div>
        </div>
      );

    case "atomic_radius_trends":
      const period3Data = [
        { sym: "Na", size: 186, num: 11, col: "bg-orange-500" },
        { sym: "Mg", size: 160, num: 12, col: "bg-amber-500" },
        { sym: "Al", size: 143, num: 13, col: "bg-yellow-500" },
        { sym: "Si", size: 132, num: 14, col: "bg-emerald-500" },
        { sym: "P", size: 128, num: 15, col: "bg-teal-500" },
        { sym: "S", size: 127, num: 16, col: "bg-cyan-500" },
        { sym: "Cl", size: 99, num: 17, col: "bg-blue-500" },
        { sym: "Ar", size: 98, num: 18, col: "bg-slate-400" }
      ];
      return (
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] rounded p-6 text-[#1A1A1A] my-4 shadow-sm text-right">
          <h4 className="text-sm font-bold text-[#2C3E50] mb-4 font-sans">تدرج الحجم الذري (نصف القطر بالبيكوميتر) عبر الدورة الثالثة</h4>
          <div className="flex flex-wrap md:flex-nowrap justify-between items-end gap-2 bg-white p-6 rounded border border-[#E5E2DE] overflow-x-auto min-h-60 shadow-sm">
            {period3Data.map((item, idx) => {
              // Map size to pixel radius
              const radius = (item.size / 186) * 70;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 min-w-16">
                  <span className="text-xs text-[#95A5A6] font-mono font-bold">({item.num})</span>
                  <span className="font-bold text-sm text-[#2C3E50]">{item.sym}</span>
                  <div className="h-44 flex items-center justify-center w-full">
                    <motion.div
                      animate={{ scale: [0.95, 1.05, 0.95] }}
                      transition={{ repeat: Infinity, duration: 3, delay: idx * 0.2 }}
                      style={{ width: radius, height: radius }}
                      className={`rounded-full ${item.col} opacity-90 shadow-sm border border-white/40 flex items-center justify-center text-white font-bold font-mono text-[10px]`}
                    >
                      {item.size}
                    </motion.div>
                  </div>
                  <span className="text-xs text-[#7F8C8D] font-mono font-bold">{item.size} pm</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-[#7F8C8D] leading-relaxed bg-white p-4 rounded border border-[#E5E2DE] shadow-sm">
            💡 <strong>لماذا يقل القطر؟</strong> عند الانتقال من الصوديوم إلى الكلور، يزداد عدد البروتونات في النواة (من +11 إلى +17)، مما يرفع شحنتها الموجبة الفعالة وجذبها للإلكترونات في نفس مستوى الطاقة، فيتقلص الحجم وينكمش غلاف الإلكترونات للداخل.
          </div>
        </div>
      );

    case "alkali_water_reaction":
      return (
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] rounded p-6 text-[#1A1A1A] my-4 shadow-sm text-right">
          <h4 className="text-sm font-bold text-[#2C3E50] mb-4 font-sans">محاكاة معملية تفاعلية: تفاعل الأقلاء مع الماء</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Control & Lab Beaker */}
            <div className="bg-white p-6 rounded border border-[#E5E2DE] flex flex-col items-center justify-center min-h-64 relative overflow-hidden shadow-sm">
              {/* Beaker representation */}
              <div className={`w-36 h-48 border-4 border-t-0 border-[#BDC3C7] rounded-b-2xl relative flex items-end justify-center overflow-hidden transition-all duration-500 ${beakerColor}`}>
                {/* Water line */}
                <div className="absolute bottom-0 w-full h-24 bg-blue-100/50 border-t-2 border-blue-300 flex items-center justify-center">
                  {/* Bubble animations if reactive */}
                  {fizzleState !== "idle" && (
                    <motion.div
                      animate={{ y: [-10, -50], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute w-2 h-2 bg-white rounded-full bottom-2 left-6"
                    />
                  )}
                  {fizzleState !== "idle" && (
                    <motion.div
                      animate={{ y: [-15, -60], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                      className="absolute w-1.5 h-1.5 bg-white rounded-full bottom-2 right-8"
                    />
                  )}
                </div>

                {/* Reactant Piece */}
                {fizzleState !== "idle" && (
                  <motion.div
                    animate={{
                      x: fizzleState === "fizzing" ? [-5, 5, -5] : [-25, 25, -25],
                      y: fizzleState === "explosion" ? [-10, 10, -10] : [-5, 5, -5],
                      rotate: 360
                    }}
                    transition={{ repeat: Infinity, duration: fizzleState === "explosion" ? 0.3 : 1.5 }}
                    className="w-4 h-4 bg-slate-400 rounded shadow-sm absolute bottom-24 z-10"
                  />
                )}

                {/* Popping Flame effect */}
                {(fizzleState === "popping" || fizzleState === "explosion") && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute bottom-24 z-20"
                  >
                    <Flame className={`w-10 h-10 ${fizzleState === "explosion" ? "text-rose-500 fill-rose-500" : "text-amber-500 fill-amber-500"}`} />
                  </motion.div>
                )}
              </div>

              {/* Selection buttons */}
              <div className="flex gap-2 mt-6">
                {["Li", "Na", "K"].map((el) => (
                  <button
                    key={el}
                    onClick={() => runAlkaliReaction(el)}
                    className={`px-3 py-1.5 rounded font-bold text-xs transition-all ${
                      selectedElement === el
                        ? "bg-[#E67E22] text-white font-bold scale-105 shadow-sm"
                        : "bg-white hover:bg-[#F9F8F6] text-[#2C3E50] border border-[#E5E2DE]"
                    }`}
                  >
                    أضف {el === "Li" ? "ليثيوم" : el === "Na" ? "صوديوم" : "بوتاسيوم"}
                  </button>
                ))}
              </div>
            </div>

            {/* Reaction Logs */}
            <div className="bg-[#F9F8F6] p-4 rounded border border-[#E5E2DE] flex flex-col h-64 overflow-y-auto shadow-sm">
              <span className="text-xs text-[#7F8C8D] font-bold block border-b border-[#E5E2DE] pb-2 mb-2">نافذة مخرجات التفاعل والملاحظات:</span>
              {reactionLog.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-[#95A5A6]">
                  انقر على أحد العناصر بالأعلى لبدء التفاعل الكيميائي ورؤية الملاحظات...
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {reactionLog.map((log, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-2 rounded font-sans leading-relaxed ${
                        idx === reactionLog.length - 1
                          ? "bg-white border-r-2 border-emerald-500 text-[#1A1A1A] shadow-sm font-bold"
                          : "text-[#7F8C8D]"
                      }`}
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case "bromine_water_test":
      return (
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] rounded p-6 text-[#1A1A1A] my-4 shadow-sm text-right">
          <h4 className="text-sm font-bold text-[#2C3E50] mb-4 font-sans">كاشف عدم التشبع: اختبار ماء البروم الأحمر</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Setup */}
            <div className="bg-white p-6 rounded border border-[#E5E2DE] flex flex-col justify-between shadow-sm">
              <span className="text-xs text-[#7F8C8D] font-bold block mb-4">اختر المركب المراد اختبار تشبعه:</span>
              <div className="grid grid-cols-2 gap-4">
                <button
                  disabled={isPlaying}
                  onClick={() => handleBromineTest(false)}
                  className="p-4 bg-[#F9F8F6] hover:bg-[#E5E2DE]/30 border border-[#E5E2DE] rounded text-center flex flex-col items-center shadow-sm"
                >
                  <span className="text-sm font-bold text-[#2C3E50]">الإيثان (مشبع)</span>
                  <span className="text-xs text-[#7F8C8D] font-mono mt-1 font-bold">C2H6 (ألكان)</span>
                </button>
                <button
                  disabled={isPlaying}
                  onClick={() => handleBromineTest(true)}
                  className="p-4 bg-[#F9F8F6] hover:bg-[#E5E2DE]/30 border border-[#E5E2DE] rounded text-center flex flex-col items-center shadow-sm"
                >
                  <span className="text-sm font-bold text-[#E67E22]">الإيثين (غير مشبع)</span>
                  <span className="text-xs text-[#7F8C8D] font-mono mt-1 font-bold">C2H4 (ألكين)</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-[#F9F8F6]/60 rounded border border-[#E5E2DE] text-xs text-[#7F8C8D] text-center">
                يستخدم ماء البروم (المذاب في الماء أو رابع كلوريد الكربون) للكشف نوعياً وعملياً عن الرابطة التساهمية المتعددة (غير المشبعة).
              </div>
            </div>

            {/* Logger Output */}
            <div className="bg-[#F9F8F6] p-4 rounded border border-[#E5E2DE] flex flex-col h-60 overflow-y-auto shadow-sm">
              <span className="text-xs text-[#7F8C8D] font-bold block border-b border-[#E5E2DE] pb-2 mb-2">الملاحظة والمشاهدات المخبرية:</span>
              {reactionLog.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-[#95A5A6]">
                  اختر الإيثان أو الإيثين بالأعلى لإجراء الاختبار...
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {reactionLog.map((log, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-2 rounded ${
                        idx === 3 || log.includes("النتيجة") ? "bg-emerald-50 text-emerald-800 border-r-2 border-emerald-500 shadow-sm font-bold" : "bg-white text-[#1A1A1A] border border-[#E5E2DE]"
                      }`}
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case "benzene_resonance":
      return (
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] rounded p-6 text-[#1A1A1A] my-4 shadow-sm text-right">
          <h4 className="text-sm font-bold text-[#2C3E50] mb-3 text-right">رسم حركي تفاعلي لسر رنين البنزين C6H6</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded border border-[#E5E2DE] shadow-sm">
              {/* Dynamic SVG showing Resonance */}
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <defs>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Hexagon ring */}
                <polygon points="100,15 178,55 178,145 100,185 22,145 22,55" fill="none" stroke="#2C3E50" strokeWidth="4" />
                {/* Resonance Circle */}
                <circle cx="100" cy="100" r="40" fill="none" stroke="#E67E22" strokeWidth="6" strokeDasharray="15 5" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '4s' }} />
                {/* Carbon labels */}
                <text x="100" y="10" fill="#2C3E50" className="font-mono text-xs font-bold text-center" textAnchor="middle">C</text>
                <text x="183" y="55" fill="#2C3E50" className="font-mono text-xs text-center" textAnchor="middle">C</text>
                <text x="183" y="145" fill="#2C3E50" className="font-mono text-xs text-center" textAnchor="middle">C</text>
                <text x="100" y="195" fill="#2C3E50" className="font-mono text-xs text-center" textAnchor="middle">C</text>
                <text x="17" y="145" fill="#2C3E50" className="font-mono text-xs text-center" textAnchor="middle">C</text>
                <text x="17" y="55" fill="#2C3E50" className="font-mono text-xs text-center" textAnchor="middle">C</text>
              </svg>
              <span className="text-xs text-[#7F8C8D] mt-3 text-center">حلقة السداسي مع تمايز حركي لإلكترونات باي الدائرية</span>
            </div>
            <div className="space-y-4 text-xs font-sans text-right leading-relaxed">
              <p>
                🔒 <strong>سر حلقة الرنين (Resonance):</strong>
                البنزين العطري C6H6 هو من أكثر المركبات ثباتاً. بالرغم من احتواء جزيئاته على روابط ثنائية إلا أنه يفضل تفاعلات الإحلال بدلاً من الإضافة ليحافظ على هذا الاستقرار.
              </p>
              <div className="bg-white p-3 rounded border border-[#E5E2DE] font-mono text-[11px] text-[#2C3E50] shadow-sm leading-relaxed">
                طول رابطة C-C الأحادية: 0.154 nm<br />
                طول رابطة C=C الثنائية: 0.134 nm<br />
                طول الرابطة في حلقة البنزين: <span className="text-emerald-700 font-bold">0.139 nm</span> (حالة وسطية متساوية تماماً بفعل رنين الإلكترونات!).
              </div>
            </div>
          </div>
        </div>
      );

    case "aqua_regia":
      return (
        <div className="bg-[#F9F8F6] border border-[#E5E2DE] rounded p-6 text-[#1A1A1A] my-4 shadow-sm text-right">
          <h4 className="text-sm font-bold text-[#2C3E50] mb-4 font-sans">معمل كيمياء الفلزات النبيلة: قوة الماء الملكي (Aqua Regia)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Lab Beaker */}
            <div className="bg-white p-6 rounded border border-[#E5E2DE] flex flex-col items-center justify-center min-h-64 relative shadow-sm">
              <div className={`w-32 h-44 border-4 border-t-0 border-[#BDC3C7] rounded-b-2xl relative flex items-end justify-center overflow-hidden transition-all duration-700 ${
                beakerColor.includes("rose") ? "bg-amber-100/50 border-amber-400" : beakerColor
              }`}>
                {/* Acid Fluid */}
                <div className="absolute bottom-0 w-full h-20 bg-yellow-400/20 border-t-2 border-yellow-400" />
                
                {/* Gold bar dissolving */}
                {isPlaying && (
                  <motion.div
                    animate={{ rotate: 360, y: [0, 40], opacity: [1, 0] }}
                    transition={{ duration: 1.5 }}
                    className="w-12 h-6 bg-yellow-500 rounded shadow-sm border border-yellow-300 absolute bottom-12 z-10 flex items-center justify-center font-bold text-[9px] text-amber-950"
                  >
                    Au ذهب
                  </motion.div>
                )}
                {!isPlaying && reactionLog.length === 0 && (
                  <div className="w-12 h-6 bg-yellow-500 rounded shadow-sm border border-yellow-300 absolute bottom-12 z-10 flex items-center justify-center font-bold text-[9px] text-amber-950">
                    Au ذهب
                  </div>
                )}
              </div>

              {/* Mixing controls */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => handleAquaRegia("HCl")}
                  className="px-2.5 py-1.5 bg-white hover:bg-[#F9F8F6] text-[#2C3E50] border border-[#E5E2DE] rounded text-[11px] font-bold shadow-sm transition-all"
                >
                  حمض HCl فقط
                </button>
                <button
                  onClick={() => handleAquaRegia("HNO3")}
                  className="px-2.5 py-1.5 bg-white hover:bg-[#F9F8F6] text-[#2C3E50] border border-[#E5E2DE] rounded text-[11px] font-bold shadow-sm transition-all"
                >
                  حمض HNO3 فقط
                </button>
                <button
                  onClick={() => handleAquaRegia("Mix")}
                  className="px-2.5 py-1.5 bg-[#E67E22] text-white hover:bg-[#d6721b] rounded text-[11px] font-bold shadow-sm transition-all"
                >
                  الماء الملكي (3:1)
                </button>
              </div>
            </div>

            {/* Log results */}
            <div className="bg-[#F9F8F6] p-4 rounded border border-[#E5E2DE] flex flex-col h-64 overflow-y-auto shadow-sm">
              <span className="text-xs text-[#7F8C8D] font-bold block border-b border-[#E5E2DE] pb-2 mb-2">نافذة التفاعل والمشاهدات:</span>
              {reactionLog.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-[#95A5A6]">
                  اختر حمضاً أو الماء الملكي لبدء التفاعل مع الذهب النقي...
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {reactionLog.map((log, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-2 rounded font-sans leading-relaxed ${
                        idx === reactionLog.length - 1
                          ? "bg-white border-r-2 border-[#E67E22] text-[#1A1A1A] font-bold shadow-sm"
                          : "text-[#7F8C8D]"
                      }`}
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case "mendeleev_table":
      const missingElements = [
        { name: "إيكا-ألومنيوم", predicted: "الكتلة 68، كثافة 5.9، ينصهر بحرارة اليد", actual: "الجاليوم (Ga 1875م)", match: "الكتلة 69.7، كثافة 5.91، ينصهر عند 29.8°م!" },
        { name: "إيكا-سيليكون", predicted: "الكتلة 72، كثافة 5.5، لونه رمادي داكن", actual: "الجرمانيوم (Ge 1886م)", match: "الكتلة 72.6، كثافة 5.35، رمادي فلزي!" }
      ];
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">عبقرية مندلييف: التنبؤ بالعناصر الشاغرة قبل اكتشافها</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {missingElements.map((el, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">{el.name} (تنبؤ مندلييف 1869)</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{el.predicted}</p>
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700 text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">الاكتشاف الفعلي: {el.actual}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{el.match}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "all_trends_summary":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">ملخص التدرج الدوري لخواص العناصر (الدورات والمجموعات)</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-center">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-blue-600 block mb-1">طاقة التأين</span>
              <span className="text-[10px] text-slate-500 block">تزداد عبر الدورة ➔</span>
              <span className="text-[10px] text-slate-500 block">تقل لأسفل المجموعة ⬇</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-emerald-600 block mb-1">الكهروسالبية</span>
              <span className="text-[10px] text-slate-500 block">الفلور F أعلاها (4.0)</span>
              <span className="text-[10px] text-slate-500 block">تزداد باتجاه الهالوجينات ➔</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-amber-600 block mb-1">الخاصية الفلزية</span>
              <span className="text-[10px] text-slate-500 block">تقل عبر الدورة ➔</span>
              <span className="text-[10px] text-slate-500 block">تزداد لأسفل المجموعة ⬇</span>
            </div>
          </div>
        </div>
      );

    case "downs_cell":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">خلية داونز (Downs Cell) لاستخلاص الصوديوم من مصهور NaCl</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-rose-600 block">المصعد (الأنود - كربون جرافيت):</span>
              <p className="text-slate-600 dark:text-slate-400">تتأكسد أيونات الكلوريد ليتصاعد غاز الكلور Cl2:</p>
              <code className="text-[10px] font-mono font-bold block bg-slate-100 dark:bg-slate-900 p-1 rounded">2Cl⁻ ⟶ Cl₂↑ + 2e⁻</code>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-blue-600 block">المهبط (الكاثود - أسطوانة حديد):</span>
              <p className="text-slate-600 dark:text-slate-400">تختزل أيونات الصوديوم لمصهور فلز الصوديوم ويطفو:</p>
              <code className="text-[10px] font-mono font-bold block bg-slate-100 dark:bg-slate-900 p-1 rounded">Na⁺ + e⁻ ⟶ Na (مصهور)</code>
            </div>
          </div>
          <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 text-[11px] text-amber-900 dark:text-amber-200">
            <strong>ملاحظة هامة:</strong> يضاف كلوريد الكالسيوم CaCl2 لخفض درجة انصهار ملح الطعام من 800°م إلى 600°م لتوفير الطاقة وحماية الخلية.
          </div>
        </div>
      );

    case "ionic_conductivity":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">التوصيل الكهربائي لمركبات الأقلاء (صلبة vs مصهورة vs محاليل)</span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-lg block">❌💡</span>
              <span className="font-bold block mt-1">بلورة NaCl صلبة</span>
              <span className="text-[10px] text-slate-500">لا توصل لتقييد الأيونات</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-lg block">💡✨</span>
              <span className="font-bold block mt-1">مصهور NaCl</span>
              <span className="text-[10px] text-emerald-600 font-bold">ناقل ممتاز (أيونات حرة)</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-lg block">💡⚡</span>
              <span className="font-bold block mt-1">محلول NaCl مائي</span>
              <span className="text-[10px] text-emerald-600 font-bold">ناقل فائق للتيار</span>
            </div>
          </div>
        </div>
      );

    case "wohler_experiment":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">تجربة فوهلر التاريخية 1828م (دحض نظرية القوة الحيوية)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">أول مركب عضوي مصنع</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-mono text-xs font-bold text-slate-800 dark:text-slate-200 space-y-2">
            <div>NH4CNO (سيانات الأمونيوم غير العضوية) + حرارة △</div>
            <div className="text-amber-600">⇓ إعادة ترتيب الذرات (تماكب حراري) ⇓</div>
            <div className="text-emerald-600">H2N-CO-NH2 (اليوريا / البولينا - مركب عضوي)</div>
          </div>
        </div>
      );

    case "iupac_steps":
      const alkaneNames = ["ميثان", "إيثان", "بروبان", "بيوتان", "بنتان", "هكسان", "هبتان"];
      const parentName = alkaneNames[carbonCount - 1] || "بنتان";
      const branchName = branchType === "methyl" ? "ميثيل" : "إيثيل";
      const calculatedIupacName = `${branchPos}-${branchName} ${parentName}`;

      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">أداة بناء سلاسل الكربون وتسمية IUPAC التفاعلية</span>
            <span className="text-[11px] font-bold text-[#047857] font-mono">{calculatedIupacName}</span>
          </div>

          {/* Carbon Chain Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 dark:text-slate-300">أطول سلسلة (C):</span>
              <button
                onClick={() => setCarbonCount(Math.max(4, carbonCount - 1))}
                className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="font-mono font-bold text-emerald-600 px-2">{carbonCount} ذرات</span>
              <button
                onClick={() => setCarbonCount(Math.min(7, carbonCount + 1))}
                className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 dark:text-slate-300">موقع التفرع:</span>
              <select
                value={branchPos}
                onChange={(e) => setBranchPos(Number(e.target.value))}
                className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-xs font-bold"
              >
                {Array.from({ length: carbonCount - 2 }, (_, i) => i + 2).map((num) => (
                  <option key={num} value={num}>ذرة كربون رقم {num}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setBranchType("methyl")}
                className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${branchType === "methyl" ? "bg-emerald-700 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600"}`}
              >
                ميثيل (CH3)
              </button>
              <button
                onClick={() => setBranchType("ethyl")}
                className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${branchType === "ethyl" ? "bg-emerald-700 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600"}`}
              >
                إيثيل (C2H5)
              </button>
            </div>
          </div>

          {/* Visual Carbon Nodes Chain */}
          <div className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
            {Array.from({ length: carbonCount }, (_, i) => {
              const cNum = i + 1;
              const hasBranch = cNum === branchPos;
              return (
                <div key={cNum} className="flex flex-col items-center relative">
                  {hasBranch && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-10 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-md shadow-sm"
                    >
                      {branchType === "methyl" ? "-CH3" : "-C2H5"}
                    </motion.div>
                  )}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                    hasBranch ? "bg-amber-600 text-white ring-2 ring-amber-300" : "bg-emerald-700 text-white"
                  }`}>
                    C{cNum}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">C#{cNum}</span>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "hydrocarbon_tree":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">شجرة تصنيف الهيدروكربونات والمركبات المتقابلة</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-emerald-700 block mb-1">ألكانات مشبعة (إيثان C2H6)</span>
              <span className="text-[10px] text-slate-500 block">روابط أحادية سيجما σ فقط</span>
              <span className="text-[10px] text-slate-400 mt-1 block">خاملة نسبياً تجاه الكواشف</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-amber-600 block mb-1">ألكينات غير مشبعة (إيثين C2H4)</span>
              <span className="text-[10px] text-slate-500 block">رابطة ثنائية (واحدة سيجما + واحدة باي π)</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">تزيل لون ماء البروم</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-rose-600 block mb-1">ألكاينات (إيثاين C2H2)</span>
              <span className="text-[10px] text-slate-500 block">رابطة ثلاثية (واحدة سيجما + اثنتان باي π)</span>
              <span className="text-[10px] text-rose-600 font-bold mt-1 block">لهب الأكسي-أسيتلين 3000°م</span>
            </div>
          </div>
        </div>
      );

    case "methane_chlorination":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">تفاعل استبدال الميثان بالكلور (في ضوء الشمس غير المباشر UV)</span>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              CH4 + Cl2 ⟶ <strong>CH3Cl (كلوريد الميثيل)</strong> + HCl
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              CH3Cl + Cl2 ⟶ <strong>CH2Cl2 (ثنائي كلورو ميثان)</strong> + HCl
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              CH2Cl2 + Cl2 ⟶ <strong>CHCl3 (الكلوروفورم - مخدر)</strong> + HCl
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800 font-bold text-emerald-800 dark:text-emerald-300">
              CHCl3 + Cl2 ⟶ <strong>CCl4 (رابع كلوريد الكربون - مذيب ومطفأة حريق)</strong> + HCl
            </div>
          </div>
        </div>
      );

    case "markovnikov_rule":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">قاعدة ماركونيكوف في تفاعلات الإضافة غير المتماثلة</span>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="font-mono text-center font-bold text-slate-800 dark:text-slate-200">
              CH3-CH=CH2 (بروبين) + H-Br (كاشف غير متماثل)
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-300 text-emerald-900 dark:text-emerald-200 leading-relaxed font-sans">
              <strong>نص القاعدة المنهجي:</strong> عند إضافة متفاعل غير متماثل إلى ألكين غير متماثل، فإن الشق الموجب (الهيدروجين H+) يضاف إلى ذرة الكربون غير المشبعة التي تحمل <strong>عدداً أكبر من ذرات الهيدروجين</strong> (الغني يزداد غنى)، مما ينتج:
              <span className="block font-mono font-bold mt-1 text-center">CH3-CH(Br)-CH3 (2-برومو بروبان) وليس 1-برومو بروبان!</span>
            </div>
          </div>
        </div>
      );

    case "acetylene_torch":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">لهب الأكسي-أسيتلين (Oxy-Acetylene Flame)</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold font-mono">3000°C</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            عند احتراق الإيثاين C2H2 في وفرة من غاز الأكسجين النقي، ينتج احتراق تام يولد لهباً أزرق ناصعاً تصل حرارته إلى 3000°م كافية لصهر الفولاذ وقطع ولحام المعادن.
          </p>
          <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs text-center font-bold text-slate-800 dark:text-slate-200">
            2C2H2 + 5O2 ⟶ 4CO2 + 2H2O + طاقة حرارية هائلة (3000°C)
          </div>
        </div>
      );

    case "bond_strain":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">توتر زوايا الروابط (Bond Strain) في الألكانات الحلقية</span>
          <div className="grid grid-cols-2 gap-3 text-xs text-center">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-rose-600 block">البروبان الحلقي (C3H6)</span>
              <span className="text-[11px] text-slate-500 block">الزاوية: 60° (انحراف شديد عن 109.5°)</span>
              <span className="text-[10px] text-rose-700 font-bold mt-1 block">توتر شديد ➔ نشاط كيميائي عالي وسهولة كسر الحلقة</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-emerald-600 block">الهكسان الحلقي (C6H12)</span>
              <span className="text-[11px] text-slate-500 block">الزاوية: 109.5° (زاوية مجسمة مستقرة)</span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">استقرار وثبات كيميائي فائق</span>
            </div>
          </div>
        </div>
      );

    case "pentane_isomers":
      const isomers = [
        { name: "بنتان عادي (n-pentane)", formula: "CH3-CH2-CH2-CH2-CH3", bp: "36.1°C", shape: "سلسلة مستقيمة بدون تفرع" },
        { name: "2-ميثيل بيوتان (isopentane)", formula: "CH3-CH(CH3)-CH2-CH3", bp: "27.8°C", shape: "تفرع ميثيل واحد" },
        { name: "2,2-ثنائي ميثيل بروبان (neopentane)", formula: "C(CH3)4", bp: "9.5°C (غاز)", shape: "تفرعان - شكل كروي مضغوط" }
      ];
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">المتماكبات السلسلية الثلاثة للبنتان C5H12 وتدرج درجات الغليان</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {isomers.map((iso, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-100 block">{iso.name}</span>
                <code className="text-[10px] font-mono text-emerald-600 block">{iso.formula}</code>
                <span className="text-[10px] text-amber-600 font-bold block">درجة الغليان: {iso.bp}</span>
                <span className="text-[10px] text-slate-400 block">{iso.shape}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500">
            <strong>القاعدة:</strong> زيادة التفرع تجعل الجزيء أكثر كروية فتقل مساحة التلامس وقوى فاندرفالز، مما يخفض درجة الغليان.
          </p>
        </div>
      );

    case "phosphorus_allotropes":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">ظاهرة التأصل: الفوسفور الأبيض vs الفوسفور الأحمر</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 text-amber-950 dark:text-amber-200 space-y-1">
              <span className="font-bold text-sm block">الفوسفور الأبيض (P4)</span>
              <p>جزيء رباعي الأوجه مجهد الزوايا (60°). شديد السمية ويشتعل تلقائياً في الهواء عند 30°م، لذا يحفظ تحت الماء.</p>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 text-rose-950 dark:text-rose-200 space-y-1">
              <span className="font-bold text-sm block">الفوسفور الأحمر (Pn)</span>
              <p>سلسلة بوليمرية مستقرة غير سامة. لا يشتعل تلقائياً إلا بالتسخين إلى 240°م، ويستخدم في صناعة أعواد الثقاب الآمنة.</p>
            </div>
          </div>
        </div>
      );

    case "nitrogen_prep_lab":
    case "ammonia_prep":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">التحضير المخبري لغاز النيتروجين والنشادر</span>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-2">
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">1. تحضير النيتروجين النقي بتسخين نتريت الأمونيوم:</span>
              <strong>NaNO2 + NH4Cl ⟶ NaCl + NH4NO2 ⟶ N2↑ + 2H2O</strong>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 block font-sans text-[10px]">2. تحضير النشادر بتسخين ملح الأمونيوم مع الجير المطفأ:</span>
              <strong>2NH4Cl + Ca(OH)2 ⟶ CaCl2 + 2H2O + 2NH3↑</strong>
            </div>
          </div>
        </div>
      );

    case "nitrogen_cycle":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">دورة النيتروجين في الطبيعة وتثبيته حيوياً</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-blue-600 block">1. تثبيت جوي</span>
              <p className="text-[10px] text-slate-500 mt-1">طاقة البرق تدمج N2 مع O2 لتكوين أكاسيد النيتروجين وأمطار النيتريك.</p>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-emerald-600 block">2. تثبيت بكتيري</span>
              <p className="text-[10px] text-slate-500 mt-1">بكتيريا العقد الجذرية (الريزوبيوم) في البقوليات تثبت النيتروجين مباشرة.</p>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-amber-600 block">3. دورة التحلل</span>
              <p className="text-[10px] text-slate-500 mt-1">بكتيريا نزع النتروجين تعيد إطلاق الغاز للغلاف الجوي (78%).</p>
            </div>
          </div>
        </div>
      );

    case "superphosphate_prep":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">صناعة سماد السوبر فوسفات الذائب للزراعة</span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            صخر الفوسفات Ca3(PO4)2 غير قابل للذوبان في الماء فلا تمتصه جذور النباتات. لمعالجته يتم مفاعلته مع حمض الكبريتيك المركز لتحويله لسماد فوسفاتي ذائب:
          </p>
          <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-xs text-center font-bold">
            Ca3(PO4)2 + 2H2SO4 ⟶ Ca(H2PO4)2 (سوبر فوسفات ذائب) + 2CaSO4
          </div>
        </div>
      );

    case "halogens_tubes":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">إزاحة الهالوجينات وتدرج النشاط (Cl2 ➔ Br2 ➔ I2)</span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 space-y-1">
              <span className="font-bold text-orange-800 dark:text-orange-300 block">الكلور يزيح البروم:</span>
              <code className="text-[10px] font-mono block">Cl2 + 2KBr ⟶ 2KCl + Br2</code>
              <span className="text-[10px] text-orange-700">تلون المحلول بالبرتقالي لظهور البروم.</span>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 space-y-1">
              <span className="font-bold text-purple-800 dark:text-purple-300 block">البروم يزيح اليود:</span>
              <code className="text-[10px] font-mono block">Br2 + 2KI ⟶ 2KBr + I2</code>
              <span className="text-[10px] text-purple-700">تلون الطبقة العضوية بالبنفسجي لليود.</span>
            </div>
          </div>
        </div>
      );

    case "chlorine_prep_lab":
    case "mercury_cathode_cell":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">تحضير غاز الكلور في المختبر والتحليل الكهربائي الصناعي</span>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-1.5">
            <div><strong>أكسدة HCl بـ MnO2 الأسود مع التسخين:</strong></div>
            <div className="text-emerald-600 font-bold">MnO2 + 4HCl ⟶ MnCl2 + 2H2O + Cl2↑ (غاز أصفر مخضر نفاذ)</div>
            <p className="text-[10px] text-slate-500 font-sans pt-1">
              يمرر الغاز في الماء لامتصاص HCl ثم حمض الكبريتيك المركز لتجفيفه، ويجمع بإزاحة الهواء للأعلى لأنه أثقل منه.
            </p>
          </div>
        </div>
      );

    case "turpentine_experiment":
    case "bleaching_mechanism":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">آلية قصر الألوان وتفاعل زيت التربنتين مع الكلور</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-emerald-700 block">تبييض الألوان بالكلور الرطب:</span>
              <p className="text-slate-600 dark:text-slate-400">
                الكلور الجاف لا يقصر الألوان، بل يتفاعل مع الماء لتكوين حمض الهيبوكلوروز الذي يطلق الأكسجين الذري الوليد [O]:
              </p>
              <code className="text-[10px] font-mono block text-emerald-700 font-bold">HClO ⟶ HCl + [O] (مؤكسد الصباغ)</code>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-rose-700 block">اشتعال زيت التربنتين:</span>
              <p className="text-slate-600 dark:text-slate-400">
                شراهة الكلور للهيدروجين تجعله ينتزع هيدروجين التربنتين مسبباً اشتعالاً فورياً ودخاناً أسود كثيفاً من الكربون (السخام).
              </p>
            </div>
          </div>
        </div>
      );

    case "transition_exceptions":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">شذوذ التوزيع الإلكتروني للكروم (Cr) والنحاس (Cu)</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-amber-600 block font-sans">الكروم Cr (العدد الذري 24):</span>
              <div>التوزيع الفعلي: [Ar] 4s1 3d5</div>
              <span className="text-[10px] text-slate-500 font-sans block">نصف ممتلئ (3d5) يعطي استقراراً إضافياً للذرة.</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-amber-600 block font-sans">النحاس Cu (العدد الذري 29):</span>
              <div>التوزيع الفعلي: [Ar] 4s1 3d10</div>
              <span className="text-[10px] text-slate-500 font-sans block">تام الامتلاء (3d10) يعطي أقصى درجات الثبات.</span>
            </div>
          </div>
        </div>
      );

    case "protective_oxide":
      return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-right space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">ظاهرة خمول الحديد في حمض النيتريك المركز (Passivation)</span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            عند غمس قطعة من الحديد في حمض النيتريك المركز HNO3، يتوقف التفاعل فوراً ولا يتصاعد غاز.
            <strong>السبب الوزاري (علل):</strong> تكوّن طبقة ميكروسكوبية رقيقة وغير مسامية من أكسيد الحديد المغناطيسي (Fe3O4) تعزل الفلز تماماً عن استمرار التفاعل.
          </p>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-[#F9F8F6] rounded border border-[#E5E2DE] text-[#7F8C8D] text-xs text-center font-sans shadow-sm">
          [مخطط كيميائي بصرى تفاعلي: {type}]
        </div>
      );
  }
};

const reactionTermsIndex = (log: string) => {
  if (log.includes("النتيجة")) return true;
  return -1;
};
