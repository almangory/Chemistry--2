import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Info, 
  Zap, 
  Sparkles, 
  Flame, 
  Layers, 
  Database,
  Star,
  Activity
} from "lucide-react";

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: "alkali" | "alkaline-earth" | "transition" | "lanthanide" | "post-transition" | "metalloid" | "nonmetal" | "halogen" | "noble";
  block: "s" | "p" | "d" | "f";
  period: number;
  group: number;
  state: "صلب" | "سائل" | "غاز";
  config: string;
  sudanRelevance: string; // Connection to Sudanese 2nd Secondary Curriculum
  keyProperties: string[];
  gridRow: number;
  gridCol: number;
}

export const elementsDb: ElementData[] = [
  // Period 1
  {
    number: 1,
    symbol: "H",
    name: "الهيدروجين",
    mass: 1.008,
    category: "nonmetal",
    block: "s",
    period: 1,
    group: 1,
    state: "غاز",
    config: "1s¹",
    sudanRelevance: "يتصاعد كغاز خفيف يشتعل بفرقعة مميزة عند تفاعل الصوديوم أو الكحولات مع فلز الصوديوم (تجارب الأقلاء والمركبات العضوية).",
    keyProperties: ["غاز عديم اللون", "قابل للاشتعال بفرقعة", "أخف الغازات كلياً"],
    gridRow: 1,
    gridCol: 1
  },
  {
    number: 2,
    symbol: "He",
    name: "الهيليوم",
    mass: 4.003,
    category: "noble",
    block: "p",
    period: 1,
    group: 18,
    state: "غاز",
    config: "1s²",
    sudanRelevance: "غاز خامل يمثل نهاية الدورة الأولى بمدار مكتمل ومستقر تماماً.",
    keyProperties: ["غاز خامل ثنائي الإلكترون", "غير قابل للاشتعال", "كثافة منخفضة جداً"],
    gridRow: 1,
    gridCol: 18
  },

  // Period 2
  {
    number: 3,
    symbol: "Li",
    name: "الليثيوم",
    mass: 6.94,
    category: "alkali",
    block: "s",
    period: 2,
    group: 1,
    state: "صلب",
    config: "[He] 2s¹",
    sudanRelevance: "أول عناصر مجموعة فلزات الأقلاء. يعطي لوناً قرمزيّاً متوهجاً في كشف اللهب (الجاف) ويتفاعل مع الماء بهدوء نسبي مقارنة بالصوديوم.",
    keyProperties: ["فلز أقلاء خفيف", "كشف اللهب: قرمزي", "يحفظ تحت الكيروسين"],
    gridRow: 2,
    gridCol: 1
  },
  {
    number: 4,
    symbol: "Be",
    name: "البريليوم",
    mass: 9.012,
    category: "alkaline-earth",
    block: "s",
    period: 2,
    group: 2,
    state: "صلب",
    config: "[He] 2s²",
    sudanRelevance: "أول عناصر الأقلاء الترابية، يمتلك خواصاً مترددة تختلف عن بقية مجموعته لصغر حجمه الذري الشديد.",
    keyProperties: ["فلز ترابي صلب", "نقطة انصهار مرتفعة", "أقل نشاطاً من الليثيوم"],
    gridRow: 2,
    gridCol: 2
  },
  {
    number: 5,
    symbol: "B",
    name: "البورون",
    mass: 10.81,
    category: "metalloid",
    block: "p",
    period: 2,
    group: 13,
    state: "صلب",
    config: "[He] 2s² 2p¹",
    sudanRelevance: "شبه فلز هام ينتمي للفئة p، يترأس المجموعة الثالثة ويتميز بخصائص تساهمية فريدة.",
    keyProperties: ["شبه فلز عالي الصلادة", "ضعيف التوصيل على البارد", "بنية شبكية تساهمية"],
    gridRow: 2,
    gridCol: 13
  },
  {
    number: 6,
    symbol: "C",
    name: "الكربون",
    mass: 12.011,
    category: "nonmetal",
    block: "p",
    period: 2,
    group: 14,
    state: "صلب",
    config: "[He] 2s² 2p²",
    sudanRelevance: "الأساس المطلق لكيمياء الكربون (العضوية) في الباب الثالث. يتميز بقدرته الفريدة على تكوين روابط أحادية وثنائية وثلاثية، وسلاسل كربون مستمرة ومتفرعة وحلقية.",
    keyProperties: ["رباعي التكافؤ", "يكون أيزومرات متعددة", "ظاهرة التآصل (جرافيت/ماس)"],
    gridRow: 2,
    gridCol: 14
  },
  {
    number: 7,
    symbol: "N",
    name: "النيتروجين",
    mass: 14.007,
    category: "nonmetal",
    block: "p",
    period: 2,
    group: 15,
    state: "غاز",
    config: "[He] 2s² 2p³",
    sudanRelevance: "غاز الغلاف الجوي الهام الموصوف في الباب الرابع. يحضر معملياً بتسخين نتريت الأمونيوم، ويدخل في تركيب الأسمدة وغاز النشادر قلوي التأثير.",
    keyProperties: ["غاز ثنائي الذرة خامل", "رابطة تساهمية ثلاثية قوية", "أساس الأسمدة النيتروجينية"],
    gridRow: 2,
    gridCol: 15
  },
  {
    number: 8,
    symbol: "O",
    name: "الأكسجين",
    mass: 15.999,
    category: "nonmetal",
    block: "p",
    period: 2,
    group: 16,
    state: "غاز",
    config: "[He] 2s² 2p⁴",
    sudanRelevance: "غاز ضروري للاحتراق والتنفس. ينتج الأكسجين الذري [O] كعامل مؤكسد خارق وقوي جداً عند ذوبان الكلور في الماء لإزالة الألوان العضوية.",
    keyProperties: ["غاز ثنائي الذرة نشط", "عامل مؤكسد رئيسي", "سالبية كهربية مرتفعة جداً"],
    gridRow: 2,
    gridCol: 16
  },
  {
    number: 9,
    symbol: "F",
    name: "الفلور",
    mass: 18.998,
    category: "halogen",
    block: "p",
    period: 2,
    group: 17,
    state: "غاز",
    config: "[He] 2s² 2p⁵",
    sudanRelevance: "أنشط لا فلز وهالوجين في الجدول الدوري على الإطلاق. يمتلك أعلى سالبية كهربية وأقوى قدرة على جذب إلكترونات التكافؤ كلياً.",
    keyProperties: ["غاز أصفر شاحب سام جداً", "أعلى كهروسالبية (4.0)", "رابطة تساهمية قطبية قوية"],
    gridRow: 2,
    gridCol: 17
  },
  {
    number: 10,
    symbol: "Ne",
    name: "النيون",
    mass: 20.18,
    category: "noble",
    block: "p",
    period: 2,
    group: 18,
    state: "غاز",
    config: "[He] 2s² 2p⁶",
    sudanRelevance: "غاز نبيل مستقر تماماً بنظام ثماني إلكتروني كامل في المدار الخارجي.",
    keyProperties: ["غاز خامل أحادي الذرة", "يصدر توهجاً أحمر في أنابيب التفريغ", "لا يتفاعل في الظروف الطبيعية"],
    gridRow: 2,
    gridCol: 18
  },

  // Period 3
  {
    number: 11,
    symbol: "Na",
    name: "الصوديوم",
    mass: 22.99,
    category: "alkali",
    block: "s",
    period: 3,
    group: 1,
    state: "صلب",
    config: "[Ne] 3s¹",
    sudanRelevance: "النموذج المثالي لفلزات الأقلاء وتدرج خواص الدورة الثالثة. يتفاعل بعنف شديد مع الماء معطياً هيدروكسيد الصوديوم القلوي ولهب كشف جاف أصفر ذهبي ساطع.",
    keyProperties: ["فلز أقلاء طري ولامع", "كشف اللهب: أصفر ذهبي ناصع", "يتفاعل بعنف شديد مع الماء"],
    gridRow: 3,
    gridCol: 1
  },
  {
    number: 12,
    symbol: "Mg",
    name: "المغنيسيوم",
    mass: 24.305,
    category: "alkaline-earth",
    block: "s",
    period: 3,
    group: 2,
    state: "صلب",
    config: "[Ne] 3s²",
    sudanRelevance: "عنصر الدورة الثالثة الذي يثبت تدرج الحجم والنشاط الكيميائي؛ لا يتفاعل مع الماء البارد مطلقاً، ولكنه يتفاعل ببطء شديد مع الماء الساخن بالتسخين المباشر.",
    keyProperties: ["فلز فضي متين", "احترق بوميض أبيض باهر", "قوة جذب نواة أكبر من Na"],
    gridRow: 3,
    gridCol: 2
  },
  {
    number: 13,
    symbol: "Al",
    name: "الألومنيوم",
    mass: 26.982,
    category: "post-transition",
    block: "p",
    period: 3,
    group: 13,
    state: "صلب",
    config: "[Ne] 3s² 3p¹",
    sudanRelevance: "فلز خفيف مميز بالفئة p، يظهر سلوكاً متردداً حيث يتفاعل كحمض مع القواعد القوية وكقاعدة مع الأحماض القوية، وينتج هيدروكسيدات مترددة.",
    keyProperties: ["متردد السلوك كيميائياً", "مقاوم للتآكل بفضل طبقة الأكسيد Al₂O₃", "ممتاز التوصيل للحرارة"],
    gridRow: 3,
    gridCol: 13
  },
  {
    number: 14,
    symbol: "Si",
    name: "السيليكون",
    mass: 28.085,
    category: "metalloid",
    block: "p",
    period: 3,
    group: 14,
    state: "صلب",
    config: "[Ne] 3s² 3p²",
    sudanRelevance: "شبه فلز من الدورة الثالثة، يتوسط عناصر الدورة ويمتلك خواصاً تساهمية شبكية تمنحه صلابة هائلة وتوصيلاً شبه موصل.",
    keyProperties: ["شبه فلز بلوري صلب", "بنية شبكية تساهمية شبيهة بالماس", "أصل صناعة الإلكترونيات الرقمية"],
    gridRow: 3,
    gridCol: 14
  },
  {
    number: 15,
    symbol: "P",
    name: "الفوسفور",
    mass: 30.974,
    category: "nonmetal",
    block: "p",
    period: 3,
    group: 15,
    state: "صلب",
    config: "[Ne] 3s² 3p³",
    sudanRelevance: "عنصر لا فلزي في الباب الرابع يوضح ظاهرة التآصل بامتياز (الفوسفور الأبيض النشط P₄ والفوسفور الأحمر المستقر). يشتعل الفوسفور الأبيض تلقائياً في الجو عند 30 درجة مئوية.",
    keyProperties: ["ظاهرة التآصل (أبيض وأحمر)", "أبخرة بيضاء كثيفة P₄O₁₀ عند الاحتراق", "أساس الأسمدة الفوسفاتية الكبرى"],
    gridRow: 3,
    gridCol: 15
  },
  {
    number: 16,
    symbol: "S",
    name: "الكبريت",
    mass: 32.06,
    category: "nonmetal",
    block: "p",
    period: 3,
    group: 16,
    state: "صلب",
    config: "[Ne] 3s² 3p⁴",
    sudanRelevance: "لافلز أصفر هام في الكيمياء الصناعية والتعدينية. يوضح ظاهرة التأصل البلوري بوضوح (كبريت معيني ومنشوري)، ويدخل في الكشف عن كبريتات الأسمدة.",
    keyProperties: ["مسحوق أصفر لافلزي", "تآصل معيني ومنشوري ولا بلوري", "مقاوم للماء تماماً"],
    gridRow: 3,
    gridCol: 16
  },
  {
    number: 17,
    symbol: "Cl",
    name: "الكلور",
    mass: 35.45,
    category: "halogen",
    block: "p",
    period: 3,
    group: 17,
    state: "غاز",
    config: "[Ne] 3s² 3p⁵",
    sudanRelevance: "الغاز الهالوجيني الأخضر المصفر الخانق الموصوف في الباب الخامس. يحضر بأكسدة حمض HCl بـ MnO₂، والكلور الرطب له خاصية قصر مذهلة للألوان العضوية.",
    keyProperties: ["غاز أخضر مصفر سام", "مبيض ومقصر ممتاز للألوان الرطبة", "عامل مؤكسد هالوجيني قوي جداً"],
    gridRow: 3,
    gridCol: 17
  },
  {
    number: 18,
    symbol: "Ar",
    name: "الأرجون",
    mass: 39.948,
    category: "noble",
    block: "p",
    period: 3,
    group: 18,
    state: "غاز",
    config: "[Ne] 3s² 3p⁶",
    sudanRelevance: "الغاز الخامل الذي يختتم الدورة الثالثة باستقرار إلكتروني كامل ومقاومة مطلقة للتفاعل.",
    keyProperties: ["غاز خامل وفير في الغلاف الجوي", "يستخدم لتوفير جو واقٍ في الصناعة", "لا يشكل مركبات كيميائية مستقرة"],
    gridRow: 3,
    gridCol: 18
  },

  // Period 4 Key Elements
  {
    number: 19,
    symbol: "K",
    name: "البوتاسيوم",
    mass: 39.098,
    category: "alkali",
    block: "s",
    period: 4,
    group: 1,
    state: "صلب",
    config: "[Ar] 4s¹",
    sudanRelevance: "من أنشط فلزات الأقلاء على الإطلاق بسبب حجمه الذري الضخم الذي يسهل فقد إلكترون s الخارجي. يتفاعل بفرقعة مذهلة مع الماء بلهب بنفسجي كيميائي خاطف.",
    keyProperties: ["أقلاء شديد التفاعل واللين", "لهب كشف جاف بنفسجي باهت", "أكثر نشاطاً وقوة تفاعل من الصوديوم"],
    gridRow: 4,
    gridCol: 1
  },
  {
    number: 20,
    symbol: "Ca",
    name: "الكالسيوم",
    mass: 40.078,
    category: "alkaline-earth",
    block: "s",
    period: 4,
    group: 2,
    state: "صلب",
    config: "[Ar] 4s²",
    sudanRelevance: "يمثل العنصر الأول والأساسي في ثلاثية دوبرينر الأولى (Ca, Sr, Ba)، يوضح التدرج الرياضي للكتل الذرية كتمهيد تاريخي للجدول الدوري.",
    keyProperties: ["فلز أقلاء ترابي صلب", "يعطي لهباً أحمر طوبي في كشف الجاف", "هام لبناء الهياكل والترسبات الجيرية"],
    gridRow: 4,
    gridCol: 2
  },
  {
    number: 26,
    symbol: "Fe",
    name: "الحديد",
    mass: 55.845,
    category: "transition",
    block: "d",
    period: 4,
    group: 8,
    state: "صلب",
    config: "[Ar] 3d⁶ 4s²",
    sudanRelevance: "النموذج الأبرز للعناصر الانتقالية في الباب السادس. يتميز بخواصه البارامغناطيسية القوية جداً بسبب وجود 4 إلكترونات مفردة في المستوى d، وقابليته للمغنطة السريعة.",
    keyProperties: ["فلز بارامغناطيسي قوي", "تعدد حالات الأكسدة (+2, +3)", "عامل حفاز رئيسي في الصناعة"],
    gridRow: 4,
    gridCol: 8
  },
  {
    number: 29,
    symbol: "Cu",
    name: "النحاس",
    mass: 63.546,
    category: "transition",
    block: "d",
    period: 4,
    group: 11,
    state: "صلب",
    config: "[Ar] 3d¹⁰ 4s¹",
    sudanRelevance: "عنصر انتقالي ذو توزيع إلكتروني شاذ لاستقرار المدار d المكتمل كلياً. أيوناته Cu²⁺ المائية تعطي محاليل زرقاء مميزة جداً تخضع للتفاعلات الطيفية للفئة d.",
    keyProperties: ["توزيع إلكتروني شاذ مستقر", "ناقل ممتاز جداً للكهرباء والحرارة", "أيوناته CuSO₄ زرقاء براقة"],
    gridRow: 4,
    gridCol: 11
  },
  {
    number: 30,
    symbol: "Zn",
    name: "الخارصين",
    mass: 65.38,
    category: "transition",
    block: "d",
    period: 4,
    group: 12,
    state: "صلب",
    config: "[Ar] 3d¹⁰ 4s²",
    sudanRelevance: "فلز انتقالي تكتمل فيه أفلاك d تماماً في الذرة والقطب الأيوني، مما يجعله دايامغناطيسياً (يتنافر مع المغناطيس) ومحاليله عديمة اللون تماماً.",
    keyProperties: ["فلز دايامغناطيسي غير ملون", "مقاوم للصدأ كطلاء جلفنة واقٍ", "يتفاعل بسهولة مطلقاً هيدروجين"],
    gridRow: 4,
    gridCol: 12
  },
  {
    number: 35,
    symbol: "Br",
    name: "البرم",
    mass: 79.904,
    category: "halogen",
    block: "p",
    period: 4,
    group: 17,
    state: "سائل",
    config: "[Ar] 3d¹⁰ 4s² 4p⁵",
    sudanRelevance: "السائل الهالوجيني الأحمر الداكن الطيار. يستعمل ماؤه (ماء البروم الأحمر) ككاشف كيميائي قاطع للتمييز بين الهيدروكربونات المشبعة وغير المشبعة بالباب الثالث.",
    keyProperties: ["السائل اللافلزي الوحيد بالجدول", "ماء البروم يزول لونه مع روابط باي", "رائحة نفاذة ومخرشة جداً"],
    gridRow: 4,
    gridCol: 17
  },

  // Period 5 Key Elements
  {
    number: 38,
    symbol: "Sr",
    name: "الاسترونشيوم",
    mass: 87.62,
    category: "alkaline-earth",
    block: "s",
    period: 5,
    group: 2,
    state: "صلب",
    config: "[Kr] 5s²",
    sudanRelevance: "العنصر الأوسط في ثلاثية دوبرينر الأولى (Ca, Sr, Ba)، كتلته الفعلية (87.6) تماثل تماماً المتوسط الحسابي للأطراف، مما أثبت قانون الثلاثيات كيميائياً.",
    keyProperties: ["فلز ترابي أصفر باهت", "كشف اللهب: أحمر قرمزي ناصع", "يتفاعل ببطء مع الماء البارد"],
    gridRow: 5,
    gridCol: 2
  },
  {
    number: 53,
    symbol: "I",
    name: "اليود",
    mass: 126.904,
    category: "halogen",
    block: "p",
    period: 5,
    group: 17,
    state: "صلب",
    config: "[Kr] 4d¹⁰ 5s² 5p⁵",
    sudanRelevance: "الهالوجين الصلب الداكن البنفسجي. يتسامى بالحرارة مباشرة لأبخرة بنفسجية، ويعتبر أقل الهالوجينات الأربعة نشاطاً وقدرة أكسدية طبقاً للتدرج الدوري بالباب الخامس.",
    keyProperties: ["صلب لافلكي يتسامى بسهولة", "يكشف عن النشا بلون أزرق داكن", "أبخرة بنفسجية سامة مميزة"],
    gridRow: 5,
    gridCol: 17
  },

  // Period 6 Key Elements
  {
    number: 56,
    symbol: "Ba",
    name: "الباريوم",
    mass: 137.327,
    category: "alkaline-earth",
    block: "s",
    period: 6,
    group: 2,
    state: "صلب",
    config: "[Xe] 6s²",
    sudanRelevance: "العنصر الثالث في ثلاثية دوبرينر ومصدر كاشف BaCl₂ الذي يعطي مع أنيونات الكبريتات راسباً أبيضاً كثيفاً لا يذوب في الأحماض نهائياً للكشف عن جودة الأسمدة.",
    keyProperties: ["فلز ترابي ثقيل ونشط", "كشف اللهب: أخضر تفاحي", "راسب كبريتات الباريوم غير قابل للذوبان"],
    gridRow: 6,
    gridCol: 2
  },
  {
    number: 63,
    symbol: "Eu",
    name: "اليوروبيوم",
    mass: 151.964,
    category: "lanthanide",
    block: "f",
    period: 6,
    group: 8, // Placed dynamically in representative column
    state: "صلب",
    config: "[Xe] 4f⁷ 6s²",
    sudanRelevance: "عنصر لانثانيدي مميز للفئة f، يمتلك غلافاً فرعياً f نصف ممتلئ (f7) مما يمنحه استقراراً مغناطيسياً متقدماً وممتازاً للفحص الفيزيائي بالمعمل.",
    keyProperties: ["عنصر أرضي نادر لدن", "بارامغناطيسية ممتازة", "تفاعل نشط مع الأحماض المخففة"],
    gridRow: 8,
    gridCol: 8
  },
  {
    number: 79,
    symbol: "Au",
    name: "الذهب",
    mass: 196.967,
    category: "transition",
    block: "d",
    period: 6,
    group: 11,
    state: "صلب",
    config: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
    sudanRelevance: "الفلز الانتقالي النبيل الخامل جداً والمقاوم لأشد الأحماض بمفردها، ولكنه يذوب في ثوانٍ معدودة وبشكل كامل عند تفاعله مع الماء الملكي الساخن (الباب السادس).",
    keyProperties: ["أصفر ذهبي براق غير قابل للتأكسد", "نبيل وخامل كيميائياً تماماً", "يذوب فقط في الماء الملكي (HCl + HNO₃)"],
    gridRow: 6,
    gridCol: 11
  }
];

export const PeriodicTableTool: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(elementsDb[10]); // Default to Sodium (Na)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBlock, setFilterBlock] = useState<"all" | "s" | "p" | "d" | "f">("all");

  const filteredElements = elementsDb.filter((el) => {
    const matchesSearch = 
      el.name.includes(searchTerm) || 
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      el.number.toString() === searchTerm;
    const matchesBlock = filterBlock === "all" || el.block === filterBlock;
    return matchesSearch && matchesBlock;
  });

  const getCategoryColor = (cat: ElementData["category"]) => {
    switch (cat) {
      case "alkali": return "bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300";
      case "alkaline-earth": return "bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-300";
      case "transition": return "bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300";
      case "lanthanide": return "bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300";
      case "metalloid": return "bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300";
      case "nonmetal": return "bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300";
      case "halogen": return "bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300";
      case "noble": return "bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300";
      default: return "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200";
    }
  };

  const getCategoryLabel = (cat: ElementData["category"]) => {
    switch (cat) {
      case "alkali": return "فلزات الأقلاء (المجموعة 1)";
      case "alkaline-earth": return "الأقلاء الترابية (المجموعة 2)";
      case "transition": return "العناصر الانتقالية الرئيسية (الفئة d)";
      case "lanthanide": return "اللانثانيدات (الفئة f)";
      case "metalloid": return "أشباه الفلزات";
      case "nonmetal": return "اللافلزات";
      case "halogen": return "الهالوجينات (المجموعة 17)";
      case "noble": return "الغازات الخاملة (المجموعة 18)";
      default: return "عنصر دوري";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-[#E5E2DE] dark:border-slate-800 rounded-lg p-5 space-y-6 shadow-sm text-right" id="periodic_table_wrapper">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E5E2DE] dark:border-slate-800 pb-3 gap-4">
        <div className="order-2 md:order-1">
          <h3 className="text-lg font-serif font-bold text-[#2C3E50] dark:text-slate-100 flex items-center gap-1.5 justify-end">
            الجدول الدوري التفاعلي المساعد للثاني الثانوي
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            انقر على أي عنصر لعرض خصائصه الفيزيائية والتوزيع الإلكتروني ودوره التعليمي الكامل في المنهج السوداني.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#2C3E50]/5 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-[#2C3E50]/10 dark:border-slate-700 order-1 md:order-2 w-full md:w-auto">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-[#2C3E50] dark:text-slate-200 font-sans">مرجع الطالب المخبري المعتمد</span>
        </div>
      </div>

      {/* Control Panel: Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between bg-[#F9F8F6] dark:bg-slate-800/80 p-3 rounded-lg border border-[#E5E2DE] dark:border-slate-800">
        <div className="flex flex-wrap gap-1.5 justify-end order-2 sm:order-1">
          {(["all", "s", "p", "d", "f"] as const).map((block) => (
            <button
              key={block}
              onClick={() => setFilterBlock(block)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                filterBlock === block
                  ? "bg-[#2C3E50] dark:bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-[#E5E2DE] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {block === "all" ? "كل الفئات" : `الفئة ${block.toUpperCase()}`}
            </button>
          ))}
        </div>

        <div className="relative order-1 sm:order-2 flex-1 max-w-xs">
          <input
            type="text"
            placeholder="ابحث بالاسم، الرمز أو العدد الذري..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-right pr-3 pl-8 py-2 border border-[#E5E2DE] dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-[#2C3E50] dark:text-slate-100"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Element Detailed Properties Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#FDFCFB] to-[#F9F8F6] dark:from-slate-900 dark:to-slate-800/90 border border-[#E5E2DE] dark:border-slate-800 rounded-xl p-5 shadow-inner space-y-4 min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {selectedElement ? (
              <motion.div
                key={selectedElement.number}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Element Badge Big View */}
                <div className="flex items-center justify-between border-b border-[#E5E2DE] dark:border-slate-800 pb-3">
                  <div className="text-left font-mono">
                    <span className="block text-2xl font-bold text-[#2C3E50] dark:text-slate-100">{selectedElement.symbol}</span>
                    <span className="block text-[10px] text-slate-400">Z = {selectedElement.number}</span>
                  </div>
                  <div className="text-right">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedElement.name}</h4>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold mt-1 ${getCategoryColor(selectedElement.category)}`}>
                      {getCategoryLabel(selectedElement.category)}
                    </span>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-3 text-right">
                  <div className="bg-white/80 p-2 rounded border border-[#E5E2DE] text-xs">
                    <span className="block text-[10px] text-slate-400 font-sans">الكتلة الذرية:</span>
                    <span className="font-mono font-bold text-slate-700">{selectedElement.mass.toFixed(3)} g/mol</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-[#E5E2DE] text-xs">
                    <span className="block text-[10px] text-slate-400 font-sans">التوزيع الإلكتروني:</span>
                    <span className="font-mono font-bold text-indigo-700" dir="ltr">{selectedElement.config}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-[#E5E2DE] text-xs">
                    <span className="block text-[10px] text-slate-400 font-sans">الفئة والمجموعة:</span>
                    <span className="font-bold text-slate-700">الفئة {selectedElement.block.toUpperCase()} / م{selectedElement.group}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-[#E5E2DE] text-xs">
                    <span className="block text-[10px] text-slate-400 font-sans">الحالة العادية:</span>
                    <span className="font-bold text-emerald-700">🟢 {selectedElement.state}</span>
                  </div>
                </div>

                {/* Sudanese Curriculum Significance (Arabic) */}
                <div className="bg-indigo-50/50 p-3.5 rounded-lg border border-indigo-100/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-800 flex items-center gap-1 justify-end">
                    العلاقة بالمنهج وتجارب الثاني الثانوي
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed text-right">
                    {selectedElement.sudanRelevance}
                  </p>
                </div>

                {/* Key Properties bullet points */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 block">الصفات الكيميائية الأبرز:</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {selectedElement.keyProperties.map((prop, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded border border-[#E5E2DE] text-[10px] text-slate-600 font-medium">
                        ✦ {prop}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 gap-2">
                <Info className="w-10 h-10 text-slate-300" />
                <span className="text-xs font-bold">حدد عنصراً دورياً من اللوحة لاستكشاف خواصه كلياً</span>
              </div>
            )}
          </AnimatePresence>

          <div className="border-t border-[#E5E2DE] pt-3 mt-4 text-[10px] text-slate-400 text-center font-sans">
            منهج كيمياء السودان • معمل مدرسة الثاني الثانوي الرقمي
          </div>
        </div>

        {/* Right Side: Interactive Table Grid Representation */}
        <div className="lg:col-span-8 overflow-x-auto bg-slate-50/50 p-4 rounded-xl border border-[#E5E2DE]">
          <div 
            className="grid gap-1.5 min-w-[640px]"
            style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
          >
            {/* Row 1 to Row 8 coordinates rendering */}
            {Array.from({ length: 8 }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              
              // We'll map the grid columns from 1 to 18
              return Array.from({ length: 18 }).map((_, cIdx) => {
                const colNum = cIdx + 1;
                
                // Find element at this position
                const el = filteredElements.find(
                  (e) => e.gridRow === rowNum && e.gridCol === colNum
                );

                // Is it our selected element?
                const isSelected = selectedElement && selectedElement.number === el?.number;

                // Render blank cells if no elements, unless it's a specific visual area
                if (!el) {
                  // Custom labels or spacer indicators
                  if (rowNum === 1 && colNum === 2) {
                    return (
                      <div key={`spacer-${rowNum}-${colNum}`} className="col-span-16 flex items-center justify-center text-[10px] font-bold text-slate-300 pointer-events-none font-sans">
                        عناصر المجموعات والـ s, p, d, f blocks
                      </div>
                    );
                  }
                  
                  // Skip column rendered inside col-span
                  if (rowNum === 1 && colNum > 2 && colNum < 18) {
                    return null;
                  }
                  
                  return <div key={`empty-${rowNum}-${colNum}`} className="aspect-square" />;
                }

                return (
                  <motion.button
                    key={el.number}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedElement(el)}
                    className={`aspect-square rounded border flex flex-col justify-between p-1 text-center transition-all cursor-pointer relative shadow-xs ${
                      isSelected 
                        ? "ring-2 ring-indigo-600 scale-105 border-indigo-600 bg-indigo-50 z-10" 
                        : getCategoryColor(el.category)
                    }`}
                  >
                    {/* Atomic Number top left */}
                    <span className="text-[8px] font-mono font-bold text-slate-400 absolute top-0.5 left-1">
                      {el.number}
                    </span>
                    
                    {/* Block badge */}
                    <span className="text-[7px] font-bold text-slate-400 absolute bottom-0.5 left-1 uppercase font-sans">
                      {el.block}
                    </span>

                    {/* Symbol Center Big */}
                    <span className="text-xs font-extrabold text-[#2C3E50] mt-1.5 block">
                      {el.symbol}
                    </span>

                    {/* Arabic Name bottom */}
                    <span className="text-[7px] font-sans font-bold text-slate-600 block leading-none pb-0.5 truncate w-full">
                      {el.name}
                    </span>
                  </motion.button>
                );
              });
            })}
          </div>

          {/* Color Guides / Legends */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-end mt-4 border-t border-[#E5E2DE]/50 pt-3 text-[10px]">
            <span className="font-bold text-slate-500">دليل الفئات والمجموعات:</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-red-100 border border-red-300 rounded" />
              <span className="text-slate-600 text-[9px]">أقلاء</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-orange-100 border border-orange-300 rounded" />
              <span className="text-slate-600 text-[9px]">أقلاء ترابية</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-indigo-100 border border-indigo-300 rounded" />
              <span className="text-slate-600 text-[9px]">عناصر انتقالية (d)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-purple-100 border border-purple-300 rounded" />
              <span className="text-slate-600 text-[9px]">لانثانيدات (f)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-amber-100 border border-amber-300 rounded" />
              <span className="text-slate-600 text-[9px]">أشباه فلزات</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-emerald-100 border border-emerald-300 rounded" />
              <span className="text-slate-600 text-[9px]">لا فلزات</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-sky-100 border border-sky-300 rounded" />
              <span className="text-slate-600 text-[9px]">هالوجينات</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-teal-100 border border-teal-300 rounded" />
              <span className="text-slate-600 text-[9px]">غازات خاملة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
