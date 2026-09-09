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
  Info
} from "lucide-react";
import { PeriodicTableTool } from "./PeriodicTableTool";
import { MolecularSimulator } from "./MolecularSimulator";

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
        if (stepIdx === 1) setBeakerWaterColor("bg-blue-300/40");
        if (stepIdx === 3) {
          setBubbleActive(true);
          setFizzleType("violent_fizz");
          setChamberStatus("اشتعال وهب وهيدروجين متصاعد!");
        }
        if (stepIdx === 4) {
          setBeakerWaterColor("bg-fuchsia-300/50");
          setBubbleActive(false);
          setFizzleType("finished");
          setChamberStatus("تكون محلول NaOH قلوي");
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

  const renderSimulation = () => {
    switch (selectedExp.id) {
      case "u1_l1": // Dobereiner's triads
        return (
          <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full justify-center">
            <span className="text-[10px] font-bold text-slate-400 font-sans">ميزان رقمي وحاسبة معملية</span>
            <div className="w-40 h-20 bg-slate-100 border border-slate-300 rounded-lg flex flex-col items-center justify-center relative shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">ميزان الكتل الذرية</span>
              <span className="text-xl font-mono font-bold text-[#2C3E50] mt-1">
                {currentStep === 0 ? "40.0 g" :
                 currentStep === 1 ? "137.3 g" :
                 currentStep === 2 ? "88.65 g" : "87.6 g"}
              </span>
              <span className="text-[9px] text-[#E67E22] font-semibold mt-0.5">
                {currentStep === 0 ? "عنصر الكالسيوم Ca" :
                 currentStep === 1 ? "عنصر الباريوم Ba" :
                 currentStep === 2 ? "متوسط الحساب (Ca+Ba)/2" : "عنصر الاسترونشيوم Sr"}
              </span>
            </div>
            {/* Calculation details formula */}
            <div className="text-center p-2 bg-[#2C3E50]/5 border border-[#2C3E50]/10 rounded w-full">
              <p className="text-[10px] text-[#2C3E50] leading-normal font-sans">
                {currentStep >= 2 ? (
                  <>
                    <strong className="block text-indigo-700">المعادلة الحسابية:</strong>
                    (40.0 + 137.3) / 2 = 88.65
                    {currentStep === 3 && <span className="block text-emerald-700 font-bold mt-1">متقاربة جداً مع وزن Sr الفعلي (87.6)!</span>}
                  </>
                ) : (
                  "ضع العينات على الميزان لملاحظة حسابات ثلاثيات دوبرينر بدقة."
                )}
              </p>
            </div>
          </div>
        );
      case "u1_l2": // s, p, d, f blocks
        return (
          <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full justify-center">
            <span className="text-[10px] font-bold text-slate-400 font-sans">جهاز فحص الخواص الفيزيائية للفئات</span>
            <div className="flex flex-col items-center gap-2">
              {/* Device output screen */}
              <div className="p-3 rounded-lg border text-center w-40 bg-[#2C3E50]/5 border-[#2C3E50]/10">
                <span className="text-[10px] font-bold text-indigo-700">النتيجة المعملية:</span>
                <span className="block text-xs font-bold text-[#2C3E50] mt-1">
                  {currentStep === 0 ? "🔌 ناقلية فائقة 💡" :
                   currentStep === 1 ? "❌ عزل كهربائي تام" :
                   currentStep === 2 ? "🎨 طيف لوني أزرق مميز" :
                   currentStep === 3 ? "🧲 جاذبية مغناطيسية متقدمة" : "حدد خطوة للفحص"}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                  {currentStep === 0 ? "عنصر Na (فئة s)" :
                   currentStep === 1 ? "غاز Cl (فئة p)" :
                   currentStep === 2 ? "أيون Cu²⁺ (فئة d)" :
                   currentStep === 3 ? "عنصر Eu (فئة f)" : "-"}
                </span>
              </div>
              {/* Visual bulb or magnet graphic */}
              <div className="flex items-center justify-center gap-4 mt-2">
                {currentStep === 0 && (
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="p-2 bg-yellow-100 rounded-full text-yellow-600 border border-yellow-300 shadow-sm text-lg">
                    💡
                  </motion.div>
                )}
                {currentStep === 1 && (
                  <div className="p-2 bg-red-100 rounded-full text-red-600 border border-red-300 text-lg">
                    🔌🚫
                  </div>
                )}
                {currentStep === 2 && (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="p-2 bg-cyan-100 rounded-full text-cyan-600 border border-cyan-300 text-lg">
                    🌈
                  </motion.div>
                )}
                {currentStep === 3 && (
                  <motion.div animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 0.8 }} className="p-2 bg-purple-100 rounded-full text-purple-600 border border-purple-300 text-lg">
                    🧲
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );
      case "u1_l3": // Period 3 trends
        return (
          <div className="flex items-center justify-center gap-6 bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full">
            {/* Tube 1: Sodium */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, rotate: [-3, 3, -3, 3, 0], x: [-3, 3, -3, 3, 0] }}
              className="flex flex-col items-center cursor-pointer select-none"
            >
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">الأنبوب 1 (Na)</span>
              <div className="w-12 h-36 border-2 border-t-0 border-[#BDC3C7] rounded-b-xl relative flex items-end justify-center overflow-hidden bg-slate-50">
                <div className={`absolute bottom-0 w-full transition-all duration-700 ${currentStep >= 1 ? "h-[60%] bg-fuchsia-300/60" : "h-[10%] bg-blue-100"}`} />
                {currentStep === 1 && (
                  <motion.div animate={{ y: [-10, -50], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute text-lg bottom-6">💥</motion.div>
                )}
              </div>
              <span className="text-[9px] text-[#7F8C8D] mt-1">{currentStep >= 1 ? "تفاعل عنيف + قلوي" : "ماء مقطر"}</span>
            </motion.div>
            {/* Tube 2: Magnesium */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, rotate: [-3, 3, -3, 3, 0], x: [-3, 3, -3, 3, 0] }}
              className="flex flex-col items-center cursor-pointer select-none"
            >
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">الأنبوب 2 (Mg)</span>
              <div className="w-12 h-36 border-2 border-t-0 border-[#BDC3C7] rounded-b-xl relative flex items-end justify-center overflow-hidden bg-slate-50">
                <div className={`absolute bottom-0 w-full transition-all duration-1000 ${
                  currentStep === 3 ? "h-[60%] bg-pink-200/50" : currentStep >= 1 ? "h-[10%] bg-blue-100" : "h-[10%] bg-blue-100"
                }`} />
                {currentStep === 3 && (
                  <motion.div animate={{ y: [-5, -40] }} transition={{ repeat: Infinity }} className="absolute bottom-10"><Thermometer className="w-4 h-4 text-orange-600" /></motion.div>
                )}
              </div>
              <span className="text-[9px] text-[#7F8C8D] mt-1">
                {currentStep === 3 ? "تفاعل بطئ بالتسخين" : currentStep >= 2 ? "لا تفاعل على البارد" : "ماء مقطر"}
              </span>
            </motion.div>
          </div>
        );
      case "u3_l2": // IUPAC branching & naming
        return (
          <div className="flex flex-col items-center justify-center gap-3 bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full">
            <span className="text-[10px] font-bold text-[#7F8C8D] font-sans">تطبيق قواعد IUPAC وبناء السلاسل المتفرعة</span>
            <div className="flex items-center justify-center h-28 w-full relative">
              {currentStep === 0 && (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] text-indigo-600 font-bold mb-0.5">{n}</span>
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">C</div>
                        </div>
                        {n < 5 && <div className="w-3 h-1 bg-amber-500 mt-2" />}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-[#2C3E50] font-bold mt-2">سلسلة البنتان الأم (5 ذرات كربون)</span>
                </motion.div>
              )}
              {currentStep === 1 && (
                <motion.div initial={{ y: 5 }} animate={{ y: 0 }} className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="flex items-center">
                        <div className="flex flex-col items-center relative">
                          <span className="text-[8px] text-indigo-600 font-bold mb-0.5">{n}</span>
                          <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-xs ${n === 2 ? "bg-amber-600 ring-2 ring-amber-400" : "bg-slate-800"}`}>C</div>
                          {n === 2 && (
                            <div className="absolute top-10 flex flex-col items-center">
                              <div className="w-1 h-2 bg-amber-500" />
                              <div className="w-7 h-6 rounded bg-[#E67E22] text-white flex items-center justify-center text-[8px] font-bold shadow-xs">CH₃</div>
                            </div>
                          )}
                        </div>
                        {n < 5 && <div className="w-3 h-1 bg-amber-500 mt-2" />}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold mt-8">2-ميثيل بنتان (الترقيم من اليمين الأقرب للفرع)</span>
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="flex items-center">
                        <div className="flex flex-col items-center relative">
                          <span className="text-[8px] text-indigo-600 font-bold mb-0.5">{n}</span>
                          <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-xs ${n === 2 || n === 4 ? "bg-amber-600 ring-2 ring-amber-400" : "bg-slate-800"}`}>C</div>
                          {(n === 2 || n === 4) && (
                            <div className="absolute top-10 flex flex-col items-center">
                              <div className="w-1 h-2 bg-amber-500" />
                              <div className="w-7 h-6 rounded bg-[#E67E22] text-white flex items-center justify-center text-[8px] font-bold shadow-xs">CH₃</div>
                            </div>
                          )}
                        </div>
                        {n < 5 && <div className="w-3 h-1 bg-amber-500 mt-2" />}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-amber-800 font-bold mt-8">2,4-ثنائي ميثيل بنتان (استخدام سابقة ثنائي)</span>
                </motion.div>
              )}
            </div>
            <div className="text-center p-1.5 bg-amber-50 border border-amber-100 rounded w-full">
              <span className="text-[10px] text-[#2C3E50] font-bold block">
                {currentStep === 0 ? "تحديد أطول سلسلة مستمرة = بنتان (5 ذرات كربون)" :
                 currentStep === 1 ? "إضافة فرع ميثيل على الذرة رقم 2 والترقيم من الأقرب للفرع" :
                 "إضافة فرع ثانٍ على الذرة 4 وتسميته 2,4-ثنائي ميثيل بنتان"}
              </span>
            </div>
          </div>
        );
      case "u3_l3": // Classification & Homologous / Metqabila
        return (
          <div className="flex flex-col items-center justify-center gap-3 bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full">
            <span className="text-[10px] font-bold text-[#7F8C8D] font-sans">فحص أقسام الهيدروكربونات والمركبات المتقابلة</span>
            <div className="flex items-center justify-center h-28 w-full">
              {currentStep === 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center p-1.5 bg-blue-50 border border-blue-200 rounded text-center">
                    <span className="text-[9px] font-bold text-blue-800">إيثان C₂H₆</span>
                    <span className="text-[8px] text-slate-500">ألكان مشبع (أحادي)</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">↔</span>
                  <div className="flex flex-col items-center p-1.5 bg-amber-50 border border-amber-200 rounded text-center">
                    <span className="text-[9px] font-bold text-amber-800">إيثين C₂H₄</span>
                    <span className="text-[8px] text-slate-500">ألكين (رابطة ثنائية)</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">↔</span>
                  <div className="flex flex-col items-center p-1.5 bg-purple-50 border border-purple-200 rounded text-center">
                    <span className="text-[9px] font-bold text-purple-800">إيثاين C₂H₂</span>
                    <span className="text-[8px] text-slate-500">ألكاين (رابطة ثلاثية)</span>
                  </div>
                </div>
              )}
              {currentStep === 1 && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">C</div>
                    <div className="w-6 h-1.5 bg-blue-500 rounded flex items-center justify-center"><span className="text-[7px] text-white font-bold">σ</span></div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">C</div>
                  </div>
                  <span className="text-[10px] text-blue-700 font-bold mt-2">رابطة سيجما (σ) تساهمية أحادية قوية ومستقرة</span>
                </div>
              )}
              {currentStep === 2 && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">C</div>
                    <div className="flex flex-col gap-1">
                      <div className="w-6 h-1 bg-blue-500 rounded" />
                      <div className="w-6 h-1 bg-amber-500 rounded animate-pulse" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">C</div>
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold mt-2">رابطة ثنائية (سيجما قوية + باي π ضعيفة سريعة الكسر)</span>
                </div>
              )}
              {currentStep === 3 && (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="w-20 h-20 border-2 border-dashed border-emerald-500 rounded-full flex items-center justify-center relative">
                  {[0, 1, 2].map((idx) => {
                    const angle = (idx * 2 * Math.PI) / 3 - Math.PI / 2;
                    const x = 28 * Math.cos(angle);
                    const y = 28 * Math.sin(angle);
                    return (
                      <div key={idx} style={{ transform: `translate(${x}px, ${y}px)` }} className="absolute w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[8px] font-bold">
                        CH₂
                      </div>
                    );
                  })}
                  <span className="text-[8px] font-bold text-emerald-800">بروبان حلقي</span>
                </motion.div>
              )}
            </div>
            <div className="text-center p-1.5 bg-slate-50 border border-slate-200 rounded w-full">
              <span className="text-[10px] text-[#2C3E50] font-bold block">
                {currentStep === 0 ? "مركبات متقابلة: تتساوى في ذرات الكربون وتختلف في نوع الرابطة" :
                 currentStep === 1 ? "الإيثان: ألكان مشبع برابطة سيجما قوية خاملة كيميائياً" :
                 currentStep === 2 ? "الإيثين: ألكين غير مشبع يمتلك رابطة باي ضعيفة سهلة الكسر" :
                 "البروبان الحلقي C₃H₆: هيدروكربون أليفاتي حلقي مشبع ذو زاوية 60° متوترة"}
              </span>
            </div>
          </div>
        );
      case "u3_l4": // Methane dry distillation
        return (
          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full relative overflow-hidden">
            <span className="text-[10px] font-bold text-[#7F8C8D] font-sans">تحضير غاز الميثان بالتقطير الجاف</span>
            <div className="w-full flex items-center justify-around h-36 relative mt-1">
              {/* Test Tube with CH3COONa + Soda Lime */}
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-500 mb-0.5">أنبوبة التفاعل</span>
                <div className="w-8 h-24 border-2 border-slate-400 rounded-b-lg relative bg-slate-50 flex flex-col justify-end p-0.5 overflow-hidden">
                  <div className="w-full h-10 bg-amber-100/80 rounded-b border-t border-amber-300 flex items-center justify-center text-[7px] text-amber-900 font-bold text-center leading-tight">
                    خلات صوديوم + جير صودي
                  </div>
                  {currentStep >= 2 && (
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute inset-0 bg-orange-400/20" />
                  )}
                </div>
                {/* Burner Flame */}
                {currentStep >= 2 && (
                  <motion.div animate={{ scaleY: [1, 1.3, 1], scaleX: [1, 0.9, 1] }} transition={{ repeat: Infinity, duration: 0.4 }} className="text-sm mt-0.5">
                    🔥
                  </motion.div>
                )}
              </div>
              {/* Delivery Tube */}
              <div className="w-16 h-1 border-t-2 border-slate-400 relative">
                {currentStep >= 2 && (
                  <motion.div animate={{ x: [0, 50] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-1 bg-sky-400 rounded-full" />
                )}
              </div>
              {/* Collection Jar inverted in Water Trough */}
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-500 mb-0.5">مخبار التجميع (إزاحة الماء)</span>
                <div className="w-12 h-24 border-2 border-b-0 border-slate-400 rounded-t-lg relative bg-sky-100/50 flex flex-col justify-between items-center overflow-hidden">
                  {/* Gas collecting at top */}
                  <div className={`w-full transition-all duration-1000 flex items-center justify-center ${currentStep >= 2 ? "h-12 bg-sky-200/60" : "h-2 bg-transparent"}`}>
                    {currentStep >= 2 && <span className="text-[8px] font-bold text-sky-800">CH₄ غاز</span>}
                  </div>
                  {/* Rising bubbles */}
                  {currentStep === 2 && (
                    <motion.div animate={{ y: [20, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} className="text-xs">🫧</motion.div>
                  )}
                  {/* Water level */}
                  <div className={`w-full bg-blue-300/60 transition-all duration-1000 ${currentStep >= 3 ? "h-6" : "h-14"}`} />
                </div>
                <div className="w-18 h-4 border-2 border-t-0 border-slate-400 rounded-b bg-blue-200/50 flex items-center justify-center">
                  <span className="text-[7px] text-blue-800">حوض الماء</span>
                </div>
              </div>
            </div>
            <div className="text-center p-1 bg-sky-50 border border-sky-100 rounded w-full mt-1">
              <span className="text-[9px] text-[#2C3E50] font-bold block">
                {currentStep === 0 ? "خلط خلات الصوديوم اللامائية مع الجير الصودي (NaOH + CaO)" :
                 currentStep === 1 ? "توصيل أنبوب التسليم بحوض الماء ومخبار التجميع المقلوب" :
                 currentStep === 2 ? "تسخين الخليط وتصاعد فقاعات غاز الميثان بإزاحة الماء لأسفل" :
                 "امتلاء المخبار بغاز الميثان واشتعاله بلهب أزرق باهت نظيف"}
              </span>
            </div>
          </div>
        );
      case "u3_l5": // Bromine water test for unsaturation
        return (
          <div className="flex items-center justify-center gap-6 bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full">
            {/* Tube 1: Ethane */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">أنبوب 1: إيثان (مشبع)</span>
              <div className="w-12 h-36 border-2 border-t-0 border-[#BDC3C7] rounded-b-xl relative flex items-end justify-center overflow-hidden bg-slate-50">
                <div className={`absolute bottom-0 w-full transition-all duration-700 ${currentStep >= 1 ? "h-[60%] bg-orange-600/75" : "h-[10%] bg-blue-100"}`} />
              </div>
              <span className="text-[9px] text-[#7F8C8D] mt-1">{currentStep >= 1 ? "بقاء اللون الأحمر 🔴 (لا تفاعل)" : "غاز إيثان"}</span>
            </div>
            {/* Tube 2: Ethene */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">أنبوب 2: إيثين (غير مشبع)</span>
              <div className="w-12 h-36 border-2 border-t-0 border-[#BDC3C7] rounded-b-xl relative flex items-end justify-center overflow-hidden bg-slate-50">
                <div className={`absolute bottom-0 w-full transition-all duration-1000 ${
                  currentStep >= 3 ? "h-[60%] bg-blue-50/10 border-t border-blue-200" : currentStep >= 2 ? "h-[60%] bg-orange-600/75" : "h-[10%] bg-blue-100"
                }`} />
                {currentStep === 3 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute text-[8px] font-bold text-emerald-700 text-center bottom-8 px-1">
                    1,2-ثنائي برومو إيثان عديم اللون
                  </motion.div>
                )}
              </div>
              <span className="text-[9px] text-[#7F8C8D] mt-1">
                {currentStep >= 3 ? "زوال لون البروم ⚪ (تفاعل إضافة)" : currentStep >= 2 ? "إضافة ماء البروم" : "غاز إيثين"}
              </span>
            </div>
          </div>
        );
      case "u3_l6": // Ethyne from CaC2
        return (
          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full relative overflow-hidden">
            <span className="text-[10px] font-bold text-[#7F8C8D] font-sans">تحضير غاز الإيثاين بتنقيط الماء على كاربيد الكالسيوم</span>
            <div className="w-full flex items-center justify-around h-36 relative mt-1">
              {/* Conical flask with CaC2 and dropping funnel */}
              <div className="flex flex-col items-center">
                {/* Dropping funnel */}
                <div className="w-4 h-8 border border-slate-400 rounded-t bg-blue-100/60 relative flex flex-col items-center">
                  {currentStep >= 1 && (
                    <motion.div animate={{ y: [0, 10], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </div>
                <div className="w-1 h-3 bg-slate-400" />
                {/* Flask */}
                <div className="w-14 h-16 border-2 border-slate-400 rounded-b-xl relative bg-slate-50 flex flex-col justify-end p-1 overflow-hidden">
                  <div className="flex gap-1 justify-center mb-1">
                    <div className="w-3 h-2 bg-slate-600 rounded-xs" />
                    <div className="w-3 h-2 bg-slate-700 rounded-xs" />
                  </div>
                  {currentStep >= 1 && (
                    <motion.div animate={{ y: [-2, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.4 }} className="absolute text-xs bottom-3 text-center w-full">🫧</motion.div>
                  )}
                  <span className="text-[6px] text-slate-600 text-center font-bold">CaC₂ صلب</span>
                </div>
              </div>
              {/* Wash bottle with acidified CuSO4 */}
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-bold text-blue-700">غسيل بـ CuSO₄</span>
                <div className="w-10 h-16 border-2 border-slate-400 rounded-b relative bg-blue-100 flex flex-col justify-end overflow-hidden">
                  <div className="w-full h-8 bg-blue-500/40 flex items-center justify-center text-[6px] text-blue-900 font-bold text-center">
                    تنقية من PH₃ و H₂S
                  </div>
                </div>
              </div>
              {/* Flame / Collector */}
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-amber-700">احتراق الإيثاين</span>
                <div className="w-10 h-16 border border-slate-300 rounded flex flex-col items-center justify-center bg-slate-50">
                  {currentStep >= 3 ? (
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="flex flex-col items-center">
                      <span className="text-xl">🔥</span>
                      <span className="text-[7px] text-red-600 font-bold">لهب مدخن 3000°C</span>
                    </motion.div>
                  ) : (
                    <span className="text-[8px] text-slate-400">جمع الغاز</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center p-1 bg-amber-50 border border-amber-100 rounded w-full mt-1">
              <span className="text-[9px] text-[#2C3E50] font-bold block">
                {currentStep === 0 ? "وضع قطع كاربيد الكالسيوم الصلبة CaC₂ في الدورق" :
                 currentStep === 1 ? "تنقيط الماء وفوران شديد وتصاعد غاز الإيثاين C₂H₂" :
                 currentStep === 2 ? "تمرير الغاز عبر محلول كبريتات النحاس لتنقيته من الشوائب" :
                 "احتراق الإيثاين بلهب مدخن وفي الأكسجين بلهب الأكسي-أستلين الحارق"}
              </span>
            </div>
          </div>
        );
      case "u3_l7": // Benzene resonance vs Hexene oxidation
        return (
          <div className="flex items-center justify-center gap-6 bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full">
            {/* Tube 1: Hexene */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">هكسين (أكسدة)</span>
              <div className="w-12 h-36 border-2 border-t-0 border-[#BDC3C7] rounded-b-xl relative flex items-end justify-center overflow-hidden bg-slate-50">
                <div className={`absolute bottom-0 w-full transition-all duration-700 ${
                  currentStep === 1 ? "h-[60%] bg-purple-600/60" : currentStep >= 2 ? "h-[60%] bg-amber-800/40" : "h-[10%] bg-blue-100"
                }`} />
              </div>
              <span className="text-[9px] text-[#7F8C8D] mt-1">
                {currentStep === 1 ? "محلول بنفسجي" : currentStep >= 2 ? "زوال البنفسجي 🟤 (تأكسد)" : "قبل الكاشف"}
              </span>
            </div>
            {/* Tube 2: Benzene */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">بنزين (رنين)</span>
              <div className="w-12 h-36 border-2 border-t-0 border-[#BDC3C7] rounded-b-xl relative flex items-end justify-center overflow-hidden bg-slate-50">
                <div className={`absolute bottom-0 w-full transition-all duration-700 ${currentStep >= 1 ? "h-[60%] bg-purple-600/80" : "h-[10%] bg-blue-100"}`} />
              </div>
              <span className="text-[9px] text-[#7F8C8D] mt-1">
                {currentStep >= 1 ? "ثبات اللون البنفسجي 🟣 (مقاومة الرنين)" : "قبل الكاشف"}
              </span>
            </div>
          </div>
        );
      case "u3_l8": // Chain isomerism C5H12 & C3H6 differentiation
        return (
          <div className="flex flex-col items-center justify-center gap-2 bg-white p-3 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full">
            <span className="text-[10px] font-bold text-[#7F8C8D] font-sans">التماكب السلسلي والتمييز المخبري لمتماكبات C₃H₆</span>
            <div className="flex items-center justify-center h-28 w-full">
              {currentStep === 0 && (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] font-bold text-indigo-700">متماكبات البنتان C₅H₁₂ الثلاثة:</span>
                  <div className="flex items-center gap-2 text-center">
                    <div className="p-1.5 bg-slate-100 rounded border border-slate-300 text-[8px]">
                      <strong className="block text-slate-800">بنتان عادي</strong>
                      <span>سلسلة مستقيمة (5 ذرات)</span>
                    </div>
                    <div className="p-1.5 bg-amber-50 rounded border border-amber-300 text-[8px]">
                      <strong className="block text-amber-800">2-ميثيل بيوتان</strong>
                      <span>سلسلة من 4 + تفرع ميثيل</span>
                    </div>
                    <div className="p-1.5 bg-purple-50 rounded border border-purple-300 text-[8px]">
                      <strong className="block text-purple-800">2,2-ثنائي ميثيل بروبان</strong>
                      <span>سلسلة من 3 + تفرعان</span>
                    </div>
                  </div>
                </div>
              )}
              {currentStep >= 1 && (
                <div className="flex items-center justify-center gap-6">
                  {/* Tube 1: Propene */}
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-bold text-[#2C3E50] mb-0.5">البروبين (ألكين غير مشبع)</span>
                    <div className="w-10 h-24 border-2 border-t-0 border-slate-400 rounded-b-lg relative flex items-end justify-center overflow-hidden bg-slate-50">
                      <div className={`absolute bottom-0 w-full transition-all duration-700 ${
                        currentStep >= 2 ? "h-[60%] bg-blue-50/10" : "h-[60%] bg-orange-600/75"
                      }`} />
                    </div>
                    <span className="text-[8px] text-emerald-700 font-bold mt-1">
                      {currentStep >= 2 ? "زوال لون البروم ⚪" : "أحمر برومي 🔴"}
                    </span>
                  </div>
                  {/* Tube 2: Cyclopropane */}
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-bold text-[#2C3E50] mb-0.5">بروبان حلقي (مشبع)</span>
                    <div className="w-10 h-24 border-2 border-t-0 border-slate-400 rounded-b-lg relative flex items-end justify-center overflow-hidden bg-slate-50">
                      <div className={`absolute bottom-0 w-full transition-all duration-700 ${
                        currentStep >= 1 ? "h-[60%] bg-orange-600/75" : "h-[10%] bg-blue-100"
                      }`} />
                    </div>
                    <span className="text-[8px] text-amber-800 font-bold mt-1">
                      {currentStep >= 3 ? "بقاء اللون الأحمر 🔴 (في الظلام)" : currentStep >= 1 ? "إضافة البروم" : "بروبان حلقي"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center p-1 bg-amber-50 border border-amber-100 rounded w-full">
              <span className="text-[9px] text-[#2C3E50] font-bold block">
                {currentStep === 0 ? "متماكبات البنتان C₅H₁₂ تتفق في الصيغة الجزيئية وتختلف في بنية السلسلة الكربونية" :
                 currentStep === 1 ? "تجهيز متماكبي الصيغة C₃H₆: البروبين المفتوح والبروبان الحلقي المشبع" :
                 currentStep === 2 ? "إضافة ماء البروم الأحمر: يزول لونه فوراً مع البروبين لتفاعل الإضافة بالرابطة الثنائية" :
                 "يبقى لون ماء البروم ثابتاً مع البروبان الحلقي المشبع في الظلام، كدليل قاطع للتمييز بينهما"}
              </span>
            </div>
          </div>
        );
      case "u4_l1": // Phosphorus allotropy
        return (
          <div className="flex items-center justify-center gap-6 bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full">
            {/* Spoon 1: Red Phosphorus */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">فوسفور أحمر</span>
              <div className="w-12 h-20 bg-slate-100 border border-slate-300 rounded-md relative flex items-center justify-center shadow-xs">
                {currentStep === 0 ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} className="text-red-600 font-bold animate-pulse">🔥 بطئ</motion.div>
                ) : (
                  <span className="text-[10px] text-slate-400">ملعقة احتراق</span>
                )}
              </div>
              <span className="text-[9px] text-slate-500 mt-1">يشتعل عند 240°C</span>
            </div>
            {/* Spoon 2: White Phosphorus */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">فوسفور أبيض</span>
              <div className="w-12 h-20 bg-slate-100 border border-slate-300 rounded-md relative flex items-center justify-center shadow-xs">
                {currentStep >= 2 ? (
                  <motion.div animate={{ scale: [1, 1.4, 1] }} className="text-yellow-500 font-bold">💥 تلقائي</motion.div>
                ) : (
                  <span className="text-[10px] text-blue-500 font-bold">تحت الماء 💧</span>
                )}
              </div>
              <span className="text-[9px] text-red-600 font-bold mt-1">
                {currentStep >= 2 ? "وميض مفرقع عند 30°C!" : "آمن تحت الماء"}
              </span>
            </div>
          </div>
        );
      case "u4_l3": // Ammonia fountain
        return (
          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full relative overflow-hidden">
            <span className="text-[10px] font-bold text-[#7F8C8D] font-sans">تجهيز نافورة النشادر القلوية</span>
            <div className="w-full flex items-center justify-center h-44 relative mt-2">
              {/* Round Bottom Flask (Upside Down) */}
              <div className="w-24 h-24 rounded-full border-4 border-[#BDC3C7] relative flex items-center justify-center bg-slate-50/50 shadow-sm z-10">
                <div className={`absolute inset-0 rounded-full transition-colors duration-1000 ${
                  currentStep === 3 ? "bg-blue-600/40" : "bg-transparent"
                }`} />
                {currentStep === 3 && (
                  <motion.div
                    animate={{ y: [20, -20, 20], opacity: [0.3, 0.9, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-xs text-blue-700 font-bold text-center"
                  >
                    ⛲ نافورة زرقاء
                  </motion.div>
                )}
                {currentStep < 3 && <span className="text-[8px] text-slate-400 text-center font-bold">غاز NH₃ جاف</span>}
              </div>
              {/* Stand / Tube extending down */}
              <div className="absolute w-2 h-20 bg-slate-400 bottom-4 z-0 flex items-end">
                {currentStep === 3 && <div className="w-2 h-full bg-blue-500" />}
              </div>
              {/* Basin at the bottom */}
              <div className="absolute bottom-0 w-32 h-6 border-2 border-t-0 border-[#BDC3C7] rounded-b-md bg-blue-200/50 flex items-center justify-center">
                <span className="text-[8px] text-rose-600 font-bold">{currentStep >= 1 ? "كاشف أحمر 🔴" : "ماء مقطر"}</span>
              </div>
            </div>
          </div>
        );
      case "u5_l3": // Chlorine bleaching
        return (
          <div className="flex items-center justify-center gap-6 bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full">
            {/* Jar 1: Dry Chlorine */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">كلور جاف</span>
              <div className="w-14 h-28 border-2 border-slate-400 rounded-md relative flex flex-col items-center justify-center bg-yellow-50/20">
                <span className="text-xl">🌹</span>
                <span className="text-[8px] text-red-600 font-bold mt-1 bg-white px-1 rounded">محافظة على لونها</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-1">لا يوجد ماء</span>
            </div>
            {/* Jar 2: Wet Chlorine */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#2C3E50] mb-1">كلور رطب</span>
              <div className="w-14 h-28 border-2 border-slate-400 rounded-md relative flex flex-col items-center justify-center bg-yellow-100/30">
                <span className="text-xl transition-all duration-1000">
                  {currentStep >= 2 ? "🪷" : "🌹"}
                </span>
                <span className={`text-[8px] font-bold mt-1 bg-white px-1 rounded ${currentStep >= 2 ? "text-slate-400" : "text-red-600"}`}>
                  {currentStep >= 2 ? "زوال الألوان تماماً ⚪" : "وردة مبللة"}
                </span>
              </div>
              <span className="text-[9px] text-emerald-700 font-bold mt-1">
                {currentStep >= 2 ? "تبييض بفعل [O] 🧪" : "كاشف رطب"}
              </span>
            </div>
          </div>
        );
      case "u6_l1": // Gouy Balance for Transition metals
        return (
          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-[#E5E2DE] shadow-inner w-full h-full">
            <span className="text-[10px] font-bold text-[#7F8C8D] font-sans">ميزان غوي الحساس (الخواص المغناطيسية)</span>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col items-center">
                {/* Scale dial */}
                <div className="p-2 bg-slate-100 border border-slate-300 rounded text-center w-28">
                  <span className="text-[9px] block text-slate-500">الوزن الظاهري:</span>
                  <span className="text-xs font-mono font-bold text-[#2C3E50]">
                    {currentStep === 0 ? "5.00 g" :
                     currentStep === 1 ? "5.45 g (انجذاب) 🟢" :
                     currentStep === 2 ? "5.15 g (انجذاب خفيف)" :
                     "4.98 g (تنافر دايامغناطيسي) 🔴"}
                  </span>
                </div>
                {/* Visual balance suspension */}
                <div className="h-16 w-1 bg-slate-300 relative mt-2 flex justify-center">
                  <motion.div
                    animate={{
                      y: currentStep === 1 ? 10 : currentStep === 2 ? 4 : currentStep === 3 ? -2 : 0
                    }}
                    className={`absolute bottom-0 w-6 h-8 rounded border flex items-center justify-center text-[10px] font-bold text-white ${
                      currentStep === 1 ? "bg-emerald-600" : currentStep === 2 ? "bg-cyan-600" : currentStep === 3 ? "bg-slate-400" : "bg-[#2C3E50]"
                    }`}
                  >
                    {currentStep === 0 ? "Fe²⁺" :
                     currentStep === 1 ? "Fe²⁺" :
                     currentStep === 2 ? "Cu²⁺" : "Zn²⁺"}
                  </motion.div>
                </div>
                {/* Electromagnet poles */}
                <div className="flex gap-8 border-t-2 border-slate-400 w-20 justify-between px-1 text-[8px] text-slate-500 mt-0.5">
                  <span>S قطب</span>
                  <span>N قطب</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        // Render fallback Standard Beaker for standard experiments
        return (
          <div className="w-44 h-60 border-4 border-t-0 border-[#BDC3C7] rounded-b-3xl relative flex items-end justify-center overflow-hidden bg-white shadow-sm">
            {/* Colored Fluid state */}
            <motion.div
              animate={{
                height: currentStep > 0 ? "48%" : "5%"
              }}
              className={`absolute bottom-0 w-full transition-colors duration-1000 ${beakerWaterColor}`}
            />

            {/* Gas Bubbles popping up */}
            {bubbleActive && (
              <>
                <motion.div
                  animate={{ y: [-10, -110], x: [-15, 5, -10], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                  className="absolute w-2.5 h-2.5 bg-blue-300 rounded-full bottom-12"
                />
                <motion.div
                  animate={{ y: [-15, -120], x: [10, -5, 15], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: 0.2 }}
                  className="absolute w-2 h-2 bg-blue-300 rounded-full bottom-12"
                />
              </>
            )}

            {/* Fire Flame effects */}
            {(fizzleType === "violent_fizz" || fizzleType === "flame_methane" || fizzleType === "flame_heavy_smoke" || fizzleType === "flame_yellow" || fizzleType === "flame_purple" || fizzleType === "flame_crimson" || fizzleType === "white_p_spontaneous") && (
              <motion.div
                animate={{ scale: [1, 1.35, 1], rotate: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 0.35 }}
                className="absolute bottom-20 z-20 flex flex-col items-center"
              >
                <Flame className={`w-14 h-14 ${
                  fizzleType === "flame_purple" ? "text-purple-500 fill-purple-500" :
                  fizzleType === "flame_crimson" ? "text-red-500 fill-red-500" :
                  fizzleType === "flame_methane" ? "text-sky-400 fill-sky-300" :
                  fizzleType === "white_p_spontaneous" ? "text-yellow-300 fill-yellow-200" :
                  "text-orange-500 fill-orange-500"
                }`} />
                <span className="text-[8px] bg-red-600 text-white px-1 py-0.5 rounded-sm font-bold uppercase animate-pulse">تفاعل نشط!</span>
              </motion.div>
            )}

            {/* Heating Indicators */}
            {(fizzleType === "heating" || fizzleType === "heat_active") && (
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute bottom-16 z-10 flex flex-col items-center gap-1 text-orange-600"
              >
                <Thermometer className="w-8 h-8 animate-bounce text-orange-600" />
                <span className="text-[8px] bg-orange-100 border border-orange-200 text-orange-800 px-1 rounded-sm font-bold">تسخين...</span>
              </motion.div>
            )}

            {/* Precipitate white blocks */}
            {(fizzleType === "white_precipitate" || fizzleType === "crystals") && (
              <div className="absolute bottom-2 flex flex-wrap gap-1 justify-center px-4 w-full">
                <span className="w-2.5 h-2.5 bg-slate-100 border border-slate-300 rounded-xs animate-pulse" />
                <span className="w-3 h-3 bg-slate-100 border border-slate-300 rounded-xs animate-pulse" />
                <span className="w-2 h-2 bg-slate-200 border border-slate-300 rounded-xs animate-pulse" />
              </div>
            )}

            {/* Melt gold effect */}
            {fizzleType === "melting" && (
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="absolute bottom-12 z-20 flex flex-col items-center"
              >
                <Beaker className="w-10 h-10 text-[#E67E22] animate-bounce" />
                <span className="text-[9px] bg-[#E67E22] text-white px-1.5 py-0.5 rounded font-bold">إذابة تامة...</span>
              </motion.div>
            )}

            {/* Indicators texts */}
            {fizzleType === "finished" && (
              <div className="absolute bottom-4 text-[10px] font-bold text-[#E67E22] font-sans bg-white/90 px-2 py-0.5 rounded border border-[#E5E2DE] animate-pulse">
                تغير كيميائي كامل
              </div>
            )}
          </div>
        );
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start border-t border-[#E5E2DE] pt-6">
        
        {/* Left Side: Apparatus & Chemicals Panel */}
        <div className="lg:col-span-1 bg-[#F9F8F6] border border-[#E5E2DE] p-5 rounded-lg space-y-5 shadow-sm">
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

          <div>
            <span className="text-[10px] font-bold text-[#7F8C8D] block border-b border-[#E5E2DE] pb-2 mb-3 text-right font-sans uppercase tracking-wider">الأدوات المخبرية اللازمة</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {selectedExp.apparatus.map((app, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white rounded border border-[#E5E2DE] text-[10px] text-[#2C3E50] font-medium shadow-xs">
                  {app}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#7F8C8D] block border-b border-[#E5E2DE] pb-2 mb-3 text-right font-sans uppercase tracking-wider">المواد المتفاعلة والكواشف</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {selectedExp.chemicals.map((chem, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white rounded border border-[#E5E2DE] text-[10px] text-[#E67E22] font-semibold shadow-xs">
                  {chem}
                </span>
              ))}
            </div>
          </div>

          {/* Equation Box */}
          <div className="bg-[#2C3E50]/5 p-3 rounded border border-[#2C3E50]/15 text-center font-mono text-[10px] text-[#2C3E50] font-bold leading-relaxed overflow-x-auto select-all" dir="ltr">
            <span className="text-[9px] text-indigo-600 block mb-1 text-right font-sans">الرابطة / المعادلة الكيميائية للمحاكاة:</span>
            {selectedExp.equation}
          </div>
        </div>

        {/* Center: Live Simulation Chamber */}
        <div className="lg:col-span-1 bg-[#F9F8F6] border border-[#E5E2DE] p-6 rounded-lg flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden shadow-sm">
          <div className="absolute top-4 left-4 flex gap-1.5 items-center bg-white/80 px-2 py-0.5 rounded-full border border-[#E5E2DE]">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] text-emerald-700 font-bold font-sans">نظام الأمان النشط مفعل</span>
          </div>

          {/* Chamber Graphic Area */}
          <div className="flex-1 w-full flex items-center justify-center relative my-6 text-right">
            {renderSimulation()}
          </div>

          <div className="w-full flex justify-between items-center border-t border-[#E5E2DE] pt-4 mt-2">
            <span className="text-[10px] text-[#95A5A6] font-bold font-mono">STATUS: {chamberStatus}</span>
            <span className="text-[10px] text-[#E67E22] font-bold font-sans">خطوة {currentStep + 1} من {selectedExp.steps.length}</span>
          </div>
        </div>

        {/* Right Side: Step Instructions & Logs */}
        <div className="lg:col-span-1 bg-[#F9F8F6] border border-[#E5E2DE] p-5 rounded-lg flex flex-col justify-between min-h-[420px] shadow-sm">
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

      {/* Educational Theory and Explanation Section */}
      <div className="bg-[#F9F8F6] border border-[#E5E2DE] p-6 rounded-lg space-y-4 shadow-xs text-right mt-6">
        <div className="flex items-center gap-2 justify-end border-b border-[#E5E2DE] pb-2 mb-3">
          <h3 className="text-lg font-serif font-bold text-[#2C3E50]">لوحة التحليل الكيميائي والتفسير التعليمي المعتمد للتجربة</h3>
          <Info className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg border border-[#E5E2DE] space-y-2">
            <span className="text-xs font-bold text-indigo-700 block border-b border-[#F5F4F0] pb-1">الخلفية النظرية الكيميائية (منهج السودان):</span>
            <p className="text-xs text-[#1A1A1A] leading-relaxed">
              {getTheoryExplanation(selectedExp.id)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#E5E2DE] space-y-2">
            <span className="text-xs font-bold text-[#E67E22] block border-b border-[#F5F4F0] pb-1">الملاحظات والمشاهدات المخبرية:</span>
            <p className="text-xs text-[#1A1A1A] leading-relaxed">
              {getObservationExplanation(selectedExp.id)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#E5E2DE] space-y-2">
            <span className="text-xs font-bold text-emerald-700 block border-b border-[#F5F4F0] pb-1">الاستنتاج العلمي والمفاهيم الكيميائية:</span>
            <p className="text-xs text-[#1A1A1A] leading-relaxed">
              {getConclusionExplanation(selectedExp.id)}
            </p>
          </div>
        </div>
      </div>

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
