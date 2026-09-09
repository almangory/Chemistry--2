import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { curriculumData } from "../data/curriculum";
import { 
  FileText, 
  Printer, 
  Lock, 
  Unlock, 
  CheckCircle, 
  RefreshCw, 
  Sparkles, 
  Heart, 
  ChevronDown, 
  Eye, 
  AlertCircle,
  HelpCircle,
  Info
} from "lucide-react";

interface WorksheetGeneratorProps {
  favoriteLessons: string[];
  toggleLessonFavorite: (id: string) => void;
}

// Pre-defined chemistry questions database matching Sudanese Curriculum
interface BaseQuestion {
  id: string;
  unitId: string;
  lessonId: string;
  type: "true_false" | "fill_blank" | "match" | "diagram";
}

interface TrueFalseQuestion extends BaseQuestion {
  type: "true_false";
  text: string;
  correctAnswer: boolean;
  explanation: string;
}

interface FillBlankQuestion extends BaseQuestion {
  type: "fill_blank";
  text: string; // e.g. "يعتبر غاز ________ هو المكون الرئيسي للغاز الطبيعي."
  correctAnswer: string; // e.g. "الميثان"
  explanation: string;
}

interface MatchPair {
  left: string;
  right: string;
}

interface MatchQuestion extends BaseQuestion {
  type: "match";
  title: string;
  pairs: MatchPair[]; // list of matching items
  explanation: string;
}

interface DiagramLabel {
  id: number;
  label: string;
  x: number;
  y: number;
  hint: string;
}

interface DiagramQuestion extends BaseQuestion {
  type: "diagram";
  title: string;
  svgType: "downs_cell" | "nitrogen_prep" | "methane_prep";
  labels: DiagramLabel[];
  explanation: string;
}

type Question = TrueFalseQuestion | FillBlankQuestion | MatchQuestion | DiagramQuestion;

// Rich Question Database covering all units of Sudanese Chemistry 2nd Secondary
const QUESTIONS_DB: Question[] = [
  // Unit 1: الترتيب الدوري للعناصر
  {
    id: "q_u1_tf1",
    unitId: "1",
    lessonId: "u1_l1",
    type: "true_false",
    text: "صاغ العالم الألماني دوبرينر قانون الثمانيات لترتيب العناصر الكيميائية.",
    correctAnswer: false,
    explanation: "نيولاندز هو من صاغ قانون الثمانيات، بينما دوبرينر رتب العناصر في ثلاثيات.",
  },
  {
    id: "q_u1_tf2",
    unitId: "1",
    lessonId: "u1_l3",
    type: "true_false",
    text: "يقل الحجم الذري عبر الدورة الأفقية من اليسار إلى اليمين بزيادة العدد الذري.",
    correctAnswer: true,
    explanation: "عبر الدورة يقل الحجم الذري لزيادة الشحنة النووية الفعالة وقوة جذب النواة للإلكترونات الخارجية.",
  },
  {
    id: "q_u1_tf3",
    unitId: "1",
    lessonId: "u1_l3",
    type: "true_false",
    text: "يعتبر عنصر الفلور هو أعلى عناصر الجدول الدوري كاطراد في الكهروسالبية.",
    correctAnswer: true,
    explanation: "الفلور يقع في أعلى يمين الجدول وله كهروسالبية تبلغ 4.0 على مقياس باولنج وهو الأكبر على الإطلاق.",
  },
  {
    id: "q_u1_fb1",
    unitId: "1",
    lessonId: "u1_l1",
    type: "fill_blank",
    text: "أثبت العالم الإنجليزي ________ أن ترتيب العناصر يعتمد على أرقامها الذرية وليس كتلها الذرية.",
    correctAnswer: "موزلي",
    explanation: "العالم هنري موزلي أثبت ذلك باستخدام الأشعة السينية المنبعثة من العناصر.",
  },
  {
    id: "q_u1_fb2",
    unitId: "1",
    lessonId: "u1_l2",
    type: "fill_blank",
    text: "يضم الجدول الدوري الحديث ________ دورات أفقية و 18 مجموعة رأسية.",
    correctAnswer: "سبع",
    explanation: "يتكون الجدول الدوري الحديث من 7 دورات أفقية و18 مجموعة رأسية.",
  },
  {
    id: "q_u1_fb3",
    unitId: "1",
    lessonId: "u1_l3",
    type: "fill_blank",
    text: "يُعرف الأيون ________ بأنه دائماً أصغر حجماً من ذرته الأصلية لزيادة الجذب الفعال.",
    correctAnswer: "الموجب",
    explanation: "الأيون الموجب يفقد إلكترونات مما يزيد جذب النواة للمتبقي ويقلل الحجم الذري.",
  },
  {
    id: "q_u1_match1",
    unitId: "1",
    lessonId: "u1_l2",
    type: "match",
    title: "صل المجموعات والكتل الإلكترونية بنظام تدرج خواصها:",
    pairs: [
      { left: "عناصر الفئة s", right: "تقع يسار الجدول وتضم فلزات الأقلاء والأقلاء الأرضية" },
      { left: "جهد التأين", right: "الطاقة اللازمة لانتزاع إلكترون من الذرة المفردة الغازية" },
      { left: "عناصر الفئة d", right: "تسمى بالعناصر الانتقالية الرئيسية وتقع في منتصف الجدول" },
      { left: "الكهروسالبية", right: "قدرة الذرة على جذب إلكترونات الرابطة التساهمية نحوها" }
    ],
    explanation: "مطابقة صحيحة للتعاريف الأساسية لخواص الفئات s وd في الجدول الدوري."
  },

  // Unit 2: فلزات المجموعة الأولى
  {
    id: "q_u2_tf1",
    unitId: "2",
    lessonId: "u2_l1",
    type: "true_false",
    text: "تتفاعل فلزات الأقلاء مع الماء وينطلق غاز النيتروجين المصحوب بفرقعة شديدة.",
    correctAnswer: false,
    explanation: "التفاعل يطلق غاز الهيدروجين النشط كيميائياً، وليس النيتروجين.",
  },
  {
    id: "q_u2_tf2",
    unitId: "2",
    lessonId: "u2_l2",
    type: "true_false",
    text: "يستخلص فلز الصوديوم صناعياً بالتحليل الكهربائي لمصهور كلوريد الصوديوم في خلية داونز.",
    correctAnswer: true,
    explanation: "يستخدم مصهور NaCl مع CaCl2 لخفض درجة الانصهار واستخلاص الصوديوم النقي.",
  },
  {
    id: "q_u2_fb1",
    unitId: "2",
    lessonId: "u2_l1",
    type: "fill_blank",
    text: "تحفظ فلزات الأقلاء مغمورة تحت سوائل هيدروكربونية خاملة مثل ________ لشدة تفاعلها مع رطوبة الجو.",
    correctAnswer: "الكيروسين",
    explanation: "يحفظ الصوديوم والبوتاسيوم تحت الكيروسين (الجاز) أو البنزين لعزلها تماماً عن رطوبة وأكسجين الهواء.",
  },
  {
    id: "q_u2_fb2",
    unitId: "2",
    lessonId: "u2_l3",
    type: "fill_blank",
    text: "الصيغة الكيميائية للمركب المعروف تجارياً باسم الصودا الكاوية هي ________.",
    correctAnswer: "NaOH",
    explanation: "هيدروكسيد الصوديوم NaOH هو الاسم العلمي للمركب المعروف تجارياً بالصودا الكاوية.",
  },
  {
    id: "q_u2_match1",
    unitId: "2",
    lessonId: "u2_l1",
    type: "match",
    title: "صل المركب الكيميائي بالاسم الشائع المستعمل كيميائياً في السودان:",
    pairs: [
      { left: "NaHCO3", right: "بيكربونات الصوديوم (مسحوق الخبيز)" },
      { left: "Na2CO3.10H2O", right: "صودا الغسيل المستخدمة في تيسير الماء العسر" },
      { left: "NaOH", right: "الصودا الكاوية التي تدخل في صناعة الصابون والورق" },
      { left: "Na2CO3", right: "رماد الصودا اللامائي" }
    ],
    explanation: "الأسماء الشائعة لمركبات الصوديوم الأكثر انتشاراً بالمنهج الدراسي."
  },

  // Unit 3: الكيمياء العضوية
  {
    id: "q_u3_tf1",
    unitId: "3",
    lessonId: "u3_l1",
    type: "true_false",
    text: "حطم العالم ووهلر نظرية القوة الحيوية بتحضير اليوريا كأول مركب عضوي في المختبر عام 1828م.",
    correctAnswer: true,
    explanation: "حضر العالم فريدريك ووهلر اليوريا بتسخين سيانات الأمونيوم غير العضوية في المختبر.",
  },
  {
    id: "q_u3_fb_l1",
    unitId: "3",
    lessonId: "u3_l1",
    type: "fill_blank",
    text: "أول مركب عضوي تم تخليقه في المختبر من مواد غير عضوية هو ________.",
    correctAnswer: "اليوريا",
    explanation: "اليوريا (البولينة) حضرها ووهلر بتسخين محلول مائي لسيانات الأمونيوم.",
  },
  {
    id: "q_u3_tf_l2",
    unitId: "3",
    lessonId: "u3_l2",
    type: "true_false",
    text: "في تسمية الألكانات حسب نظام IUPAC يبدأ ترقيم السلسلة الكربونية الأطول من الطرف الأقرب لأول تفرع.",
    correctAnswer: true,
    explanation: "قواعد IUPAC تنص على ترقيم أطول سلسلة من الطرف الذي يعطي مجموع أرقام التفرعات أصغر قيمة ممكنة.",
  },
  {
    id: "q_u3_fb1",
    unitId: "3",
    lessonId: "u3_l2",
    type: "fill_blank",
    text: "تسمى الصيغة التي توضح نوع وعدد الذرات وطريقة ارتباطها ببعضها في الجزيء بالصيغة ________.",
    correctAnswer: "البنائية",
    explanation: "الصيغة البنائية تفصل كيفية ترابط الذرات بينما الصيغة الجزيئية تعطي فقط العدد الكلي والنوع.",
  },
  {
    id: "q_u3_match_l2",
    unitId: "3",
    lessonId: "u3_l2",
    type: "match",
    title: "صل الصيغة البنائية للمركب الهيدروكربوني باسمه المنهجي المعتمد (IUPAC):",
    pairs: [
      { left: "CH3-CH(CH3)-CH3", right: "2-ميثيل بروبان (أيزوبيوتان)" },
      { left: "CH3-CH2-CH(CH3)-CH3", right: "2-ميثيل بيوتان (أيزوبنتان)" },
      { left: "CH3-C(CH3)2-CH3", right: "2,2-ثنائي ميثيل بروبان (نيوبنتان)" },
      { left: "CH3-CH(CH3)-CH(CH3)-CH3", right: "2,3-ثنائي ميثيل بيوتان" }
    ],
    explanation: "تطبيقات تسمية السلاسل المتفرعة بنظام IUPAC حسب مقرر الثاني ثانوي."
  },
  {
    id: "q_u3_tf_l3",
    unitId: "3",
    lessonId: "u3_l3",
    type: "true_false",
    text: "تسمى المركبات الهيدروكربونية التي تتساوى في عدد ذرات الكربون وتختلف في نوع الروابط بالمركبات المتقابلة مثل الإيثان والإيثين.",
    correctAnswer: true,
    explanation: "المركبات المتقابلة تتساوى في عدد ذرات الكربون وتختلف في الإشباع كالإيثان C2H6 والإيثين C2H4 والإيثاين C2H2.",
  },
  {
    id: "q_u3_fb_l3",
    unitId: "3",
    lessonId: "u3_l3",
    type: "fill_blank",
    text: "الهيدروكربونات التي ترتبط فيها جميع ذرات الكربون بروابط تساهمية أحادية تسمى هيدروكربونات ________.",
    correctAnswer: "مشبعة",
    explanation: "الألكانات هيدروكربونات مشبعة لأن جميع روابطها تساهمية أحادية من النوع سيجما القوي.",
  },
  {
    id: "q_u3_tf_l4",
    unitId: "3",
    lessonId: "u3_l4",
    type: "true_false",
    text: "يجمع غاز الميثان في المختبر بإزاحة الماء لأسفل لأنه شحيح الذوبان في الماء وأخف من الهواء.",
    correctAnswer: true,
    explanation: "الميثان غاز غير قطبي شحيح الذوبان في الماء ويجمع بإزاحة الماء لأسفل.",
  },
  {
    id: "q_u3_fb2",
    unitId: "3",
    lessonId: "u3_l4",
    type: "fill_blank",
    text: "يحضر غاز الميثان في المختبر بالتقطير الجاف لملح خلات الصوديوم اللامائية مع ________.",
    correctAnswer: "الجير الصودي",
    explanation: "خلات الصوديوم اللامائية تسخن مع الجير الصودي (NaOH + CaO) لخفض درجة الانصهار وحماية الزجاج.",
  },
  {
    id: "q_u3_match1",
    unitId: "3",
    lessonId: "u3_l4",
    type: "match",
    title: "صل الصيغة البنائية للمركبات العضوية الهيدروكربونية باسمها ومواصفاتها:",
    pairs: [
      { left: "CH4", right: "ميثان (أبسط الهيدروكربونات المشبعة ويحترق بلهب أزرق نظيف)" },
      { left: "C2H4", right: "إيثين (يحتوي على رابطة تساهمية ثنائية ويزيل لون ماء البروم)" },
      { left: "C2H2", right: "إيثاين (غاز الأسيتيلين المستخدم في لحام المعادن عند 3000°C)" },
      { left: "C6H6", right: "البنزين العطري (مركب أروماتي حلقي ذو ثبات رنيني استثنائي)" }
    ],
    explanation: "المركبات الهيدروكربونية الأساسية بالمنهج العضوي وصيغها الشائعة والمنهجية."
  },
  {
    id: "q_u3_tf2",
    unitId: "3",
    lessonId: "u3_l5",
    type: "true_false",
    text: "يزول اللون الأحمر لماء البروم فوراً عند إمراره في غاز الإيثين بسبب تفاعل الإضافة على الرابطة الثنائية.",
    correctAnswer: true,
    explanation: "الإيثين هيدروكربون غير مشبع يكسر رابطة باي الضعيفة ويضم ذرتي البروم مكوناً 1,2-ثنائي برومو إيثان عديم اللون.",
  },
  {
    id: "q_u3_fb_l5",
    unitId: "3",
    lessonId: "u3_l5",
    type: "fill_blank",
    text: "الصيغة الجزيئية العامة لسلسلة الألكينات (الأوليفينات) غير المشبعة هي ________.",
    correctAnswer: "CnH2n",
    explanation: "الألكينات ذات الرابطة الثنائية تنقص ذرتي هيدروجين عن الألكانات وصيغتها العامة CnH2n.",
  },
  {
    id: "q_u3_tf_l6",
    unitId: "3",
    lessonId: "u3_l6",
    type: "true_false",
    text: "يستخدم لهب الأكسي-أسيتلين الناتج من احتراق غاز الإيثاين في قطع ولحام المعادن لأن حرارته تصل إلى 3000°C.",
    correctAnswer: true,
    explanation: "الاحتراق التام لغاز الإيثاين في وفرة من الأكسجين النقي ينتج لهب الأكسي-أسيتلين البالغ الحرارة.",
  },
  {
    id: "q_u3_fb_l6",
    unitId: "3",
    lessonId: "u3_l6",
    type: "fill_blank",
    text: "يحضر غاز الإيثاين في المختبر بتنقيط الماء على مادة صلبة تسمى ________.",
    correctAnswer: "كاربيد الكالسيوم",
    explanation: "بتنقيط الماء على كاربيد الكالسيوم CaC2 يتصاعد الإيثاين C2H2 وهيدروكسيد الكالسيوم.",
  },
  {
    id: "q_u3_tf_l7",
    unitId: "3",
    lessonId: "u3_l7",
    type: "true_false",
    text: "يمتاز جزيء البنزين العطري C6H6 بثبات كيميائي فائق ومقاومة للأكسدة لظاهرة الرنين وحركية إلكترونات باي.",
    correctAnswer: true,
    explanation: "الرنين يمنح حلقة البنزين استقراراً ديناميكياً يحميها من التفاعلات التقليدية لعدم التشبع.",
  },
  {
    id: "q_u3_fb_l7",
    unitId: "3",
    lessonId: "u3_l7",
    type: "fill_blank",
    text: "الزاوية بين روابط الكربون في البروبان الحلقي تبلغ ________ درجات، مما يسبب شد الرابطة والنشاط الشديد.",
    correctAnswer: "60",
    explanation: "الزاوية 60° تنحرف كثيراً عن الزاوية الرباعية الطبيعية 109.5° مما يسبب توتراً كبيراً بالحلقة.",
  },
  {
    id: "q_u3_tf_l8",
    unitId: "3",
    lessonId: "u3_l8",
    type: "true_false",
    text: "يمتلك ألكان البنتان C5H12 ثلاثة متماكبات سلسلية تشترك في الصيغة الجزيئية وتختلف في الهيكل البنائي.",
    correctAnswer: true,
    explanation: "متماكبات البنتان هي: بنتان عادي، 2-ميثيل بيوتان، و2,2-ثنائي ميثيل بروبان.",
  },
  {
    id: "q_u3_fb_l8",
    unitId: "3",
    lessonId: "u3_l8",
    type: "fill_blank",
    text: "الظاهرة التي يتفق فيها مركبان في الصيغة الجزيئية ويختلفان في الصيغة البنائية تسمى ظاهرة ________.",
    correctAnswer: "التماكب",
    explanation: "التماكب (التشكل أو الأيزوميرية) ظاهرة تميز المركبات الكربونية العضوية.",
  },
  {
    id: "q_u3_match_l8",
    unitId: "3",
    lessonId: "u3_l8",
    type: "match",
    title: "صل المركب بسلوكه المخبري مع ماء البروم الأحمر في التمييز العملي لمتماكبات C3H6:",
    pairs: [
      { left: "البروبين C3H6", right: "يزيل لون ماء البروم الأحمر فوراً (ألكين غير مشبع ذو رابطة ثنائية)" },
      { left: "البروبان الحلقي C3H6", right: "لا يزيل لون ماء البروم في الظلام (ألكان حلقي مشبع)" },
      { left: "البنتان العادي C5H12", right: "ألكان مفتوح السلسلة خامل في غياب الضوء" },
      { left: "الإيثاين C2H2", right: "يزيل لون ماء البروم على مرحلتين لرابطته الثلاثية" }
    ],
    explanation: "التمييز العملي لمتماكبات C3H6 بتفاعل ماء البروم الوارد بصفحة 68 من كتاب الوزارة."
  },

  // Unit 4: مجموعة النيتروجين
  {
    id: "q_u4_tf1",
    unitId: "4",
    lessonId: "u4_l2",
    type: "true_false",
    text: "يحضر غاز النيتروجين في المختبر بتسخين خليط من كلوريد الأمونيوم ونيتريت الصوديوم.",
    correctAnswer: true,
    explanation: "التفاعل ينتج نيتريت الأمونيوم الذي يتفكك بالحرارة معطياً غاز النيتروجين النقي والماء.",
  },
  {
    id: "q_u4_tf2",
    unitId: "4",
    lessonId: "u4_l3",
    type: "true_false",
    text: "غاز النشادر (الأمونيا) هو غاز شحيح الذوبان في الماء وله تأثير حمضي على ورقة عباد الشمس.",
    correctAnswer: false,
    explanation: "الأمونيا غاز شره جداً للذوبان في الماء وله تأثير قاعدي يزرق ورقة عباد الشمس الحمراء.",
  },
  {
    id: "q_u4_fb1",
    unitId: "4",
    lessonId: "u4_l1",
    type: "fill_blank",
    text: "تسمى ظاهرة وجود العنصر في عدة صور تختلف في الخواص الفيزيائية وتتفق في الخواص الكيميائية بـ ________.",
    correctAnswer: "التآصل",
    explanation: "التآصل (Allotropy) مثل الفوسفور الأبيض والأحمر، أو الكربون (الماس والجرافيت).",
  },
  {
    id: "q_u4_match1",
    unitId: "4",
    lessonId: "u4_l4",
    type: "match",
    title: "صل السماد النيتروجيني بنسبة النيتروجين المتواجدة به ومواصفاته:",
    pairs: [
      { left: "اليوريا", right: "يحتوي على 46% نيتروجين وهو السماد الأكثر تركيزاً وشهرة بالسودان" },
      { left: "نترات الأمونيوم", right: "يحتوي على حوالي 35% نيتروجين وسريع الذوبان في التربة" },
      { left: "كيميائيات NPK", right: "سماد مركب يحتوي على النيتروجين والفوسفور والبوتاسيوم معاً" },
      { left: "كبريتات الأمونيوم", right: "يزيد من حموضة التربة بالإضافة لتوفير النيتروجين والكبريت" }
    ],
    explanation: "التركيزات والخصائص للأسمدة الزراعية المقررة بالمنهج."
  },

  // Unit 5: الهالوجينات
  {
    id: "q_u5_tf1",
    unitId: "5",
    lessonId: "u5_l1",
    type: "true_false",
    text: "يعتبر الفلور هو أعلى عناصر الهالوجينات نشاطاً وأقواها كعامل مؤكسد لصغر حجمه وارتفاع كهروسالبيته.",
    correctAnswer: true,
    explanation: "الفلور يقع في قمة المجموعة السابعة عشر وله أعلى قدرة على اكتساب الإلكترونات.",
  },
  {
    id: "q_u5_fb1",
    unitId: "5",
    lessonId: "u5_l1",
    type: "fill_blank",
    text: "الهالوجين الوحيد الذي يوجد في الحالة السائلة في درجة حرارة الغرفة العادية هو ________.",
    correctAnswer: "البروم",
    explanation: "البروم سائل أحمر متطاير، بينما الفلور والكلور غازات، واليود مادة صلبة.",
  },
  {
    id: "q_u5_tf2",
    unitId: "5",
    lessonId: "u5_l2",
    type: "true_false",
    text: "يحضر غاز الكلور في المختبر بأكسدة حمض الهيدروكلوريك المركز بواسطة ثاني أكسيد المنجنيز بالتسخين.",
    correctAnswer: true,
    explanation: "المعادلة: MnO2 + 4HCl -> MnCl2 + 2H2O + Cl2↑ ويجمع بإزاحة الهواء لأعلى.",
  },
  {
    id: "q_u5_fb2",
    unitId: "5",
    lessonId: "u5_l2",
    type: "fill_blank",
    text: "يجمع غاز الكلور في المختبر بإزاحة الهواء ________ لأنه أثقل من الهواء الجوي بحوالي مرتين ونصف.",
    correctAnswer: "للأعلى",
    explanation: "كثافة غاز الكلور أعلى من الهواء لذا يزيح الهواء إلى أعلى ويستقر بالأسفل.",
  },
  {
    id: "q_u5_tf3",
    unitId: "5",
    lessonId: "u5_l3",
    type: "true_false",
    text: "غاز الكلور الجاف تماماً لا يقصر ألوان الأقمشة المصبوغة ويشترط وجود الماء لتوليد حمض الهيبوكلوروز.",
    correctAnswer: true,
    explanation: "حمض الهيبوكلوروز HClO الناتج من ذوبان الكلور في الماء يتفكك معطياً الأكسجين الذري الوليد الذي يقصر الألوان.",
  },
  {
    id: "q_u5_match1",
    unitId: "5",
    lessonId: "u5_l3",
    type: "match",
    title: "صل مركب الكلور بالاستخدام الصناعي أو الطبي الشائع في السودان:",
    pairs: [
      { left: "مسحوق قصر الألوان", right: "هيبوكلوريت الكالسيوم المستخدم في تبييض المنسوجات والتعقيم" },
      { left: "ماء جافيل", right: "محلول هيبوكلوريت الصوديوم المستعمل كمنظف ومطهر منزلي" },
      { left: "حمض الهيبوكلوروز", right: "حمض غير ثابت يتفكك مطلقاً الأكسجين الذري الفعال في القصر" },
      { left: "غاز الفوسجين", right: "غاز سام خانق ينتج من اتحاد الكلور مع أول أكسيد الكربون" }
    ],
    explanation: "مشتقات الكلور واستخداماتها التطبيقية في التعقيم والصناعة."
  },

  // Unit 6: العناصر الانتقالية
  {
    id: "q_u6_tf1",
    unitId: "6",
    lessonId: "u6_l1",
    type: "true_false",
    text: "تتميز العناصر الانتقالية بتعدد حالات تأكسدها لتقارب طاقتي المستويين الفرعيين 4s و 3d.",
    correctAnswer: true,
    explanation: "تفقد العناصر الانتقالية إلكترونات 4s أولاً ثم تتابع فقد إلكترونات 3d المتقاربة في الطاقة.",
  },
  {
    id: "q_u6_fb1",
    unitId: "6",
    lessonId: "u6_l1",
    type: "fill_blank",
    text: "المادة التي تنجذب نحو المجال المغناطيسي الخارجي لوجود إلكترونات مفردة في المستوى الفرعي d تسمى مادة ________.",
    correctAnswer: "بارامغناطيسية",
    explanation: "الإلكترونات المفردة غير المزدوجة تولد عزوماً مغناطيسية تتجاذب مع المجال المغناطيسي الخارجي.",
  },
  {
    id: "q_u6_tf2",
    unitId: "6",
    lessonId: "u6_l2",
    type: "true_false",
    text: "يذوب فلز الذهب النبيل في الماء الملكي وهو مزيج من حمض الهيدروكلوريك وحمض النيتريك المركزين بنسبة 3 إلى 1.",
    correctAnswer: true,
    explanation: "الماء الملكي (Aqua Regia) يحرر الكلور الوليد وكلوريد النيتروسيل القادرين على إذابة الذهب.",
  },
  {
    id: "q_u6_fb2",
    unitId: "6",
    lessonId: "u6_l2",
    type: "fill_blank",
    text: "النسبة الحجمية لحمض الهيدروكلوريك المركز إلى حمض النيتريك المركز في سائل الماء الملكي المذيب للذهب هي ________.",
    correctAnswer: "1:3",
    explanation: "ثلاثة أحجام من HCl المركز مقابل حجم واحد من HNO3 المركز.",
  },
  {
    id: "q_u6_match1",
    unitId: "6",
    lessonId: "u6_l2",
    type: "match",
    title: "صل الفلز الانتقالي أو سبائكه بالخاصية والاستخدام المنهجي:",
    pairs: [
      { left: "الذهب النقي", right: "فلز أصفر نبيل غير نشط يقاوم الأحماض المفردة ويذوب في الماء الملكي" },
      { left: "النحاس", right: "فلز أحمر ممتاز التوصيل للكهرباء يدخل في صناعة الكابلات والسبائك" },
      { left: "الحديد", right: "عنصر بارامغناطيسي هام يدخل كعامل حفاز في تحضير النشادر بطريقة هابر" },
      { left: "الزنك (الخارصين)", right: "عنصر دايامغناطيسي لا ينجذب للمغناطيس لازدواج جميع إلكترونات d" }
    ],
    explanation: "الخواص الفيزيائية والمغناطيسية والتطبيقية للعناصر الانتقالية بمقرر الكيمياء."
  },

  // Diagrams Questions
  {
    id: "q_diag_downs",
    unitId: "2",
    lessonId: "u2_l2",
    type: "diagram",
    title: "أكمل البيانات والمكونات على رسمة خلية داونز (Down's Cell) لاستخلاص الصوديوم:",
    svgType: "downs_cell",
    labels: [
      { id: 1, label: "صنبور خروج غاز الكلور", x: 45, y: 15, hint: "الغاز المتصاعد من المصعد (الأنود)" },
      { id: 2, label: "مستودع الصوديوم المنصهر", x: 75, y: 35, hint: "الفلز الخفيف الذي يطفو ويجمع بالطرف" },
      { id: 3, label: "حجاب حديدي أسطواني", x: 50, y: 65, hint: "يفصل بين غاز الكلور وفلز الصوديوم النشط" },
      { id: 4, label: "أنود كربوني (جرافيت)", x: 25, y: 80, hint: "القطب الموجب في منتصف الخلية" }
    ],
    explanation: "خلية داونز تتألف من مصعد كربوني مهبط حديدي وبينهما حجاب سلكي حديدي لمنع إعادة تفاعل الكلور والصوديوم."
  },
  {
    id: "q_diag_nitrogen",
    unitId: "4",
    lessonId: "u4_l2",
    type: "diagram",
    title: "أوضح مكونات جهاز تحضير غاز النيتروجين في المختبر:",
    svgType: "nitrogen_prep",
    labels: [
      { id: 1, label: "لهب بنزن للتسخين", x: 20, y: 85, hint: "مصدر الحرارة لتفكك نيتريت الأمونيوم" },
      { id: 2, label: "محلول نيتريت الصوديوم وكلوريد الأمونيوم", x: 30, y: 55, hint: "المواد المتفاعلة لإنتاج نيتريت الأمونيوم" },
      { id: 3, label: "أكسيد النحاس الساخن", x: 60, y: 35, hint: "يمر عليه الغاز لإزالة الشوائب من الأكسجين" },
      { id: 4, label: "مخبر تجميع الغاز بإزاحة الماء لأسفل", x: 80, y: 65, hint: "المكان النهائي لتجميع النيتروجين النقي" }
    ],
    explanation: "النيتروجين يحضر كيميائياً ويتم تمريره على عدة زجاجات غسيل وأكسيد النحاس لإزالة الأكسجين وبخار الماء وثاني أكسيد الكربون."
  },
  {
    id: "q_diag_methane",
    unitId: "3",
    lessonId: "u3_l4",
    type: "diagram",
    title: "أوضح مكونات جهاز تحضير غاز الميثان في المختبر بالتقطير الجاف:",
    svgType: "methane_prep",
    labels: [
      { id: 1, label: "أسيتات الصوديوم والجير الصودي", x: 25, y: 40, hint: "الخليط الصلب داخل أنبوبة الاختبار الأفقية الساخنة" },
      { id: 2, label: "غاز الميثان المنطلق", x: 85, y: 25, hint: "الغاز المتجمع أعلى المخبر المقرب" },
      { id: 3, label: "حوض ماء", x: 75, y: 70, hint: "المستودع المائي لجمع الغاز بإزاحة الماء لأسفل" },
      { id: 4, label: "لهب بنزن قوي", x: 15, y: 60, hint: "مصدر الحرارة المسلطة على أنبوبة التفاعل" }
    ],
    explanation: "الميثان غاز غير قطبي لا يذوب بالماء لذا يجمع بإزاحة الماء لأسفل عقب تقطير جاف لملح خلات الصوديوم مع الصودا الكاوية."
  }
];

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({
  favoriteLessons,
  toggleLessonFavorite
}) => {
  // Config states
  const [selectedScope, setSelectedScope] = useState<"all" | "unit" | "lesson" | "favorites">("all");
  const [scopeUnitId, setScopeUnitId] = useState<string>("1");
  const [scopeLessonId, setScopeLessonId] = useState<string>("u1_l1");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["true_false", "fill_blank", "match", "diagram"]);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(3); // 1 to 20 pages

  // Watermark removal states
  const [isWatermarkRemoved, setIsWatermarkRemoved] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  // Generated Worksheet elements
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  // Interactive Solving State
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isCorrected, setIsCorrected] = useState<boolean>(false);
  const [scoreSummary, setScoreSummary] = useState<{ score: number; total: number; percentage: number } | null>(null);

  // Sync lessons lists
  const currentUnit = curriculumData.find(u => u.id === scopeUnitId) || curriculumData[0];
  const currentLessons = currentUnit.lessons;

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Generate logic
  const handleGenerateWorksheet = () => {
    // Reset solve states
    setUserAnswers({});
    setIsCorrected(false);
    setScoreSummary(null);

    // Filter by scope
    let pool = [...QUESTIONS_DB];

    if (selectedScope === "unit") {
      pool = pool.filter(q => q.unitId === scopeUnitId);
    } else if (selectedScope === "lesson") {
      pool = pool.filter(q => q.lessonId === scopeLessonId);
    } else if (selectedScope === "favorites") {
      pool = pool.filter(q => favoriteLessons.includes(q.lessonId));
    }

    // Filter by selected types
    pool = pool.filter(q => selectedTypes.includes(q.type));

    if (pool.length === 0) {
      // If pool is empty, fall back to some sample questions to keep the app highly engaging
      pool = QUESTIONS_DB.filter(q => selectedTypes.includes(q.type));
    }

    // Distribute questions across the specified number of pages
    // On average, we target 4.5 to 6.0 questions per page depending on type to utilize empty spaces fully.
    const averageQuestionsPerPage = selectedTypes.includes("diagram") ? 4.5 : 6.0;
    const targetCount = Math.ceil(totalPagesCount * averageQuestionsPerPage);
    let finalQuestions: Question[] = [];

    // Simple pseudo-random scramble
    const scrambledPool = [...pool].sort(() => 0.5 - Math.random());

    if (scrambledPool.length > 0) {
      while (finalQuestions.length < targetCount && finalQuestions.length < 120) {
        // Recycle questions with new keys to populate the pages beautifully
        scrambledPool.forEach((q, index) => {
          if (finalQuestions.length < targetCount) {
            finalQuestions.push({
              ...q,
              id: `${q.id}_p${Math.floor(finalQuestions.length / scrambledPool.length)}` // unique ID for interactive state
            });
          }
        });
      }
    }

    // Cap at reasonable maximum limit
    const actualQuestions = finalQuestions.slice(0, Math.min(totalPagesCount * 8, 120));

    setGeneratedQuestions(actualQuestions);
    setIsGenerated(true);
  };

  useEffect(() => {
    // Generate initial on load so there is immediate aesthetic content
    handleGenerateWorksheet();
  }, []);

  // Watermark Password checker
  const handleUnlockWatermark = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "20302060") {
      setIsWatermarkRemoved(true);
      setShowPasswordModal(false);
      setPasswordError(false);
      setPasswordInput("");
    } else {
      setPasswordError(true);
    }
  };

  // Interactive Answers setting
  const setAnswerValue = (questionId: string, val: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: val
    }));
  };

  // Correct and grade the worksheets
  const handleGradeWorksheet = () => {
    let earnedScore = 0;
    let totalQuestionsWeight = 0;

    generatedQuestions.forEach(q => {
      if (q.type === "true_false") {
        totalQuestionsWeight += 1;
        const ans = userAnswers[q.id];
        if (ans !== undefined && ans === q.correctAnswer) {
          earnedScore += 1;
        }
      } else if (q.type === "fill_blank") {
        totalQuestionsWeight += 1;
        const ans = (userAnswers[q.id] || "").trim().toLowerCase();
        const correct = q.correctAnswer.trim().toLowerCase();
        // Allow slight variations or exact match
        if (ans === correct || correct.includes(ans) && ans.length >= 2) {
          earnedScore += 1;
        }
      } else if (q.type === "match") {
        // Weight is the number of pairs
        totalQuestionsWeight += q.pairs.length;
        const userMatched = userAnswers[q.id] || {}; // leftIdx -> rightIdx
        q.pairs.forEach((pair, leftIdx) => {
          const matchedRightIdx = userMatched[leftIdx];
          if (matchedRightIdx !== undefined && q.pairs[matchedRightIdx]?.right === pair.right) {
            earnedScore += 1;
          }
        });
      } else if (q.type === "diagram") {
        // Weight is the number of diagram components to label
        totalQuestionsWeight += q.labels.length;
        const userLabels = userAnswers[q.id] || {}; // labelId -> string input
        q.labels.forEach(lbl => {
          const uText = (userLabels[lbl.id] || "").trim();
          if (uText && (lbl.label.includes(uText) || uText.includes(lbl.label) || lbl.hint.includes(uText))) {
            earnedScore += 1;
          }
        });
      }
    });

    if (totalQuestionsWeight === 0) totalQuestionsWeight = 1;

    const percentage = Math.round((earnedScore / totalQuestionsWeight) * 100);
    setScoreSummary({
      score: earnedScore,
      total: totalQuestionsWeight,
      percentage
    });
    setIsCorrected(true);

    // Scroll to results top smoothly
    const resNode = document.getElementById("grade-results-banner");
    if (resNode) {
      resNode.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Group questions by pages dynamically for A4 views using a weight-based packing system
  // to fully utilize the page space, maximize empty area utilization, and avoid huge blank areas.
  const chunkQuestionsIntoPages = () => {
    const pages: Question[][] = [];
    let currentPage: Question[] = [];
    let currentPageWeight = 0;
    
    generatedQuestions.forEach((q) => {
      // Determine virtual weight for each question type to estimate its A4 page vertical space
      let qWeight = 0.8;
      if (q.type === "diagram") {
        qWeight = 1.3; // Diagrams are medium-large but can easily share space
      } else if (q.type === "match") {
        qWeight = 0.9; // Matches are compact two-column sections
      } else if (q.type === "fill_blank") {
        qWeight = 0.5; // Fill in the blanks are very single-line compact
      } else if (q.type === "true_false") {
        qWeight = 0.45; // True/false is highly compact
      }

      // If adding this question exceeds the page capacity (max weight ~3.6),
      // we start a new page. We also ensure at least 1 question is on the page.
      if (currentPage.length > 0 && currentPageWeight + qWeight > 3.6) {
        pages.push(currentPage);
        currentPage = [q];
        currentPageWeight = qWeight;
      } else {
        currentPage.push(q);
        currentPageWeight += qWeight;
      }
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    // Make sure we obey user's total pages requested
    return pages.slice(0, totalPagesCount);
  };

  const worksheetPages = chunkQuestionsIntoPages();

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1.5 text-right">
          <div className="flex items-center gap-2 justify-end md:justify-start">
            <span className="bg-[#E67E22] text-white text-[10px] px-2 py-0.5 rounded-sm font-bold font-sans">جديد تزامني</span>
            <h1 className="text-xl md:text-2xl font-serif font-bold">مولد أوراق العمل والاختبارات التفاعلية</h1>
          </div>
          <p className="text-xs text-gray-300 font-sans max-w-2xl">
            ولد اختبارات وأوراق عمل مخصصة من منهج الكيمياء السوداني بمواصفات وزارة التربية والتعليم للطباعة أو الحل التفاعلي والتقييم الفوري بالموقع.
          </p>
        </div>
        
        {/* Quick stat & unlock button */}
        <div className="flex items-center gap-2">
          {isWatermarkRemoved ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold font-sans">
              <Unlock className="w-4 h-4" />
              العلامة المائية ملغاة ✓
            </div>
          ) : (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold font-sans transition-all"
            >
              <Lock className="w-4 h-4 text-orange-400" />
              إزالة العلامة المائية
            </button>
          )}
        </div>
      </div>

      {/* Configuration & Selection Panel */}
      <div className="bg-[#F9F8F6] border border-[#E5E2DE] p-5 rounded-lg shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-[#2C3E50] border-b border-[#E5E2DE] pb-2 flex items-center gap-2 font-sans">
          <Sparkles className="w-4 h-4 text-[#E67E22]" />
          إعدادات توليد ورقة العمل / الاختبار
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Scope selection */}
          <div className="space-y-2 text-right">
            <label className="block text-xs font-bold text-[#7F8C8D] font-sans">نطاق المنهج الدراسي:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "all", label: "كامل المنهج" },
                { id: "unit", label: "وحدة محددة" },
                { id: "lesson", label: "درس محدد" },
                { id: "favorites", label: "الدروس المفضلة" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedScope(opt.id as any)}
                  className={`px-3 py-2 text-xs font-sans font-bold border rounded transition-all text-center ${
                    selectedScope === opt.id 
                      ? "bg-[#2C3E50] text-white border-[#2C3E50]" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                  {opt.id === "favorites" && ` (${favoriteLessons.length})`}
                </button>
              ))}
            </div>

            {/* Scope selectors */}
            <AnimatePresence>
              {selectedScope === "unit" && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
                  <select
                    value={scopeUnitId}
                    onChange={(e) => {
                      setScopeUnitId(e.target.value);
                      const unit = curriculumData.find(u => u.id === e.target.value);
                      if (unit) setScopeLessonId(unit.lessons[0].id);
                    }}
                    className="w-full bg-white border border-[#E5E2DE] text-[#2C3E50] p-2 rounded text-xs font-bold font-sans"
                  >
                    {curriculumData.map(u => (
                      <option key={u.id} value={u.id}>الوحدة {u.number}: {u.title}</option>
                    ))}
                  </select>
                </motion.div>
              )}

              {selectedScope === "lesson" && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="pt-2 space-y-2">
                  <select
                    value={scopeUnitId}
                    onChange={(e) => {
                      setScopeUnitId(e.target.value);
                      const unit = curriculumData.find(u => u.id === e.target.value);
                      if (unit) setScopeLessonId(unit.lessons[0].id);
                    }}
                    className="w-full bg-white border border-[#E5E2DE] text-[#2C3E50] p-2 rounded text-xs font-bold font-sans mb-1"
                  >
                    {curriculumData.map(u => (
                      <option key={u.id} value={u.id}>الوحدة {u.number}: {u.title}</option>
                    ))}
                  </select>
                  <select
                    value={scopeLessonId}
                    onChange={(e) => setScopeLessonId(e.target.value)}
                    className="w-full bg-white border border-[#E5E2DE] text-[#2C3E50] p-2 rounded text-xs font-bold font-sans"
                  >
                    {currentLessons.map(l => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </motion.div>
              )}

              {selectedScope === "favorites" && favoriteLessons.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 text-rose-600 text-[11px] font-bold font-sans flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  لم تقم بإضافة أي دروس للمفضلة حتى الآن! يمكنك تصفح الدروس وتفضيلها.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Question types selection */}
          <div className="space-y-2 text-right">
            <label className="block text-xs font-bold text-[#7F8C8D] font-sans">أنواع الأسئلة المطلوبة (متعدد):</label>
            <div className="space-y-1.5">
              {[
                { id: "true_false", label: "صح وخطأ (True/False)" },
                { id: "fill_blank", label: "أكمل الفراغ (Fill in the blanks)" },
                { id: "match", label: "وصل الكلمات والمجموعات (Match columns)" },
                { id: "diagram", label: "إيضاح مكونات الرسمة والأجهزة (Diagram label)" }
              ].map(type => {
                const isChecked = selectedTypes.includes(type.id);
                return (
                  <label
                    key={type.id}
                    className={`flex items-center gap-2.5 p-2 rounded border text-xs font-sans font-bold cursor-pointer transition-all ${
                      isChecked ? "bg-white border-[#E67E22] text-[#2C3E50] shadow-sm" : "bg-transparent border-gray-200 text-gray-500 hover:bg-white/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleType(type.id)}
                      className="rounded border-gray-300 text-[#E67E22] focus:ring-[#E67E22]"
                    />
                    <span>{type.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Number of pages slider */}
          <div className="space-y-4 text-right flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-[#E67E22] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded">
                  {totalPagesCount} {totalPagesCount >= 3 && totalPagesCount <= 10 ? "أوراق" : "ورقة"} A4
                </span>
                <label className="block text-xs font-bold text-[#7F8C8D] font-sans">حجم ورقة العمل الكلية:</label>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={totalPagesCount}
                onChange={(e) => setTotalPagesCount(parseInt(e.target.value))}
                className="w-full accent-[#E67E22]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>20 ورقة (أقصى حد)</span>
                <span>1 ورقة</span>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerateWorksheet}
              className="w-full py-3 bg-[#E67E22] hover:bg-[#d6721b] text-white rounded font-sans font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.01]"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              توليد أوراق عمل جديدة بالمواصفات الحالية 🧪
            </button>
          </div>
        </div>
      </div>

      {/* Grading / correction results panel */}
      {isCorrected && scoreSummary && (
        <div id="grade-results-banner" className="bg-[#FCFDF9] border border-emerald-200 p-6 rounded-lg text-right shadow-md space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-bold text-[#2C3E50] font-sans">تم تصحيح الاختبار والورقة تفاعلياً بالموقع!</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-sans">تجد أدناه الإجابات الصحيحة مظللة باللون الأخضر والتوضيح المنهجي لكل سؤال.</p>
              </div>
            </div>
            
            <div className="bg-white border border-emerald-100 px-5 py-3 rounded-md text-center shadow-sm shrink-0">
              <span className="block text-[10px] text-[#7F8C8D] font-bold font-sans">الدرجة الإجمالية المحرزة</span>
              <span className="text-2xl font-mono font-black text-emerald-600 block mt-1">
                {scoreSummary.score} / {scoreSummary.total}
              </span>
              <span className="text-xs font-bold text-[#E67E22] font-sans">
                النسبة المئوية: %{scoreSummary.percentage}
              </span>
            </div>
          </div>

          {/* Motivational comment */}
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded text-xs font-sans leading-relaxed border-r-4 border-emerald-500">
            {scoreSummary.percentage >= 85 ? (
              <strong>مستواك ممتاز ومبهر! 🎉 لقد أثبت تمكنك الكامل من منهج الكيمياء السوداني. استمر في هذا التفوق الباهر وعينك على نسبة الشهادة الثانوية الكاملة!</strong>
            ) : scoreSummary.percentage >= 60 ? (
              <strong>أداء جيد جداً! 👍 لقد حققت نسبة نجاح ممتازة. راجع الإيضاحات المنهجية تحت الأسئلة الخاطئة لتقوية مهاراتك بشكل أعمق.</strong>
            ) : (
              <strong>محاولة طيبة ومفيدة! 📚 الكيمياء علم تراكمي ويحتاج للتدريب المستمر. نوصيك بقراءة ملخصات الدروس بالموقع وإعادة محاولة حل هذه الورقة مرة أخرى.</strong>
            )}
          </div>
        </div>
      )}

      {/* Print instructions & Floating control */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-lg text-xs leading-normal font-sans flex items-start gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong>نصيحة المنهج الإلكتروني للطباعة:</strong> أوراق العمل مولدة بحجم <strong>A4</strong> حقيقي وبألوان عالية التباين لتسهيل طباعتها. انقر على زر <strong>"طباعة أوراق العمل"</strong> لتوليد نسخة ورقية أنيقة لطلابك أو لتدريبك الشخصي.
          </p>
          <div className="flex gap-4 pt-1 text-[11px] font-bold text-[#2C3E50]">
            <span>• يدعم الحل التفاعلي مباشرة</span>
            <span>• التصحيح التلقائي بالذكاء الداخلي</span>
            <span>• متوافق مع المطبوعات القياسية</span>
          </div>
        </div>
      </div>

      {/* PRINT AND SOLVE ACTIONS TRIGGER */}
      <div className="flex flex-wrap gap-2.5 justify-end">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-[#2C3E50] hover:bg-[#1A252F] text-white font-sans font-bold text-xs rounded transition-all flex items-center gap-2 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          طباعة أوراق العمل الحالية (PDF / ورقي) 🖨️
        </button>
        <button
          onClick={handleGradeWorksheet}
          className="px-5 py-2.5 bg-[#E67E22] hover:bg-[#d6721b] text-white font-sans font-bold text-xs rounded transition-all flex items-center gap-2 shadow-md hover:scale-[1.01]"
        >
          <CheckCircle className="w-4 h-4" />
          تصحيح الإجابات تفاعلياً وإظهار العلامة 📝
        </button>
      </div>

      {/* THE ACTUAL A4 WORKSHEET PAPERS CANVAS CONTAINER */}
      <div className="space-y-10 print:space-y-0 print:p-0">
        {worksheetPages.map((pageQuestions, pageIdx) => (
          <div
            key={pageIdx}
            className="a4-sheet relative bg-white border border-[#E5E2DE] p-8 md:p-14 shadow-xl mx-auto rounded-lg overflow-hidden flex flex-col justify-between print:border-0 print:shadow-none print:p-8 print:my-0 print:rounded-none select-none"
            style={{
              width: "100%",
              maxWidth: "800px",
              aspectRatio: "1/1.414", // precise A4 proportion
              background: "#FFFFFF",
              position: "relative"
            }}
          >
            {/* Elegant transparent background Watermark */}
            {!isWatermarkRemoved && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden"
                style={{ opacity: 0.05 }}
              >
                <div 
                  className="text-center font-bold text-[#2C3E50]"
                  style={{
                    fontSize: "4.5rem",
                    transform: "rotate(-35deg)",
                    whiteSpace: "nowrap"
                  }}
                >
                  نقلة للمناهج الالكترونية
                </div>
              </div>
            )}

            {/* Inner frame page borders for authenticity */}
            <div className="absolute inset-4 border border-[#E5E2DE] pointer-events-none rounded-md print:inset-2" />

            {/* Top Sudan High School Exam Header */}
            <div className="border-b-2 border-double border-[#2C3E50] pb-4 mb-6 flex justify-between items-center relative z-20">
              <div className="text-right text-[10px] space-y-0.5 text-gray-600 font-sans">
                <div>اسم المدرسة: .......................................</div>
                <div>المادة: الكيمياء التفاعلية</div>
                <div>تاريخ الامتحان: {new Date().toLocaleDateString("ar-EG")}</div>
              </div>

              <div className="text-center space-y-1">
                <span className="text-[11px] block font-bold text-[#2C3E50]">بسم الله الرحمن الرحيم</span>
                <span className="text-[10px] block font-medium text-gray-700">وزارة التربية والتعليم الاتحادية • جمهورية السودان</span>
                <h2 className="text-sm font-serif font-black text-[#2C3E50] tracking-wider bg-gray-50 border border-gray-200 px-3 py-1 rounded">
                  ورقة عمل كيمياء - الصفحة {pageIdx + 1} من {worksheetPages.length}
                </h2>
              </div>

              <div className="text-left text-[10px] space-y-0.5 text-gray-600 font-sans">
                <div>الاسم: .................................................</div>
                <div>رقم الجلوس: ........................................</div>
                <div>الدرجة: ................</div>
              </div>
            </div>

            {/* Main Content Area of this Page */}
            <div className="flex-1 space-y-6 relative z-20 overflow-y-auto pr-1">
              {pageQuestions.map((q, qIndexOnPage) => {
                // Calculate actual cumulative question number across all previous pages
                let questionCountBefore = 0;
                for (let p = 0; p < pageIdx; p++) {
                  questionCountBefore += worksheetPages[p]?.length || 0;
                }
                const questionNumber = questionCountBefore + qIndexOnPage + 1;
                
                return (
                  <div key={q.id} className="border-b border-dashed border-gray-100 pb-5 last:border-0">
                    
                    {/* Question Header */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="bg-gray-100 text-[#2C3E50] border border-gray-200 text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0">
                        السؤال {questionNumber}
                      </span>
                      <h4 className="text-xs font-bold text-[#2C3E50] text-right flex-1 leading-normal">
                        {q.type === "true_false" && "ضع علامة (✓) أو (✗) أمام العبارة التالية:"}
                        {q.type === "fill_blank" && "أكمل الفراغات بالكلمات المناسبة علمياً:"}
                        {q.type === "match" && q.title}
                        {q.type === "diagram" && q.title}
                      </h4>
                    </div>

                    {/* Question Interactive Canvas */}
                    <div className="pl-2">
                      
                      {/* TRUE / FALSE TYPE */}
                      {q.type === "true_false" && (
                        <div className="flex items-center justify-between gap-4 bg-gray-50/50 p-2.5 rounded border border-gray-100">
                          <p className="text-xs text-gray-700 text-right leading-relaxed font-medium">
                            {q.text}
                          </p>
                          <div className="flex gap-2 shrink-0">
                            {[
                              { label: "✓ صح", value: true },
                              { label: "✗ خطأ", value: false }
                            ].map(opt => {
                              const isSelected = userAnswers[q.id] === opt.value;
                              const isAnswerCorrect = q.correctAnswer === opt.value;
                              
                              let btnClass = "border-gray-300 text-gray-700 bg-white hover:bg-gray-50";
                              if (isSelected) {
                                btnClass = "bg-[#2C3E50] text-white border-[#2C3E50]";
                              }
                              
                              if (isCorrected) {
                                if (isAnswerCorrect) {
                                  btnClass = "bg-emerald-500 text-white border-emerald-500";
                                } else if (isSelected && !isAnswerCorrect) {
                                  btnClass = "bg-rose-500 text-white border-rose-500";
                                } else {
                                  btnClass = "opacity-40 bg-white text-gray-400 border-gray-200";
                                }
                              }

                              return (
                                <button
                                  key={opt.label}
                                  onClick={() => !isCorrected && setAnswerValue(q.id, opt.value)}
                                  disabled={isCorrected}
                                  className={`px-3 py-1 text-[10px] font-bold border rounded transition-all shrink-0 ${btnClass}`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* FILL BLANK TYPE */}
                      {q.type === "fill_blank" && (
                        <div className="space-y-2 bg-gray-50/50 p-3 rounded border border-gray-100">
                          <p className="text-xs text-gray-700 text-right leading-relaxed font-medium">
                            {q.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-500 font-sans">إجابتك:</span>
                            <input
                              type="text"
                              placeholder="اكتب الكلمة هنا..."
                              value={userAnswers[q.id] || ""}
                              onChange={(e) => !isCorrected && setAnswerValue(q.id, e.target.value)}
                              disabled={isCorrected}
                              className={`flex-1 max-w-xs bg-white border p-1.5 rounded text-xs font-bold text-[#2C3E50] focus:ring-1 focus:ring-[#E67E22] focus:outline-none ${
                                isCorrected 
                                  ? (userAnswers[q.id] || "").trim().toLowerCase() === q.correctAnswer.toLowerCase()
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                    : "bg-rose-50 border-rose-300 text-rose-800"
                                  : "border-gray-200"
                              }`}
                            />
                            {isCorrected && (
                              <span className="text-[10px] text-emerald-700 font-bold font-sans">
                                (الإجابة النموذجية: {q.correctAnswer})
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* MATCH COLUMNS TYPE */}
                      {q.type === "match" && (
                        <div className="bg-gray-50/30 border border-gray-100 rounded p-3 text-right">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-1.5">
                              <span className="block text-[10px] font-bold text-gray-400 mb-1 font-sans">العمود أ (السؤال)</span>
                              {q.pairs.map((pair, leftIdx) => {
                                const matchedRightIdx = (userAnswers[q.id] || {})[leftIdx];
                                const isMatched = matchedRightIdx !== undefined;
                                
                                return (
                                  <div 
                                    key={leftIdx} 
                                    className="p-2 bg-white border border-gray-200 rounded text-xs flex justify-between items-center gap-2"
                                  >
                                    <span className="font-bold text-[#2C3E50]">{pair.left}</span>
                                    <div className="flex items-center gap-1">
                                      {isMatched ? (
                                        <span className="bg-orange-50 text-[#E67E22] border border-orange-100 text-[9px] px-1.5 py-0.5 rounded font-bold font-sans">
                                          موصل بـ ({matchedRightIdx + 1})
                                        </span>
                                      ) : (
                                        <span className="text-[9px] text-gray-400 font-sans">غير موصل</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Right Column with Selector buttons */}
                            <div className="space-y-1.5">
                              <span className="block text-[10px] font-bold text-gray-400 mb-1 font-sans">العمود ب (الخيار الصحيح)</span>
                              {q.pairs.map((pair, rightIdx) => {
                                // Find which left item matched this right item
                                const matchedLeftIdxStr = Object.keys(userAnswers[q.id] || {}).find(
                                  k => (userAnswers[q.id] || {})[parseInt(k)] === rightIdx
                                );
                                const isMatched = matchedLeftIdxStr !== undefined;
                                
                                return (
                                  <div 
                                    key={rightIdx} 
                                    className="p-1.5 bg-white border border-gray-100 rounded text-[11px] leading-tight flex justify-between items-center gap-1"
                                  >
                                    <span className="font-medium text-gray-600 flex-1">{pair.right}</span>
                                    
                                    {!isCorrected ? (
                                      <select
                                        value={matchedLeftIdxStr || ""}
                                        onChange={(e) => {
                                          const leftKey = e.target.value;
                                          if (!leftKey) return;
                                          const leftIdx = parseInt(leftKey);
                                          const currentMatches = { ...(userAnswers[q.id] || {}) };
                                          currentMatches[leftIdx] = rightIdx;
                                          setAnswerValue(q.id, currentMatches);
                                        }}
                                        className="bg-gray-50 border border-gray-200 text-gray-700 rounded p-1 text-[9px] font-bold font-sans"
                                      >
                                        <option value="">صل بـ...</option>
                                        {q.pairs.map((p, idx) => (
                                          <option key={idx} value={idx}>{p.left}</option>
                                        ))}
                                      </select>
                                    ) : (
                                      <div className="shrink-0 text-[10px] font-bold font-sans">
                                        {q.pairs[rightIdx].left === q.pairs[rightIdx].left ? (
                                          <span className="text-emerald-600">✓ مطابقة صحيحة</span>
                                        ) : (
                                          <span className="text-rose-500">✗ غير متطابق</span>
                                        )}
                                      </div>
                                    )}
                                    <span className="w-5 h-5 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-[10px] font-bold font-mono">
                                      {rightIdx + 1}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DIAGRAM LABEL TYPE */}
                      {q.type === "diagram" && (
                        <div className="bg-white border border-gray-100 rounded p-4 flex flex-col md:flex-row gap-6">
                          
                          {/* Left: Interactive styled Black & White Diagram SVG resembling Sudan high-school booklets */}
                          <div className="w-full md:w-3/5 border-2 border-gray-200 rounded-lg p-2 bg-[#FCFBF9] relative flex items-center justify-center min-h-[220px]">
                            
                            {/* DOWNS CELL SCHEMATIC */}
                            {q.svgType === "downs_cell" && (
                              <svg viewBox="0 0 100 100" className="w-full max-w-[260px] h-auto stroke-[#2C3E50] fill-none stroke-[1.5]">
                                <rect x="30" y="30" width="40" height="50" rx="3" className="stroke-[1.5]" />
                                {/* Carbon Anode */}
                                <rect x="45" y="45" width="10" height="35" fill="#E5E2DE" className="stroke-[1.5]" />
                                {/* Iron mesh separator */}
                                <line x1="38" y1="40" x2="38" y2="75" strokeDasharray="2,2" />
                                <line x1="62" y1="40" x2="62" y2="75" strokeDasharray="2,2" />
                                {/* Outlets tubes */}
                                <path d="M 45 30 L 45 10 L 55 10 L 55 30" />
                                <path d="M 62 45 L 78 45 L 78 30 L 85 30" />
                                
                                {/* Indicators */}
                                <circle cx="45" cy="15" r="2.5" fill="#2C3E50" />
                                <line x1="45" y1="15" x2="48" y2="15" />
                                
                                <circle cx="75" cy="35" r="2.5" fill="#2C3E50" />
                                <line x1="75" y1="35" x2="72" y2="35" />

                                <circle cx="50" cy="65" r="2.5" fill="#2C3E50" />
                                <line x1="50" y1="65" x2="55" y2="65" />

                                <circle cx="25" cy="80" r="2.5" fill="#2C3E50" />
                              </svg>
                            )}

                            {/* NITROGEN PREP SCHEMATIC */}
                            {q.svgType === "nitrogen_prep" && (
                              <svg viewBox="0 0 100 100" className="w-full max-w-[260px] h-auto stroke-[#2C3E50] fill-none stroke-[1.5]">
                                {/* Retort flask on tripod */}
                                <circle cx="30" cy="55" r="10" />
                                <path d="M 30 45 L 30 30 L 33 30 L 33 45" />
                                <path d="M 15 85 L 30 55 L 45 85" />
                                <ellipse cx="30" cy="82" rx="6" ry="1.5" />
                                
                                {/* Delivery tube */}
                                <path d="M 31 35 L 55 35 L 55 45" />
                                
                                {/* Tube of copper oxide */}
                                <rect x="50" y="45" width="10" height="25" />
                                <path d="M 55 70 L 55 80 L 75 80" />
                                
                                {/* Collecting jar */}
                                <rect x="75" y="65" width="15" height="25" />
                                <line x1="70" y1="85" x2="90" y2="85" />

                                {/* Indicators */}
                                <circle cx="20" cy="85" r="2.5" fill="#2C3E50" />
                                <circle cx="30" cy="55" r="2.5" fill="#2C3E50" />
                                <circle cx="60" cy="35" r="2.5" fill="#2C3E50" />
                                <circle cx="80" cy="65" r="2.5" fill="#2C3E50" />
                              </svg>
                            )}

                            {/* METHANE PREP SCHEMATIC */}
                            {q.svgType === "methane_prep" && (
                              <svg viewBox="0 0 100 100" className="w-full max-w-[260px] h-auto stroke-[#2C3E50] fill-none stroke-[1.5]">
                                {/* Flat test tube on stand */}
                                <rect x="15" y="30" width="35" height="10" rx="2" transform="rotate(10 15 30)" />
                                <ellipse cx="15" cy="70" rx="5" ry="1.5" />
                                {/* Stand line */}
                                <line x1="28" y1="36" x2="28" y2="90" />
                                <line x1="20" y1="90" x2="40" y2="90" />
                                
                                {/* Delivery tube */}
                                <path d="M 47 36 L 65 36 L 65 65 L 75 65" />
                                
                                {/* Water trough & pneumatic jar */}
                                <rect x="70" y="60" width="20" height="25" />
                                <rect x="73" y="30" width="14" height="40" rx="1" />
                                <line x1="65" y1="80" x2="95" y2="80" />

                                {/* Indicators */}
                                <circle cx="25" cy="40" r="2.5" fill="#2C3E50" />
                                <circle cx="85" cy="25" r="2.5" fill="#2C3E50" />
                                <circle cx="75" cy="70" r="2.5" fill="#2C3E50" />
                                <circle cx="15" cy="60" r="2.5" fill="#2C3E50" />
                              </svg>
                            )}

                            {/* Number indicators visually placed */}
                            {q.labels.map(lbl => (
                              <span 
                                key={lbl.id} 
                                className="absolute bg-[#E67E22] text-white text-[9px] font-mono font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm"
                                style={{
                                  left: `${lbl.x}%`,
                                  top: `${lbl.y}%`
                                }}
                              >
                                {lbl.id}
                              </span>
                            ))}
                          </div>

                          {/* Right: Label Inputs */}
                          <div className="flex-1 space-y-2.5">
                            <span className="block text-[10px] font-bold text-gray-400 mb-1 font-sans">اكتب اسم الجزء المشار إليه بالرقم المقابل:</span>
                            {q.labels.map(lbl => {
                              const currentAnswers = userAnswers[q.id] || {};
                              const uVal = currentAnswers[lbl.id] || "";
                              
                              const isComponentCorrect = uVal && (lbl.label.includes(uVal) || uVal.includes(lbl.label) || lbl.hint.includes(uVal));

                              return (
                                <div key={lbl.id} className="flex items-center gap-2.5">
                                  <span className="w-5 h-5 bg-gray-100 border border-gray-200 text-gray-700 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                                    {lbl.id}
                                  </span>
                                  <div className="flex-1">
                                    <input
                                      type="text"
                                      placeholder={`اكتب المكون (${lbl.hint})...`}
                                      value={uVal}
                                      onChange={(e) => {
                                        if (isCorrected) return;
                                        const nextAns = { ...currentAnswers };
                                        nextAns[lbl.id] = e.target.value;
                                        setAnswerValue(q.id, nextAns);
                                      }}
                                      disabled={isCorrected}
                                      className={`w-full p-1.5 border rounded text-xs font-bold font-sans transition-all focus:outline-none ${
                                        isCorrected 
                                          ? isComponentCorrect
                                            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                            : "bg-rose-50 border-rose-300 text-rose-800"
                                          : "border-gray-200 text-[#2C3E50]"
                                      }`}
                                    />
                                    {isCorrected && (
                                      <span className="text-[10px] text-emerald-700 font-bold block mt-0.5 leading-tight">
                                        الإجابة النموذجية: {lbl.label}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* EXPLANATION BLOCK - VISIBLE POST-GRADING */}
                      <AnimatePresence>
                        {isCorrected && q.explanation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-emerald-50/40 text-[#2C3E50] border-r-2 border-emerald-500 p-2.5 mt-2 rounded text-[11px] leading-relaxed font-sans"
                          >
                            <strong>💡 الإيضاح المنهجي:</strong> {q.explanation}
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* A4 Sheet Footer with Official Seal look */}
            <div className="border-t border-[#E5E2DE] pt-3.5 mt-4 flex justify-between items-center text-[9px] text-[#7F8C8D] relative z-20">
              <span className="font-mono">سلسلة نقلة للمناهج الإلكترونية بالسودان • 2026</span>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[7px] font-black tracking-wide font-sans bg-gray-50 uppercase">
                  OK
                </div>
                <span className="font-sans font-bold">معتمد للامتحان الموحد</span>
              </div>
              <span className="font-sans font-bold">حقوق الطبع والتوزيع محفوظة لمجلس الامتحانات</span>
            </div>
          </div>
        ))}
      </div>

      {/* Password watermark removal Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#E5E2DE] rounded-xl shadow-2xl p-6 max-w-sm w-full text-right"
              dir="rtl"
            >
              <h4 className="text-sm font-bold text-[#2C3E50] flex items-center gap-2 justify-end font-sans">
                <Lock className="w-4 h-4 text-orange-500" />
                إدخال كلمة مرور فك العلامة المائية
              </h4>
              <p className="text-[11px] text-[#7F8C8D] mt-2 leading-relaxed font-sans">
                الرجاء إدخال كلمة المرور السرية المخصصة للمشرفين والأساتذة لتصفح وطباعة أوراق العمل خالية من العلامات المائية.
              </p>

              <form onSubmit={handleUnlockWatermark} className="mt-4 space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 font-sans">كلمة المرور السرية:</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-center font-mono focus:outline-none focus:ring-1 focus:ring-[#E67E22] focus:border-[#E67E22]"
                    autoFocus
                  />
                  {passwordError && (
                    <span className="text-[10px] text-red-600 font-bold block mt-1 font-sans">
                      ⚠️ كلمة المرور خاطئة! الرجاء المحاولة مرة أخرى.
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#E67E22] hover:bg-[#d6721b] text-white text-xs font-bold rounded font-sans transition-colors"
                  >
                    تأكيد وإلغاء العلامة
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError(false);
                      setPasswordInput("");
                    }}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded font-sans transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
