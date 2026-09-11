import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Droplet, 
  Layers, 
  Flame, 
  Sparkles, 
  MapPin, 
  Lightbulb, 
  Compass, 
  FlaskConical,
  ChevronRight,
  Info
} from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  badge: string;
  location: string;
  concept: string;
  icon: React.ComponentType<any>;
  color: string;
  accentBg: string;
  borderColor: string;
  summary: string;
  steps: {
    title: string;
    description: string;
    chemicalEquation?: string;
  }[];
  localTip: string;
}

const sudanCases: CaseStudy[] = [
  {
    id: "water_treatment",
    title: "تنقية مياه النيلين الأزرق والأبيض",
    badge: "تطبيق بيئي ومائي",
    location: "محطات المقرن، شمبات، وود مدني لتنقية المياه",
    concept: "كيمياء المحاليل، التخثر، والتعقيم بالهالوجينات (الوحدة الخامسة)",
    icon: Droplet,
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60",
    accentBg: "bg-blue-50/50 dark:bg-slate-900/90",
    borderColor: "border-blue-100 dark:border-blue-900/50",
    summary: "يعتبر طمي النيل الأزرق (خاصة في موسم الفيضان) شديد العكارة ويحتاج لمعالجات كيميائية دقيقة قبل ضخه للمواطنين في شبكات المياه السودانية.",
    steps: [
      {
        title: "عملية التخثر (Coagulation)",
        description: "تُضاف كبريتات الألمنيوم (الشبّة) لتكوين راسب جيلاتيني من هيدروكسيد الألمنيوم يجذب حبيبات الطمي سالبة الشحنة فتتجمع وتترسب في قاع الحوض.",
        chemicalEquation: "Al2(SO4)3 (aq) + 6H2O (l) ⟶ 2Al(OH)3 (s)↓ + 3H2SO4 (aq)"
      },
      {
        title: "التعقيم بالكلوريد (Chlorination)",
        description: "يُحقن غاز الكلور (من المجموعة السابعة) في المياه المعالجة للقضاء على البكتيريا والطفيليات، حيث يتفاعل مع الماء لينتج حمض الهيبوكلوروز النشط والمبهر معقماً للمياه.",
        chemicalEquation: "Cl2 (g) + H2O (l) ⇌ HClO (aq) + HCl (aq)"
      },
      {
        title: "ضبط الحموضة واليسر (pH Adjustment)",
        description: "يُضاف الجير المطفي (هيدروكسيد الكالسيوم) أحياناً لمعادلة الحموضة الناتجة عن الشبّة لضمان بقاء الرقم الهيدروجيني للمياه في المدى الآمن والمتعادل (7.2 - 7.6)."
      }
    ],
    localTip: "هل تعلم؟ عكارة النيل الأزرق أثناء الفيضان تصل لآلاف الوحدات، والشبّة كعامل تخثر هي البطل المجهول لتصفية هذه المياه العكرة وجعلها نقية وصالحة للشرب كحنفية المقرن التاريخية."
  },
  {
    id: "sugar_industry",
    title: "إنتاج وتكرير السكر الوطني",
    badge: "تطبيق صناعي زراعي",
    location: "مصانع سكر كنانة، عسلاية، والجنيد",
    concept: "الكربوهيدرات والكيمياء العضوية (الوحدة الثالثة)",
    icon: Layers,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60",
    accentBg: "bg-emerald-50/50 dark:bg-slate-900/90",
    borderColor: "border-emerald-100 dark:border-emerald-900/50",
    summary: "السودان رائد في صناعة السكر من قصب السكر، وتمر عملية استخلاص السكروز النقي بعدة تفاعلات وتحولات كيميائية دقيقة تمنع التخمر والأكسدة.",
    steps: [
      {
        title: "عصر قصب السكر والترويق (Clarification)",
        description: "يُعصر القصب لاستخلاص السكروز الخام، ويضاف الجير المطفي Ca(OH)₂ لترسيب الشوائب العضوية والفوسفاتية الحمضية لرفع الأس الهيدروجيني وتجنب تفكك السكر.",
        chemicalEquation: "3Ca(OH)2 (aq) + 2H3PO4 (aq) ⟶ Ca3(PO4)2 (s)↓ + 6H2O (l)"
      },
      {
        title: "التشبيع بالكربون (Carbonation)",
        description: "يُمرر غاز CO₂ للتفاعل مع الجير الزائد وترسيبه ككربونات كالسيوم، مما يسحب معه بقايا المادة الملونة والشوائب الميكروبية العالقة.",
        chemicalEquation: "Ca(OH)2 (aq) + CO2 (g) ⟶ CaCO3 (s)↓ + H2O (l)"
      },
      {
        title: "التبييض بغاز الكبريت (Sulfitation)",
        description: "يُمرر غاز ثاني أكسيد الكبريت SO₂ كعامل مختزل قوي يقصر الألوان الصبغية العضوية (مضاد للأكسدة) ويحافظ على السكر أبيض ناصعاً وبلورياً متماسكاً."
      }
    ],
    localTip: "مصنع سكر كنانة يمثل قصة نجاح عالمية للتكامل الزراعي الصناعي، حيث يتم تدوير مخلفات القصب (البغاس) كوقود للمراجل وتوليد الكهرباء بالطاقة الحيوية النظيفة."
  },
  {
    id: "gold_extraction",
    title: "تعدين واستخلاص الذهب",
    badge: "تطبيق فلزي واقتصادي",
    location: "مناجم أبو حمد، البطانة، وقبجية بتعدين الذهب",
    concept: "الفلزات الانتقالية والماء الملكي (الوحدة السادسة)",
    icon: Flame,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60",
    accentBg: "bg-amber-50/50 dark:bg-slate-900/90",
    borderColor: "border-amber-100 dark:border-amber-900/50",
    summary: "يحتل السودان مرتبة متقدمة في إنتاج الذهب الإفريقي. الكيمياء تحدد طرق الفرز، السيانيد البديل، والاستخلاص عالي الجودة بالزنك والكربون النشط.",
    steps: [
      {
        title: "التسييل والتعقيد (Cyanidation)",
        description: "يُعالج خام الذهب المطحون بمحلول سيانيد الصوديوم المخفف في وجود الأكسجين، ليذوب الذهب غير النشط متحولاً لمركب معقد ذائب في الماء.",
        chemicalEquation: "4Au (s) + 8NaCN (aq) + O2 (g) + 2H2O (l) ⟶ 4Na[Au(CN)2] (aq) + 4NaOH (aq)"
      },
      {
        title: "الإزاحة والترسيب بمسحوق الزنك (Zinc Precipitation)",
        description: "يُضاف مسحوق الخارصين (الزنك) النشط ليزيح الذهب النبيل من معقده الكيميائي ويطرده خارج المحلول ليترسب كمسحوق ذهب خالص جاهز للصهر والتنقية.",
        chemicalEquation: "2Na[Au(CN)2] (aq) + Zn (s) ⟶ Na2[Zn(CN)4] (aq) + 2Au (s)↓"
      },
      {
        title: "التحذير البيئي من الزئبق والسيانيد",
        description: "في التعدين التقليدي يُستخدم الزئبق Hg لتكوين ملغم الذهب، ثم يُحرق مسبباً تلوثاً ساماً للمياه الجوفية والهواء. البديل الكيميائي الحديث هو السيانيد أو ثيوسلفات الصوديوم الصديقين للبيئة مع الالتزام بالمعالجة الآمنة."
      }
    ],
    localTip: "أبحاث الكيمياء الصناعية بجامعة الخرطوم تدعم بقوة استبدال تقنيات الزئبق في التعدين العشوائي بمستخلصات كيميائية خضراء حمايةً للبيئة والإنسان في ولايات السودان."
  },
  {
    id: "traditional_scents",
    title: "تخمير وتركيب العطور السودانية",
    badge: "تطبيق حياتي وتراثي",
    location: "صناعة 'الخمرة والظفرة' البيتية والتجارية بالسودان",
    concept: "الكيمياء العضوية والمركبات الحلقية والعطرية (الوحدة الثالثة)",
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60",
    accentBg: "bg-purple-50/50 dark:bg-slate-900/90",
    borderColor: "border-purple-100 dark:border-purple-900/50",
    summary: "تتميز العطور السودانية التقليدية مثل 'الخمرة' بثباتها العالي لسنوات، وهو سر كيميائي يعتمد على التفاعلات العضوية والتثبيت الجزيئي للمستخلصات العطرية.",
    steps: [
      {
        title: "الاستخلاص والذوبان العضوي",
        description: "تُذوب المكونات الزيتية العطرية في الكحول الإيثيلي (Ethanol) كونه مذيباً قطبياً خفيفاً يسحب جزيئات الإسترات المتطايرة من أخشاب الصندل والمحلب وجوز الطيب ويحافظ على ثبات تركيبها الكيميائي."
      },
      {
        title: "تثبيت الروائح الكيميائي (Fixation)",
        description: "يُستخدم المسك والراتنجات الطبيعية (الظفرة المعالجة هيدروكسيلياً) ذات التراكيب الحلقية الضخمة التي تبطئ معدل تبخر الجزيئات العطرية الصغيرة، مما يجعل العطر يطلق أريجه ببطء وثبات تام."
      },
      {
        title: "كيمياء التبخير والتحلل الحراري",
        description: "في صناعة البخور السوداني، يتم حرق الأخشاب العطرية المشبعة بالسكريات بوجود الحرارة، فتتكسر السكريات (كربوهيدرات) بفعل التحلل الحراري لتنتج دخاناً بلورياً يثبت في الأقمشة والبيوت."
      }
    ],
    localTip: "الخمرة السودانية العتيقة تجسد معمل كيمياء مصغر في كل بيت؛ حيث يتم نقع المكونات العضوية في قوارير معتمة لمدة أشهر لإتمام عمليات التخمير والأسترة البطيئة للحصول على الرائحة المثالية."
  }
];

export const SudanCaseStudies: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<string>("water_treatment");

  const currentCase = sudanCases.find((c) => c.id === selectedCase) || sudanCases[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-[#E5E2DE] dark:border-slate-800 rounded-lg p-6 text-right shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E2DE] dark:border-slate-800 pb-4">
        <div className="order-2 sm:order-1 flex items-center gap-2">
          <span className="text-xs text-[#7F8C8D] dark:text-slate-400 bg-[#F9F8F6] dark:bg-slate-800 px-2.5 py-1 rounded border border-[#E5E2DE] dark:border-slate-700 font-bold font-sans">
            من واقع بيئتنا السودانية
          </span>
          <h3 className="text-lg font-serif font-bold text-[#2C3E50] dark:text-slate-100">دراسات حالة واقعية: الكيمياء في السودان</h3>
        </div>
        <Compass className="order-1 sm:order-2 w-6 h-6 text-[#E67E22] shrink-0" />
      </div>

      <p className="text-xs text-[#7F8C8D] dark:text-slate-300 leading-relaxed">
        تطبيق المفاهيم الكيميائية النظرية التي تدرسها في منهج الصف الثاني الثانوي على قطاعات البيئة والصناعة الحية داخل بلدنا السودان. اختر دراسة الحالة لتستكشف الكيمياء التطبيقية والعملية:
      </p>

      {/* Case Grid Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sudanCases.map((item) => {
          const Icon = item.icon;
          const isSelected = item.id === selectedCase;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedCase(item.id)}
              className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 ${
                isSelected 
                  ? "bg-[#F9F8F6] dark:bg-slate-800/95 border-[#E67E22] dark:border-[#E67E22] shadow-sm scale-102 ring-1 ring-[#E67E22]" 
                  : "bg-white dark:bg-slate-900/80 hover:bg-[#F9F8F6]/50 dark:hover:bg-slate-800/60 border-[#E5E2DE] dark:border-slate-800"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.color}`}>
                  {item.badge}
                </span>
                <Icon className={`w-5 h-5 ${isSelected ? "text-[#E67E22]" : "text-[#95A5A6] dark:text-slate-400"}`} />
              </div>
              <div className="space-y-1">
                <span className="block font-bold text-sm text-[#2C3E50] dark:text-slate-100">{item.title}</span>
                <span className="block text-[10px] text-[#7F8C8D] dark:text-slate-400 font-sans truncate">{item.location}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Showcase Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`p-6 rounded-xl border border-[#E5E2DE] dark:border-slate-800 ${currentCase.accentBg} space-y-5 shadow-sm`}
        >
          {/* Main Info */}
          <div className="space-y-2 border-b border-[#E5E2DE] dark:border-slate-800 pb-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs font-bold text-[#E67E22] bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-[#E5E2DE] dark:border-slate-700 flex items-center gap-1 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#E67E22]" />
                {currentCase.location}
              </span>
              <h4 className="text-base font-bold text-[#2C3E50] dark:text-slate-100">{currentCase.title}</h4>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xs text-[#7F8C8D] dark:text-slate-300 font-sans font-medium">{currentCase.concept}</span>
              <Info className="w-3.5 h-3.5 text-[#95A5A6] dark:text-slate-400" />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[#2C3E50] dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-950/80 p-4 rounded-lg border border-[#E5E2DE] dark:border-slate-800 shadow-inner">
            {currentCase.summary}
          </p>

          {/* Steps Timeline */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-[#7F8C8D] dark:text-slate-300 font-sans uppercase tracking-wider mb-2">الخطوات الكيميائية والعمليات بالتفصيل:</h5>
            <div className="space-y-4 relative border-r-2 border-[#E5E2DE] dark:border-slate-700 mr-3 pr-5">
              {currentCase.steps.map((step, idx) => (
                <div key={idx} className="relative space-y-2 bg-white/80 dark:bg-slate-950/60 p-3.5 rounded-lg border border-[#E5E2DE] dark:border-slate-800 shadow-2xs">
                  {/* Timeline dot */}
                  <span className="absolute right-[-26px] top-4 w-3.5 h-3.5 rounded-full bg-[#E67E22] border-2 border-white dark:border-slate-900 shadow-xs" />
                  
                  <span className="block text-xs font-bold text-[#2C3E50] dark:text-slate-100">{step.title}</span>
                  <p className="text-xs text-[#7F8C8D] dark:text-slate-300 leading-relaxed">{step.description}</p>
                  
                  {step.chemicalEquation && (
                    <div className="bg-white dark:bg-slate-950 border border-[#E5E2DE] dark:border-slate-800 p-2.5 rounded text-left font-mono text-xs text-[#2C3E50] dark:text-emerald-300 shadow-2xs overflow-x-auto select-all" dir="ltr">
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block mb-1">الرابط الكيميائي / المعادلة:</span>
                      {step.chemicalEquation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sudanese Context Box */}
          <div className="bg-white dark:bg-slate-950/80 border border-[#E5E2DE] dark:border-slate-800 p-4 rounded-lg shadow-xs flex gap-4 items-start">
            <div className="flex-1 space-y-1">
              <span className="block text-xs font-bold text-[#2C3E50] dark:text-slate-100">معلومة سودانية كيميائية:</span>
              <p className="text-xs text-[#7F8C8D] dark:text-slate-300 leading-relaxed">{currentCase.localTip}</p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded border border-amber-100 dark:border-amber-900/60 shrink-0">
              <Lightbulb className="w-5 h-5 text-[#E67E22] animate-bounce" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
