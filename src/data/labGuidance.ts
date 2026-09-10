// src/data/labGuidance.ts
// نظام التوجيه الذكي وترقيم الأدوات المخصصة لكل تجربة معملية وحذف أي أدوات غير مرتبطة

export interface StepGuidance {
  targetActionId: string;
  toolNumber: number; // 1 to 6
  toolName: string;
  actionVerb: string;
  hintText: string;
  badgeSymbol: string; // "①", "②", etc.
}

export interface LabToolItem {
  id: string;
  number: number;
  badge: string;
  label: string;
  iconType: "bottle" | "pipette" | "rod" | "funnel" | "flame" | "water" | "knife" | "forceps" | "magnet" | "reset";
  colorClass: string;
}

const NUMBER_BADGES = ["①", "②", "③", "④", "⑤", "⑥"];

export function getNumberBadge(num: number): string {
  if (num >= 1 && num <= 6) return NUMBER_BADGES[num - 1];
  return `(${num})`;
}

/**
 * إرجاع قائمة أدوات تجربة حوض الفلزات القلوية (u2_l1)
 */
export function getBasinTools(): LabToolItem[] {
  return [
    {
      id: "pour_water",
      number: 1,
      badge: "①",
      label: "وعاء ماء مقطر",
      iconType: "water",
      colorClass: "from-sky-600 to-cyan-700 text-white"
    },
    {
      id: "cut_metal",
      number: 2,
      badge: "②",
      label: "سكين حاد + ورق ترشيح",
      iconType: "knife",
      colorClass: "from-slate-700 to-zinc-800 text-white"
    },
    {
      id: "drop_sodium",
      number: 3,
      badge: "③",
      label: "ملقط + صوديوم Na",
      iconType: "forceps",
      colorClass: "from-amber-500 to-yellow-600 text-slate-900"
    },
    {
      id: "drop_potassium",
      number: 4,
      badge: "④",
      label: "ملقط + بوتاسيوم K",
      iconType: "forceps",
      colorClass: "from-purple-600 to-indigo-700 text-white"
    },
    {
      id: "add_indicator",
      number: 5,
      badge: "⑤",
      label: "قطارة كاشف الفينول فثالين",
      iconType: "pipette",
      colorClass: "from-pink-600 to-rose-700 text-white"
    },
    {
      id: "clean_basin",
      number: 6,
      badge: "⑥",
      label: "غسيل وتفريغ الحوض",
      iconType: "reset",
      colorClass: "from-slate-600 to-slate-800 text-white"
    }
  ];
}

/**
 * إرجاع الأدوات المخصصة حصرياً للتجربة المحددة (منع الأدوات الزائدة ومنع تراكب الشارات)
 */
export function getExperimentTools(
  expId: string, 
  chemicals: string[] = [], 
  apparatus: string[] = []
): LabToolItem[] {
  const chemA = chemicals[0] ? chemicals[0].split("(")[0].trim() : "المتفاعل الأول";
  const chemB = chemicals[1] ? chemicals[1].split("(")[0].trim() : "المتفاعل الثاني";

  switch (expId) {
    // === UNIT 1: Classification & Periodicity ===
    case "u1_l1": // Dobereiner's triads (weighing Ca, Ba, Sr & calculating)
      return [
        { id: "weigh_ca", number: 1, badge: "①", label: "عينة الكالسيوم Ca", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "weigh_ba", number: 2, badge: "②", label: "عينة الباريوم Ba", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "calc_average", number: 3, badge: "③", label: "حاسبة متوسط الكتلة الذرية", iconType: "reset", colorClass: "from-emerald-600 to-teal-700 text-white" },
        { id: "weigh_sr", number: 4, badge: "④", label: "عينة الاسترونشيوم Sr", iconType: "bottle", colorClass: "from-purple-600 to-indigo-700 text-white" }
      ];

    case "u1_l2": // s, p, d, f blocks
      return [
        { id: "test_s", number: 1, badge: "①", label: "سلك صوديوم (فئة s)", iconType: "rod", colorClass: "from-amber-500 to-yellow-600 text-slate-900" },
        { id: "test_p", number: 2, badge: "②", label: "أنبوب غاز الكلور (فئة p)", iconType: "bottle", colorClass: "from-emerald-600 to-teal-700 text-white" },
        { id: "test_d", number: 3, badge: "③", label: "محلول أيونات النحاس (فئة d)", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "test_f", number: 4, badge: "④", label: "عينة يوروبيوم (فئة f)", iconType: "forceps", colorClass: "from-purple-600 to-indigo-700 text-white" }
      ];

    case "u1_l3": // Period 3 trends
      return [
        { id: "prep_water", number: 1, badge: "①", label: "ماء مقطر + دليل الفينول", iconType: "water", colorClass: "from-sky-600 to-cyan-700 text-white" },
        { id: "drop_na", number: 2, badge: "②", label: "فلز الصوديوم Na النشط", iconType: "forceps", colorClass: "from-amber-500 to-yellow-600 text-slate-900" },
        { id: "drop_mg", number: 3, badge: "③", label: "فلز المغنيسيوم Mg", iconType: "forceps", colorClass: "from-slate-600 to-zinc-700 text-white" },
        { id: "heat_mg", number: 4, badge: "④", label: "موقد تسخين أنبوبة Mg", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" }
      ];

    // === UNIT 2: Alkali & Alkaline Earth Metals ===
    case "u2_l1": // Alkali basin
      return getBasinTools();

    case "u2_l2": // Flame tests
      return [
        { id: "clean_wire", number: 1, badge: "①", label: "سلك بلاتين + حمض HCl", iconType: "rod", colorClass: "from-slate-600 to-slate-700 text-white" },
        { id: "flame_na", number: 2, badge: "②", label: "ملح NaCl (أصفر ذهبي)", iconType: "bottle", colorClass: "from-amber-500 to-yellow-600 text-slate-900" },
        { id: "flame_k", number: 3, badge: "③", label: "ملح KCl (بنفسجي فاتح)", iconType: "bottle", colorClass: "from-purple-600 to-indigo-700 text-white" },
        { id: "flame_ca", number: 4, badge: "④", label: "ملح CaCl2 (أحمر طوبي)", iconType: "bottle", colorClass: "from-rose-600 to-red-700 text-white" },
        { id: "flame_li", number: 5, badge: "⑤", label: "ملح LiCl (أحمر قرمزي)", iconType: "bottle", colorClass: "from-red-600 to-rose-800 text-white" },
        { id: "toggle_heat", number: 6, badge: "⑥", label: "موقد بنسن للكشف الطيفي", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" }
      ];

    // === UNIT 3: Organic Chemistry ===
    case "u3_l1": // Wohler synthesis of Urea
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "محلول كلوريد الأمونيوم", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "add_reagent_2", number: 2, badge: "②", label: "محلول سيانات الفضة", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "filter_funnel", number: 3, badge: "③", label: "قمع ترشيح راسب AgCl", iconType: "funnel", colorClass: "from-emerald-600 to-teal-700 text-white" },
        { id: "toggle_heat", number: 4, badge: "④", label: "موقد تبخير سيانات الأمونيوم", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" }
      ];

    case "u3_l2": // IUPAC
      return [
        { id: "build_chain", number: 1, badge: "①", label: "السلسلة الأم (5 كربون - بنتان)", iconType: "rod", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "add_branch_1", number: 2, badge: "②", label: "تفرع ميثيل على ذرة C2", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "add_branch_2", number: 3, badge: "③", label: "تفرع ميثيل إضافي على C4", iconType: "bottle", colorClass: "from-purple-600 to-indigo-700 text-white" }
      ];

    case "u3_l3": // Hydrocarbon comparison
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "عينة الهكسان المشبع (ألكان)", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "add_reagent_2", number: 2, badge: "②", label: "عينة الهكسين غير المشبع (ألكين)", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "use_pipette", number: 3, badge: "③", label: "ماصة كاشف ماء البروم الأحمر", iconType: "pipette", colorClass: "from-rose-600 to-red-700 text-white" },
        { id: "stir_rod", number: 4, badge: "④", label: "ساق التقليب والمزج", iconType: "rod", colorClass: "from-slate-600 to-slate-700 text-white" }
      ];

    case "u3_l4": // Methane prep
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "خلات صوديوم لا مائية", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "add_reagent_2", number: 2, badge: "②", label: "مسحوق الجير الصودي", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "toggle_heat", number: 3, badge: "③", label: "موقد بنسن للتسخين الشديد", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" },
        { id: "collect_gas", number: 4, badge: "④", label: "مخبار جمع غاز الميثان", iconType: "funnel", colorClass: "from-emerald-600 to-teal-700 text-white" }
      ];

    case "u3_l5": // Ethene & Bromine
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "كحول إيثيلي (إيثانول)", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "add_reagent_2", number: 2, badge: "②", label: "حمض كبريتيك مركز", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "toggle_heat", number: 3, badge: "③", label: "موقد التسخين (180°C)", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" },
        { id: "use_pipette", number: 4, badge: "④", label: "ماصة ماء البروم الأحمر", iconType: "pipette", colorClass: "from-rose-600 to-red-700 text-white" }
      ];

    case "u3_l6": // Ethyne oxy-acetylene
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "قطع كربيد الكالسيوم CaC2", iconType: "bottle", colorClass: "from-slate-600 to-slate-700 text-white" },
        { id: "use_pipette", number: 2, badge: "②", label: "قطارة الماء المقطر", iconType: "pipette", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "collect_gas", number: 3, badge: "③", label: "صمام جمع غاز الأسيتيلين", iconType: "funnel", colorClass: "from-emerald-600 to-teal-700 text-white" },
        { id: "ignite_torch", number: 4, badge: "④", label: "مشعل الأوكسي أسيتيلين (3000°C)", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" }
      ];

    case "u3_l7": // Benzene vs Hexene
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "عينة البنزين العطري C6H6", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "add_reagent_2", number: 2, badge: "②", label: "عينة الهكسين C6H12", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "use_pipette", number: 3, badge: "③", label: "قطارة كاشف KMnO4 / البروم", iconType: "pipette", colorClass: "from-purple-600 to-indigo-700 text-white" },
        { id: "stir_rod", number: 4, badge: "④", label: "ساق الرج والتقليب", iconType: "rod", colorClass: "from-slate-600 to-slate-700 text-white" }
      ];

    case "u3_l8": // Isomers
      return [
        { id: "isomer_1", number: 1, badge: "①", label: "بنتان عادي (سلسلة مستقيمة)", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "isomer_2", number: 2, badge: "②", label: "أيزوبنتان (2-ميثيل بيوتان)", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "isomer_3", number: 3, badge: "③", label: "نيوبنتان (2,2-ثنائي ميثيل)", iconType: "bottle", colorClass: "from-purple-600 to-indigo-700 text-white" }
      ];

    // === UNIT 4: Group 5 Elements ===
    case "u4_l1": // Phosphorus allotropes
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "ملقط الفوسفور الأبيض الشمعي", iconType: "forceps", colorClass: "from-amber-500 to-yellow-600 text-slate-900" },
        { id: "add_reagent_2", number: 2, badge: "②", label: "ملعقة الفوسفور الأحمر", iconType: "rod", colorClass: "from-rose-600 to-red-700 text-white" },
        { id: "toggle_heat", number: 3, badge: "③", label: "مشعل التسخين الهادئ (240°C)", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" }
      ];

    case "u4_l2": // Nitrogen prep
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "محلول كلوريد الأمونيوم", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "add_reagent_2", number: 2, badge: "②", label: "محلول نتريت الصوديوم", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "toggle_heat", number: 3, badge: "③", label: "موقد بنسن للتسخين الهين", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" },
        { id: "collect_gas", number: 4, badge: "④", label: "مخبار جمع النيتروجين بإزاحة الماء", iconType: "funnel", colorClass: "from-emerald-600 to-teal-700 text-white" }
      ];

    case "u4_l3": // Ammonia fountain
      return [
        { id: "prep_flask", number: 1, badge: "①", label: "دورق غاز الأمونيا الجاف", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "use_pipette", number: 2, badge: "②", label: "قطارة حقن الماء لبدء الذوبان", iconType: "pipette", colorClass: "from-cyan-600 to-sky-700 text-white" },
        { id: "open_fountain", number: 3, badge: "③", label: "صمام اندفاع النافورة الزرقاء", iconType: "water", colorClass: "from-blue-600 to-indigo-700 text-white" }
      ];

    case "u4_l4": // Ammonium sulfate
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "محلول هيدروكسيد الأمونيوم", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "use_pipette", number: 2, badge: "②", label: "سحاحة حمض الكبريتيك المخفف", iconType: "pipette", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "stir_rod", number: 3, badge: "③", label: "ساق التقليب الزجاجي", iconType: "rod", colorClass: "from-slate-600 to-slate-700 text-white" },
        { id: "toggle_heat", number: 4, badge: "④", label: "موقد تبخير وبلورة السماد", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" }
      ];

    // === UNIT 5: Halogens ===
    case "u5_l1": // Halogen displacement
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "ماء الكلور Cl2 المؤكسد", iconType: "bottle", colorClass: "from-emerald-600 to-teal-700 text-white" },
        { id: "add_reagent_2", number: 2, badge: "②", label: "محلول بروميد البوتاسيوم KBr", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "use_pipette", number: 3, badge: "③", label: "محلول يوديد البوتاسيوم KI", iconType: "pipette", colorClass: "from-purple-600 to-indigo-700 text-white" },
        { id: "stir_rod", number: 4, badge: "④", label: "مذيب CCl4 وساق الاستخلاص", iconType: "rod", colorClass: "from-cyan-600 to-sky-700 text-white" }
      ];

    case "u5_l2": // Chlorine prep
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "مسحوق ثاني أكسيد المنجنيز MnO2", iconType: "bottle", colorClass: "from-slate-700 to-zinc-800 text-white" },
        { id: "use_pipette", number: 2, badge: "②", label: "حمض HCl المركز عبر القمع", iconType: "pipette", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "toggle_heat", number: 3, badge: "③", label: "موقد التسخين الهين", iconType: "flame", colorClass: "from-orange-600 to-red-600 text-white" },
        { id: "collect_gas", number: 4, badge: "④", label: "مخبار جمع غاز الكلور للأعلى", iconType: "funnel", colorClass: "from-emerald-600 to-teal-700 text-white" }
      ];

    case "u5_l3": // Chlorine bleaching
      return [
        { id: "insert_dry", number: 1, badge: "①", label: "ملقط ورقة تباع شمس جافة", iconType: "forceps", colorClass: "from-rose-600 to-red-700 text-white" },
        { id: "use_pipette", number: 2, badge: "②", label: "قطارة ترطيب الورقة بالماء", iconType: "pipette", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "insert_moist", number: 3, badge: "③", label: "ملقط إدخال الورقة المبللة", iconType: "forceps", colorClass: "from-emerald-600 to-teal-700 text-white" }
      ];

    // === UNIT 6: Transition Elements ===
    case "u6_l1": // Transition magnetism & color
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "عينة كبريتات الحديدوز FeSO4", iconType: "bottle", colorClass: "from-emerald-600 to-teal-700 text-white" },
        { id: "toggle_magnet", number: 2, badge: "②", label: "مفتاح تشغيل المغناطيس ⚡", iconType: "magnet", colorClass: "from-cyan-600 to-sky-700 text-white" },
        { id: "add_reagent_2", number: 3, badge: "③", label: "عينة كبريتات النحاس CuSO4", iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "use_pipette", number: 4, badge: "④", label: "عينة كلوريد الخارصين ZnCl2", iconType: "bottle", colorClass: "from-slate-600 to-slate-700 text-white" }
      ];

    case "u6_l2": // Aqua Regia gold dissolution
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: "حمض HCl المركز (3 أحجام)", iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "add_reagent_2", number: 2, badge: "②", label: "حمض HNO3 المركز (حجم واحد)", iconType: "bottle", colorClass: "from-orange-600 to-red-600 text-white" },
        { id: "add_gold", number: 3, badge: "③", label: "ملقط سبيكة الذهب النقي Au", iconType: "forceps", colorClass: "from-yellow-500 to-amber-600 text-slate-900" },
        { id: "stir_rod", number: 4, badge: "④", label: "ساق التقليب والمزج", iconType: "rod", colorClass: "from-slate-600 to-slate-700 text-white" }
      ];

    // Default fallback: 4 cleanly tailored tools
    default:
      return [
        { id: "add_reagent_1", number: 1, badge: "①", label: `قارورة ${chemA}`, iconType: "bottle", colorClass: "from-sky-600 to-blue-700 text-white" },
        { id: "add_reagent_2", number: 2, badge: "②", label: `قارورة ${chemB}`, iconType: "bottle", colorClass: "from-amber-600 to-amber-700 text-white" },
        { id: "use_pipette", number: 3, badge: "③", label: "ماصة وقطارة كيميائية", iconType: "pipette", colorClass: "from-rose-600 to-red-700 text-white" },
        { id: "stir_rod", number: 4, badge: "④", label: "ساق تقليب زجاجي", iconType: "rod", colorClass: "from-slate-600 to-slate-700 text-white" }
      ];
  }
}

/**
 * إرجاع قائمة الأدوات الموحدة (محتفظ بها للتوافق الخلفي)
 */
export function getUniversalTools(chemicals: string[] = []): LabToolItem[] {
  return getExperimentTools("default", chemicals);
}

/**
 * تحديد التوجيه الذكي والأداة المطلوبة للخطوة الحالية بدقة متطابقة مع أدوات المعمل
 */
export function getStepGuidance(
  expId: string,
  stepIndex: number,
  stepText: string = "",
  chemicals: string[] = [],
  apparatusType?: string
): StepGuidance {
  const tools = getExperimentTools(expId, chemicals);
  const text = stepText.toLowerCase();

  // معمل تفاعل الفلزات القلوية مع الماء (حوض زجاجي)
  if (expId === "u2_l1" || apparatusType === "glass_basin") {
    if (stepIndex <= 1 || text.includes("ماء") || text.includes("حوض")) {
      const tool = tools.find(t => t.id === "pour_water") || tools[0];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "املأ الحوض بالماء",
        hintText: `👉 اسحب [${tool.label} ${tool.badge}] لتجهيز الحوض بالماء النقي`
      };
    }
    if (stepIndex === 2 || text.includes("سكين") || text.includes("اقطع") || text.includes("جفف")) {
      const tool = tools.find(t => t.id === "cut_metal") || tools[1];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "اقطع وجفف الفلز",
        hintText: `👉 انقر على [${tool.label} ${tool.badge}] لقطع قطعة صوديوم صغيرة وتجفيفها`
      };
    }
    if (stepIndex === 3 || text.includes("صوديوم") || text.includes("na")) {
      const tool = tools.find(t => t.id === "drop_sodium") || tools[2];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "أسقط الصوديوم بالملقط",
        hintText: `👉 اسحب [${tool.label} ${tool.badge}] لمشاهدة الانصهار واللهب الأصفر!`
      };
    }
    if (text.includes("بوتاسيوم") || text.includes(" k ")) {
      const tool = tools.find(t => t.id === "drop_potassium") || tools[3];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "أسقط البوتاسيوم بالملقط",
        hintText: `👉 اسحب [${tool.label} ${tool.badge}] لمشاهدة الاشتعال البنفسجي العنيف!`
      };
    }
    const tool = tools.find(t => t.id === "add_indicator") || tools[4] || tools[tools.length - 1];
    return {
      targetActionId: tool.id,
      toolNumber: tool.number,
      badgeSymbol: tool.badge,
      toolName: tool.label,
      actionVerb: "أضف قطرات الدليل",
      hintText: `👉 اسحب [${tool.label} ${tool.badge}] للكشف عن قلوية المحلول`
    };
  }

  // كشف اللهب (u2_l2)
  if (expId === "u2_l2") {
    if (stepIndex === 0) {
      const tool = tools.find(t => t.id === "clean_wire") || tools[0];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "نظف السلك",
        hintText: `👉 اسحب [${tool.label} ${tool.badge}] لتنظيفه في حمض HCl`
      };
    }
    if (stepIndex === 1) {
      const tool = tools.find(t => t.id === "flame_na") || tools[1];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "اكشف على الصوديوم",
        hintText: `👉 اسحب [${tool.label} ${tool.badge}] لملاحظة اللهب الأصفر الذهبي`
      };
    }
    if (stepIndex === 2) {
      const tool = tools.find(t => t.id === "flame_k") || tools[2];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "اكشف على البوتاسيوم",
        hintText: `👉 اسحب [${tool.label} ${tool.badge}] لملاحظة اللهب البنفسجي`
      };
    }
    const tool = tools.find(t => t.id === "flame_li") || tools[4] || tools[3];
    return {
      targetActionId: tool.id,
      toolNumber: tool.number,
      badgeSymbol: tool.badge,
      toolName: tool.label,
      actionVerb: "اكشف على الليثيوم",
      hintText: `👉 اسحب [${tool.label} ${tool.badge}] لملاحظة اللهب القرمزي الكرزي`
    };
  }

  // ميزان غوي (u6_l1)
  if (expId === "u6_l1" || apparatusType === "magnetic_balance") {
    if (text.includes("مغناطيس") || text.includes("شغل") || text.includes("تشغيل")) {
      const tool = tools.find(t => t.id === "toggle_magnet") || tools[1];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "شغل المغناطيس",
        hintText: `👉 اضغط على [${tool.label} ${tool.badge}] لملاحظة الانجذاب الميزاني`
      };
    }
    if (stepIndex === 0) {
      const tool = tools[0];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "علق العينة الأولى",
        hintText: `👉 اسحب أو اضغط على [${tool.label} ${tool.badge}] لتعليقها بين قطبي المغناطيس`
      };
    }
    if (stepIndex === 2) {
      const tool = tools[2] || tools[1];
      return {
        targetActionId: tool.id,
        toolNumber: tool.number,
        badgeSymbol: tool.badge,
        toolName: tool.label,
        actionVerb: "علق العينة الثانية",
        hintText: `👉 اسحب أو اضغط على [${tool.label} ${tool.badge}] لاختبار خواصها`
      };
    }
    const tool = tools[tools.length - 1];
    return {
      targetActionId: tool.id,
      toolNumber: tool.number,
      badgeSymbol: tool.badge,
      toolName: tool.label,
      actionVerb: "اختبر العينة",
      hintText: `👉 اسحب [${tool.label} ${tool.badge}] لاختبار سلوكها المغناطيسي`
    };
  }

  // البحث المباشر في أدوات التجربة الحالية بناءً على نصوص الخطوة
  // 1. فحص التسخين
  if (text.includes("سخن") || text.includes("تسخين") || text.includes("موقد") || text.includes("لهب") || text.includes("أشعل") || text.includes("تبخير")) {
    const heatTool = tools.find(t => t.iconType === "flame" || t.id.includes("heat") || t.id.includes("torch"));
    if (heatTool) {
      return {
        targetActionId: heatTool.id,
        toolNumber: heatTool.number,
        badgeSymbol: heatTool.badge,
        toolName: heatTool.label,
        actionVerb: "سخّن بالموقد",
        hintText: `👉 اسحب [${heatTool.label} ${heatTool.badge}] أو انقر عليه لبدء التسخين الحراري`
      };
    }
  }

  // 2. فحص الترشيح
  if (text.includes("ترشيح") || text.includes("قمع") || text.includes("افصل الراسب") || text.includes("راشح")) {
    const funnelTool = tools.find(t => t.iconType === "funnel" || t.id.includes("filter"));
    if (funnelTool) {
      return {
        targetActionId: funnelTool.id,
        toolNumber: funnelTool.number,
        badgeSymbol: funnelTool.badge,
        toolName: funnelTool.label,
        actionVerb: "رشّح الخليط",
        hintText: `👉 اسحب [${funnelTool.label} ${funnelTool.badge}] لفصل الراسب والحصول على المحلول الصافي`
      };
    }
  }

  // 3. فحص التقليب
  if (text.includes("رج") || text.includes("تقليب") || text.includes("اخلط") || text.includes("ساق") || text.includes("حرك")) {
    const rodTool = tools.find(t => t.iconType === "rod" || t.id.includes("stir"));
    if (rodTool) {
      return {
        targetActionId: rodTool.id,
        toolNumber: rodTool.number,
        badgeSymbol: rodTool.badge,
        toolName: rodTool.label,
        actionVerb: "قلّب المحلول",
        hintText: `👉 اسحب [${rodTool.label} ${rodTool.badge}] أو انقر عليه لرج وتقليب المحلول`
      };
    }
  }

  // 4. فحص القطارة / الماصة
  if (text.includes("قطارة") || text.includes("ماصة") || text.includes("قطرات") || text.includes("ماء البروم") || text.includes("حقن")) {
    const pipTool = tools.find(t => t.iconType === "pipette" || t.id.includes("pipette"));
    if (pipTool) {
      return {
        targetActionId: pipTool.id,
        toolNumber: pipTool.number,
        badgeSymbol: pipTool.badge,
        toolName: pipTool.label,
        actionVerb: "أضف بالماصة",
        hintText: `👉 اسحب [${pipTool.label} ${pipTool.badge}] لإضافة القطرات بدقة`
      };
    }
  }

  // 5. ربط الخطوة المباشرة بترتيب أدوات التجربة (1-to-1 index matching fallback)
  const targetToolIndex = Math.min(stepIndex, tools.length - 1);
  const matchedTool = tools[targetToolIndex];

  return {
    targetActionId: matchedTool.id,
    toolNumber: matchedTool.number,
    badgeSymbol: matchedTool.badge,
    toolName: matchedTool.label,
    actionVerb: `استخدم ${matchedTool.label}`,
    hintText: `👉 اسحب [${matchedTool.label} ${matchedTool.badge}] أو انقر عليها لتنفيذ الخطوة`
  };
}

/**
 * التحقق مما إذا كان الإجراء المنفذ من الطالب يطابق الأداة المطلوبة للخطوة
 */
export function isToolMatchingStep(actionId: string, targetActionId: string): boolean {
  if (actionId === targetActionId) return true;

  // تساهل تفاعلي مرن لتشجيع الطالب ودعم سلاسة التعلم:
  const isTargetReagent = targetActionId.includes("reagent") || targetActionId.includes("add") || targetActionId.includes("weigh") || targetActionId.includes("test");
  const isActionReagent = actionId.includes("reagent") || actionId.includes("add") || actionId.includes("weigh") || actionId.includes("test");
  if (isTargetReagent && isActionReagent) return true;

  if (targetActionId.includes("heat") && (actionId.includes("heat") || actionId.includes("flame") || actionId.includes("torch"))) return true;
  if (targetActionId.includes("pipette") && (actionId.includes("pipette") || actionId.includes("dropper") || actionId.includes("inject"))) return true;
  if (targetActionId.includes("stir") && (actionId.includes("stir") || actionId.includes("rod") || actionId.includes("mix"))) return true;
  if (targetActionId.includes("filter") && (actionId.includes("filter") || actionId.includes("funnel"))) return true;

  return false;
}
