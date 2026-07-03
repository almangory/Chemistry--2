import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Droplets, Thermometer, Flame } from "lucide-react";

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
