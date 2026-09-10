import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Beaker, 
  Flame, 
  Thermometer, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Shield, 
  CheckCircle,
  Sparkles,
  Layers,
  Droplet,
  Compass,
  Zap,
  Info,
  Maximize2,
  Scale,
  Magnet,
  Eye,
  HelpCircle,
  CheckCircle2,
  Scissors,
  FileText,
  Pipette,
  FlaskConical,
  Utensils
} from "lucide-react";
import { PeriodicTableTool } from "./PeriodicTableTool";
import { MolecularSimulator } from "./MolecularSimulator";
import { Lab3DScene } from "./Lab3DScene";
import { getExperimentReflection, LAB_REFLECTIONS } from "../data/labReflections";

interface LabStep {
  text: string;
  chemicalChange?: string;
  animationState?: string;
}

interface Experiment {
  id: string; // matches lesson ID exactly (e.g. "u1_l1")
  title: string;
  unit: string;
  unitId: string; // e.g. "u1"
  dangerLevel: "منخفض" | "متوسط" | "مرتفع" | "شديد الخطورة";
  apparatus: string[];
  chemicals: string[];
  equation: string;
  steps: LabStep[];
}

const experiments: Experiment[] = [
  // --- UNIT 1 ---
  {
    id: "u1_l1",
    title: "ثلاثيات دوبرينر ومقارنة الكتل الذرية",
    unit: "الوحدة الأولى: تصنيف العناصر وتاريخه",
    unitId: "u1",
    dangerLevel: "منخفض",
    apparatus: ["ميزان حساس رقمي", "أنابيب للعينات", "حاسبة معملية"],
    chemicals: ["عنصر الكالسيوم Ca", "عنصر الباريوم Ba", "عنصر الاسترونشيوم Sr"],
    equation: "متوسط كتلة (Ca + Ba) / 2 = 88.6 g/mol ≃ الكتلة الحقيقية لـ Sr (87.6)",
    steps: [
      { text: "زن عينة نقية من الكالسيوم Ca (الكتلة الذرية 40.0) وسجل قراءتها في حاسبة المعمل.", chemicalChange: "وزن عينة الكالسيوم واستخلاص الكتلة الذرية الأولى.", animationState: "weigh_ca" },
      { text: "زن عينة مماثلة من الباريوم Ba (الكتلة الذرية 137.3) وسجل وزنها.", chemicalChange: "وزن عينة الباريوم واستخلاص الكتلة الذرية الثالثة.", animationState: "weigh_ba" },
      { text: "احسب كيميائياً المتوسط الحسابي لكتلتي الكالسيوم والباريوم بالأرقام.", chemicalChange: "عملية الحساب: (40.0 + 137.3) / 2 = 88.65.", animationState: "calculate" },
      { text: "زن الآن عينة من العنصر الأوسط في الثلاثية وهو الاسترونشيوم Sr لتكتشف كتلته الفعلية.", chemicalChange: "كتلة الاسترونشيوم الفعلية هي 87.6، وهي متقاربة جداً مع متوسط الحساب مما يثبت تدرج الثلاثية لدوبرينر.", animationState: "weigh_sr" }
    ]
  },
  {
    id: "u1_l2",
    title: "التمييز بين فئات الجدول الدوري s, p, d, f",
    unit: "الوحدة الأولى: تصنيف العناصر وتاريخه",
    unitId: "u1",
    dangerLevel: "منخفض",
    apparatus: ["جهاز قياس الناقلية الكهربية", "شاشة الطيف الضوئي", "ملقط عزل"],
    chemicals: ["سلك صوديوم (فئة s)", "غاز الكلور في أنبوب مغلق (فئة p)", "أيونات النحاس المائية (فئة d)", "عينة يوروبيوم (فئة f)"],
    equation: "1s² 2s² 2p⁶ 3s¹ (Na s-block) vs [Ar] 3d¹⁰ 4s¹ (Cu d-block)",
    steps: [
      { text: "اختبر سلك الصوديوم من فئة s بجهاز الناقلية الكهربية.", chemicalChange: "توصيل كهربائي فائق نظراً لسهولة حركة إلكترونات المدار الخارجي s1.", animationState: "conduct_s" },
      { text: "اختبر غاز الكلور من فئة p في الأنبوب المغلق لمقارنة التوصيل.", chemicalChange: "مقاومة تامة للتوصيل الكهربي لشدة ثبات إلكترونات غلاف التكافؤ p5 واستحالة تحركها.", animationState: "conduct_p" },
      { text: "ألقِ نظرة على محلول أيونات النحاس من فئة d تحت مطياف الضوء.", chemicalChange: "ظهور لون أزرق براق ناصع نتيجة لامتصاص وترقية الإلكترونات في المدار d الممتلئ جزئياً.", animationState: "color_d" },
      { text: "افحص عينة اليوروبيوم من فئة f اللانثانيدات لمشاهدة المظهر المغناطيسي.", chemicalChange: "جاذبية مغناطيسية متقدمة ناتجة عن عدم اكتمال الغلاف f الثقيل.", animationState: "magnet_f" }
    ]
  },
  {
    id: "u1_l3",
    title: "تدرج الحجم والنشاط الكيميائي عبر الدورة الثالثة",
    unit: "الوحدة الأولى: تصنيف العناصر وتاريخه",
    unitId: "u1",
    dangerLevel: "متوسط",
    apparatus: ["أنبوبتا اختبار", "حامل مقارنة", "قطارة دقيقة"],
    chemicals: ["ماء مقطر", "فلز الصوديوم Na", "فلز المغنيسيوم Mg", "كاشف الفينول فثالين"],
    equation: "2Na(s) + 2H2O(l) ⟶ 2NaOH(aq) + H2↑ (عنيف) vs Mg + 2H2O (hot) ⟶ Mg(OH)2 + H2",
    steps: [
      { text: "أضف ماءً مقطراً مع قطرات من دليل الفينول فثالين في كلتا الأنبوبتين.", chemicalChange: "تحضير الوسط المائي الملاحظ لتغيرات درجة الحموضة.", animationState: "prep_tubes" },
      { text: "ألقِ قطعة الصوديوم Na بحذر في الأنبوبة الأولى وراقب سرعة التفاعل.", chemicalChange: "الصوديوم ذو حجم ذري كبير يسهل عليه فقد إلكترونه، فيتفاعل فوراً وبعنف مفرقعاً.", animationState: "reaction_na_trend" },
      { text: "ألقِ قطعة المغنيسيوم Mg في الأنبوبة الثانية وراقب النتيجة.", chemicalChange: "لا يحدث تفاعل واضح في الماء البارد لتقلص الحجم الذري للمغنيسيوم وقوة نواة ذراته وجذبها للإلكترونات.", animationState: "reaction_mg_trend" },
      { text: "سخن أنبوبة المغنيسيوم باستخدام الموقد بلطف وشاهد التغير.", chemicalChange: "بالتسخين، يتفاعل المغنيسيوم ببطء ليتلون المحلول بالوردي دلالة على تكون هيدروكسيد المغنيسيوم القلوي.", animationState: "heat_mg_trend" }
    ]
  },

  // --- UNIT 2 ---
  {
    id: "u2_l1",
    title: "تفاعل الصوديوم والبوتاسيوم مع الماء",
    unit: "الوحدة الثانية: فلزات الأقلاء وتفاعلاتها",
    unitId: "u2",
    dangerLevel: "شديد الخطورة",
    apparatus: ["حوض زجاجي كبير", "ملقط معدني", "ورق ترشيح", "سكين حاد"],
    chemicals: ["ماء مقطر", "قطعة صوديوم Na", "قطعة بوتاسيوم K", "دليل الفينول فثالين"],
    equation: "2M(s) + 2H2O(l) ⟶ 2MOH(aq) + H2(g) + طاقة حرارية",
    steps: [
      { text: "ارتدِ النظارات الواقية والقفازات كإجراء وقائي هام.", chemicalChange: "تجهيز معدات السلامة الشخصية (الأمان أولاً).", animationState: "shield" },
      { text: "املأ الحوض الزجاجي بالماء المقطر وأضف قطرتين من دليل الفينول فثالين عديم اللون.", chemicalChange: "تحضير الوسط المائي للكشف عن القلوية.", animationState: "beaker_fill" },
      { text: "باستخدام الملقط والسكين، اقطع قطعة صغيرة جداً من فلز الصوديوم Na وجففها بورق الترشيح.", chemicalChange: "إزالة كيروسين الحفظ وتجهيز الفلز النشط.", animationState: "slice" },
      { text: "ضع قطعة الصوديوم بحذر في الحوض باستخدام الملقط وابتعد فوراً!", chemicalChange: "تنصهر قطعة الصوديوم وتتحرك بعنف على سطح الماء بلهب أصفر ساطع وفرقعات حادة.", animationState: "reaction_na" },
      { text: "لاحظ تغير لون المحلول في الحوض إلى اللون الوردي البنفسجي المميز.", chemicalChange: "تكون هيدروكسيد الصوديوم (NaOH) القلوي وتصاعد غاز الهيدروجين.", animationState: "pink_indicator" }
    ]
  },
  {
    id: "u2_l2",
    title: "كشف اللهب لفلزات الأقلاء (Flame Test)",
    unit: "الوحدة الثانية: فلزات الأقلاء وتفاعلاتها",
    unitId: "u2",
    dangerLevel: "متوسط",
    apparatus: ["سلك بلاتين رفيع للغاية", "موقد بنزين صامت غير مضيء", "حمض HCl لتنظيف السلك"],
    chemicals: ["ملح كلوريد الصوديوم NaCl", "ملح كلوريد البوتاسيوم KCl", "ملح كلوريد الليثيوم LiCl"],
    equation: "M⁺ + طاقة حرارية ⟶ M* (إثارة إلكترونية) ⟶ M + ضوء مميز (طيف انبعاث)",
    steps: [
      { text: "اغمس سلك البلاتين في حمض HCl المركز ثم ضعه على لهب بنزين الساخن لتنظيفه تماماً.", chemicalChange: "إزالة أي شوائب فلزية عالقة لضمان دقة ألوان الكشف.", animationState: "clean_wire" },
      { text: "اغمس السلك النظيف في ملح كلوريد الصوديوم NaCl، ثم قربه من لهب موقد بنزين.", chemicalChange: "تثور الإلكترونات وتعود لتبعث ضوءاً مميزاً بلون أصفر ذهبي ساطع وبراق.", animationState: "flame_na" },
      { text: "كرر خطوة غمس سلك البلاتين النظيف بملح كلوريد البوتاسيوم KCl وضعه على اللهب.", chemicalChange: "انبعاث طيف لوني ناصع بلون بنفسجي فاتح وهادئ يعكس بصمة عنصر البوتاسيوم.", animationState: "flame_k" },
      { text: "جرب كشف ملح كلوريد الليثيوم LiCl على لهب موقد بنزين الساخن.", chemicalChange: "اشتعال اللهب بلون قرمزي أحمر داكن وخلاب يبرز خواص ذرة الليثيوم.", animationState: "flame_li" }
    ]
  },

  // --- UNIT 3 ---
  {
    id: "u3_l1",
    title: "تحضير اليوريا لفوهلر (تخليق كيميائي عضوي)",
    unit: "الوحدة الثالثة: الكيمياء العضوية",
    unitId: "u3",
    dangerLevel: "متوسط",
    apparatus: ["دورق زجاجي حراري", "موقد تسخين هادئ", "أوراق ترشيح وقمع"],
    chemicals: ["محلول كلوريد الأمونيوم NH4Cl", "محلول سيانات الفضة AgCNO", "ماء مقطر"],
    equation: "NH4Cl (aq) + AgCNO (aq) ⟶ NH4CNO (aq) + AgCl (s)↓ ⟶ (heat) ⟶ CO(NH2)2 (يوريا)",
    steps: [
      { text: "امزج محلولي كلوريد الأمونيوم وسيانات الفضة في الدورق في حرارة الغرفة.", chemicalChange: "حدوث تفاعل تبادل مزدوج فوري، وتكون راسب أبيض كثيف من كلوريد الفضة AgCl ومحلول سيانات الأمونيوم.", animationState: "wohler_mix" },
      { text: "قم بترشيح الراسب الأبيض الكثيف AgCl للحصول على محلول سيانات الأمونيوم الصافي.", chemicalChange: "فصل المواد غير الذائبة لتنقية سيانات الأمونيوم.", animationState: "filter_wohler" },
      { text: "سخن محلول سيانات الأمونيوم الصافي تدريجياً وببطء على موقد التدفئة حتى يتبخر الماء.", chemicalChange: "تسبب الحرارة في إعادة ترتيب جزيئي للروابط داخل جزيء سيانات الأمونيوم غير الثابت.", animationState: "heat_wohler" },
      { text: "راقب تكون بلورات بيضاء نقية في قاع الدورق.", chemicalChange: "تكون مركب اليوريا (البولينة) العضوي بنجاح لتهدم نظرية القوة الحيوية لبرزيليوس للأبد.", animationState: "crystal_urea" }
    ]
  },
  {
    id: "u3_l2",
    title: "تطبيق قواعد التسمية المنهجية (IUPAC) وبناء متفرعات الكربون",
    unit: "الوحدة الثالثة: الكيمياء العضوية",
    unitId: "u3",
    dangerLevel: "منخفض",
    apparatus: ["مجموعات نمذجة الجزيئات ثلاثية الأبعاد", "شاشة الكاميرا الكيميائية الذكية"],
    chemicals: ["نماذج ذرات الكربون سوداء", "نماذج ذرات الهيدروجين بيضاء", "روابط تساهمية مرنة"],
    equation: "تطبيق التسمية: أطول سلسلة ⟶ ترقيم من الطرف الأقرب للتفرع ⟶ 2-ميثيل بنتان",
    steps: [
      { text: "قم ببناء سلسلة كربون رئيسية مستمرة مكونة من 5 ذرات كربون واعتبرها السلسلة الأم.", chemicalChange: "تحديد السلسلة الأم وهي البنتان (Pentane) لاحتوائها على 5 ذرات كربون.", animationState: "build_pentane" },
      { text: "أضف تفرعاً ألكيلياً (مجموعة ميثيل -CH3) على ذرة الكربون رقم 2 بدءاً بالترقيم من الطرف الأيمن الأقرب.", chemicalChange: "تطبيق قاعدة الترقيم من الطرف الذي يعطي المتفرع أصغر رقم (الرقم 2 وليس 4).", animationState: "iupac_naming" },
      { text: "أضف مجموعة ميثيل أخرى على ذرة الكربون رقم 4 ولاحظ استخدام السابقة (ثنائي).", chemicalChange: "تطبيق قاعدة تكرار المتفرع: تسمية المركب 2,4-ثنائي ميثيل بنتان وفق أمثلة كتاب الوزارة.", animationState: "iupac_di_methyl" }
    ]
  },
  {
    id: "u3_l3",
    title: "تصنيف الهيدروكربونات ومقارنة السلاسل المفتوحة والمغلقة",
    unit: "الوحدة الثالثة: الكيمياء العضوية",
    unitId: "u3",
    dangerLevel: "منخفض",
    apparatus: ["نماذج جزيئية تفاعلية", "كؤوس مقارنة للمركبات المتقابلة"],
    chemicals: ["غاز الإيثان C2H6", "غاز الإيثين C2H4", "غاز الإيثاين C2H2"],
    equation: "مركبات متقابلة تتساوى في ذرات الكربون (C2) وتختلف في نوع الروابط ودرجة الإشباع",
    steps: [
      { text: "افحص جزيئات الإيثان والإيثين والإيثاين؛ كمركبات متقابلة لتساويها في ذرتي كربون.", chemicalChange: "فحص مفهوم المركبات المتقابلة الوارد في كتاب كيمياء الثاني ثانوي ص 50.", animationState: "examine_homologous" },
      { text: "افحص الرابطة التساهمية الأحادية بين ذرتي كربون الإيثان (مشبع وخامل نسبياً).", chemicalChange: "الرابطة سيجما القوية يصعب كسرها في الألكانات المشبعة.", animationState: "examine_single_bond" },
      { text: "افحص الرابطة الثنائية في الإيثين (رابطة سيجما + رابطة باي ضعيفة سهلة الكسر).", chemicalChange: "وجود رابطة باي يمنح الألكينات نشاطاً كيميائياً فائقاً وقابلية لتفاعلات الإضافة.", animationState: "examine_double_bond" },
      { text: "اغلق سلسلة من 3 ذرات كربون لتكوين البروبان الحلقي المشبع.", chemicalChange: "التحول من سلسلة مفتوحة إلى سلسلة مغلقة حلقية C3H6 بزاوية 60 درجة متوترة.", animationState: "build_cyclopropane" }
    ]
  },
  {
    id: "u3_l4",
    title: "تحضير غاز الميثان معملياً بالتقطير الجاف",
    unit: "الوحدة الثالثة: الكيمياء العضوية",
    unitId: "u3",
    dangerLevel: "مرتفع",
    apparatus: ["أنبوبة من زجاج حراري صلب", "موقد بنزين شديد اللهب", "حوض ماء مقعر ومخبار تجميع"],
    chemicals: ["خلات الصوديوم اللامائية CH3COONa", "الجير الصودي (مزيج من الصودا الكاوية NaOH والجير الحي CaO)"],
    equation: "CH3COONa (s) + NaOH (s) ⟶ (heat/CaO) ⟶ Na2CO3 (s) + CH4 (g)↑",
    steps: [
      { text: "اخلط خلات الصوديوم اللامائية الجافة جيداً مع الجير الصودي الصلب وضعهما في أنبوبة التفاعل.", chemicalChange: "تحضير المواد المتفاعلة. الجير الحي CaO يقلل درجة انصهار الخليط ويمنع تأكل الزجاج.", animationState: "prep_methane" },
      { text: "ثبت الأنبوبة أفقياً وصلها بالأنبوب الممتد إلى مخبار مقلوب مليء بالماء ومغمور في حوض الماء.", chemicalChange: "تجهيز جهاز لجمع الميثان بإزاحة الماء لأسفل لعدم ذوبانه.", animationState: "setup_methane" },
      { text: "سخن أنبوبة التفاعل بحذر وقوة باستخدام موقد بنزين.", chemicalChange: "تفاعل جاف قوي يؤدي لكسر الرابطة بين الكربون والصوديوم وانطلاق الميثان CH4 الغازي وتكون كربونات الصوديوم.", animationState: "heat_methane" },
      { text: "راقب تصاعد الفقاعات وتراكم غاز الميثان في أعلى المخبار، ثم اقترب بلهب لتشاهد تفاعله مع الهواء.", chemicalChange: "تجمع غاز الميثان واحتراقه بلهب أزرق باهت نظيف غير مدخن لتكون CO2 وبخار ماء وطاقة حرارية.", animationState: "burn_methane" }
    ]
  },
  {
    id: "u3_l5",
    title: "اختبار ماء البروم الأحمر للكشف عن عدم التشبع في الإيثين",
    unit: "الوحدة الثالثة: الكيمياء العضوية",
    unitId: "u3",
    dangerLevel: "متوسط",
    apparatus: ["أنبوبتا اختبار", "حامل أنابيب", "قطارة زجاجية"],
    chemicals: ["غاز الإيثان C2H6", "غاز الإيثين C2H4", "ماء البروم الأحمر Br2/H2O"],
    equation: "CH2=CH2 + Br2 ⟶ CH2Br-CH2Br (1,2-ثنائي برومو إيثان عديم اللون)",
    steps: [
      { text: "املأ الأنبوبة الأولى بغاز الإيثان (ألكان مشبع) والأنبوبة الثانية بغاز الإيثين (ألكين غير مشبع).", chemicalChange: "تحضير الهيدروكربونات المراد اختبار تفاعلها.", animationState: "tubes_fill" },
      { text: "باستخدام القطارة، أضف 3 قطرات من ماء البروم الأحمر ذي اللون البرتقالي المميز إلى أنبوبة الإيثان ورج جيداً.", chemicalChange: "البروم لا يتفاعل مع الألكان المشبع في غياب الضوء، ويبقى لون الأنبوبة أحمراً.", animationState: "bromine_ethane" },
      { text: "الآن، أضف 3 قطرات من ماء البروم الأحمر إلى أنبوبة غاز الإيثين ورج جيداً.", chemicalChange: "تفاعل إضافة فوري فائق السرعة يتم فيه كسر الرابطة الثنائية باي الضعيفة للإيثين.", animationState: "bromine_ethene" },
      { text: "لاحظ زوال اللون الأحمر لماء البروم فوراً في أنبوبة الإيثين وتحوله إلى محلول عديم اللون.", chemicalChange: "تكون مركب 1,2-ثنائي برومو إيثان المشبع عديم اللون كدليل قاطع على عدم التشبع.", animationState: "bromine_fade" }
    ]
  },
  {
    id: "u3_l6",
    title: "تحضير غاز الإيثاين بتنقيط الماء على كربيد الكالسيوم",
    unit: "الوحدة الثالثة: الكيمياء العضوية",
    unitId: "u3",
    dangerLevel: "مرتفع",
    apparatus: ["دورق تحضير مخروطي", "قمع صنبوري للتنقيط", "حوض ماء ومخبار"],
    chemicals: ["قطع كاربيد الكالسيوم الصلب CaC2", "ماء مقطر", "محلول كبريتات نحاس محمضة"],
    equation: "CaC2 (s) + 2H2O (l) ⟶ Ca(OH)2 (s) + C2H2 (g)↑ + طاقة حرارية",
    steps: [
      { text: "ضع قطعاً صلبة رمادية من كاربيد الكالسيوم في الدورق المخروطي الجاف.", chemicalChange: "تجهيز الملح المتفاعل مع الماء.", animationState: "prep_carbide" },
      { text: "افتح صنبور قمع التنقيط لينزل الماء قطرة قطرة على الكاربيد بشكل هادئ.", chemicalChange: "تفاعل طارد جداً للحرارة وفوران شديد وتصاعد فوري لغاز الإيثاين الأستلين C2H2 الكريه الرائحة لوجود شوائب.", animationState: "drip_water" },
      { text: "مرر الغاز المتصاعد عبر محلول كبريتات النحاس المحمضة بحمض الكبريتيك.", chemicalChange: "إزالة شوائب الفوسفين وغاز كبريتيد الهيدروجين والحصول على أستلين نقي.", animationState: "purify_ethyne" },
      { text: "اجمع الغاز في مخبار مقلوب بالماء وقربه من لهب موقد.", chemicalChange: "تجمع غاز الإيثاين واحتراقه في الهواء بلهب مدخن جداً، وعند خلطه بالأكسجين يحترق بلهب الأكسي-أستلين البالغ الحرارة (3000°C).", animationState: "burn_ethyne" }
    ]
  },
  {
    id: "u3_l7",
    title: "ثبات رنين البنزين ومقارنة شد الرابطة للبروبان الحلقي",
    unit: "الوحدة الثالثة: الكيمياء العضوية",
    unitId: "u3",
    dangerLevel: "متوسط",
    apparatus: ["أنبوبتا اختبار", "حامل", "قطارة دقيقة"],
    chemicals: ["بنزين عطري نقي C6H6", "سائل هكسين غير مشبع C6H12", "محلول برمنجنات البوتاسيوم البنفسجي KMnO4"],
    equation: "C6H12 + KMnO4 ⟶ زوال اللون (تأكسد) vs C6H6 + KMnO4 ⟶ لا يوجد تفاعل (ثبات الرنين)",
    steps: [
      { text: "ضع الهكسين في الأنبوبة الأولى والبنزين العطري في الأنبوبة الثانية.", chemicalChange: "تحضير السوائل لمقارنة قابلية الأكسدة الكيميائية.", animationState: "prep_benzene_test" },
      { text: "أضف قطرات من برمنجنات البوتاسيوم البنفسجية المؤكسدة لـ الهكسين ورج بقوة.", chemicalChange: "يتأكسد الهكسين وتتكسر الرابطة باي ويزول اللون البنفسجي فوراً مكوناً جليكول.", animationState: "oxidize_hexene" },
      { text: "الآن أضف برمنجنات البوتاسيوم البنفسجية لـ البنزين العطري ورج بقوة.", chemicalChange: "لا يحدث أي تفاعل ويبقى اللون البنفسجي راسخاً تماماً مما يدل على الثبات الخارق لحلقة رنين البنزين ضد عوامل الأكسدة.", animationState: "benzene_stable" }
    ]
  },
  {
    id: "u3_l8",
    title: "التماكب السلسلي: متماكبات C5H12 والتمييز بين مركبي C3H6",
    unit: "الوحدة الثالثة: الكيمياء العضوية",
    unitId: "u3",
    dangerLevel: "متوسط",
    apparatus: ["أنبوبتا اختبار", "حامل أنابيب", "قطارة دقيقة", "نماذج كربون وهيدروجين"],
    chemicals: ["البروبين C3H6 (ألكين غير مشبع)", "البروبان الحلقي C3H6 (ألكان حلقي مشبع)", "ماء البروم الأحمر Br2/H2O"],
    equation: "CH2=CH-CH3 + Br2 ⟶ CH2Br-CHBr-CH3 (يزول اللون) vs البروبان الحلقي + Br2 ⟶ لا تفاعل في الظلام (يثبت اللون)",
    steps: [
      { text: "افحص الهيكل البنائي لمتماكبات البنتان الثلاثة: البنتان العادي، 2-ميثيل بيوتان، و2,2-ثنائي ميثيل بروبان.", chemicalChange: "توضيح التماكب السلسلي: نفس الصيغة الجزيئية C5H12 واختلاف هيكل السلسلة مستقيمة ومتفرعة.", animationState: "pentane_isomers_view" },
      { text: "جهز أنبوبتين تحتويان على متماكبين للصيغة C3H6 (أنبوبة البروبين وأنبوبة البروبان الحلقي) وفق تمرين ص 68 بكتاب الوزارة.", chemicalChange: "مركبان لهما نفس الصيغة الجزيئية C3H6 أحدهما مفتوح السلسلة ذو رابطة ثنائية والآخر حلقي مشبع.", animationState: "prep_c3h6_tubes" },
      { text: "أضف قطرات من ماء البروم الأحمر إلى أنبوبة البروبين ورج جيداً.", chemicalChange: "يتفاعل البروبين فوراً بالإضافة كاسراً الرابطة الثنائية ويزول اللون الأحمر لماء البروم كلياً.", animationState: "bromine_propene_fade" },
      { text: "أضف قطرات من ماء البروم الأحمر إلى أنبوبة البروبان الحلقي ورج في الظلام.", chemicalChange: "البروبان الحلقي ألكان مشبع فلا يتفاعل مع ماء البروم في الظلام ويبقى اللون الأحمر ثابتاً، مما يثبت التمييز العملي بينهما.", animationState: "cyclopropane_bromine_stable" }
    ]
  },

  // --- UNIT 4 ---
  {
    id: "u4_l1",
    title: "ظاهرة التأصل ومقارنة الفوسفور الأبيض والأحمر",
    unit: "الوحدة الرابعة: النيتروجين والمجموعة الخامسة",
    unitId: "u4",
    dangerLevel: "شديد الخطورة",
    apparatus: ["ملعقة احتراق طويلة", "ملقط أمان معدني", "موقد بنزين", "حوض ماء لحفظ الفوسفور"],
    chemicals: ["فوسفور أحمر صلب", "فوسفور أبيض نشط (محفوظ تحت الماء لتفادي اشتعاله تلقائياً)"],
    equation: "P4 (s) + 5O2 (g) ⟶ P4O10 (s) (احتراق تلقائي في الهواء عند 30°C)",
    steps: [
      { text: "أخرج بلطف قطعة صغيرة من الفوسفور الأحمر الصلب وضعه على ملعقة الاحتراق وقربه من اللهب لتسخينه.", chemicalChange: "يشتعل الفوسفور الأحمر ببطء وبحرارة عالية (240 درجة مئوية) مطلقاً أبخرة كثيفة.", animationState: "burn_red_p" },
      { text: "بحذر شديد باستخدام الملقط، أخرج قطعة صغيرة من الفوسفور الأبيض المحفوظ تحت الماء وجففها تماماً.", chemicalChange: "تحضير المتآصل غير المستقر والنشط جداً.", animationState: "dry_white_p" },
      { text: "اترك قطعة الفوسفور الأبيض الجافة معرضة لأكسجين الهواء عند درجة حرارة الغرفة (30 درجة مئوية).", chemicalChange: "تشتعل قطعة الفوسفور الأبيض تلقائياً في الهواء بوميض أصفر مبهر مسببة حرائق شديدة لضعف وتوتر روابطه التساهمية.", animationState: "auto_burn_white_p" }
    ]
  },
  {
    id: "u4_l2",
    title: "تحضير غاز النيتروجين في المختبر معملياً",
    unit: "الوحدة الرابعة: النيتروجين والمجموعة الخامسة",
    unitId: "u4",
    dangerLevel: "متوسط",
    apparatus: ["دورق تسخين زجاجي", "موقد بنزين", "أنبوب توصيل", "حوض ماء مقعر", "مخبار تجميع"],
    chemicals: ["كلوريد الأمونيوم الصلب NH4Cl", "نتريت الصوديوم NaNO2", "ماء مقطر"],
    equation: "NH4Cl + NaNO2 ⟶ NaCl + N2↑ + 2H2O (بالتسخين الهين لنتريت الأمونيوم)",
    steps: [
      { text: "ضع خليطاً متساوياً من ملح كلوريد الأمونيوم ونتريت الصوديوم مع قليل من الماء في دورق التسخين.", chemicalChange: "تكون ملح نتريت الأمونيوم (NH4NO2) غير الثابت في المحلول لتلافي تفرقع الملح الصلب.", animationState: "setup_flask" },
      { text: "صل دورق التحضير بأنبوب توصيل يمتد إلى حوض الماء المنكس فيه مخبار التجميع المليء بالماء.", chemicalChange: "إعداد جهاز جمع الغاز بالإزاحة السفلية للماء لقلة ذوبانه.", animationState: "apparatus_connect" },
      { text: "سخن دورق التفاعل تسخيناً هيناً ولطيفاً باستخدام موقد بنزين.", chemicalChange: "انحلال ملح نتريت الأمونيوم حرارياً ببطء وانطلاق غاز النيتروجين وبخار الماء.", animationState: "heat_nitrogen" },
      { text: "راقب تصاعد فقاعات غاز النيتروجين وتجمعها في أعلى المخبار منكسة الماء لأسفل.", chemicalChange: "تجمع غاز النيتروجين N2 النقي عديم اللون والرائحة بإزاحة الماء لأسفل بنجاح.", animationState: "nitrogen_collect" }
    ]
  },
  {
    id: "u4_l3",
    title: "تجربة نافورة النشادر (الأمونيا) الملونة",
    unit: "الوحدة الرابعة: النيتروجين والمجموعة الخامسة",
    unitId: "u4",
    dangerLevel: "مرتفع",
    apparatus: ["دورق مستدير جاف", "سدادة ذات ثقبين مع أنبوب مستدق", "حقنة حقن ماء", "حوض مائي سفلي"],
    chemicals: ["غاز الأمونيا الجاف NH3", "ماء مقطر", "دليل تباع الشمس الأحمر"],
    equation: "NH3 (g) + H2O (l) ⇌ NH4⁺ (aq) + OH⁻ (aq) (تفاعل هيدروكسيلي قلوي فائق الذوبان)",
    steps: [
      { text: "املأ الدورق المستدير العلوي تماماً بغاز النشادر NH3 الجاف وركبه مقلوباً بشكل آمن.", chemicalChange: "تحضير غاز الأمونيا عالي القلوية والذوبانية.", animationState: "prep_ammonia_flask" },
      { text: "اغمر الأنبوب الزجاجي المستدق الممتد من الدورق في حوض الماء السفلي المضاف إليه دليل تباع الشمس الأحمر.", chemicalChange: "تجهيز وسط الكشف الحمضي/القلوي.", animationState: "prep_fountain_basin" },
      { text: "باستخدام حقنة الضغط الجانبية، احقن بضع قطرات من الماء داخل الدورق العلوي.", chemicalChange: "بسبب ذوبانية غاز النشادر الهائلة الخارقة في الماء، يذوب الغاز بداخل القطرات فوراً محدثاً انخفاضاً وخلخلة هائلة في الضغط.", animationState: "inject_water" },
      { text: "راقب اندفاع الماء بقوة من الحوض السفلي إلى الدورق العلوي.", chemicalChange: "يتصاعد الماء ليكون نافورة نافذة ومبهرة باللون الأزرق داخل الدورق لقلوية الأمونيا العالية وتصاعد تركيز أيونات الهيدروكسيد.", animationState: "fountain_blue" }
    ]
  },
  {
    id: "u4_l4",
    title: "الكشف والتحليل الكيميائي لسماد كبريتات الأمونيوم",
    unit: "الوحدة الرابعة: النيتروجين والمجموعة الخامسة",
    unitId: "u4",
    dangerLevel: "متوسط",
    apparatus: ["أنابيب اختبار زجاجية", "موقد تسخين", "ورق كاشف رطب"],
    chemicals: ["كبريتات الأمونيوم (سماد النيتروجين)", "محلول هيدروكسيد الصوديوم NaOH", "محلول كلوريد الباريوم BaCl2"],
    equation: "(NH4)2SO4 + 2NaOH ⟶ Na2SO4 + 2NH3↑ (أمونيا) + 2H2O • SO4²⁻ + Ba²⁺ ⟶ BaSO4↓ (راسب أبيض)",
    steps: [
      { text: "أذب القليل من حبيبات السماد (كبريتات الأمونيوم) في الماء المقطر لتحصل على محلول واضح.", chemicalChange: "تفكك جزيئات السماد إلى أيونات أمونيوم وكبريتات.", animationState: "dissolve_fertilizer" },
      { text: "أضف هيدروكسيد الصوديوم NaOH إلى المحلول وسخنه بلطف على الموقد.", chemicalChange: "تفاعل يطرد غاز النشادر NH3 ذو الرائحة النفاذة المخرشة.", animationState: "heat_fertilizer_nh3" },
      { text: "ضع ورقة كاشف مبللة بالماء فوق فوهة الأنبوبة لمراقبة تغير الألوان.", chemicalChange: "تحول الكاشف للأزرق بتأثير تصاعد غاز النشادر القلوي النشط.", animationState: "indicator_blue_fertilizer" },
      { text: "أضف محلول كلوريد الباريوم BaCl2 في أنبوبة اختبار أخرى لعينة السماد.", chemicalChange: "تكون راسب أبيض ناصع لا يذوب في حمض الهيدروكلوريك المخفف وهو كبريتات الباريوم BaSO4 كدليل على وجود الكبريتات بالسماد.", animationState: "precipitate_baso4" }
    ]
  },

  // --- UNIT 5 ---
  {
    id: "u5_l1",
    title: "تفاعلات إزاحة الهالوجينات النشطة من أملاحها",
    unit: "الوحدة الخامسة: عائلة الهالوجينات وصناع الأملاح",
    unitId: "u5",
    dangerLevel: "متوسط",
    apparatus: ["أنابيب اختبار صلبة", "مذيب عضوي قطبي (رابع كلوريد الكربون CCl4)"],
    chemicals: ["محلول بروميد البوتاسيوم KBr (عديم اللون)", "محلول يوديد البوتاسيوم KI (عديم اللون)", "ماء الكلور الأصفر Cl2(aq)", "ماء البروم البرتقالي Br2(aq)"],
    equation: "Cl2 (aq) + 2KBr (aq) ⟶ 2KCl (aq) + Br2 (l) (الكلور يزيح البروم)",
    steps: [
      { text: "صب محلول بروميد البوتاسيوم KBr عديم اللون في الأنبوبة الأولى ومحلول يوديد البوتاسيوم KI في الثانية.", chemicalChange: "تحضير أملاح هالوجينية لمقارنة الإزاحة الكيميائية.", animationState: "prep_halides" },
      { text: "أضف قطرات من ماء الكلور الأصفر الشاحب النشط إلى أنبوبة بروميد البوتاسيوم.", chemicalChange: "الكلور الأكثر نشاطاً يهاجم أيونات البروميد ويزيحها، ليتحول المحلول للون البرتقالي المحمر بفعل تكون البروم الحر.", animationState: "displace_bromine" },
      { text: "أضف بضع قطرات من المذيب العضوي CCl4 ورج الأنبوبة جيداً.", chemicalChange: "انفصال طبقة برتقالية غامقة خلابة في الأسفل تتركز فيها جزيئات البروم الذائبة عضوياً.", animationState: "layer_bromine" },
      { text: "الآن، أضف ماء البروم البرتقالي إلى أنبوبة يوديد البوتاسيوم KI وراقب النتيجة.", chemicalChange: "البروم يزيح اليود الأقل نشاطاً من ملحه، ليتحول المحلول للون البني البنفسجي لليود الحر، وينفصل كطبقة بنفسجية مميزة تحت CCl4.", animationState: "displace_iodine" }
    ]
  },
  {
    id: "u5_l2",
    title: "تحضير غاز الكلور معملياً من أكسدة HCl",
    unit: "الوحدة الخامسة: عائلة الهالوجينات وصناع الأملاح",
    unitId: "u5",
    dangerLevel: "مرتفع",
    apparatus: ["دورق تحضير دائري بقمع ذو صنبور", "أنابيب غسيل وتجفيف", "مخبار جمع الغاز للأعلى", "دولاب أبخرة"],
    chemicals: ["مسحوق ثاني أكسيد المنجنيز الأسود MnO2", "حمض الهيدروكلوريك HCl مركز", "حمض الكبريتيك المركز H2SO4"],
    equation: "MnO2 (s) + 4HCl (aq) ⟶ MnCl2 (aq) + Cl2 (g)↑ + 2H2O (l)",
    steps: [
      { text: "ضع كمية من مسحوق ثاني أكسيد المنجنيز الأسود (عامل مؤكسد قوي) في دورق التفاعل.", chemicalChange: "تجهيز العامل المؤكسد للبدء في انتزاع الإلكترونات من الكلوريد.", animationState: "prep_mno2" },
      { text: "صب حمض HCl المركز عبر القمع ببطء وسخن الدورق تسخيناً هيناً.", chemicalChange: "تفاعل أكسدة واختزال عنيف ينتج عنه تصاعد غاز الكلور الأخضر المصفر والسام وتكون كلوريد المنجنيز الثنائي.", animationState: "heat_chlorine_prep" },
      { text: "مرر الغاز المتصاعد عبر زجاجة غسيل تحتوي على ماء ثم عبر زجاجة حمض الكبريتيك المركز.", chemicalChange: "الماء يمتص غاز HCl المتطاير، وحمض الكبريتيك يمتص بخار الماء للحصول على كلور جاف تماماً.", animationState: "dry_chlorine" },
      { text: "اجمع الغاز في مخبار جاف بإزاحة الهواء للأعلى.", chemicalChange: "تراكم غاز الكلور Cl2 الأخضر المصفر السام والخانق في المخبار لكونه أثقل من الهواء بمقدار مرتين ونصف.", animationState: "collect_chlorine" }
    ]
  },
  {
    id: "u5_l3",
    title: "أثر غاز الكلور الرطب في قصر الألوان وتبييضها",
    unit: "الوحدة الخامسة: عائلة الهالوجينات وصناع الأملاح",
    unitId: "u5",
    dangerLevel: "متوسط",
    apparatus: ["مخبران لغاز الكلور الجاف", "ملقط معملي طويل", "بتلات أزهار ملونة", "أوراق تباع شمس حمراء جافة"],
    chemicals: ["غاز الكلور الجاف Cl2", "ماء مقطر"],
    equation: "Cl2 + H2O ⇌ HCl + HClO ⟶ HCl + [O] (الأكسجين الذري النشط يقصر الأصباغ)",
    steps: [
      { text: "أدخل ورقة تباع الشمس الحمراء الجافة تماماً بملقط في المخبار الأول المحتوي على كلور جاف.", chemicalChange: "لا يحدث أي تغير مطلقاً في لون الورقة لتأكيد خلو الوسط من الماء.", animationState: "dry_chlorine_paper" },
      { text: "بلل ورقة تباع شمس حمراء أخرى بالماء المقطر وأدخلها في المخبار الثاني.", chemicalChange: "يتفاعل الكلور مع الماء لينتج حمض الهيبوكلوروز HClO غير الثابت.", animationState: "moist_chlorine_paper" },
      { text: "راقب بدقة زوال اللون الأحمر لتباع الشمس وتحوله الفوري للأبيض الناصع.", chemicalChange: "يتفكك حمض HClO مطلقاً الأكسجين الذري الوليد [O] وهو عامل مؤكسد خارق يقوم بقصر وصباغة وتبييض المواد العضوية والألوان تماماً.", animationState: "bleach_active" }
    ]
  },

  // --- UNIT 6 ---
  {
    id: "u6_l1",
    title: "مقارنة الخواص المغناطيسية وألوان العناصر الانتقالية",
    unit: "الوحدة السادسة: كيمياء العناصر الانتقالية",
    unitId: "u6",
    dangerLevel: "منخفض",
    apparatus: ["ميزان غوي الحساس (Gouy Balance)", "مغناطيس كهربائي جبار قابل للتشغيل والإنهاء"],
    chemicals: ["كبريتات الحديد الثنائية الخضراء FeSO4", "كبريتات النحاس المائية الزرقاء CuSO4", "مسحوق كلوريد الزنك الأبيض ZnCl2"],
    equation: "Paramagnetic (Fe²⁺: 3d⁶, CuSO4: 3d⁹) vs Diamagnetic (Zn²⁺: 3d¹⁰)",
    steps: [
      { text: "علق أنبوبة كبريتات الحديد الخضراء FeSO4 بين قطبي المغناطيس الكهربائي وهو مطفأ وقم بوزنها بدقة.", chemicalChange: "وزن العينة في الظروف العادية.", animationState: "weigh_fe" },
      { text: "قم بتشغيل المغناطيس الكهربائي وراقب مؤشر الميزان الحساس.", chemicalChange: "ينجذب مركب الحديد بقوة للأسفل نحو المغناطيس ويزداد وزنه الظاهري دلالة على الخاصية البارامغناطيسية العالية الناتجة عن 4 إلكترونات مفردة في مدارات d.", animationState: "magnet_attract_fe" },
      { text: "استبدل عينة الحديد بمسحوق كبريتات النحاس CuSO4 الزرقاء وشغل المغناطيس.", chemicalChange: "تنجذب العينة بشكل أقل لوجود إلكترون واحد فقط مفرد، ويبرز لونها الأزرق نتيجة لامتصاص طيف الضوء الأحمر وترقية إلكتروناتها.", animationState: "magnet_attract_cu" },
      { text: "اختبر الآن مسحوق كلوريد الزنك ZnCl2 الأبيض تحت المغناطيس القوي.", chemicalChange: "تتنافر العينة بشكل ضئيل وخفيف مع المغناطيس (خاصية دايامغناطيسية) ومظهرها أبيض لامتلاء المدار d تماماً بـ 10 إلكترونات مستقرة تمنع ترقية الطاقة الطيفية.", animationState: "zinc_diamagnetic" }
    ]
  },
  {
    id: "u6_l2",
    title: "قوة الماء الملكي (Aqua Regia) في إذابة الذهب",
    unit: "الوحدة السادسة: كيمياء العناصر الانتقالية",
    unitId: "u6",
    dangerLevel: "مرتفع",
    apparatus: ["كأس زجاجي حراري", "ساق زجاجية للتحريك", "دولاب الأبخرة"],
    chemicals: ["سبيكة ذهب نقي Au", "حمض الهيدروكلوريك HCl مركز", "حمض النيتريك HNO3 مركز"],
    equation: "Au(s) + HNO3(aq) + 3HCl(aq) ⟶ AuCl3(aq) + NO(g) + 2H2O(l)",
    steps: [
      { text: "شغل دولاب الأبخرة لحماية المختبر من انبعاث الغازات الخانقة والسامة.", chemicalChange: "تحضير معمل الأمان الكيميائي.", animationState: "shield" },
      { text: "ضع قطعة الذهب النقي داخل الكأس الزجاجي ثم صب فوقها حمض HCl المركز بمفرده.", chemicalChange: "الذهب لا يتفاعل مع حمض الهيدروكلوريك مطلقاً، ويبقى بريق الذهب كما هو.", animationState: "gold_hcl" },
      { text: "أضف حمض النيتريك المركز بمفرده إلى كأس ذهب آخر للتجربة.", chemicalChange: "لا يذوب الذهب ولا يحدث تفاعل مع حمض النيتريك بمفرده لثبات الذهب النبيل.", animationState: "gold_hno3" },
      { text: "الآن، امزج حمض HCl المركز وحمض HNO3 المركز بنسبة حجمية دقيقة 3 : 1 لإنتاج الماء الملكي الجبار.", chemicalChange: "تفاعل الحمضين المركبين يطلق غاز الكلور النشط وكلوريد النيتروسيل الفعالين.", animationState: "mix_aqua" },
      { text: "صب الماء الملكي فوق سبيكة الذهب وراقب التفاعل المبهر.", chemicalChange: "الكلور النشط يهاجم الذهب بضراوة ويذوبه تماماً متحولاً لمحلول حمض الكلوروأوريك الذهبي.", animationState: "gold_melt" }
    ]
  }
];

interface VirtualLabProps {
  selectedExperimentId?: string | null;
  setSelectedExperimentId?: (id: string | null) => void;
  completedLabs?: string[];
  onLabComplete?: (labId: string) => void;
}

export const VirtualLab: React.FC<VirtualLabProps> = ({
  selectedExperimentId,
  setSelectedExperimentId,
  completedLabs = [],
  onLabComplete
}) => {
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>("all");
  const [selectedExp, setSelectedExp] = useState<Experiment>(experiments[3]); // Default to alkali reaction
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // Simulation visual states
  const [beakerWaterColor, setBeakerWaterColor] = useState<string>("bg-blue-200/30");
  const [bubbleActive, setBubbleActive] = useState<boolean>(false);
  const [fizzleType, setFizzleType] = useState<string>("idle");
  const [chamberStatus, setChamberStatus] = useState<string>("خامل");
  const [showPeriodicTable, setShowPeriodicTable] = useState<boolean>(false);
  
  // Automatically select incoming experiment if passed from external syllabus click
  useEffect(() => {
    if (selectedExperimentId) {
      const matched = experiments.find((exp) => exp.id === selectedExperimentId);
      if (matched) {
        setSelectedExp(matched);
        setSelectedUnitFilter(matched.unitId);
        setCurrentStep(0);
        setIsCompleted(false);
        resetSimulationStates(matched.id);
        applyStepAnimation(matched.id, 0);
      }
      // Reset after handling
      if (setSelectedExperimentId) {
        setSelectedExperimentId(null);
      }
    }
  }, [selectedExperimentId]);

  const resetSimulationStates = (expId: string) => {
    setBeakerWaterColor("bg-blue-200/30");
    setBubbleActive(false);
    setFizzleType("idle");
    setChamberStatus("خامل ومستقر");
  };

  const selectExperiment = (exp: Experiment) => {
    setSelectedExp(exp);
    setCurrentStep(0);
    setIsCompleted(false);
    resetSimulationStates(exp.id);
    applyStepAnimation(exp.id, 0);
  };

  const handleNextStep = () => {
    if (currentStep < selectedExp.steps.length - 1) {
      const nextStepIdx = currentStep + 1;
      setCurrentStep(nextStepIdx);
      applyStepAnimation(selectedExp.id, nextStepIdx);
    } else {
      setIsCompleted(true);
      setChamberStatus("اكتمل التفاعل بنجاح!");
      if (onLabComplete) {
        onLabComplete(selectedExp.id);
      }
    }
  };

  const applyStepAnimation = (expId: string, stepIdx: number) => {
    // Highly interactive visual logic for 21 lessons
    switch (expId) {
      // Unit 1
      case "u1_l1":
        if (stepIdx === 1) setBeakerWaterColor("bg-emerald-200/30");
        if (stepIdx === 2) setFizzleType("calculating");
        if (stepIdx === 3) setBeakerWaterColor("bg-amber-100/40");
        break;
      case "u1_l2":
        if (stepIdx === 0) setBeakerWaterColor("bg-blue-300/40");
        if (stepIdx === 1) setBeakerWaterColor("bg-slate-300/40");
        if (stepIdx === 2) setBeakerWaterColor("bg-cyan-500/50");
        if (stepIdx === 3) setBeakerWaterColor("bg-purple-400/50");
        break;
      case "u1_l3":
        if (stepIdx === 1) {
          setBeakerWaterColor("bg-pink-100/40");
          setFizzleType("bubbling");
          setBubbleActive(true);
        }
        if (stepIdx === 2) {
          setFizzleType("idle");
          setBubbleActive(false);
        }
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-fuchsia-200/40");
          setBubbleActive(true);
          setFizzleType("heat_active");
        }
        break;

      // Unit 2
      case "u2_l1":
        if (stepIdx <= 2) {
          setBeakerWaterColor("bg-slate-100/10");
          setBubbleActive(false);
          setFizzleType("idle");
        }
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-pink-400/60");
          setBubbleActive(true);
          setFizzleType("violent_fizz");
          setChamberStatus("اشتعال الصوديوم وتصاعد الهيدروجين وتلون المحلول بالوردي!");
        }
        if (stepIdx === 4) {
          setBeakerWaterColor("bg-fuchsia-400/70");
          setBubbleActive(false);
          setFizzleType("finished");
          setChamberStatus("تكون محلول NaOH قلوي واستقرار اللون الوردي");
        }
        break;
      case "u2_l2":
        if (stepIdx === 1) {
          setBeakerWaterColor("bg-amber-400/80");
          setFizzleType("flame_yellow");
          setChamberStatus("لهب الصوديوم الأصفر الساطع");
        }
        if (stepIdx === 2) {
          setBeakerWaterColor("bg-purple-300/80");
          setFizzleType("flame_purple");
          setChamberStatus("لهب البوتاسيوم البنفسجي");
        }
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-red-500/80");
          setFizzleType("flame_crimson");
          setChamberStatus("لهب الليثيوم القرمزي");
        }
        break;

      // Unit 3
      case "u3_l1":
        if (stepIdx === 1) setBeakerWaterColor("bg-slate-100/80");
        if (stepIdx === 2) {
          setBeakerWaterColor("bg-slate-200/40");
          setFizzleType("heating");
        }
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-yellow-50/30");
          setFizzleType("crystals");
        }
        break;
      case "u3_l2":
        if (stepIdx === 0) {
          setBeakerWaterColor("bg-slate-800/20");
          setFizzleType("build_pentane");
        }
        if (stepIdx === 1) {
          setBeakerWaterColor("bg-orange-600/20");
          setFizzleType("iupac_naming");
        }
        if (stepIdx === 2) {
          setBeakerWaterColor("bg-amber-600/20");
          setFizzleType("iupac_di_methyl");
        }
        break;
      case "u3_l3":
        if (stepIdx === 0) setBeakerWaterColor("bg-indigo-50/20");
        if (stepIdx === 1) setFizzleType("single_bond");
        if (stepIdx === 2) setFizzleType("double_bond");
        if (stepIdx === 3) setFizzleType("cyclopropane");
        break;
      case "u3_l4":
        if (stepIdx === 1) setBeakerWaterColor("bg-indigo-50/20");
        if (stepIdx === 2) {
          setBubbleActive(true);
          setFizzleType("gas_release");
        }
        if (stepIdx === 3) {
          setFizzleType("flame_methane");
          setBeakerWaterColor("bg-sky-200/40");
        }
        break;
      case "u3_l5":
        if (stepIdx === 1) setBeakerWaterColor("bg-amber-600/30");
        if (stepIdx === 2) setFizzleType("adding_drops");
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-slate-100/10");
          setFizzleType("finished");
        }
        break;
      case "u3_l6":
        if (stepIdx === 1) {
          setBeakerWaterColor("bg-emerald-100/30");
          setBubbleActive(true);
          setFizzleType("violent_fizz");
        }
        if (stepIdx === 3) {
          setFizzleType("flame_heavy_smoke");
        }
        break;
      case "u3_l7":
        if (stepIdx === 1) {
          setBeakerWaterColor("bg-purple-600/50");
        }
        if (stepIdx === 2) {
          setBeakerWaterColor("bg-purple-600/60");
          setFizzleType("no_reaction");
        }
        break;
      case "u3_l8":
        if (stepIdx === 0) setBeakerWaterColor("bg-slate-100/20");
        if (stepIdx === 1) setBeakerWaterColor("bg-amber-600/30");
        if (stepIdx === 2) {
          setBeakerWaterColor("bg-blue-50/10");
          setFizzleType("propene_fade");
        }
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-amber-600/60");
          setFizzleType("cyclopropane_stable");
        }
        break;

      // Unit 4
      case "u4_l1":
        if (stepIdx === 0) setFizzleType("red_p_burn");
        if (stepIdx === 2) {
          setFizzleType("white_p_spontaneous");
          setBeakerWaterColor("bg-yellow-400/50");
        }
        break;
      case "u4_l2":
        if (stepIdx === 1) setBeakerWaterColor("bg-sky-100/30");
        if (stepIdx === 2) {
          setBubbleActive(true);
          setFizzleType("gas_release");
        }
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-sky-50/10");
          setBubbleActive(false);
        }
        break;
      case "u4_l3":
        if (stepIdx === 1) setBeakerWaterColor("bg-rose-500/50");
        if (stepIdx === 2) setFizzleType("injecting");
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-blue-600/80");
          setFizzleType("fountain_active");
        }
        break;
      case "u4_l4":
        if (stepIdx === 1) {
          setBeakerWaterColor("bg-yellow-100/40");
          setBubbleActive(true);
        }
        if (stepIdx === 2) setBeakerWaterColor("bg-blue-100/40");
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-slate-100/90");
          setFizzleType("white_precipitate");
          setBubbleActive(false);
        }
        break;

      // Unit 5
      case "u5_l1":
        if (stepIdx === 1) setBeakerWaterColor("bg-orange-400/40");
        if (stepIdx === 2) setBeakerWaterColor("bg-orange-600/80");
        if (stepIdx === 3) setBeakerWaterColor("bg-purple-800/80");
        break;
      case "u5_l2":
        if (stepIdx === 1) {
          setBeakerWaterColor("bg-yellow-100/40");
          setBubbleActive(true);
        }
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-yellow-300/40");
          setBubbleActive(false);
          setFizzleType("gas_chlorine");
        }
        break;
      case "u5_l3":
        if (stepIdx === 1) setBeakerWaterColor("bg-yellow-100/30");
        if (stepIdx === 2) {
          setBeakerWaterColor("bg-slate-100/10");
          setFizzleType("bleaching_done");
        }
        break;

      // Unit 6
      case "u6_l1":
        if (stepIdx === 1) {
          setBeakerWaterColor("bg-emerald-600/30");
          setFizzleType("magnet_fe_g");
        }
        if (stepIdx === 2) {
          setBeakerWaterColor("bg-cyan-500/30");
          setFizzleType("magnet_cu_g");
        }
        if (stepIdx === 3) {
          setBeakerWaterColor("bg-slate-50/10");
          setFizzleType("zinc_diamag");
        }
        break;
      case "u6_l2":
        if (stepIdx === 3) setBeakerWaterColor("bg-yellow-300/20");
        if (stepIdx === 4) {
          setBeakerWaterColor("bg-orange-400/40");
          setFizzleType("melting");
          setChamberStatus("إذابة سبيكة الذهب تماماً في الماء الملكي!");
        }
        break;
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    resetSimulationStates(selectedExp.id);
    setUsedTools([]);
    setAddedChemicals([]);
    setActiveAlkali("none");
    setHasWater(true);
    setIsIndicatorAdded(false);
    setIsCutAndDried(false);
    setToolToast(null);
  };

  // Unit categories for layout filters
  const unitFilters = [
    { id: "all", label: "كل تجارب المنهج" },
    { id: "u1", label: "الوحدة 1: تصنيف العناصر" },
    { id: "u2", label: "الوحدة 2: الأقلاء" },
    { id: "u3", label: "الوحدة 3: العضوية" },
    { id: "u4", label: "الوحدة 4: النيتروجين" },
    { id: "u5", label: "الوحدة 5: الهالوجينات" },
    { id: "u6", label: "الوحدة 6: الانتقالية" }
  ];

  const filteredExperiments = selectedUnitFilter === "all"
    ? experiments
    : experiments.filter((exp) => exp.unitId === selectedUnitFilter);

  const [manualHeating, setManualHeating] = useState<boolean>(false);
  const [manualBubbling, setManualBubbling] = useState<boolean>(false);
  const [manualMagnet, setManualMagnet] = useState<boolean>(false);

  // Interactive Workbench State
  const [usedTools, setUsedTools] = useState<string[]>([]);
  const [addedChemicals, setAddedChemicals] = useState<string[]>([]);
  const [activeAlkali, setActiveAlkali] = useState<"none" | "na" | "k">("none");
  const [hasWater, setHasWater] = useState<boolean>(true);
  const [isIndicatorAdded, setIsIndicatorAdded] = useState<boolean>(false);
  const [isCutAndDried, setIsCutAndDried] = useState<boolean>(false);
  const [toolToast, setToolToast] = useState<string | null>(null);

  // Helper icons for tools
  const getToolIcon = (toolName: string) => {
    if (toolName.includes("سكين") || toolName.includes("مشرط")) return <Scissors className="w-3.5 h-3.5 text-amber-500" />;
    if (toolName.includes("ورق")) return <FileText className="w-3.5 h-3.5 text-slate-500" />;
    if (toolName.includes("ملقط")) return <Utensils className="w-3.5 h-3.5 text-indigo-500" />;
    if (toolName.includes("حوض") || toolName.includes("كأس") || toolName.includes("أنبوب")) return <FlaskConical className="w-3.5 h-3.5 text-sky-500" />;
    if (toolName.includes("قطارة")) return <Pipette className="w-3.5 h-3.5 text-pink-500" />;
    if (toolName.includes("ميزان")) return <Scale className="w-3.5 h-3.5 text-emerald-500" />;
    if (toolName.includes("موقد") || toolName.includes("لهب")) return <Flame className="w-3.5 h-3.5 text-rose-500" />;
    return <Layers className="w-3.5 h-3.5 text-indigo-500" />;
  };

  // Helper icons for chemicals
  const getChemIcon = (chemName: string) => {
    if (chemName.includes("ماء")) return <Droplet className="w-3.5 h-3.5 text-sky-500" />;
    if (chemName.includes("صوديوم") || chemName.includes("Na")) return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    if (chemName.includes("بوتاسيوم") || chemName.includes("K")) return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
    if (chemName.includes("فينول") || chemName.includes("كاشف") || chemName.includes("دليل")) return <Pipette className="w-3.5 h-3.5 text-pink-500" />;
    if (chemName.includes("حمض") || chemName.includes("غاز")) return <Flame className="w-3.5 h-3.5 text-rose-500" />;
    return <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />;
  };

  const handleToolClick = (toolName: string) => {
    setUsedTools(prev => prev.includes(toolName) ? prev : [...prev, toolName]);
    
    if (toolName.includes("حوض زجاجي")) {
      setChamberStatus("تم تجهيز وتثبيت الحوض الزجاجي الكبير على طاولة المعمل");
      setToolToast("🥣 تم تجهيز الحوض الزجاجي الكبير على طاولة المعمل");
    } else if (toolName.includes("سكين") || toolName.includes("ورق ترشيح")) {
      setIsCutAndDried(true);
      setChamberStatus("تم استخراج فلز الصوديوم وقطعه بالسكين الحاد وتجفيفه بورق الترشيح لإزالة الكيروسين وإظهار بريقه الفضي");
      setToolToast("🔪 تم قطع الفلز بحجم حبة العدس وتجفيفه بالسكين والورق");
    } else if (toolName.includes("ملقط")) {
      if (selectedExp.id === "u2_l1") {
        if (activeAlkali === "none") {
          setActiveAlkali("na");
          setAddedChemicals(prev => prev.includes("قطعة صوديوم Na") ? prev : [...prev, "قطعة صوديوم Na"]);
          setChamberStatus("التقاط قطعة الصوديوم Na بالملقط وإسقاطها في الحوض - انصهار فوري واشتعال بلهب أصفر ساطع وفرقعات حادة!");
          setToolToast("🥢 تم التقاط قطعة الصوديوم بالملقط وإسقاطها في الحوض");
        } else if (activeAlkali === "na") {
          setActiveAlkali("k");
          setAddedChemicals(prev => prev.includes("قطعة بوتاسيوم K") ? prev : [...prev, "قطعة بوتاسيوم K"]);
          setChamberStatus("التقاط قطعة البوتاسيوم K بالملقط وإسقاطها - اشتعال فوري عنيف بلهب بنفسجي ليلكي رائع وفرقعة!");
          setToolToast("🥢 تم التقاط قطعة البوتاسيوم بالملقط وإسقاطها في الحوض");
        }
      } else {
        setChamberStatus(`استخدام ${toolName} لتثبيت وتحريك مكونات التجربة بأمان`);
        setToolToast(`🥢 تم استخدام ${toolName} بأمان`);
      }
    } else if (toolName.includes("موقد") || toolName.includes("بنزين")) {
      setManualHeating(prev => !prev);
      setChamberStatus("تشغيل موقد بنزن لتسخين المتفاعلات");
      setToolToast("🔥 تم تفعيل موقد التسخين");
    } else {
      setChamberStatus(`تم تجهيز واستخدام ${toolName} في التجربة`);
      setToolToast(`⚡ تم استخدام ${toolName}`);
    }
  };

  const handleChemicalClick = (chemName: string) => {
    setAddedChemicals(prev => prev.includes(chemName) ? prev : [...prev, chemName]);

    if (chemName.includes("ماء مقطر")) {
      setHasWater(true);
      setChamberStatus("تم ملء الحوض بالماء المقطر النقي كوسط للتفاعل");
      setToolToast("💧 تم صب الماء المقطر في وعاء التفاعل");
    } else if (chemName.includes("صوديوم") || chemName.includes("Na")) {
      setActiveAlkali("na");
      setManualBubbling(true);
      setUsedTools(prev => prev.includes("ملقط معدني") ? prev : [...prev, "ملقط معدني"]);
      setChamberStatus("إضافة قطعة الصوديوم Na: انصهار إلى كرة فضية تسبح بسرعة فوق سطح الماء مع اشتعال لهب أصفر ساطع وفرقعات!");
      setToolToast("🟡 انصهار الصوديوم واشتعاله بلهب أصفر ساطع!");
    } else if (chemName.includes("بوتاسيوم") || chemName.includes("K")) {
      setActiveAlkali("k");
      setManualBubbling(true);
      setUsedTools(prev => prev.includes("ملقط معدني") ? prev : [...prev, "ملقط معدني"]);
      setChamberStatus("إضافة قطعة البوتاسيوم K: اشتعال فوري عنيف بلهب بنفسجي ليلكي رائع وفرقعات قوية!");
      setToolToast("🟣 اشتعال عنيف للبوتاسيوم بلهب بنفسجي ليلكي!");
    } else if (chemName.includes("فينول") || chemName.includes("كاشف") || chemName.includes("دليل")) {
      setIsIndicatorAdded(true);
      if (activeAlkali !== "none" || currentStep >= 3) {
        setChamberStatus("إضافة قطرات دليل الفينول فثالين: تلون المحلول بالوردي الأرجواني دلالة على تكوّن الهيدروكسيد القلوي!");
        setToolToast("🌸 تلون المحلول بالوردي الأرجواني (وسط قلوي)");
      } else {
        setChamberStatus("إضافة دليل الفينول فثالين للماء المقطر: يظل المحلول عديم اللون وشفافاً تماماً (وسط متعادل)");
        setToolToast("💧 كاشف الفينول فثالين مضاف (عديم اللون في الوسط المتعادل)");
      }
    } else {
      setManualBubbling(true);
      setTimeout(() => setManualBubbling(false), 3000);
      setChamberStatus(`تمت إضافة ${chemName} إلى وسط التفاعل وملاحظة التغير`);
      setToolToast(`🧪 تمت إضافة ${chemName}`);
    }
  };

  const handleActionTrigger = (action: string) => {
    if (action === "toggle_heat") {
      setManualHeating(prev => !prev);
    } else if (action === "toggle_magnet") {
      setManualMagnet(prev => !prev);
    } else if (action === "add_reagent_1" || action === "add_reagent_2" || action === "add_reagent" || action === "use_pipette") {
      setManualBubbling(true);
      setTimeout(() => setManualBubbling(false), 4000);
      const chemName = action === "add_reagent_1"
        ? (selectedExp.chemicals[0] || "المتفاعل الأول")
        : action === "add_reagent_2"
        ? (selectedExp.chemicals[1] || "المتفاعل الثاني")
        : action === "use_pipette"
        ? "الكاشف بالماصة المخبرية"
        : "المحلول الكيميائي";
      setAddedChemicals(prev => prev.includes(chemName) ? prev : [...prev, chemName]);
      setChamberStatus(`تم سكب وإضافة ${chemName} بنجاح وبدء التفاعل الكيميائي الملحوظ`);
      setToolToast(`🧪 تم سكب وإضافة: ${chemName}`);
    } else if (action === "stir_rod" || action === "stir") {
      setChamberStatus("تم تقليب ورج المحلول بالساق الزجاجي لضمان تجانس وتفاعل الجزيئات");
      setToolToast("🥄 تم تقليب ورج المحلول لزيادة سرعة التفاعل");
    } else if (action === "filter_funnel") {
      setChamberStatus("تم استخدام قمع وورق الترشيح لفصل الراسب والحصول على الراشح الصافي النقي");
      setToolToast("⚗️ تم ترشيح المحلول وفصل المواد الصلبة غير الذائبة");
    } else if (action === "pour_water") {
      setHasWater(true);
      setAddedChemicals(prev => prev.includes("ماء مقطر") ? prev : [...prev, "ماء مقطر"]);
      setChamberStatus("تم صب الماء المقطر في الحوض الزجاجي");
      setToolToast("💧 تم صب الماء المقطر في الحوض");
    } else if (action === "cut_metal") {
      setIsCutAndDried(true);
      setUsedTools(prev => {
        const next = [...prev];
        if (!next.includes("سكين حاد")) next.push("سكين حاد");
        if (!next.includes("ورق ترشيح")) next.push("ورق ترشيح");
        return next;
      });
      setChamberStatus("تم قطع وتجفيف فلز الصوديوم بالسكين على ورق الترشيح لإزالة الكيروسين");
      setToolToast("🔪 تم قطع وتجفيف الفلز بالسكين والورق");
    } else if (action === "drop_sodium") {
      setActiveAlkali("na");
      setAddedChemicals(prev => prev.includes("قطعة صوديوم Na") ? prev : [...prev, "قطعة صوديوم Na"]);
      setUsedTools(prev => prev.includes("ملقط معدني") ? prev : [...prev, "ملقط معدني"]);
      if (isIndicatorAdded) {
        setChamberStatus("إسقاط الصوديوم Na بالملقط: تكوّن كرة منصهرة تسبح بلهب أصفر ساطع وفرقعة وتلون المحلول بالوردي!");
        setToolToast("🟡 انصهار واشتعال الصوديوم + تلون المحلول بالوردي");
      } else {
        setChamberStatus("إسقاط الصوديوم Na بالملقط: تكوّن كرة منصهرة تسبح بلهب أصفر ساطع وفرقعة (المحلول قلوي لكنه عديم اللون حتى إضافة الفينول فثالين)!");
        setToolToast("🟡 انصهار واشتعال الصوديوم بلهب أصفر ساطع");
      }
    } else if (action === "drop_potassium") {
      setActiveAlkali("k");
      setAddedChemicals(prev => prev.includes("قطعة بوتاسيوم K") ? prev : [...prev, "قطعة بوتاسيوم K"]);
      setUsedTools(prev => prev.includes("ملقط معدني") ? prev : [...prev, "ملقط معدني"]);
      if (isIndicatorAdded) {
        setChamberStatus("إسقاط البوتاسيوم K بالملقط: اشتعال فوري عنيف بلهب بنفسجي ليلكي خاطف وتلون المحلول بالوردي البنفسجي!");
        setToolToast("🟣 اشتعال عنيف للبوتاسيوم بلهب ليلكي + تلون وردي");
      } else {
        setChamberStatus("إسقاط البوتاسيوم K بالملقط: اشتعال فوري عنيف بلهب بنفسجي ليلكي خاطف وفرقعة قوية!");
        setToolToast("🟣 ملقط + قطعة البوتاسيوم: لهب بنفسجي ليلكي خاطف");
      }
    } else if (action === "add_indicator") {
      setIsIndicatorAdded(true);
      setAddedChemicals(prev => prev.includes("دليل الفينول فثالين") ? prev : [...prev, "دليل الفينول فثالين"]);
      if (activeAlkali !== "none" || currentStep >= 3) {
        setChamberStatus("إضافة دليل الفينول فثالين: تلون المحلول باللون الوردي دلالة على تكوّن هيدروكسيد قلوي!");
        setToolToast("🌸 إضافة دليل الفينول فثالين (ظهور اللون الوردي)");
      } else {
        setChamberStatus("إضافة دليل الفينول فثالين للماء المقطر: يظل المحلول عديم اللون وشفافاً تماماً (وسط متعادل)");
        setToolToast("💧 كاشف الفينول فثالين مضاف (عديم اللون في الوسط المتعادل)");
      }
    } else if (action === "clean_basin") {
      setActiveAlkali("none");
      setIsIndicatorAdded(false);
      setHasWater(true);
      setIsCutAndDried(false);
      setUsedTools([]);
      setAddedChemicals([]);
      setChamberStatus("تم تفريغ الحوض وغسيله وتعبئته بماء مقطر نقي جديد");
      setToolToast("🔄 تم غسيل وتفريغ الحوض");
    }
  };

  // 🧪 High-precision 3D Laboratory State calculation for all 21 lessons
  const get3DLabState = () => {
    let apparatusType: "beaker" | "test_tubes" | "gas_prep" | "electrolysis" | "magnetic_balance" | "glass_basin" = "beaker";
    let liquidColor = "#38bdf8";
    let liquidHeight = 0.45;
    let isHeating = false;
    let isBubbling = false;
    let isPrecipitating = false;
    let isSmoking = false;
    let flameColor = "#3b82f6";
    let temperature = 25;
    let phValue = 7.0;
    let gasVolume = 0;
    let apparentWeight: number | undefined = undefined;
    let magneticFieldOn: boolean = manualMagnet;
    let activeSubstance: string | undefined = undefined;

    switch (selectedExp.id) {
      // UNIT 1: Classification & Periodicity
      case "u1_l1": // Dobereiner's triads
        apparatusType = "beaker";
        liquidColor = currentStep >= 2 ? "#a5f3fc" : "#e0f2fe";
        liquidHeight = 0.35 + currentStep * 0.08;
        temperature = 25;
        phValue = 7.0;
        break;
      case "u1_l2": // s, p, d, f blocks
        apparatusType = "test_tubes";
        liquidColor = currentStep === 2 ? "#0284c7" : currentStep === 0 ? "#cbd5e1" : "#f1f5f9";
        isBubbling = currentStep === 0;
        break;
      case "u1_l3": // Period 3 trends
        apparatusType = "test_tubes";
        liquidColor = currentStep >= 1 ? "#f43f5e" : "#e0f2fe";
        isBubbling = currentStep >= 1;
        isHeating = currentStep === 3;
        temperature = currentStep === 3 ? 85 : 25;
        phValue = currentStep >= 1 ? 12.5 : 7.0;
        break;

      // UNIT 2: Alkali & Alkaline Earth Metals
      case "u2_l1": // Alkali metals in water
        apparatusType = "glass_basin";
        const hasReacted = activeAlkali !== "none" || currentStep >= 3;
        liquidColor = (isIndicatorAdded && hasReacted) ? (activeAlkali === "k" ? "#c084fc" : "#ec4899") : "#f0f9ff";
        isBubbling = hasReacted;
        isSmoking = hasReacted;
        isHeating = hasReacted;
        flameColor = activeAlkali === "k" ? "#a855f7" : "#eab308";
        temperature = hasReacted ? (activeAlkali === "k" ? 115 : 92) : 25;
        phValue = hasReacted ? (activeAlkali === "k" ? 14.0 : 13.8) : 7.0;
        gasVolume = hasReacted ? (activeAlkali === "k" ? 220 : 180) : 0;
        break;
      case "u2_l2": // Flame tests
        apparatusType = "test_tubes";
        isHeating = true;
        flameColor = currentStep === 1 ? "#eab308" : currentStep === 2 ? "#a855f7" : currentStep === 3 ? "#e11d48" : "#3b82f6";
        temperature = 650;
        break;

      // UNIT 3: Organic Chemistry
      case "u3_l1": // Wohler synthesis of Urea
        apparatusType = "beaker";
        liquidColor = currentStep >= 2 ? "#f8fafc" : "#e0f2fe";
        isHeating = currentStep >= 2;
        isPrecipitating = currentStep === 0 || currentStep === 1 || currentStep === 3;
        temperature = currentStep >= 2 ? 110 : 25;
        break;
      case "u3_l2": // IUPAC
        apparatusType = "beaker";
        liquidColor = "#fed7aa";
        liquidHeight = 0.5;
        break;
      case "u3_l3": // Hydrocarbon comparison
        apparatusType = "test_tubes";
        liquidColor = "#e0f2fe";
        break;
      case "u3_l4": // Methane prep
        apparatusType = "gas_prep";
        liquidColor = "#94a3b8";
        isHeating = currentStep >= 1;
        isBubbling = currentStep >= 2;
        temperature = currentStep >= 1 ? 250 : 25;
        gasVolume = currentStep >= 2 ? 220 : 0;
        flameColor = "#3b82f6";
        break;
      case "u3_l5": // Ethene & Bromine
        apparatusType = "beaker";
        liquidColor = currentStep === 2 ? "#f8fafc" : "#ea580c";
        isHeating = currentStep === 1;
        temperature = currentStep === 1 ? 180 : 25;
        isBubbling = currentStep >= 1;
        break;
      case "u3_l6": // Ethyne oxy-acetylene
        apparatusType = "gas_prep";
        liquidColor = "#cbd5e1";
        isBubbling = currentStep >= 1;
        isHeating = currentStep >= 2;
        isSmoking = currentStep === 2;
        temperature = currentStep === 3 ? 3000 : 25;
        gasVolume = currentStep >= 1 ? 240 : 0;
        break;
      case "u3_l7": // Benzene vs Hexene
        apparatusType = "test_tubes";
        liquidColor = currentStep >= 2 ? "#7e22ce" : "#e0f2fe";
        break;
      case "u3_l8": // Isomers
        apparatusType = "test_tubes";
        liquidColor = currentStep === 2 ? "#ea580c" : "#f8fafc";
        break;

      // UNIT 4: Group 5 Elements (Nitrogen & Phosphorus)
      case "u4_l1": // Phosphorus allotropes
        apparatusType = "beaker";
        isHeating = currentStep >= 2;
        isSmoking = currentStep >= 1;
        temperature = currentStep === 1 ? 35 : 240;
        flameColor = "#facc15";
        break;
      case "u4_l2": // Nitrogen prep
        apparatusType = "gas_prep";
        liquidColor = "#e0f2fe";
        isHeating = currentStep >= 1;
        isBubbling = currentStep >= 2;
        temperature = currentStep >= 1 ? 85 : 25;
        gasVolume = currentStep >= 2 ? 200 : 0;
        break;
      case "u4_l3": // Ammonia fountain
        apparatusType = "gas_prep";
        liquidColor = currentStep >= 1 ? "#1d4ed8" : "#e0f2fe";
        isBubbling = currentStep >= 1;
        phValue = 11.5;
        break;
      case "u4_l4": // Ammonium sulfate
        apparatusType = "beaker";
        liquidColor = "#f8fafc";
        isPrecipitating = currentStep >= 2;
        isHeating = currentStep === 1;
        phValue = 10.0;
        break;

      // UNIT 5: Halogens
      case "u5_l1": // Halogen displacement
        apparatusType = "test_tubes";
        liquidColor = currentStep === 1 ? "#ea580c" : currentStep === 2 ? "#581c87" : "#e0f2fe";
        break;
      case "u5_l2": // Chlorine prep
        apparatusType = "gas_prep";
        liquidColor = currentStep >= 1 ? "#84cc16" : "#475569";
        isHeating = currentStep >= 1;
        isBubbling = currentStep >= 1;
        isSmoking = currentStep >= 2;
        temperature = currentStep >= 1 ? 90 : 25;
        gasVolume = currentStep >= 1 ? 190 : 0;
        break;
      case "u5_l3": // Bleaching
        apparatusType = "beaker";
        liquidColor = "#bef264";
        isSmoking = true;
        break;

      // UNIT 6: Transition Elements
      case "u6_l1": // Transition magnetism & color
        apparatusType = "magnetic_balance";
        magneticFieldOn = manualMagnet || currentStep >= 1;
        if (currentStep === 0) {
          activeSubstance = "FeSO4";
          apparentWeight = 10.00;
        } else if (currentStep === 1) {
          activeSubstance = "FeSO4";
          apparentWeight = 11.85;
        } else if (currentStep === 2) {
          activeSubstance = "CuSO4";
          apparentWeight = 10.42;
        } else {
          activeSubstance = "ZnCl2";
          apparentWeight = 9.92;
        }
        break;
      case "u6_l2": // Aqua Regia gold dissolution
        apparatusType = "beaker";
        liquidColor = currentStep >= 2 ? "#eab308" : "#fed7aa";
        isHeating = currentStep >= 2;
        isBubbling = currentStep >= 2;
        isSmoking = currentStep >= 2;
        temperature = currentStep >= 2 ? 80 : 25;
        phValue = 0.5;
        break;
    }

    return {
      apparatusType,
      liquidColor,
      liquidHeight,
      isHeating,
      isBubbling,
      isPrecipitating,
      isSmoking,
      flameColor,
      temperature,
      phValue,
      gasVolume,
      apparentWeight,
      magneticFieldOn,
      activeSubstance
    };
  };

  return (
    <div className="p-6 bg-white text-[#1A1A1A] rounded-lg border border-[#E5E2DE] shadow-sm space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-[#E5E2DE] pb-4 gap-4">
        <div className="text-right order-2 lg:order-1">
          <h2 className="text-2xl font-serif font-bold text-[#2C3E50] tracking-tight">
            المعمل الكيميائي التفاعلي الافتراضي للثاني الثانوي
          </h2>
          <p className="text-xs text-[#7F8C8D] mt-1">
            نفذ تجربة عملية تفاعلية وآمنة لكل درس من دروس المنهج السوداني الـ 21 بشكل كامل وممتع!
          </p>
        </div>
        <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100 order-1 lg:order-2">
          <Compass className="w-6 h-6 text-purple-600 animate-pulse" />
        </div>
      </div>

      {/* Unit & Experiment Dropdowns Selection Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end justify-between bg-[#F9F8F6] p-4 rounded-xl border border-[#E5E2DE] text-right">
        {/* Dropdowns group */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1 order-2 md:order-1 items-stretch">
          {/* Unit Dropdown */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <span className="text-[11px] font-bold text-[#7F8C8D] block uppercase tracking-wider">الخطوة الأولى: اختر الوحدة الدراسية</span>
            <select
              value={selectedUnitFilter}
              onChange={(e) => {
                const unitId = e.target.value;
                setSelectedUnitFilter(unitId);
                // Select first experiment of that filtered set
                const matched = experiments.find(exp => unitId === "all" || exp.unitId === unitId);
                if (matched) {
                  selectExperiment(matched);
                }
              }}
              className="w-full bg-white border border-[#E5E2DE] text-[#2C3E50] rounded-lg px-3 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-[#E67E22] transition-all cursor-pointer shadow-xs text-right"
              dir="rtl"
            >
              {unitFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Experiment Dropdown */}
          <div className="flex flex-col gap-1.5 flex-2 min-w-[240px]">
            <span className="text-[11px] font-bold text-[#7F8C8D] block uppercase tracking-wider">الخطوة الثانية: اختر التجربة العملية</span>
            <select
              value={selectedExp.id}
              onChange={(e) => {
                const expId = e.target.value;
                const matched = experiments.find(exp => exp.id === expId);
                if (matched) {
                  selectExperiment(matched);
                }
              }}
              className="w-full bg-white border border-[#E5E2DE] text-[#2C3E50] rounded-lg px-3 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-[#E67E22] transition-all cursor-pointer shadow-xs text-right"
              dir="rtl"
            >
              {filteredExperiments.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  [{exp.id.toUpperCase()}] {exp.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Periodic Table Toggle Button */}
        <div className="order-1 md:order-2 flex items-center justify-end">
          <button
            onClick={() => setShowPeriodicTable(!showPeriodicTable)}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 w-full md:w-auto justify-center cursor-pointer ${
              showPeriodicTable
                ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400"
                : "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${showPeriodicTable ? "text-amber-300 animate-spin" : "text-indigo-600"}`} />
            {showPeriodicTable ? "إخفاء الجدول الدوري" : "عرض الجدول الدوري التفاعلي 🧪"}
          </button>
        </div>
      </div>

      {/* Interactive Periodic Table Section */}
      <AnimatePresence>
        {showPeriodicTable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <PeriodicTableTool />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start border-t border-[#E5E2DE] pt-6">
        
        {/* Left Side: Apparatus & Chemicals Panel */}
        <div className="lg:col-span-3 bg-[#F9F8F6] border border-[#E5E2DE] p-5 rounded-xl space-y-5 shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-[#7F8C8D] block border-b border-[#E5E2DE] pb-2 mb-3 text-right font-sans uppercase tracking-wider">بيانات تجربة الدرس</span>
            <div className="space-y-2 text-right">
              <span className="block text-sm font-bold text-[#2C3E50]">{selectedExp.title}</span>
              <span className="block text-xs text-[#E67E22] font-semibold">{selectedExp.unit}</span>
              <div className="flex items-center gap-1.5 justify-end mt-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedExp.dangerLevel === "شديد الخطورة" ? "bg-red-50 text-red-700 border border-red-200" :
                  selectedExp.dangerLevel === "مرتفع" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                  "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  مستوى الأمان: {selectedExp.dangerLevel}
                </span>
                <AlertTriangle className="w-3.5 h-3.5 text-[#E67E22]" />
              </div>
            </div>
          </div>

          {/* Interactive Tools & Apparatus Inventory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-[#E5E2DE] pb-1.5 mb-1">
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                تفاعلي - انقر للاستخدام ⚡
              </span>
              <span className="text-[10px] font-bold text-[#7F8C8D] font-sans uppercase tracking-wider">
                الأدوات والمعدات
              </span>
            </div>
            <div className="space-y-1.5">
              {selectedExp.apparatus.map((app, idx) => {
                const isUsed = usedTools.includes(app);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToolClick(app)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-right transition-all cursor-pointer group text-xs ${
                      isUsed
                        ? "bg-emerald-50/80 border-emerald-300 text-emerald-900 font-bold shadow-2xs"
                        : "bg-white border-[#E5E2DE] hover:border-indigo-300 hover:bg-indigo-50/40 text-[#2C3E50]"
                    }`}
                  >
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border transition-colors ${
                      isUsed
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-[#F5F4F0] text-[#7F8C8D] border-[#E5E2DE] group-hover:border-indigo-300 group-hover:text-indigo-700"
                    }`}>
                      {isUsed ? "مُفعّل ✓" : "استخدام ⚡"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[11px]">{app}</span>
                      {getToolIcon(app)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Chemicals & Reagents Inventory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-[#E5E2DE] pb-1.5 mb-1">
              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold border border-indigo-200">
                انقر للإضافة والتفاعل 🧪
              </span>
              <span className="text-[10px] font-bold text-[#7F8C8D] font-sans uppercase tracking-wider">
                المواد والكواشف
              </span>
            </div>
            <div className="space-y-1.5">
              {selectedExp.chemicals.map((chem, idx) => {
                const isAdded = addedChemicals.includes(chem);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChemicalClick(chem)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-right transition-all cursor-pointer group text-xs ${
                      isAdded
                        ? "bg-amber-50/80 border-amber-300 text-amber-900 font-bold shadow-2xs"
                        : "bg-white border-[#E5E2DE] hover:border-amber-300 hover:bg-amber-50/40 text-[#2C3E50]"
                    }`}
                  >
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border transition-colors ${
                      isAdded
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-[#F5F4F0] text-[#7F8C8D] border-[#E5E2DE] group-hover:border-amber-300 group-hover:text-amber-700"
                    }`}>
                      {isAdded ? "تمت الإضافة ✓" : "إضافة 🧪"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[11px] text-[#E67E22]">{chem}</span>
                      {getChemIcon(chem)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Action Toast Banner */}
          {toolToast && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold text-center shadow-xs"
            >
              {toolToast}
            </motion.div>
          )}

          {/* Equation Box */}
          <div className="bg-[#2C3E50]/5 p-3 rounded border border-[#2C3E50]/15 text-center font-mono text-[10px] text-[#2C3E50] font-bold leading-relaxed overflow-x-auto select-all" dir="ltr">
            <span className="text-[9px] text-indigo-600 block mb-1 text-right font-sans">الرابطة / المعادلة الكيميائية للمحاكاة:</span>
            {selectedExp.equation}
          </div>
        </div>

        {/* Center: Live Simulation Chamber */}
        <div className="lg:col-span-6 bg-[#F9F8F6] border border-[#E5E2DE] p-3 sm:p-4 rounded-xl flex flex-col items-center justify-between min-h-[490px] relative overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex gap-1.5 items-center bg-white/80 px-2.5 py-1 rounded-full border border-[#E5E2DE] shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] text-emerald-700 font-bold font-sans">نظام الأمان النشط مفعل</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#7F8C8D] font-bold">المختبر الافتراضي 3D WebGL</span>
            </div>
          </div>

          {/* 3D WebGL Virtual Laboratory Chamber */}
          <div className="w-full flex-1 my-1">
            {(() => {
              const lab3D = get3DLabState();
              const expReflection = getExperimentReflection(selectedExp.id);
              const currentStepReflection = expReflection?.steps[currentStep];

              return (
                <Lab3DScene
                  experimentId={selectedExp.id}
                  stepIndex={currentStep}
                  apparatusType={expReflection?.apparatusType || lab3D.apparatusType}
                  liquidColor={currentStepReflection?.telemetry.liquidColor || lab3D.liquidColor}
                  liquidHeight={currentStepReflection?.telemetry.liquidHeight || lab3D.liquidHeight}
                  isHeating={lab3D.isHeating || manualHeating}
                  isBubbling={lab3D.isBubbling || manualBubbling}
                  isPrecipitating={currentStepReflection?.telemetry.isPrecipitating || lab3D.isPrecipitating}
                  isSmoking={currentStepReflection?.telemetry.isSmoking || lab3D.isSmoking}
                  flameColor={currentStepReflection?.telemetry.flameColor || lab3D.flameColor}
                  temperature={currentStepReflection?.telemetry.temp || lab3D.temperature}
                  phValue={currentStepReflection?.telemetry.ph || lab3D.phValue}
                  gasVolume={currentStepReflection?.telemetry.gas || lab3D.gasVolume}
                  apparentWeight={currentStepReflection?.telemetry.weight !== undefined ? currentStepReflection.telemetry.weight : lab3D.apparentWeight}
                  magneticFieldOn={currentStepReflection?.telemetry.magneticFieldOn !== undefined ? currentStepReflection.telemetry.magneticFieldOn : lab3D.magneticFieldOn}
                  activeSubstance={currentStepReflection?.telemetry.activeSubstance || lab3D.activeSubstance}
                  activeAlkali={activeAlkali}
                  hasWater={hasWater}
                  isIndicatorAdded={isIndicatorAdded}
                  isCutAndDried={isCutAndDried}
                  chemicalNote={currentStepReflection?.observation || selectedExp.steps[currentStep]?.chemicalChange}
                  scientificObservation={currentStepReflection?.observation}
                  scientificReason={currentStepReflection?.scientificReason}
                  experimentTitle={selectedExp.title}
                  unitName={selectedExp.unit}
                  totalSteps={selectedExp.steps.length}
                  chemicals={selectedExp.chemicals}
                  apparatusList={selectedExp.apparatus}
                  currentStepTitle={selectedExp.steps[currentStep]?.text}
                  precipitateColor={currentStepReflection?.telemetry.precipitateColor}
                  onNextStep={currentStep < selectedExp.steps.length - 1 ? handleNextStep : undefined}
                  onPrevStep={currentStep > 0 ? () => setCurrentStep(prev => prev - 1) : undefined}
                  onReset={handleReset}
                  onActionTrigger={handleActionTrigger}
                />
              );
            })()}
          </div>

          <div className="w-full flex justify-between items-center border-t border-[#E5E2DE] pt-3 mt-2">
            <span className="text-[10px] text-[#95A5A6] font-bold font-mono">STATUS: {chamberStatus}</span>
            <span className="text-[10px] text-[#E67E22] font-bold font-sans">خطوة {currentStep + 1} من {selectedExp.steps.length}</span>
          </div>
        </div>

        {/* Right Side: Step Instructions & Logs */}
        <div className="lg:col-span-3 bg-[#F9F8F6] border border-[#E5E2DE] p-5 rounded-xl flex flex-col justify-between min-h-[490px] shadow-sm">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-[#7F8C8D] block border-b border-[#E5E2DE] pb-2 mb-2 text-right font-sans uppercase tracking-wider">خطوات التنفيذ التفاعلية</span>
            
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {selectedExp.steps.map((step, idx) => {
                const isCurrent = currentStep === idx;
                const isPassed = idx < currentStep;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded border text-right transition-all duration-300 ${
                      isCurrent
                        ? "bg-white border-[#E67E22] shadow-sm scale-102"
                        : isPassed
                        ? "bg-white/45 border-[#E5E2DE]/70 opacity-50"
                        : "bg-transparent border-[#E5E2DE]/20 opacity-25"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      {isPassed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCurrent ? "bg-[#E67E22] text-white" : "bg-[#E5E2DE] text-[#7F8C8D]"
                        }`}>{idx + 1}</span>
                      )}
                      <span className={`text-[11px] font-bold ${isCurrent ? "text-[#E67E22]" : "text-[#7F8C8D]"}`}>الخطوة {idx + 1}</span>
                    </div>
                    <p className="text-xs text-[#1A1A1A] mt-1.5 leading-relaxed">{step.text}</p>
                    
                    {isCurrent && step.chemicalChange && (
                      <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50/70 p-2 rounded border border-emerald-100">
                        ✨ {step.chemicalChange}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E5E2DE] pt-4 mt-4 flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F9F8F6] text-[#2C3E50] border border-[#E5E2DE] rounded text-xs font-bold transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة البدء
            </button>

            {!isCompleted ? (
              <button
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#E67E22] text-white font-bold rounded text-xs hover:bg-[#d6721b] transition-all shadow-sm"
              >
                الخطوة التالية
                <Play className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex-1 p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-center font-bold text-xs flex items-center justify-center gap-2 shadow-sm animate-pulse">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                اكتملت تجربة الدرس!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 🔬 Comprehensive Live Results, Observations & Scientific Reflection Dashboard */}
      {(() => {
        const expReflection = getExperimentReflection(selectedExp.id);
        const currentStepReflection = expReflection?.steps[currentStep];

        return (
          <div className="bg-[#F9F8F6] border border-[#E5E2DE] p-5 sm:p-6 rounded-2xl space-y-5 shadow-xs text-right mt-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E2DE] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>انعكاس ونتائج الخطوة ({currentStep + 1} من {selectedExp.steps.length})</span>
                </span>
                {currentStepReflection?.chemicalProperty && (
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                    {currentStepReflection.chemicalProperty}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#2C3E50]">لوحة التحليل الكيميائي والنتائج المعتمدة للدرس</h3>
                <Info className="w-5 h-5 text-indigo-600" />
              </div>
            </div>

            {/* Step Observation & Reflection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Immediate Lab Observation */}
              <div className="bg-white p-4 rounded-xl border border-[#E5E2DE] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#F5F4F0] pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>المشاهدة والانعكاس المخبري المباشر:</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    انعكاس مرئي مباشر
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A] leading-relaxed font-sans">
                  {currentStepReflection?.observation || selectedExp.steps[currentStep]?.chemicalChange}
                </p>
                {currentStepReflection?.telemetry.weight !== undefined && (
                  <div className="mt-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200 flex items-center justify-between">
                    <span>قراءة ميزان غوي الحساس:</span>
                    <span>{currentStepReflection.telemetry.weight.toFixed(2)} g</span>
                  </div>
                )}
              </div>

              {/* Card 2: Scientific Explanation */}
              <div className="bg-white p-4 rounded-xl border border-[#E5E2DE] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#F5F4F0] pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>التفسير والتعليل العلمي (منهج السودان):</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                    سؤال علل / فسر
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A] leading-relaxed font-sans">
                  {currentStepReflection?.scientificReason || getTheoryExplanation(selectedExp.id)}
                </p>
              </div>
            </div>

            {/* Exam Tip and Formula Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#E5E2DE] text-xs">
              {currentStepReflection?.examTip && (
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold">تنبيه امتحانات الشهادة الثانوية (بخت الرضا): </span>
                  <span className="font-normal">{currentStepReflection.examTip}</span>
                </div>
              )}

              {currentStepReflection?.equationOrFormula && (
                <div className="font-mono text-xs font-bold text-indigo-800 bg-indigo-50/70 px-3 py-1 rounded-lg border border-indigo-200 select-all" dir="ltr">
                  {currentStepReflection.equationOrFormula}
                </div>
              )}
            </div>

            {/* Cumulative Comparative Results Table */}
            {expReflection?.cumulativeTable && expReflection.cumulativeTable.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-[#E5E2DE] space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#F5F4F0] pb-2">
                  <span className="text-xs font-bold text-[#2C3E50]">
                    📊 جدول المقارنة والتسجيل التراكمي لنتائج عينات التجربة:
                  </span>
                  <span className="text-[10px] text-[#7F8C8D]">توثيق الفروقات المعملية</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs border border-[#E5E2DE] rounded-lg overflow-hidden">
                    <thead className="bg-[#F5F4F0] text-[#2C3E50] font-bold text-[11px]">
                      <tr>
                        <th className="p-2.5 border-b border-[#E5E2DE]">العينة / المادة</th>
                        <th className="p-2.5 border-b border-[#E5E2DE]">الظرف / الإجراء</th>
                        <th className="p-2.5 border-b border-[#E5E2DE]">النتيجة الملاحظة</th>
                        <th className="p-2.5 border-b border-[#E5E2DE]">المدلول الكيميائي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E2DE]">
                      {expReflection.cumulativeTable.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#FAF9F6]"}>
                          <td className="p-2.5 font-bold text-[#2C3E50]">{row.sampleName}</td>
                          <td className="p-2.5 text-[#7F8C8D]">{row.condition}</td>
                          <td className="p-2.5 font-semibold text-emerald-800">{row.result}</td>
                          <td className="p-2.5 text-[#1A1A1A]">{row.scientificMeaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3-Column Standard Theory / Observation / Conclusion Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-[#E5E2DE] space-y-2">
                <span className="text-xs font-bold text-indigo-700 block border-b border-[#F5F4F0] pb-1">الخلفية النظرية للدرس:</span>
                <p className="text-xs text-[#1A1A1A] leading-relaxed">
                  {getTheoryExplanation(selectedExp.id)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E2DE] space-y-2">
                <span className="text-xs font-bold text-[#E67E22] block border-b border-[#F5F4F0] pb-1">الملاحظات المخبرية العامة:</span>
                <p className="text-xs text-[#1A1A1A] leading-relaxed">
                  {getObservationExplanation(selectedExp.id)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E2DE] space-y-2">
                <span className="text-xs font-bold text-emerald-700 block border-b border-[#F5F4F0] pb-1">الاستنتاج العلمي الشامل:</span>
                <p className="text-xs text-[#1A1A1A] leading-relaxed">
                  {expReflection?.overallConclusion || getConclusionExplanation(selectedExp.id)}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Interactive Molecular Chemical Reactions Simulation Tool */}
      <MolecularSimulator />

    </div>
  );
};

// Curriculum aligned Arabic high-yield explanations for the 21 lessons of Secondary 2 Chemistry
export const getTheoryExplanation = (id: string): string => {
  switch (id) {
    case "u1_l1":
      return "تقوم نظرية دوبرينر لثنائيات وثلاثيات العناصر على تصنيف العناصر الكيميائية المتشابهة في مجموعات ثلاثية، بحيث تكون الكتلة الذرية للعنصر الأوسط تساوي تقريباً المتوسط الحسابي لكتلتي العنصرين الأول والثالث في الثلاثية.";
    case "u1_l2":
      return "ينقسم الجدول الدوري الحديث إلى أربع فئات رئيسية بناء على نوع المستوى الفرعي الذي ينتهي به التوزيع الإلكتروني للعنصر: فئة s في اليسار، فئة p في اليمين، فئة d (العناصر الانتقالية الرئيسية) في الوسط، وفئة f (اللانثانيدات والأكتينيدات) أسفل الجدول.";
    case "u1_l3":
      return "عند الانتقال من اليسار إلى اليمين عبر الدورة الثالثة، يقل الحجم الذري تدريجياً بسبب زيادة الشحنة النووية الفعالة (جذب النواة)، مما يزيد صعوبة فقد إلكترونات التكافؤ ويؤثر مباشرة في انخفاض النشاط الكيميائي للفلزات.";
    case "u2_l1":
      return "تعتبر فلزات الأقلاء (المجموعة الأولى) من أنشط الفلزات لامتلاكها إلكترون تكافؤ وحيد يسهل فقده. تزداد شدة هذا النشاط وقوة التفاعل مع الماء بالنزول لأسفل المجموعة من الليثيوم إلى الصوديوم ثم البوتاسيوم لتناقص طاقة التأين.";
    case "u2_l2":
      return "كشف الجاف أو كشف اللهب هو اختبار كيميائي نوعي مميز، يعتمد على إثارة إلكترونات التكافؤ عند تسخين أملاح الفلزات؛ حيث تمتص طاقة حرارية لتنتقل لمستوى طاقة أعلى، وعند عودتها تطلق طاقة على شكل أطياف ضوئية ملونة مميزة لكل عنصر.";
    case "u3_l1":
      return "قبل عام 1828، كان الاعتقاد السائد هو 'نظرية القوة الحيوية' لبرزيليوس والتي تدعي استحالة تحضير المركبات العضوية في المختبر إلا داخل أجسام الكائنات الحية. دحض الألماني فوهلر هذه النظرية بتخليق أول مركب عضوي (اليوريا) بتسخين سيانات الأمونيوم غير العضوية.";
    case "u3_l2":
      return "تعتمد تسمية الهيدروكربونات حسب نظام IUPAC المنهجي على اختيار أطول سلسلة كربونية مستمرة كسلسلة أم، وترقيم ذرات الكربون من الطرف الأقرب لأول تفرع ألكيلي، واستخدام السوابق الدالة على التكرار (ثنائي، ثلاثي) مع الترتيب الأبجدي.";
    case "u3_l3":
      return "تصنف الهيدروكربونات إلى أليفاتية (مفتوحة السلسلة كالألكانات والألكينات والألكاينات، أو حلقية مشبعة كالبروبان الحلقي) وأروماتية. 'المركبات المتقابلة' هي التي تتساوى في عدد ذرات الكربون وتختلف في نوع الروابط ودرجة الإشباع كالإيثان والإيثين والإيثاين.";
    case "u3_l4":
      return "السلسلة المتجانسة (المتشاكلة) هي مجموعة مركبات يجمعها قانون جزيئي عام وتشترك في الخواص الكيميائية وتتدرج في الفيزيائية. غاز الميثان CH₄ هو أول أفراد الألكانات، ويحضر مخبرياً بالتقطير الجاف لخلات الصوديوم اللامائية مع الجير الصودي.";
    case "u3_l5":
      return "تحتوي الألكينات (الأوليفينات) كالإيثين C₂H₄ على رابطة تساهمية ثنائية (واحدة سيجما قوية والأخرى باي ضعيفة). يسهل كسر رابطة باي بتفاعلات الإضافة؛ لذا يزيل غاز الإيثين لون ماء البروم الأحمر فوراً، بخلاف الألكانات المشبعة.";
    case "u3_l6":
      return "الألكاينات (الأسيتلينات) كالإيثاين C₂H₂ تحتوي على رابطة ثلاثية (رابطة سيجما ورابطتا باي ضعيفتان). يحضر الإيثاين بتنقيط الماء على كاربيد الكالسيوم، ويتميز باحتراقه بلهب الأكسي-أسيتلين الذي تصل حرارته إلى 3000°C ويستخدم في قطع ولحام المعادن.";
    case "u3_l7":
      return "يتميز البنزين العطري C₆H₆ بثبات كيميائي فائق واستقرار استثنائي ناتج عن ظاهرة الرنين وعدم تمركز إلكترونات باي الستة حول الحلقة، فلا يتأكسد ببرمنجنات البوتاسيوم. أما الحلقات الصغيرة كالبروبان الحلقي فتعاني من شد الرابطة (التوتر الزاوي) لانحراف زاويتها عن 109.5° إلى 60°.";
    case "u3_l8":
      return "التشكل أو التماكب السلسلي (Isomerism) هو اتفاق مركبين أو أكثر في الصيغة الجزيئية واختلافهما في الصيغة البنائية وترتيب الهيكل الكربوني، مثل متماكبات البنتان الثلاثة C₅H₁₂، والتمييز بين متماكبي الصيغة C₃H₆ (البروبين يزيل لون ماء البروم، بينما البروبان الحلقي لا يزيله في الظلام).";
    case "u4_l1":
      return "التأصل (Allotropy) هو وجود العنصر اللافلزي الواحد في عدة صور في نفس الحالة الفيزيائية، تختلف في البناء البلوري والخواص الفيزيائية والنشاط الكيميائي، مثل صور الفوسفور المتعددة (الأبيض والأحمر).";
    case "u4_l2":
      return "يمثل النيتروجين N₂ حوالي 78% من حجم الغلاف الجوي. يتم تحضيره مخبرياً بالانحلال الحراري لملح نتريت الأمونيوم غير المستقر، والذي يحضر آنياً من خلط كلوريد الأمونيوم ونتريت الصوديوم لتفادي الانفجار.";
    case "u4_l3":
      return "غاز النشادر (الأمونيا) NH₃ غاز قلوي التأثير ويتميز بذوبانية هائلة وفائقة جداً في الماء؛ حيث يذوب الحجم الواحد من الماء مئات الأحجام من الغاز، مما يسبب خلخلة مفاجئة وهبوطاً حاداً في الضغط داخل الدورق المغلق.";
    case "u4_l4":
      return "سماد كبريتات الأمونيوم هو سماد نيتروجيني هام للتربة. للكشف عن مكوناته مخبرياً يتم الكشف عن شق الأمونيوم (الكاتيون) بإطلاق غاز النشادر، وشق الكبريتات (الأنيون) بتكوين راسب كبريتات الباريوم.";
    case "u5_l1":
      return "في عائلة الهالوجينات (المجموعة السابعة عشر)، يقل النشاط الكيميائي والقدرة على كسب الإلكترونات (الأكسدة) كلما اتجهنا لأسفل المجموعة من الفلور إلى الكلور ثم البروم واليود.";
    case "u5_l2":
      return "يتم تحضير غاز الكلور Cl₂ في المختبر عن طريق أكسدة حمض الهيدروكلوريك HCl المركز بواسطة عامل مؤكسد قوي جداً مثل ثاني أكسيد المنجنيز الأسود MnO₂ بالتسخين المباشر.";
    case "u5_l3":
      return "غاز الكلور الجاف ليس له القدرة على قصر الألوان بمفرده، ولكن عند ذوبانه في الماء ينتج حمض الهيبوكلوروز HClO غير الثابت الذي يتفكك مطلقاً الأكسجين الذري الوليد [O] النشط جداً في الأكسدة وقصر الأصباغ.";
    case "u6_l1":
      return "تتميز العناصر الانتقالية بوجود إلكترونات مفردة غير مزدوجة في أفلاك المستوى الفرعي d. هذه الإلكترونات المفردة تدور حول نفسها وتولد مجالاً مغناطيسياً يتجاذب مع المجال المغناطيسي الخارجي (خاصية بارامغناطيسية).";
    case "u6_l2":
      return "الذهب فلز نبيل ومستقر للغاية كيميائياً ويقاوم الذوبان في أقوى الأحماض المركزة بمفردها مثل HCl أو HNO₃. ولكن يمكن إذابته في 'الماء الملكي' (Aqua Regia) وهو مزيج من الحمضين بنسبة حجمية 3 هيدروكلوريك إلى 1 نيتريك.";
    default:
      return "خلفية نظرية متقدمة من مناهج الكيمياء للثاني الثانوي تدعم الفهم الأكاديمي والتحصيل العلمي المتميز.";
  }
};

export const getObservationExplanation = (id: string): string => {
  switch (id) {
    case "u1_l1":
      return "عند حساب متوسط كتلتي الكالسيوم (40.0) والباريوم (137.3)، نجد أن الناتج الحسابي هو (88.65)، وهو يقارب جداً الكتلة الذرية الفعلية لعنصر الاسترونشيوم الأوسط (87.6).";
    case "u1_l2":
      return "توهج المصباح بشدة مع الصوديوم (s-block)، عدم توصيل كلي للتيار مع الكلور (p-block)، تلون محلول النحاس باللون الأزرق المميز (d-block)، وانجذاب اليوروبيوم للمغناطيس (f-block).";
    case "u1_l3":
      return "يتفاعل الصوديوم فورا وبعنف فائق مطلقا فرقعة قوية، بينما شريط المغنيسيوم لا يبدي تفاعلاً على البارد، ولكن عند تسخين الماء يتصاعد غاز الهيدروجين ببطء ويتلون المحلول باللون الوردي الميزان.";
    case "u2_l1":
      return "يجري فلز الصوديوم بشكل كرة منصهرة تسبح فوق سطح الماء وتشتعل بلهب أصفر ساطع، بينما يتفاعل البوتاسيوم بعنف أشد بلهب بنفسجي خاطف، ويتلون الكاشف بالوردي دليل تصاعد القلوية NaOH.";
    case "u2_l2":
      return "ظهور لهب أصفر ذهبي ناصع مع الصوديوم Na، وبنفسجي باهت مميز مع البوتاسيوم K، وقرمزي غامق مع الليثيوم Li عند تقريب الأملاح المبللة بـ HCl من لهب بنسن.";
    case "u3_l1":
      return "تكون راسب أبيض من كلوريد الفضة AgCl، وبعد الترشيح وتبخير الرشاح بالتسخين الهين تتشكل بلورات اليوريا البيضاء العضوية في قاع الجفنة.";
    case "u3_l2":
      return "تحديد سلسلة البنتان (5 ذرات C)، وعند إضافة تفرع ميثيل على الذرة رقم 2 والترقيم من اليمين يصبح 2-ميثيل بنتان، ومع إضافة فرع آخر يصبح 2,4-ثنائي ميثيل بنتان.";
    case "u3_l3":
      return "مقارنة المركبات المتقابلة (إيثان، إيثين، إيثاين) ذات الذرتين من الكربون، وملاحظة الفرق بين الرابطة الأحادية سيجما، والرابطة الثنائية، وبناء الحلقة المثلثة للبروبان الحلقي بزاوية 60°.";
    case "u3_l4":
      return "تصاعد فقاعات غاز الميثان عديم اللون والرائحة بإزاحة الماء لأسفل، واشتعال الغاز المتجمع بلهب أزرق باهت ونظيف دون تصاعد دخان أو سخام.";
    case "u3_l5":
      return "بقاء اللون الأحمر لماء البروم ثابتاً دون تغير مع أنبوبة الإيثان المشبع، بينما يزول اللون الأحمر لماء البروم فوراً ويصبح عديم اللون مع أنبوبة الإيثين غير المشبع.";
    case "u3_l6":
      return "حدوث فوران شديد وتصاعد غاز الإيثاين عند تنقيط الماء على كاربيد الكالسيوم، وترسيب شوائب الفوسفين وكبريتيد الهيدروجين في محلول CuSO₄، واشتعال الغاز بلهب مدخن وفي الأكسجين بلهب شديد الإبهار.";
    case "u3_l7":
      return "زوال اللون البنفسجي لبرمنجنات البوتاسيوم مع الهكسين وتكون راسب بني MnO₂ لتأكسده، بينما يظل اللون البنفسجي راسخاً تماماً مع البنزين لمقاومته للأكسدة بفعل الرنين.";
    case "u3_l8":
      return "ملاحظة الهياكل الثلاثة لمتماكبات C₅H₁₂، وعند فحص متماكبي C₃H₆ بماء البروم الأحمر: يزول اللون الأحمر فوراً مع البروبين، بينما يبقى اللون الأحمر ثابتاً مع البروبان الحلقي المشبع في الظلام.";
    case "u4_l1":
      return "الفوسفور الأبيض يشتعل تلقائياً بمجرد ملامسته للهواء الجاف مطلقاً وميضاً ساطعاً وأبخرة بيضاء كثيفة، بينما الفوسفور الأحمر مستقر ولا يشتعل إلا بالتسخين المباشر.";
    case "u4_l2":
      return "يتصاعد غاز النيتروجين النقي ببطء عند تسخين الخليط، حيث يجمع الغاز بإزاحة الماء لأسفل لعدم ذوبانه في الماء.";
    case "u4_l3":
      return "حقن قطرات الماء يذيب الأمونيا بسرعة البرق، مما يسبب اندفاع الماء من الحوض السفلي للأعلى بقوة ليندلع في صورة نافورة زرقاء غامقة مذهلة داخل الدورق.";
    case "u4_l4":
      return "عند إضافة NaOH للسماد يتصاعد غاز نفاذ يزرق ورقة عباد الشمس الرطبة، وعند إضافة BaCl2 يتكون راسب أبيض كثيف جداً لا يذوب في حمض الهيدروكلوريك.";
    case "u5_l1":
      return "تغير لون محلول KBr من عديم اللون إلى البرتقالي عند تمرير الكلور، وتغير لون KI إلى البني البنفسجي، وتتركز الألوان كطبقة عضوية واضحة في الأسفل عند رجها مع CCl₄.";
    case "u5_l2":
      return "تصاعد غاز الكلور ذي اللون الأخضر المصفر والرائحة الخانقة النفاذة، وتجمعه بإزاحة الهواء للأعلى نظراً لأنه أثقل من الهواء الجوي.";
    case "u5_l3":
      return "تحتفظ بتلة الوردة الحمراء الجافة بلونها تماماً في جرة الكلور الجاف، بينما يزول لون الوردة المبللة بالماء كلياً وتتحول إلى بيضاء ناصعة في ثوانٍ.";
    case "u6_l1":
      return "تحرك كفة ميزان غوي بقوة نحو الأسفل (زيادة الوزن الظاهري) مع كبريتات الحديد Fe²⁺، وتحركها ببطء مع كبريتات النحاس CuSO₄، بينما تندفع للأعلى (تنافر) مع Zn²⁺.";
    case "u6_l2":
      return "لا يذوب الذهب في حمض الهيدروكلوريك أو النيتريك منفرداً، ولكن عند صب الماء الملكي المشترك يذوب الذهب فوراً وبشكل كامل منتجاً تفاعلاً فورياً ملوناً بالذهبي.";
    default:
      return "مشاهدة مخبرية دقيقة وتغير لوني وفيزيائي واضح يسهل على الطالب استيعاب المفاهيم النظرية.";
  }
};

export const getConclusionExplanation = (id: string): string => {
  switch (id) {
    case "u1_l1":
      return "نستنتج أن الكتل الذرية للعناصر المتقاربة في الخواص تترابط بعلاقات رياضية دورية واضحة، مما يثبت صحة قانون ثلاثيات دوبرينر كتمهيد تاريخي وعلمي راسخ لفكرة التدرج الدوري.";
    case "u1_l2":
      return "نستنتج أن التقسيم الفئوي s, p, d, f ليس مجرد تقسيم نظري، بل ينعكس كلياً على سلوك العناصر الفيزيائي والكيميائي (كالناقلية، والألوان، والمغناطيسية، والنشاط).";
    case "u1_l3":
      return "نستنتج أن حجم الذرة يحدد نشاطها الفلزي؛ فالصوديوم بحجمه الكبير يفقد إلكترون التكافؤ بسهولة فيكون نشطاً، بينما المغنيسيوم الأصغر حجماً يقاوم الفقد ويحتاج طاقة تسخين.";
    case "u2_l1":
      return "تتفاعل فلزات الأقلاء مع الماء بقوة مطلقة غاز الهيدروجين ومكونة هيدروكسيدات الفلزات القلوية القوية. التفاعل طارد للحرارة بشدة مما يسبب اشتعال الهيدروجين المتصاعد بفرقعة.";
    case "u2_l2":
      return "يرجع تلون اللهب إلى عودة الإلكترونات المثارة من مستويات الطاقة العليا إلى مستويات طاقة أدنى مستقرة، مطلقة كمات محددة من الطاقة (الفوتونات) ذات أطوال موجية مميزة لفلزات الأقلاء.";
    case "u3_l1":
      return "أثبتت تجربة فوهلر بطلان نظرية القوة الحيوية لبرزيليوس نهائياً، حيث أمكن تحضير مركب عضوي داخل المعمل من ملحين غير عضويين (كلوريد الأمونيوم وسيانات الفضة).";
    case "u3_l2":
      return "قواعد IUPAC توحد لغة الكيمياء عالمياً؛ حيث يتم ترقيم السلسلة الأطول من الطرف الأقرب للتفرع لإعطاء البدائل أصغر أرقام ممكنة مع ترتيبها أبجدياً واستخدام سوابق التكرار بدقة.";
    case "u3_l3":
      return "المركبات المتقابلة تبرهن على أن تدرج عدم التشبع من الروابط الأحادية إلى الثنائية فالثلاثية يغير السلوك الكيميائي جذرياً، كما أن الهيدروكربونات الحلقية المشبعة تختلف في ثباتها باختلاف زوايا الروابط.";
    case "u3_l4":
      return "التقطير الجاف لخلات الصوديوم مع الجير الصودي ينتج الميثان النقي، حيث يعمل الجير الحي CaO على خفض درجة انصهار الخليط ومنع تآكل الأنبوبة الزجاجية وامتصاص الرطوبة.";
    case "u3_l5":
      return "تفاعل ماء البروم اختبار قاطع للكشف عن عدم التشبع في الألكينات؛ حيث تنكسر رابطة باي الضعيفة وتضاف ذرتا البروم لتكوين مركب 1,2-ثنائي برومو إيثان المشبع عديم اللون.";
    case "u3_l6":
      return "التحلل المائي لكاربيد الكالسيوم يولد غاز الإيثاين وهيدروكسيد الكالسيوم. نسبة الكربون العالية في الإيثاين تفسر لهبه المدخن في الهواء، وحرارته الفائقة (3000°C) عند الاحتراق التام في الأكسجين النقي.";
    case "u3_l7":
      return "استقرار البنزين العطري يرجع إلى سحابة رنين إلكترونات باي اللاموضعية التي تمنع تفاعلات الإضافة والأكسدة التقليدية. والبروبان الحلقي أكثر نشاطاً من باقي الألكانات لشد الرابطة وتوتر زاويته الضيقة (60°).";
    case "u3_l8":
      return "التماكب السلسلي يثبت أن الخواص لا تتحدد بالصيغة الجزيئية فقط بل بالهيكل البنائي وترتيب الروابط. اختبار ماء البروم يميز تجريبياً بين متماكبي C₃H₆ (الألكين غير المشبع والألكان الحلقي المشبع) وفق المقرر الدراسي.";
    case "u4_l1":
      return "يرجع الاختلاف الشاسع في النشاط بين الفوسفور الأبيض والأحمر إلى التوتر الزاوي الشديد داخل جزيء الفوسفور الأبيض P₄ الدائري، مما يجعله ينفجر اشتعالاً تلقائياً عند 30°C.";
    case "u4_l2":
      return "تتفكك نتريت الأمونيوم حرارياً إلى غاز النيتروجين وجزيئات الماء. الطريقة تؤمن غازاً نقياً جداً مناسباً للتجارب المعملية الحساسة للرطوبة والأكسجين.";
    case "u4_l3":
      return "الذوبان الفائق والخاطف لغاز النشادر في قطرات الماء المحقنة يخلق فراغاً فورياً (خلخلة ضغط)، فيندفع الماء للأعلى بقوة تحت تأثير الضغط الجوي، ويتلون باللون الأزرق لقلويته الشديدة.";
    case "u4_l4":
      return "يتحلل ملح الأمونيوم مع القلويات الساخنة مطلقاً غاز النشادر، بينما يتفاعل أنيون الكبريتات مع كاتيون الباريوم ليتكون راسب كبريتات الباريوم غير القابل للذوبان في الأحماض، مما يؤكد مكونات السماد.";
    case "u5_l1":
      return "الكلور أقوى مؤكسد من البروم، والبروم أقوى مؤكسد من اليود. لذلك يزيح الهالوجين الأعلى في المجموعة الهالوجينات الأدنى منها من محاليل أملاحها المائية دورياً.";
    case "u5_l2":
      return "يتأكسد أنيون الكلوريد HCl بواسطة MnO₂ منتجاً غاز الكلور الحر. يعد الكلور غازاً عالي السمية والنشاط، ويتطلب تجفيفاً بحمض الكبريتيك المركز قبل حفظه واستخدامه.";
    case "u5_l3":
      return "الكلور الرطب يبيض الألوان لأنه يتفاعل مع الماء ليكون حمض الهيبوكلوروز الذي يتفكك ليعطي الأكسجين الذري الوليد [O]، وهو عامل مؤكسد قوي جداً يخرب ويهدم كيميائياً المجموعات الملونة في الصباغ.";
    case "u6_l1":
      return "الخاصية البارامغناطيسية ولون المحلول في العناصر الانتقالية تعتمد على عدد الإلكترونات المفردة في المستوى d. زيادة عدد الإلكترونات المفردة تزيد من قوة الجذب المغناطيسي وعمق اللون.";
    case "u6_l2":
      return "تأثير الماء الملكي المذيب للذهب يرجع لتولد غاز الكلور النشط الوليد وكلوريد النيتروسيل NOCl من تفاعل الحمضين المشترك، والذين يقومان بمهاجمة الذهب وتحويله لـ AuCl₃ الذائب.";
    default:
      return "استنتاج كيميائي رصين يعزز التحصيل الأكاديمي ويساعد طلاب السودان على التميز في اختبارات الشهادة الكيميائية.";
  }
};
