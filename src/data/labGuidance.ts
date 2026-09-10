// src/data/labGuidance.ts
// نظام التوجيه الذكي وترقيم الأدوات وربط الخطوات بالمعامل الكيميائية الافتراضية

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
 * إرجاع قائمة الأدوات الستة الموحدة على صينية المعمل
 */
export function getUniversalTools(chemicals: string[] = []): LabToolItem[] {
  const chemA = chemicals[0] ? chemicals[0].split("(")[0].trim() : "المتفاعل الأول";
  const chemB = chemicals[1] ? chemicals[1].split("(")[0].trim() : "المتفاعل الثاني";

  return [
    {
      id: "add_reagent_1",
      number: 1,
      badge: "①",
      label: `قارورة ${chemA}`,
      iconType: "bottle",
      colorClass: "from-sky-600 to-blue-700 text-white"
    },
    {
      id: "add_reagent_2",
      number: 2,
      badge: "②",
      label: `قارورة ${chemB}`,
      iconType: "bottle",
      colorClass: "from-amber-600 to-amber-700 text-white"
    },
    {
      id: "use_pipette",
      number: 3,
      badge: "③",
      label: "ماصة وقطارة كيميائية",
      iconType: "pipette",
      colorClass: "from-rose-600 to-red-700 text-white"
    },
    {
      id: "stir_rod",
      number: 4,
      badge: "④",
      label: "ساق تقليب زجاجي",
      iconType: "rod",
      colorClass: "from-slate-600 to-slate-700 text-white"
    },
    {
      id: "filter_funnel",
      number: 5,
      badge: "⑤",
      label: "قمع وورق ترشيح",
      iconType: "funnel",
      colorClass: "from-emerald-600 to-teal-700 text-white"
    },
    {
      id: "toggle_heat",
      number: 6,
      badge: "⑥",
      label: "مشعل موقد بنسن",
      iconType: "flame",
      colorClass: "from-orange-600 to-red-600 text-white"
    }
  ];
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
 * تحديد التوجيه الذكي والأداة المطلوبة للخطوة الحالية بدقة
 */
export function getStepGuidance(
  expId: string,
  stepIndex: number,
  stepText: string = "",
  chemicals: string[] = [],
  apparatusType?: string
): StepGuidance {
  const text = stepText.toLowerCase();

  // 1. معمل تفاعل الفلزات القلوية مع الماء (حوض زجاجي)
  if (expId === "u2_l1" || apparatusType === "glass_basin") {
    if (stepIndex === 0 || text.includes("نظارات") || text.includes("وقائ") || text.includes("أمان")) {
      return {
        targetActionId: "pour_water",
        toolNumber: 1,
        badgeSymbol: "①",
        toolName: "وعاء الماء المقطر",
        actionVerb: "املأ الحوض بالماء",
        hintText: "👉 اضغط أو اسحب [وعاء الماء المقطر ①] لملء الحوض الزجاجي كوسط للتفاعل"
      };
    }
    if (stepIndex === 1 || text.includes("ماء") || text.includes("حوض")) {
      return {
        targetActionId: "pour_water",
        toolNumber: 1,
        badgeSymbol: "①",
        toolName: "وعاء الماء المقطر",
        actionVerb: "صب الماء المقطر",
        hintText: "👉 اسحب أو اضغط على [وعاء الماء المقطر ①] لتجهيز الحوض بالماء النقي"
      };
    }
    if (stepIndex === 2 || text.includes("سكين") || text.includes("اقطع") || text.includes("جفف")) {
      return {
        targetActionId: "cut_metal",
        toolNumber: 2,
        badgeSymbol: "②",
        toolName: "السكين الحاد وورق الترشيح",
        actionVerb: "اقطع وجفف الفلز",
        hintText: "👉 انقر على [السكين وورق الترشيح ②] لقطع قطعة صوديوم صغيرة وتجفيفها من الكيروسين"
      };
    }
    if (stepIndex === 3 || text.includes("صوديوم") || text.includes("na")) {
      return {
        targetActionId: "drop_sodium",
        toolNumber: 3,
        badgeSymbol: "③",
        toolName: "ملقط معدني + قطعة صوديوم Na",
        actionVerb: "أسقط الصوديوم بالملقط",
        hintText: "👉 اسحب [ملقط الصوديوم Na ③] وأسقطه في الحوض لمشاهدة الانصهار واللهب الأصفر الساطع!"
      };
    }
    if (text.includes("بوتاسيوم") || text.includes(" k ")) {
      return {
        targetActionId: "drop_potassium",
        toolNumber: 4,
        badgeSymbol: "④",
        toolName: "ملقط معدني + قطعة بوتاسيوم K",
        actionVerb: "أسقط البوتاسيوم بالملقط",
        hintText: "👉 اسحب [ملقط البوتاسيوم K ④] وأسقطه لمشاهدة الاشتعال العنيف باللون البنفسجي المميز!"
      };
    }
    // الخطوة الأخيرة أو إضافة الفينول
    return {
      targetActionId: "add_indicator",
      toolNumber: 5,
      badgeSymbol: "⑤",
      toolName: "قطارة دليل الفينول فثالين",
      actionVerb: "أضف قطرات الدليل",
      hintText: "👉 اسحب أو اضغط على [قطارة الفينول فثالين ⑤] للكشف عن قلوية المحلول وتحوله للوردي"
    };
  }

  // 2. معمل الميزان المغناطيسي (u6_l1)
  if (expId === "u6_l1" || apparatusType === "magnetic_balance") {
    if (text.includes("مغناطيس") || text.includes("شغل") || text.includes("تشغيل")) {
      return {
        targetActionId: "toggle_magnet",
        toolNumber: 1,
        badgeSymbol: "①",
        toolName: "مفتاح تشغيل المغناطيس الكهرومغناطيسي",
        actionVerb: "شغل المغناطيس",
        hintText: "👉 اضغط على [تشغيل المغناطيس الكهربائي ⚡] لملاحظة انحراف الميزان وتجاذب العينة"
      };
    }
    if (stepIndex === 0) {
      return {
        targetActionId: "add_reagent_1",
        toolNumber: 1,
        badgeSymbol: "①",
        toolName: "عينة كبريتات الحديد الخضراء FeSO4",
        actionVerb: "علق العينة الأولى",
        hintText: "👉 اسحب أو اضغط على [عينة الحديد FeSO4 ①] لتعليقها بين قطبي المغناطيس"
      };
    }
    if (stepIndex === 2) {
      return {
        targetActionId: "add_reagent_2",
        toolNumber: 2,
        badgeSymbol: "②",
        toolName: "عينة كبريتات النحاس CuSO4",
        actionVerb: "علق العينة الثانية",
        hintText: "👉 اسحب أو اضغط على [عينة النحاس CuSO4 ②] لاختبار خواصها المغناطيسية"
      };
    }
    return {
      targetActionId: "toggle_magnet",
      toolNumber: 1,
      badgeSymbol: "①",
      toolName: "مفتاح تشغيل المغناطيس الكهرومغناطيسي",
      actionVerb: "شغل المغناطيس",
      hintText: "👉 اضغط على [تشغيل المغناطيس الكهربائي ⚡] لاختبار الجذب والتنافر"
    };
  }

  // 3. تحليل الكلمات المفتاحية الذكي لبقية المعامل الـ 20
  const chemA = chemicals[0] ? chemicals[0].split("(")[0].trim() : "المتفاعل الأول";
  const chemB = chemicals[1] ? chemicals[1].split("(")[0].trim() : "المتفاعل الثاني";

  // فحص التسخين واللهب
  if (text.includes("سخن") || text.includes("تسخين") || text.includes("موقد") || text.includes("لهب") || text.includes("أشعل") || text.includes("احتراق")) {
    return {
      targetActionId: "toggle_heat",
      toolNumber: 6,
      badgeSymbol: "⑥",
      toolName: "مشعل موقد بنسن الحراري",
      actionVerb: "سخّن بالموقد",
      hintText: "👉 اسحب [مشعل موقد بنسن ⑥] أو انقر عليه لبدء التسخين الحراري للتفاعل"
    };
  }

  // فحص الترشيح
  if (text.includes("ترشيح") || text.includes("قمع") || text.includes("افصل الراسب") || text.includes("راشح")) {
    return {
      targetActionId: "filter_funnel",
      toolNumber: 5,
      badgeSymbol: "⑤",
      toolName: "قمع وورق الترشيح",
      actionVerb: "رشّح الخليط",
      hintText: "👉 اسحب [قمع وورق الترشيح ⑤] لفصل الراسب وتصفية المحلول الصافي"
    };
  }

  // فحص التقليب والرج
  if (text.includes("رج") || text.includes("تقليب") || text.includes("اخلط") || text.includes("ساق") || text.includes("حرك")) {
    return {
      targetActionId: "stir_rod",
      toolNumber: 4,
      badgeSymbol: "④",
      toolName: "ساق التقليب الزجاجي",
      actionVerb: "قلّب المحلول",
      hintText: "👉 اسحب [ساق التقليب ④] أو انقر عليه لرج وتقليب المحلول وزيادة سرعة التفاعل"
    };
  }

  // فحص القطارة والماصة
  if (text.includes("قطارة") || text.includes("ماصة") || text.includes("قطرات") || text.includes("تنقيط") || text.includes("ماء البروم") || text.includes("برمنجنات") || text.includes("حقن") || text.includes("دليل")) {
    return {
      targetActionId: "use_pipette",
      toolNumber: 3,
      badgeSymbol: "③",
      toolName: "الماصة والقطارة الكيميائية",
      actionVerb: "أضف قطرات بالماصة",
      hintText: `👉 اسحب [الماصة الكيميائية ③] أو انقر عليها لإضافة القطرات بدقة وبدء التفاعل`
    };
  }

  // فحص المتفاعل الثاني
  if (stepIndex === 1 || text.includes("ثاني") || text.includes("أخرى") || text.includes("كاشف ثاني") || text.includes(chemB.toLowerCase())) {
    return {
      targetActionId: "add_reagent_2",
      toolNumber: 2,
      badgeSymbol: "②",
      toolName: `قارورة ${chemB}`,
      actionVerb: `أضف ${chemB}`,
      hintText: `👉 اسحب [قارورة ${chemB} ②] أو انقر عليها لإضافتها إلى وعاء التفاعل`
    };
  }

  // المتفاعل الأول (الخطوة الأولى أو الافتراضية)
  return {
    targetActionId: "add_reagent_1",
    toolNumber: 1,
    badgeSymbol: "①",
    toolName: `قارورة ${chemA}`,
    actionVerb: `أضف ${chemA}`,
    hintText: `👉 اسحب [قارورة ${chemA} ①] أو انقر عليها للبدء بإضافتها إلى وعاء التفاعل`
  };
}

/**
 * التحقق مما إذا كان الإجراء المنفذ من الطالب يطابق الأداة المطلوبة للخطوة
 */
export function isToolMatchingStep(actionId: string, targetActionId: string): boolean {
  if (actionId === targetActionId) return true;

  // تساهل مرن لتسهيل التعلم على الطالب:
  if (targetActionId === "add_reagent_1" && (actionId === "add_reagent" || actionId === "use_pipette")) return true;
  if (targetActionId === "add_reagent_2" && (actionId === "add_reagent" || actionId === "use_pipette")) return true;
  if (targetActionId === "use_pipette" && (actionId === "add_reagent" || actionId === "add_reagent_1" || actionId === "add_reagent_2")) return true;
  if (targetActionId === "stir_rod" && (actionId === "stir" || actionId === "mix")) return true;
  if (targetActionId === "toggle_heat" && (actionId === "heat" || actionId === "flame")) return true;

  return false;
}
