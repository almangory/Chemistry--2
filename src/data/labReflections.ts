export interface StepReflectionItem {
  stepNumber: number;
  action: string;
  observation: string; // ما يشاهده الطالب بدقة في المعمل
  scientificReason: string; // التفسير والتعليل العلمي للشهادة السودانية
  examTip: string; // التنبيه الامتحاني المعتمد (بخت الرضا)
  physicalState: string;
  colorState: string;
  chemicalProperty: string;
  equationOrFormula?: string;
  telemetry: {
    temp: number;
    ph: number;
    gas: number;
    weight?: number;
    liquidColor: string;
    liquidHeight?: number;
    isHeating: boolean;
    isBubbling: boolean;
    isPrecipitating: boolean;
    isSmoking: boolean;
    flameColor?: string;
    magneticFieldOn?: boolean;
    activeSubstance?: string;
  };
}

export interface CumulativeResultItem {
  sampleName: string;
  condition: string;
  result: string;
  scientificMeaning: string;
  status: "positive" | "negative" | "neutral";
}

export interface ExperimentReflection {
  id: string;
  apparatusType: "beaker" | "test_tubes" | "gas_prep" | "electrolysis" | "magnetic_balance" | "glass_basin";
  steps: StepReflectionItem[];
  cumulativeTable: CumulativeResultItem[];
  overallConclusion: string;
}

export const LAB_REFLECTIONS: Record<string, ExperimentReflection> = {
  // === UNIT 1: Classification & Periodicity ===
  u1_l1: {
    id: "u1_l1",
    apparatusType: "beaker",
    overallConclusion: "تثبت التجربة أن الكتلة الذرية للعنصر الأوسط في ثلاثية دوبرينر تساوي المتوسط الحسابي لكتلتي طرفي الثلاثية، مما شكل الأساس التاريخي لفكرة التدرج الدوري للعناصر.",
    cumulativeTable: [
      { sampleName: "الليثيوم (Li)", condition: "العنصر الأول في الثلاثية", result: "الكتلة الذرية = 6.94", scientificMeaning: "طرف الثلاثية السفلي", status: "neutral" },
      { sampleName: "البوتاسيوم (K)", condition: "العنصر الثالث في الثلاثية", result: "الكتلة الذرية = 39.10", scientificMeaning: "طرف الثلاثية العلوي", status: "neutral" },
      { sampleName: "الصوديوم (Na)", condition: "العنصر الأوسط المحسوب", result: "المتوسط = (6.94 + 39.10) ÷ 2 = 23.02", scientificMeaning: "مطابق تماماً للكتلة الفعلية (23.0) للصوديوم", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "تجهيز عينتي الليثيوم Li والبوتاسيوم K ووزنهما بدقة على الميزان التحليلي.",
        observation: "تسجيل الكتل الذرية الدقيقة للعنصرين: الليثيوم 6.94 والبوتاسيوم 39.10.",
        scientificReason: "عناصر المجموعة الأولى تشترك في الخواص الكيميائية التكافئية وتتدرج كتلها بانتظام.",
        examTip: "قانون الثلاثيات يطبق فقط على مجموعات محددة من العناصر ذات الخواص المتشابهة.",
        physicalState: "صلب فلزي",
        colorState: "فضي برّاق",
        chemicalProperty: "فلزات قلوية متشابهة الخواص",
        equationOrFormula: "Atomic Mass (Na) ≈ [Mass(Li) + Mass(K)] ÷ 2",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#e0f2fe", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "حساب المتوسط الحسابي الرياضي لكتلتي الليثيوم والبوتاسيوم ومقارنته بالصوديوم.",
        observation: "الناتج الحسابي هو (6.94 + 39.10) ÷ 2 = 23.02، وهو يطابق تماماً الكتلة الذرية الفعلية للصوديوم (23.0).",
        scientificReason: "التماثل في التركيب الإلكتروني لمستويات الطاقة الخارجية يربط الكتلة بالسلوك الكيميائي الدوري.",
        examTip: "احفظ نص قانون ثلاثيات دوبرينر كما ورد في كتاب بخت الرضا حرفياً.",
        physicalState: "مطابقة حسابية",
        colorState: "شفاف",
        chemicalProperty: "علاقة دوبرينر الرياضية",
        equationOrFormula: "Average = (6.94 + 39.10) / 2 = 23.02 ≈ 23.00 (Na)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#a5f3fc", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u1_l2: {
    id: "u1_l2",
    apparatusType: "test_tubes",
    overallConclusion: "التصنيف الفئوي (s, p, d, f) يعكس الخواص الفيزيائية والكيميائية؛ عناصر s و d جيدة التوصيل وملونة ومغناطيسية، بينما عناصر p رديئة التوصيل.",
    cumulativeTable: [
      { sampleName: "الصوديوم (s-block)", condition: "دائرة كهربائية + ماء", result: "إضاءة ساطعة للمصباح + فوران قلوي", scientificMeaning: "فلز نشط جداً ذو توصيل إلكتروني حر", status: "positive" },
      { sampleName: "الكلور (p-block)", condition: "دائرة كهربائية", result: "المصباح لا يضيء نهائياً", scientificMeaning: "لا فلز عازل لعدم وجود إلكترونات حرة", status: "negative" },
      { sampleName: "النحاس (d-block)", condition: "محلول مائي", result: "محلول أزرق وتوصيل ممتاز", scientificMeaning: "عنصر انتقالي ملون وموصل", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "اختبار التوصيل الكهربائي لفلز الصوديوم (فئة s).",
        observation: "توهج فوري وقوي للمصباح الكهربائي وتفاعل عنيف مع بخار الماء في الهواء.",
        scientificReason: "يمتلك الصوديوم إلكترون تكافؤ حراً وحيداً في المستوى 3s يسهل حركته ونقله للشحنات الكهربائية.",
        examTip: "عناصر الفئة s جميعها فلزات صلبة (عدا الهيدروجين الغازي) وعالية الكهرإيجابية.",
        physicalState: "فلز موصل للتيار",
        colorState: "فضي رمادي",
        chemicalProperty: "ناقلية كهربائية فائقة",
        equationOrFormula: "Na: [Ne] 3s¹",
        telemetry: { temp: 28, ph: 7.0, gas: 0, liquidColor: "#cbd5e1", liquidHeight: 0.5, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "اختبار التوصيل الكهربائي والخواص لعنصر الكلور (فئة p).",
        observation: "المصباح لا يضيء مطلقاً، وينبعث غاز أخضر مصفر خانق ذو رائحة نفاذة.",
        scientificReason: "عناصر فئة p تميل لجذب الإلكترونات لإكمال مستواها الخارجي بدلاً من فقدها، لذا تفتقر لإلكترونات حرة للتوصيل.",
        examTip: "عناصر فئة p تشمل اللافلزات وأشباه الفلزات وبعض الفلزات، وتقع أقصى يمين الجدول.",
        physicalState: "غاز عازل للتيار",
        colorState: "أخضر مصفر",
        chemicalProperty: "خاصية لا فلزية عازلة",
        equationOrFormula: "Cl: [Ne] 3s² 3p⁵",
        telemetry: { temp: 25, ph: 3.5, gas: 50, liquidColor: "#fef08a", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 3,
        action: "فحص محلول كبريتات النحاس لعنصر النحاس (فئة d الانتقالية).",
        observation: "تلون المحلول باللون الأزرق المائي الساحر مع استجابة مغناطيسية واضحة وتوصيل كهربائي جيد.",
        scientificReason: "وجود إلكترونات في أفلاك d غير ممتلئة يتيح امتصاص الضوء المرئي وترقية الإلكترونات وظهور الألوان.",
        examTip: "الفئة d تشغل وسط الجدول وتسمى العناصر الانتقالية الرئيسية وتتميز بتعدد حالات التأكسد.",
        physicalState: "محلول مائي ملون",
        colorState: "أزرق سماوي ناصع",
        chemicalProperty: "عنصر انتقالي ملون وبارامغناطيسي",
        equationOrFormula: "Cu: [Ar] 3d¹⁰ 4s¹ ⟶ Cu²⁺: [Ar] 3d⁹",
        telemetry: { temp: 25, ph: 5.5, gas: 0, liquidColor: "#0284c7", liquidHeight: 0.6, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u1_l3: {
    id: "u1_l3",
    apparatusType: "test_tubes",
    overallConclusion: "التدرج عبر الدورة الثالثة يظهر تناقص نصف القطر الذري وزيادة شحنة النواة الفعالة، مما يقلل النشاط الفلزي للصوديوم مقارنة بالمغنيسيوم، ويتحول الطابع من قاعدي قوي إلى متردد ثم حمضي.",
    cumulativeTable: [
      { sampleName: "الصوديوم (Na)", condition: "ماء بارد + كاشف", result: "اشتعال فوري مع فوران شديد ولون وردي", scientificMeaning: "نشاط فلزي عنيف (نصف قطر كبير)", status: "positive" },
      { sampleName: "المغنيسيوم (Mg)", condition: "ماء بارد", result: "لا تفاعل ظاهر على البارد", scientificMeaning: "خمول نسبي لنقصان الحجم الذري", status: "neutral" },
      { sampleName: "المغنيسيوم (Mg)", condition: "ماء مغلي (تسخين)", result: "تصاعد بطيء لفقاعات H2 وتلون بالوردي", scientificMeaning: "يتفاعل فقط بالحرارة للتغلب على طاقة التأين", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "إسقاط قطعة صوديوم صغيرة في كأس ماء بارد محتوي على الفينولفثالين.",
        observation: "تتحول قطعة الصوديوم لكرة فضية منصهرة تجري بسرعة وتشتعل بفرقعة، ويتلون المحلول فوراً باللون الوردي.",
        scientificReason: "كبر الحجم الذري للصوديوم وصغر شحنة النواة الفعالة يسهل فقد إلكترون التكافؤ فوراً متفاعلاً مع الماء لإنتاج NaOH القلوي وغاز H2.",
        examTip: "تفاعل الصوديوم مع الماء طارد للحرارة بشدة مما يسبب اشتعال الهيدروجين المتصاعد.",
        physicalState: "سائل قلوي نشط",
        colorState: "وردي فاقع",
        chemicalProperty: "نشاط فلزي قلوي قوي",
        equationOrFormula: "2Na + 2H2O ⟶ 2NaOH + H2↑ + Heat",
        telemetry: { temp: 75, ph: 13.5, gas: 150, liquidColor: "#ec4899", liquidHeight: 0.55, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 2,
        action: "وضع شريط مغنيسيوم ملمع في ماء بارد مع كاشف الفينولفثالين.",
        observation: "لا يظهر أي تفاعل محسوس في الماء البارد ويبقى المحلول عديم اللون.",
        scientificReason: "المغنيسيوم يقع بعد الصوديوم في الدورة، فشحنته النووية أكبر ونصف قطره أصغر وطاقة تأينه أعلى، فلا يفقد إلكترونيه على البارد.",
        examTip: "علل: يتفاعل الصوديوم مع الماء البارد بعنف بينما لا يتفاعل المغنيسيوم؟ لصغر نصف قطر المغنيسيوم وزيادة طاقة تأينه.",
        physicalState: "فلز خامل على البارد",
        colorState: "عديم اللون",
        chemicalProperty: "انخفاض النشاط الفلزي",
        equationOrFormula: "Mg + H2O (cold) ⟶ No visible reaction",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#e0f2fe", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "تسخين كأس المغنيسيوم والماء حتى الغليان.",
        observation: "تصاعد بطيء لفقاعات غاز الهيدروجين وتلون المحلول تدريجياً باللون الوردي الخفيف.",
        scientificReason: "الحرارة توفر طاقة التنشيط اللازمة لكسر الروابط وتأيين المغنيسيوم ليتفاعل منتجاً Mg(OH)2 الضعيف القلوية.",
        examTip: "المغنيسيوم يتفاعل ببطء مع الماء المغلي، لكنه يحترق في بخار الماء بشدة مكوناً MgO الأبيض.",
        physicalState: "محلول قلوي ضعيف ساخن",
        colorState: "وردي خفيف",
        chemicalProperty: "تفاعل فلزي مشروط بالحرارة",
        equationOrFormula: "Mg + 2H2O (boiling) ⟶ Mg(OH)2 + H2↑",
        telemetry: { temp: 95, ph: 9.8, gas: 45, liquidColor: "#f472b6", liquidHeight: 0.5, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true }
      }
    ]
  },

  // === UNIT 2: Alkali & Alkaline Earth Metals ===
  u2_l1: {
    id: "u2_l1",
    apparatusType: "glass_basin",
    overallConclusion: "فلزات الأقلاء تزداد شدة نشاطها وتفاعلها مع الماء طرداً بالنزول لأسفل المجموعة من Li إلى Na ثم K، نتيجة لزيادة نصف القطر وسهولة فقد إلكترون التكافؤ الوحيد.",
    cumulativeTable: [
      { sampleName: "الليثيوم (Li)", condition: "تفاعل مع الماء", result: "فوران هادئ دون اشتعال", scientificMeaning: "أقل الأقلاء نشاطاً لصغر حجمه", status: "neutral" },
      { sampleName: "الصوديوم (Na)", condition: "تفاعل مع الماء", result: "كرة منصهرة تجري وتشتعل بلهب أصفر", scientificMeaning: "تفاعل شديد طارد للحرارة", status: "positive" },
      { sampleName: "البوتاسيوم (K)", condition: "تفاعل مع الماء", result: "فرقعة فورية مع لهب بنفسجي خاطف", scientificMeaning: "تفاعل فائق العنف لسهولة فقد الإلكترون", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "وضع قطعة صوديوم بحجم حبة العدس في حوض زجاجي به ماء وكاشف.",
        observation: "تتحول قطعة الصوديوم لكرة منصهرة تسبح فوق سطح الماء مطلقة فرقعات وتشتعل بلهب أصفر ساطع، ويتلون المحلول بالوردي.",
        scientificReason: "انخفاض درجة انصهار الصوديوم وكبر حرارة التفاعل تجعله ينصهر على شكل كرة، ويتصاعد H2 مشتعلاً بالحرارة القوية.",
        examTip: "تحفظ فلزات الأقلاء تحت سطح الكيروسين أو البارافين لعزلها عن الهواء والرطوبة.",
        physicalState: "سائل قلوي منصهر",
        colorState: "لهب أصفر ذهبي",
        chemicalProperty: "اشتعال قلوي شديد",
        equationOrFormula: "2Na(s) + 2H2O(l) ⟶ 2NaOH(aq) + H2(g)↑ + ΔH",
        telemetry: { temp: 92, ph: 13.8, gas: 180, liquidColor: "#ec4899", liquidHeight: 0.6, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true, flameColor: "#eab308" }
      },
      {
        stepNumber: 2,
        action: "إسقاط قطعة بوتاسيوم مماثلة في الحوض الآخر.",
        observation: "اشتعال فوري عنيف وانفجار خاطف بلهب بنفسجي بهي يتناثر معه شرر المحلول القلوي.",
        scientificReason: "نصف القطر الذري للبوتاسيوم أكبر من الصوديوم، فإلكترون التكافؤ أبعد عن النواة وأسهل فقداً، فيكون التفاعل أشد عنفاً وتحرراً للطاقة.",
        examTip: "علل: البوتاسيوم أكثر نشاطاً من الصوديوم؟ لكبر حجم ذرته وسهولة فقد إلكترون التكافؤ.",
        physicalState: "انفجار خاطف",
        colorState: "لهب بنفسجي خاطف",
        chemicalProperty: "عنف التفاعل القلوي الفائق",
        equationOrFormula: "2K(s) + 2H2O(l) ⟶ 2KOH(aq) + H2(g)↑ + ΔH (أشد عنفاً)",
        telemetry: { temp: 110, ph: 14.0, gas: 220, liquidColor: "#a855f7", liquidHeight: 0.6, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true, flameColor: "#c084fc" }
      }
    ]
  },

  u2_l2: {
    id: "u2_l2",
    apparatusType: "test_tubes",
    overallConclusion: "اختبار اللهب (الكشف الجاف) يحدد هوية كاتيونات فلزات الأقلاء بدقة بناءً على اللون المميز الذي تطلقه عند إثارة إلكتروناتها بحرارة اللهب وعودتها للمستوى المستقر.",
    cumulativeTable: [
      { sampleName: "ملح الصوديوم (NaCl)", condition: "سلك بلاتين في لهب بنسن", result: "لهب أصفر ذهبي ناصع ومبهر", scientificMeaning: "طول موجي مميز لإلكترونات Na", status: "positive" },
      { sampleName: "ملح البوتاسيوم (KCl)", condition: "سلك بلاتين في لهب بنسن", result: "لهب بنفسجي فاتح (أرجواني)", scientificMeaning: "إثارة إلكترونات ذرة البوتاسيوم", status: "positive" },
      { sampleName: "ملح الليثيوم (LiCl)", condition: "سلك بلاتين في لهب بنسن", result: "لهب قرمزي (أحمر كرزي غامق)", scientificMeaning: "انبعاث طيفي مميز لليثيوم", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "تنظيف سلك البلاتين في حمض HCl المركز وغمسه في مسحوق ملح كلوريد الصوديوم ثم تقريبه من قاعدة لهب بنسن.",
        observation: "يتوهج اللهب فوراً بلون أصفر ذهبي ساطع يطغى على لون الموقد كلياً.",
        scientificReason: "الحرارة العالية تثير إلكترون التكافؤ في ذرة الصوديوم لمستوى طاقة أعلى، وعند هبوطه يطلق طاقة ضوئية بطول موجي 589 نانومتر (اللون الأصفر المميز).",
        examTip: "يستخدم حمض الهيدروكلوريك لتنظيف سلك البلاتين لأنه يحول الأملاح إلى كلوريدات سريعة التطاير.",
        physicalState: "طيف انبعاث ذري",
        colorState: "أصفر ذهبي ساطع",
        chemicalProperty: "بصمة طيفية للصوديوم",
        equationOrFormula: "Na* (excited) ⟶ Na (ground) + hν (λ = 589 nm)",
        telemetry: { temp: 650, ph: 7.0, gas: 0, liquidColor: "#e0f2fe", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#eab308" }
      },
      {
        stepNumber: 2,
        action: "اختبار ملح كلوريد البوتاسيوم KCl على لهب بنسن.",
        observation: "يتحول لهب الموقد إلى لون بنفسجي فاتح باهت (يمكن تدقيقه عبر زجاج الكوبالت الأزرق).",
        scientificReason: "فارق الطاقة بين مستويات الإثارة والاستقرار في ذرة البوتاسيوم يتوافق مع الأطوال الموجية للون البنفسجي.",
        examTip: "تستخدم شريحة زجاج الكوبالت الأزرق عند فحص البوتاسيوم لحجب وميض شوائب الصوديوم الصفراء.",
        physicalState: "طيف انبعاث ذري",
        colorState: "بنفسجي فاتح باهت",
        chemicalProperty: "بصمة طيفية للبوتاسيوم",
        equationOrFormula: "K* (excited) ⟶ K (ground) + hν (Violet)",
        telemetry: { temp: 680, ph: 7.0, gas: 0, liquidColor: "#e0f2fe", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#a855f7" }
      },
      {
        stepNumber: 3,
        action: "اختبار ملح كلوريد الليثيوم LiCl على لهب بنسن.",
        observation: "يشتعل اللهب بلون قرمزي أحمر كرزي عميق وفاتن.",
        scientificReason: "التركيب الإلكتروني لليثيوم يصدر فوتونات تقع في نطاق الضوء الأحمر القرمزي عند استرخاء إلكتروناته.",
        examTip: "الليثيوم يعطي لهباً قرمزياً، الصوديوم أصفر ذهبياً، والبوتاسيوم بنفسجياً.",
        physicalState: "طيف انبعاث ذري",
        colorState: "أحمر قرمزي كرزي",
        chemicalProperty: "بصمة طيفية لليثيوم",
        equationOrFormula: "Li* ⟶ Li + hν (Crimson Red, λ = 670 nm)",
        telemetry: { temp: 660, ph: 7.0, gas: 0, liquidColor: "#e0f2fe", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#e11d48" }
      }
    ]
  },

  // === UNIT 3: Organic Chemistry ===
  u3_l1: {
    id: "u3_l1",
    apparatusType: "beaker",
    overallConclusion: "تجربة فوهلر عام 1828 وجهت الضربة القاضية لنظرية القوة الحيوية لبرزيليوس بإثبات إمكانية تخليق مركب عضوي (اليوريا) معملياً من مادتين غير عضويتين بتسخين سيانات الأمونيوم.",
    cumulativeTable: [
      { sampleName: "كلوريد الأمونيوم + سيانات الفضة", condition: "خلط المحلولين المائيين", result: "راسب أبيض كثيف AgCl + رشاح سيانات أمونيوم", scientificMeaning: "تفاعل إحلال مزدوج غير عضوي", status: "neutral" },
      { sampleName: "سيانات الأمونيوم NH4CNO", condition: "تبخير بالتسخين الهين", result: "إعادة ترتيب الذرات وتكون بلورات بيضاء حريرية", scientificMeaning: "تخلق اليوريا العضوية CO(NH2)2", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "مزج محلول كلوريد الأمونيوم NH4Cl مع محلول سيانات الفضة AgCNO.",
        observation: "تكون راسب أبيض فوري من كلوريد الفضة AgCl مع بقاء سيانات الأمونيوم ذائبة في المحلول.",
        scientificReason: "تفاعل إحلال مزدوج بين ملحين غير عضويين يرسب كلوريد الفضة شحيح الذوبان في الماء.",
        examTip: "فوهلر استخدم سيانات الفضة وكلوريد الأمونيوم لتحضير سيانات الأمونيوم غير الثابتة.",
        physicalState: "راسب أبيض وسائل رائق",
        colorState: "حليبي أبيض",
        chemicalProperty: "ترسيب أملاح غير عضوية",
        equationOrFormula: "NH4Cl + AgCNO ⟶ AgCl↓ (white ppt) + NH4CNO (aq)",
        telemetry: { temp: 25, ph: 6.8, gas: 0, liquidColor: "#f8fafc", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: true, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "ترشيح الراسب وتسخين المحلول الرشاح (سيانات الأمونيوم) برفق حتى الجفاف.",
        observation: "تبخر الماء وتشكل بلورات إبرية بيضاء في قاع الجفنة تمثل اليوريا العضوية النقية.",
        scientificReason: "الحرارة تتسبب في إعادة ترتيب ذرات جزيء سيانات الأمونيوم غير الثابت حرارياً ليتحول إلى مركب اليوريا الأكثر ثباتاً.",
        examTip: "علل: أهمية تجربة فوهلر التاريخية؟ لأنها حطمت نظرية القوة الحيوية وفتحت عصر تخليق المركبات العضوية.",
        physicalState: "بلورات عضوية صلبة",
        colorState: "أبيض ناصع",
        chemicalProperty: "إعادة ترتيب جزيئي (تخليق عضوي)",
        equationOrFormula: "NH4CNO (سيانات الأمونيوم) ⟶Δ⟶ CO(NH2)2 (يوريا عضوية)",
        telemetry: { temp: 110, ph: 7.2, gas: 0, liquidColor: "#ffffff", liquidHeight: 0.2, isHeating: true, isBubbling: false, isPrecipitating: true, isSmoking: true }
      }
    ]
  },

  u3_l2: {
    id: "u3_l2",
    apparatusType: "beaker",
    overallConclusion: "قواعد الاتحاد الدولي للكيمياء البحتة والتطبيقية (IUPAC) تضمن تسمية فريدة ودقيقة لكل مركب عضوي عبر تحديد أطول سلسلة كربونية مستمرة وترقيمها من الطرف الأقرب لأول تفرع.",
    cumulativeTable: [
      { sampleName: "السلسلة الرئيسية (5 كربون)", condition: "ألكان مشبع مستقيم", result: "بنتان عادي Pentane", scientificMeaning: "الهيكل الكربوني الأساسي", status: "neutral" },
      { sampleName: "إضافة فرع ميثيل على C2", condition: "الترقيم من الطرف الأقرب", result: "2-ميثيل بنتان", scientificMeaning: "أصغر أرقام للتفرعات", status: "positive" },
      { sampleName: "إضافة فرع ميثيل ثانٍ على C4", condition: "استخدام سابقة ثنائي Di-", result: "2،4-ثنائي ميثيل بنتان", scientificMeaning: "تسمية IUPAC قياسية معتمدة", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "تحديد أطول سلسلة كربونية متصلة من ذرات الكربون.",
        observation: "اختيار 5 ذرات كربون متصلة لتشكيل جذر الألكان (بنتان Pentane).",
        scientificReason: "قواعد IUPAC تلزم البدء بأطول سلسلة مستمرة كمرجع أساسي للاسم.",
        examTip: "ليست السلسلة الأطول بالضرورة مستقيمة أفقياً، بل قد تكون ملتوية على شكل حرف L أو U.",
        physicalState: "سلسلة هيدروكربونية",
        colorState: "شفاف عضوي",
        chemicalProperty: "تحديد أطول سلسلة",
        equationOrFormula: "C-C-C-C-C (Pentane root)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#fed7aa", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "ترقيم ذرات الكربون من الطرف الأقرب للتفرع وإضافة مجموعة ألكيل.",
        observation: "الترقيم من اليمين يعطي التفرع الرقم 2 بدلاً من 4 إذا رُقم من اليسار، ليكون 2-ميثيل بنتان.",
        scientificReason: "قاعدة IUPAC تعطي البدائل أصغر الأرقام الممكنة لمواضع التفرع.",
        examTip: "يفصل بين الرقم والاسم بشرطة (-) وبين الأرقام بفاصلة (,).",
        physicalState: "ألكان متفرع",
        colorState: "شفاف عضوي",
        chemicalProperty: "ترقيم السلسلة الأقرب للتفرع",
        equationOrFormula: "CH3-CH(CH3)-CH2-CH2-CH3",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#fdba74", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u3_l3: {
    id: "u3_l3",
    apparatusType: "test_tubes",
    overallConclusion: "المركبات المتقابلة تبرهن على أن تدرج عدم التشبع من الروابط الأحادية إلى الثنائية فالثلاثية يغير السلوك الكيميائي جذرياً، كما أن الهيدروكربونات الحلقية المشبعة تختلف في ثباتها باختلاف زوايا الروابط.",
    cumulativeTable: [
      { sampleName: "الإيثان C2H6", condition: "رابطة أحادية سيجما (مشبع)", result: "خمول كيميائي نسبي", scientificMeaning: "ألكان مشبع بزاوية 109.5°", status: "neutral" },
      { sampleName: "الإيثين C2H4", condition: "رابطة ثنائية (سيجما + باي)", result: "نشاط كيميائي وتفاعلات إضافة", scientificMeaning: "ألكين غير مشبع بزاوية 120°", status: "positive" },
      { sampleName: "البروبان الحلقي C3H6", condition: "حلقة ثلاثية متوترة", result: "زاوية 60° وإجهاد زاوي شديد", scientificMeaning: "نشط وسهل فتح الحلقة لنظرية باير", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "مقارنة الرابطة التساهمية الأحادية في الإيثان والرابطة الثنائية في الإيثين.",
        observation: "الرابطة الأحادية سيجما قوية وموجهة في الفراغ، بينما الرابطة الثنائية تحوي رابطة باي سهلة الانكسار.",
        scientificReason: "التداخل الجانبي لأفلاك p في رابطة باي يجعل الكثافة الإلكترونية مكشوفة ويسهل استقطابها بالمتفاعلات.",
        examTip: "الرابطة الثنائية تتكون من رابطة سيجما قوية ورابطة باي ضعيفة سهلة الكسر.",
        physicalState: "غازات هيدروكربونية",
        colorState: "شفاف",
        chemicalProperty: "مقارنة التشبع وعدم التشبع",
        equationOrFormula: "Ethane (C-C σ) vs Ethene (C=C σ + π)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#e0f2fe", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "فحص بناء حلقة البروبان الحلقي C3H6 وزوايا الروابط.",
        observation: "زاوية الحلقة المثلثية تنضغط إلى 60° بدلاً من الزاوية الطبيعية 109.5°.",
        scientificReason: "انحراف الزاوية بمقدار 49.5° يسبب توتراً حلقياً هائلاً (Ring Strain) يجعل الحلقة غير مستقرة وسريعة التفاعل بفتح الحلقة.",
        examTip: "علل: البروبان الحلقي أكثر نشاطاً من باقي الألكانات؟ لشدة التوتر الزاوي لصغر زاويته (60°).",
        physicalState: "هيدروكربون حلقي متوتر",
        colorState: "شفاف",
        chemicalProperty: "إجهاد زوايا باير",
        equationOrFormula: "Cyclopropane Angle = 60° (Strain = 109.5° - 60° = 49.5°)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#bae6fd", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u3_l4: {
    id: "u3_l4",
    apparatusType: "gas_prep",
    overallConclusion: "ينتج غاز الميثان بالتقطير الجاف لأسيتات الصوديوم اللامائية مع الجير الصودي، ويجمع بإزاحة الماء لأسفل لعدم ذوبانه، ويحترق بلهب أزرق باهت غير مدخن.",
    cumulativeTable: [
      { sampleName: "أسيتات الصوديوم + الجير الصودي", condition: "تسخين شديد مباشر", result: "انصهار وتصاعد غاز عديم اللون والرائحة", scientificMeaning: "تفاعل نزع كربوكسيل وإنتاج CH4", status: "positive" },
      { sampleName: "غاز الميثان في المخبار", condition: "جمع فوق حوض الماء", result: "إزاحة الماء لأسفل وامتلاء المخبار بالغاز", scientificMeaning: "غاز شحيح الذوبان في الماء وأخف من الهواء", status: "positive" },
      { sampleName: "غاز الميثان المتجمع", condition: "تقريب شظية مشتعلة", result: "اشتعال بلهب أزرق باهت نظيف بلا دخان", scientificMeaning: "احتراق تام لألكان مشبع بنسبة هيدروجين عالية", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "خلط أسيتات الصوديوم اللامائية CH3COONa مع الجير الصودي (NaOH + CaO) في أنبوبة اختبار صلبة وتثبيتها مائلة.",
        observation: "تجهيز الخليط المتفاعل الجاف وتوصيل أنبوبة التوصيل لحوض الماء.",
        scientificReason: "الجير الحي CaO يمتص الرطوبة ويخفض درجة انصهار الخليط ويمنع التصاق وتآكل الزجاج.",
        examTip: "الجير الصودي خليط من الصودا الكاوية NaOH والجير الحي CaO، ولا يستخدم NaOH منفرداً لأنه يتلف الأواني.",
        physicalState: "مسحوق جاف صلب",
        colorState: "رمادي فاتح",
        chemicalProperty: "خليط التقطير الجاف",
        equationOrFormula: "CH3COONa + NaOH (CaO) ⟶Δ",
        telemetry: { temp: 25, ph: 12.0, gas: 0, liquidColor: "#94a3b8", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "تسخين الأنبوبة تسخيناً شديداً بموقد بنزن وجمع الغاز في مخبار مقلوب فوق الماء.",
        observation: "تصاعد سيل من فقاعات غاز الميثان في الحوض وإزاحة الماء في المخبار لأسفل حتى يمتلئ تماماً.",
        scientificReason: "غاز الميثان CH4 هيدروكربون غير قطبي شحيح الذوبان في الماء وأخف من الهواء، لذا يجمع بالإزاحة السفلية للماء.",
        examTip: "علل: يجمع غاز الميثان بإزاحة الماء لأسفل؟ لأنه شحيح الذوبان جداً في الماء.",
        physicalState: "غاز عديم اللون والرائحة",
        colorState: "شفاف",
        chemicalProperty: "إزاحة مائية للغاز الخامل",
        equationOrFormula: "CH3COONa(s) + NaOH(s) ⟶Δ, CaO⟶ CH4(g)↑ + Na2CO3(s)",
        telemetry: { temp: 250, ph: 7.0, gas: 220, liquidColor: "#0284c7", liquidHeight: 0.4, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true, flameColor: "#3b82f6" }
      },
      {
        stepNumber: 3,
        action: "إخراج مخبار الميثان وتقريب شظية مشتعلة من فوهته.",
        observation: "يشتعل الغاز بهدوء بلهب أزرق باهت نظيف جداً وخالٍ تماماً من الدخان أو السخام.",
        scientificReason: "نسبة الكربون في الميثان منخفضة (ذرة واحدة مقابل 4 ذرات H) مما يتيح احتراقاً تاماً وكاملاً في أكسجين الهواء.",
        examTip: "الميثان يحترق بلهب أزرق غير مدخن، بينما الإيثاين يحترق بلهب مدخن لكبر نسبة الكربون.",
        physicalState: "اشتعال غازي أزرق",
        colorState: "لهب أزرق باهت نظيف",
        chemicalProperty: "احتراق تام للألكانات المشبعة",
        equationOrFormula: "CH4 + 2O2 ⟶ CO2 + 2H2O + 890 kJ (احتراق تام نظيف)",
        telemetry: { temp: 800, ph: 7.0, gas: 0, liquidColor: "#0284c7", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#38bdf8" }
      }
    ]
  },

  u3_l5: {
    id: "u3_l5",
    apparatusType: "beaker",
    overallConclusion: "تفاعل ماء البروم الأحمر في CCl4 كشف قطعي للتمييز بين الهيدروكربونات المشبعة وغير المشبعة؛ حيث يزول اللون الأحمر فوراً مع الألكينات (الإيثين) لانكسار رابطة باي والإضافة، بينما يبقى اللون ثابتاً مع الألكانات (الإيثان).",
    cumulativeTable: [
      { sampleName: "الإيثان المشبع (C2H6)", condition: "إضافة ماء البروم الأحمر", result: "بقاء اللون البرتقالي المحمر ثابتاً دون تغير", scientificMeaning: "خمول الألكان وروابط سيجما القوية", status: "negative" },
      { sampleName: "الإيثين غير المشبع (C2H4)", condition: "إضافة ماء البروم الأحمر", result: "زوال فوري للون البروم وتحوله لشفاف", scientificMeaning: "كسر رابطة باي وتكون 1,2-ثنائي برومو إيثان عديم اللون", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "إمرار غاز الإيثان المشبع C2H6 في أنبوبة اختبار تحوي ماء البروم الأحمر المذاب في CCl4.",
        observation: "يبقى لون ماء البروم الأحمر البرتقالي راسخاً دون أدنى تغير أو زوال.",
        scientificReason: "الإيثان ألكان مشبع جميع روابطه من نوع سيجما القوية التي تقاوم الكسر في الظروف العادية بدون ضوء شمس مباشر.",
        examTip: "الألكانات المشبعة لا تتفاعل مع ماء البروم الأحمر في الظلام وتتفاعل فقط بالإحلال في ضوء الشمس المباشر.",
        physicalState: "محلول بروم أحمر ثابت",
        colorState: "أحمر برتقالي",
        chemicalProperty: "خمول تشبع الألكانات",
        equationOrFormula: "CH3-CH3 + Br2 / CCl4 ⟶ No Reaction (Dark)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#ea580c", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "إمرار غاز الإيثين غير المشبع C2H4 (المحضر بنزع الماء من الكحول) في ماء البروم ورج الأنبوبة.",
        observation: "يزول اللون الأحمر لماء البروم فوراً في ثوانٍ معدودة ويتحول المحلول إلى سائل شفاف رائق عديم اللون كلياً.",
        scientificReason: "تنكسر الرابطة التساهمية الثنائية باي الضعيفة بين ذرتي الكربون وتضاف ذرتا البروم مكونة 1,2-ثنائي برومو إيثان عديم اللون.",
        examTip: "علل: يزول لون ماء البروم الأحمر مع الإيثين؟ لانكسار رابطة باي وتكون 1,2-ثنائي برومو إيثان عديم اللون.",
        physicalState: "سائل عضوي شفاف رائق",
        colorState: "عديم اللون كلياً (زوال الأحمر)",
        chemicalProperty: "تفاعل إضافة لمركب غير مشبع",
        equationOrFormula: "CH2=CH2 + Br2 (أحمر) ⟶ CH2Br-CH2Br (1,2-ثنائي برومو إيثان عديم اللون)",
        telemetry: { temp: 28, ph: 7.0, gas: 0, liquidColor: "#f8fafc", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u3_l6: {
    id: "u3_l6",
    apparatusType: "gas_prep",
    overallConclusion: "تفاعل تنقيط الماء على كربيد الكالسيوم يولد الإيثاين (الأسيتلين) في تفاعل طارد للحرارة بشدة، والذي يحترق في الهواء بلهب مدخن، بينما في وفرة الأكسجين ينتج لهب الأكسي-أسيتلين البالغ 3000°C المستخدم في قطع وصهر المعادن.",
    cumulativeTable: [
      { sampleName: "كربيد الكالسيوم CaC2 + ماء", condition: "تنقيط هادئ", result: "فوران شديد وتصاعد فوري لغاز الإيثاين", scientificMeaning: "تحلل مائي للملح وإنتاج C2H2 + Ca(OH)2", status: "positive" },
      { sampleName: "غاز الإيثاين في الهواء", condition: "تقريب لهب", result: "لهب أصفر ساطع مصحوب بسخام ودخان أسود", scientificMeaning: "احتراق غير تام لارتفاع نسبة الكربون", status: "neutral" },
      { sampleName: "غاز الإيثاين + أكسجين نقي", condition: "شعلة لحام أكسي-أسيتلين", result: "لهب أزرق باهر جداً وحرارة 3000°C تصهر الحديد", scientificMeaning: "احتراق تام عالي الطاقة الحرارية", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "تنقيط الماء قطرة قطرة على قطع كربيد الكالسيوم الصلبة في دورق التحضير.",
        observation: "فوران عنيف وسخونة بالغة للدورق مع انطلاق سريع لغاز الإيثاين C2H2 ذي الرائحة النفاذة لشوائب الفوسفين.",
        scientificReason: "تفاعل تحلل مائي عنيف وطارد للحرارة يكسر شبكة CaC2 لإنتاج غاز الإيثاين وهيدروكسيد الكالسيوم.",
        examTip: "يمرر غاز الإيثاين قبل جمعه على محلول كبريتات النحاس المحمضة لتنقيته من شوائب PH3 و H2S.",
        physicalState: "فوران وتصاعد غازي سريع",
        colorState: "رمادي عكر في القاع",
        chemicalProperty: "تحلل مائي طارد للحرارة",
        equationOrFormula: "CaC2(s) + 2H2O(l) ⟶ Ca(OH)2(s) + C2H2(g)↑ + Heat",
        telemetry: { temp: 85, ph: 12.5, gas: 240, liquidColor: "#cbd5e1", liquidHeight: 0.5, isHeating: false, isBubbling: true, isPrecipitating: true, isSmoking: true }
      },
      {
        stepNumber: 2,
        action: "إشعال غاز الإيثاين النقي في موقد خلط الأكسجين (شعلة الأكسي-أسيتلين).",
        observation: "يتولد لهب مبهر شديد التوهج بحرارة تقارب 3000 درجة مئوية يؤدي لانصهار وقطع ألواح الفولاذ فوراً!",
        scientificReason: "الاحتراق التام للإيثاين في الأكسجين النقي يطلق كمية هائلة من الطاقة المركزة ترفع درجة حرارة اللهب لـ 3000°C.",
        examTip: "علل: يستخدم لهب الأكسي-أسيتلين في لحام وقطع المعادن؟ لأن احتراقه في الأكسجين يولد حرارة فائقة تصل إلى 3000°C تكفي لصهر الحديد.",
        physicalState: "شعلة بلازما حرارية فائقة",
        colorState: "لهب أزرق أبيض مبهر",
        chemicalProperty: "طاقة احتراق الإيثاين الفائقة",
        equationOrFormula: "2C2H2 + 5O2 ⟶ 4CO2 + 2H2O + 2600 kJ (3000°C)",
        telemetry: { temp: 3000, ph: 7.0, gas: 0, liquidColor: "#cbd5e1", liquidHeight: 0.5, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#60a5fa" }
      }
    ]
  },

  u3_l7: {
    id: "u3_l7",
    apparatusType: "test_tubes",
    overallConclusion: "استقرار حلقة البنزين العطري يرجع إلى ظاهرة الرنين واللاموضعية لإلكترونات باي الستة، مما يمنع تفاعلات الأكسدة والإضافة مع KMnO4 مقارنة بالألكين العادي.",
    cumulativeTable: [
      { sampleName: "الهكسين C6H12", condition: "إضافة برمنجنات البوتاسيوم KMnO4", result: "زوال اللون البنفسجي وتكون راسب بني MnO2", scientificMeaning: "تأكسد الألكين لسهولة كسر رابطة باي", status: "positive" },
      { sampleName: "البنزين C6H6", condition: "إضافة برمنجنات البوتاسيوم KMnO4", result: "بقاء اللون البنفسجي راسخاً دون أدنى تفاعل", scientificMeaning: "ثبات حلقة البنزين الخارقة بفعل طاقة الرنين", status: "negative" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "إضافة محلول برمنجنات البوتاسيوم البنفسجي KMnO4 إلى أنبوبة الهكسين ورجها.",
        observation: "يزول اللون البنفسجي فوراً ويتكون راسب بني من ثاني أكسيد المنجنيز MnO2.",
        scientificReason: "الرابطة المزدوجة في الهكسين غير مشبعة وتتأكسد بسهولة بواسطة العامل المؤكسد القوي مكونة ديول.",
        examTip: "اختبار باير (KMnO4) يكشف عن عدم التشبع بزوال اللون البنفسجي وظهور راسب بني.",
        physicalState: "محلول رائق وراسب بني",
        colorState: "بني عكر (زوال البنفسجي)",
        chemicalProperty: "أكسدة ألكين غير مشبع",
        equationOrFormula: "C6H12 + [O] + H2O ⟶ C6H12(OH)2 + MnO2↓",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#78350f", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: true, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "إضافة محلول برمنجنات البوتاسيوم البنفسجي إلى أنبوبة البنزين العطري ورجها.",
        observation: "يبقى اللون البنفسجي الغامق ثابتاً وراسخاً تماماً دون أي تغيير مهما طال الرج.",
        scientificReason: "حلقة البنزين تتمتع بثبات استثنائي (طاقة رنين 150 kJ/mol) لسحابة إلكترونات باي غير المتمركزة، مما يمنع مهاجمة المؤكسدات للروابط.",
        examTip: "علل: يقاوم البنزين الأكسدة ببرمنجنات البوتاسيوم؟ بسبب ثبات الرنين وتمركز الإلكترونات في سحابة دائرية مستقرة.",
        physicalState: "سائل ذو طبقتين محافظ على لونه",
        colorState: "بنفسجي داكن ملكي",
        chemicalProperty: "ثبات حلقة الرنين الأروماتية",
        equationOrFormula: "C6H6 + KMnO4 ⟶ No Reaction (Resonance Stabilization)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#7e22ce", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u3_l8: {
    id: "u3_l8",
    apparatusType: "test_tubes",
    overallConclusion: "التماكب السلسلي يثبت أن الخواص الفيزيائية والكيميائية لا تتحدد بالصيغة الجزيئية فقط بل بالهيكل البنائي وترتيب الروابط، واختبار ماء البروم يميز بين الألكين والألكان الحلقي.",
    cumulativeTable: [
      { sampleName: "متماكبات C5H12 الثلاثة", condition: "مقارنة الهيكل ودرجات الغليان", result: "بنتان عادي (36°C) > 2-ميثيل بيوتان (28°C) > 2،2-ثنائي ميثيل بروبان (9.5°C)", scientificMeaning: "زيادة التفرع تقلل المساحة السطحية وتخفض درجة الغليان", status: "neutral" },
      { sampleName: "البروبين (CH2=CH-CH3)", condition: "إضافة ماء البروم الأحمر", result: "زوال فوري للون الأحمر للبروم", scientificMeaning: "ألكين غير مشبع يكسر رابطة باي", status: "positive" },
      { sampleName: "البروبان الحلقي (C3H6)", condition: "إضافة ماء البروم في الظلام", result: "بقاء اللون الأحمر ثابتاً دون تغير", scientificMeaning: "ألكان حلقي مشبع يقاوم الإضافة في الظلام", status: "negative" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "إضافة ماء البروم الأحمر إلى أنبوبة البروبين غير المشبع C3H6.",
        observation: "يزول اللون الأحمر للبروم فوراً ويصبح المحلول عديم اللون تماماً.",
        scientificReason: "وجود الرابطة الثنائية يتيح تفاعل الإضافة كاسراً رابطة باي ومكوناً 1،2-ثنائي برومو بروبان عديم اللون.",
        examTip: "البروبين ألكين غير مشبع يتفاعل مع ماء البروم بالإضافـة، بينما البروبان الحلقي مشبع.",
        physicalState: "سائل شفاف رائق",
        colorState: "عديم اللون",
        chemicalProperty: "تفاعل إضافة مع الألكين",
        equationOrFormula: "CH2=CH-CH3 + Br2 ⟶ CH2Br-CHBr-CH3",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f8fafc", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "إضافة ماء البروم الأحمر إلى أنبوبة البروبان الحلقي المشبع C3H6 في الظلام.",
        observation: "يبقى لون ماء البروم الأحمر ثابتاً دون أي تغير، مما يؤكد التمييز العملي بين المتماكبين.",
        scientificReason: "البروبان الحلقي ألكان حلقي مشبع بروابط أحادية يقاوم الإضافة في غياب الضوء والحرارة المرتفعة.",
        examTip: "سؤال وزاري متكرر: كيف تميز عملياً بين البروبين والبروبان الحلقي؟ بإضافة ماء البروم الأحمر؛ يزول اللون مع البروبين ويثبت مع البروبان الحلقي.",
        physicalState: "محلول أحمر ثابت",
        colorState: "أحمر برتقالي",
        chemicalProperty: "خمول الألكان الحلقي في الظلام",
        equationOrFormula: "Cyclopropane + Br2 (dark) ⟶ No Reaction",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#ea580c", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  // === UNIT 4: Group 5 Elements ===
  u4_l1: {
    id: "u4_l1",
    apparatusType: "beaker",
    overallConclusion: "يرجع التباين الشديد في نشاط متآصلي الفوسفور إلى البنية الجزيئية؛ فالفوسفور الأبيض ذو جزيئات P4 هرمية بزوايا 60° متوترة بشدة مما يجعله يشتعل ذاتياً عند 30°C، بينما الفوسفور الأحمر شبكة بوليمرية مستقرة تحتاج حرارة 240°C للاشتعال.",
    cumulativeTable: [
      { sampleName: "الفوسفور الأبيض (White P)", condition: "تعريض للهواء عند 30°C", result: "اشتعال ذاتي فوري مع دخان أبيض كثيف P4O10", scientificMeaning: "توتر زاوي شديد (60°) ونشاط متفجر", status: "positive" },
      { sampleName: "الفوسفور الأحمر (Red P)", condition: "تعريض للهواء عند 30°C", result: "مستقر تماماً ولا يشتعل إلا بالتسخين لـ 240°C", scientificMeaning: "بنية بوليمرية مترابطة ومستقرة", status: "neutral" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "تسخين الفوسفور الأحمر الصلب على ملعقة احتراق في الهواء.",
        observation: "لا يشتعل الفوسفور الأحمر إلا بعد تسخين مباشر شديد يتجاوز 240°C مطلقاً لهباً أصفر ودخاناً أبيض.",
        scientificReason: "السلاسل البوليمرية في الفوسفور الأحمر تتطلب طاقة تنشيط عالية لتفكيك روابطها قبل التفاعل مع الأكسجين.",
        examTip: "الفوسفور الأبيض يحفظ تحت الماء لمنع ملامسته للهواء، بينما الفوسفور الأحمر مسحوق ثابت لا يشتعل تلقائياً.",
        physicalState: "احتراق صلب متأخر",
        colorState: "أحمر قرميدي يتحول لأبخرة بيضاء",
        chemicalProperty: "ثبات بوليمري حراري",
        equationOrFormula: "4P(red) + 5O2 ⟶Δ (240°C)⟶ P4O10",
        telemetry: { temp: 240, ph: 7.0, gas: 0, liquidColor: "#dc2626", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: true, flameColor: "#facc15" }
      },
      {
        stepNumber: 2,
        action: "تجفيف قطعة صغيرة من الفوسفور الأبيض وتركها في هواء الغرفة (30°C).",
        observation: "تتوهج القطعة بوميض خافت ثم تشتعل تلقائياً بلهب أصفر ساطع ومبهر وتطلق سحباً كثيفة من خامس أكسيد الفوسفور P4O10!",
        scientificReason: "الزوايا بين ذرات الفوسفور في جزيء P4 محصورة عند 60° بدلاً من 109.5°، مما يسبب إجهاداً جزيئياً خارقاً يجعل الروابط تنكسر ذاتياً بملامسة الأكسجين عند حرارة الغرفة.",
        examTip: "علل: يشتعل الفوسفور الأبيض تلقائياً في الهواء؟ لشدة التوتر الزاوي (60°) في جزيء P4 وضعف الروابط التساهمية.",
        physicalState: "اشتعال ذاتي خطير وأبخرة كثيفة",
        colorState: "لهب أصفر ساطع ودخان أبيض P4O10",
        chemicalProperty: "اشتعال ذاتي فائق لمتآصل الفوسفور الأبيض",
        equationOrFormula: "P4(s, white) + 5O2(g) ⟶ P4O10(s) + Heat (30°C Auto-ignition)",
        telemetry: { temp: 350, ph: 3.0, gas: 80, liquidColor: "#fef08a", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: true, flameColor: "#fde047" }
      }
    ]
  },

  u4_l2: {
    id: "u4_l2",
    apparatusType: "gas_prep",
    overallConclusion: "يحضر النيتروجين معملياً بالانحلال الحراري الهين لنتريت الأمونيوم (المحضر في وسط التفاعل من NaNO2 و NH4Cl)، ويجمع بإزاحة الماء لأسفل لقلة ذوبانه في الماء.",
    cumulativeTable: [
      { sampleName: "NaNO2 + NH4Cl في الماء", condition: "تسخين هين منتظم", result: "انحلال حراري هادئ وتصاعد فقاعات N2", scientificMeaning: "تفكك NH4NO2 إلى N2 و H2O", status: "positive" },
      { sampleName: "غاز النيتروجين في المخبار", condition: "جمع فوق الماء", result: "إزاحة الماء لأسفل وامتلاء المخبار بغاز نقي", scientificMeaning: "غاز خامل قليل الذوبان في الماء", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "تسخين خليط نتريت الصوديوم وكلوريد الأمونيوم في دورق التحضير تسخيناً هيناً.",
        observation: "تصاعد سيل مستمر من فقاعات غاز النيتروجين عديم اللون والرائحة عبر أنبوبة التوصيل إلى حوض الماء.",
        scientificReason: "يتكون ملح نتريت الأمونيوم NH4NO2 غير الثابت حرارياً في المحلول، والذي يتفكك بالحرارة اللطيفة إلى غاز النيتروجين وبخار الماء.",
        examTip: "علل: لا يسخن ملح نتريت الأمونيوم الصلب مباشرة؟ لأنه مركب غير ثابت وقد ينفجر بعنف عند التسخين الجاف المباشر.",
        physicalState: "تصاعد غاز خامل نقي",
        colorState: "شفاف",
        chemicalProperty: "انحلال حراري هين للملح",
        equationOrFormula: "NH4Cl + NaNO2 ⟶ [NH4NO2] ⟶Δ⟶ N2↑ + 2H2O + NaCl",
        telemetry: { temp: 85, ph: 7.0, gas: 200, liquidColor: "#e0f2fe", liquidHeight: 0.45, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u4_l3: {
    id: "u4_l3",
    apparatusType: "gas_prep",
    overallConclusion: "تجربة نافورة النشادر تثبت الذوبانية الفائقة والاستثنائية لغاز الأمونيا في الماء (700 حجم غاز يذوب في حجم واحد ماء)، والطابع القاعدي القوي لمحلول هيدروكسيد الأمونيوم الناتج.",
    cumulativeTable: [
      { sampleName: "غاز الأمونيا + قطرات ماء", condition: "حقن الماء في الدورق المقلوب", result: "ذوبان خاطف للغاز وخلخلة ضغط شديدة", scientificMeaning: "فراغ فوري وسحب الماء للأعلى", status: "positive" },
      { sampleName: "النافورة المندفعة", condition: "دخول الماء المحتوي على تباع الشمس الأحمر", result: "اندلاع نافورة زرقاء ناصعة وساحرة بالدورق", scientificMeaning: "قلوية شديدة لتكون أيونات OH⁻", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "حقن قطرات من الماء داخل الدورق المستدير المملوء بغاز النشادر الجاف.",
        observation: "يذوب غاز الأمونيا في قطرات الماء في كسر من الثانية مما يخلق خلخلة هائلة في الضغط داخل الدورق.",
        scientificReason: "الأمونيا شديدة القطبية وتكون روابط هيدروجينية قوية جداً مع الماء، فيذوب حجم هائل من الغاز مخلفاً فراغاً شبه تام.",
        examTip: "علل: يندفع الماء في تجربة نافورة النشادر؟ لأن ذوبان الغاز الفوري في الماء يحدث خلخلة كبيرة في الضغط الداخلي.",
        physicalState: "خلخلة ضغط وذوبان فائق",
        colorState: "شفاف إلى وردي",
        chemicalProperty: "ذوبانية خارقة لغاز قطبي",
        equationOrFormula: "NH3(g) + H2O(l) ⇌ NH4⁺(aq) + OH⁻(aq)",
        telemetry: { temp: 25, ph: 11.5, gas: 0, liquidColor: "#1d4ed8", liquidHeight: 0.7, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "مراقبة اندفاع الماء من الحوض السفلي إلى داخل الدورق المقلوب.",
        observation: "يندفع الماء للأعلى بقوة تحت تأثير الضغط الجوي لينفجر في صورة نافورة زرقاء ناصعة ومبهرة تملأ الدورق كلياً.",
        scientificReason: "دليل تباع الشمس الأحمر يتحول إلى اللون الأزرق في الوسط القلوي لتصاعد تركيز أيونات الهيدروكسيد OH⁻ الناتجة عن تأين الأمونيا.",
        examTip: "لون النافورة أزرق لأن محلول الأمونيا قلوي التأثير على دليل تباع الشمس.",
        physicalState: "نافورة مائية قلوية زرقاء",
        colorState: "أزرق نيلي ساحر",
        chemicalProperty: "قلوية محلول النشادر المائي",
        equationOrFormula: "Indicator: Red Litmus ⟶ Blue (Base, pH = 11.5)",
        telemetry: { temp: 26, ph: 11.5, gas: 0, liquidColor: "#1e40af", liquidHeight: 0.85, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u4_l4: {
    id: "u4_l4",
    apparatusType: "beaker",
    overallConclusion: "التحليل الكيميائي لسماد كبريتات الأمونيوم يثبت احتواءه على شقين: كاتيون الأمونيوم NH4⁺ (الذي يطلق غاز النشادر القلوي عند تسخينه مع NaOH) وأنيون الكبريتات SO4²⁻ (الذي يكون راسباً أبيض غير ذائب من BaSO4 مع BaCl2).",
    cumulativeTable: [
      { sampleName: "السماد + هيدروكسيد الصوديوم", condition: "تسخين لطيف", result: "تصاعد غاز نفاذ يزرق ورقة تباع الشمس الرطبة", scientificMeaning: "تأكيد وجود كاتيون الأمونيوم NH4⁺", status: "positive" },
      { sampleName: "محلول السماد + كلوريد الباريوم BaCl2", condition: "إضافة على البارد", result: "تكون راسب أبيض ناصع لا يذوب في HCl", scientificMeaning: "تأكيد وجود أنيون الكبريتات SO4²⁻", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "تسخين عينة سماد كبريتات الأمونيوم مع محلول NaOH ووضع ورقة تباع شمس حمراء رطبة على فوهة الأنبوبة.",
        observation: "انطلاق غاز النشادر برائحته النفاذة وتحول ورقة تباع الشمس الحمراء فوراً إلى اللون الأزرق.",
        scientificReason: "القاعدة القوية تطرد القاعدة الضعيفة؛ فيتفكك ملح الأمونيوم مع هيدروكسيد الصوديوم ويطلق غاز الأمونيا القلوي.",
        examTip: "الكشف عن كاتيون الأمونيوم يتم بالتسخين مع قلوي قوي وملاحظة رائحة النشادر وتزريق ورقة تباع الشمس.",
        physicalState: "تصاعد غاز قلوي مخرش",
        colorState: "أزرق قماشي",
        chemicalProperty: "طرد غاز النشادر بالقلويات",
        equationOrFormula: "(NH4)2SO4 + 2NaOH ⟶ Na2SO4 + 2NH3↑ + 2H2O",
        telemetry: { temp: 70, ph: 10.5, gas: 60, liquidColor: "#fef08a", liquidHeight: 0.5, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 2,
        action: "إضافة محلول كلوريد الباريوم BaCl2 إلى محلول مائي من السماد.",
        observation: "تشكل فوري لراسب أبيض ناصع وكثيف جداً لا يذوب عند إضافة حمض الهيدروكلوريك المخفف.",
        scientificReason: "أيونات الباريوم Ba²⁺ تتحد مع أيونات الكبريتات SO4²⁻ لترسيب كبريتات الباريوم BaSO4 غير الذائبة في الأحماض المعدنية.",
        examTip: "راسب BaSO4 الأبيض يميز الكبريتات لأنه لا يذوب في حمض HCl، بينما راسب كبريتيت الباريوم BaSO3 يذوب في الحمض.",
        physicalState: "راسب أبيض كثيف",
        colorState: "أبيض حليبي ناصع",
        chemicalProperty: "ترسيب الكبريتات النوعي",
        equationOrFormula: "Ba²⁺(aq) + SO4²⁻(aq) ⟶ BaSO4↓ (راسب أبيض غير ذائب)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f8fafc", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: true, isSmoking: false }
      }
    ]
  },

  // === UNIT 5: Halogens ===
  u5_l1: {
    id: "u5_l1",
    apparatusType: "test_tubes",
    overallConclusion: "تدرج النشاط الكيميائي للهالوجينات ينخفض بالنزول لأسفل المجموعة؛ فالكلور أكثر نشاطاً وقدرة على الأكسدة من البروم ويزيحه من أملاحه، والبروم يزيح اليود من يوديد البوتاسيوم.",
    cumulativeTable: [
      { sampleName: "بروميد البوتاسيوم KBr", condition: "إضافة ماء الكلور Cl2 + CCl4", result: "ظهور لون برتقالي محمر بطبقة CCl4", scientificMeaning: "الكلور يزيح البروم: Cl2 + 2KBr ⟶ 2KCl + Br2", status: "positive" },
      { sampleName: "يوديد البوتاسيوم KI", condition: "إضافة ماء البروم Br2 + CCl4", result: "ظهور لون بنفسجي ياقوتي غامق بطبقة CCl4", scientificMeaning: "البروم يزيح اليود: Br2 + 2KI ⟶ 2KBr + I2", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "إضافة ماء الكلور الأصفر الشاحب Cl2 إلى محلول بروميد البوتاسيوم KBr عديم اللون، ثم إضافة قطرات من CCl4 ورج الأنبوبة.",
        observation: "يتحول المحلول إلى اللون البرتقالي المحمر وتنفصل طبقة عضوية برتقالية كثيفة في قاع الأنبوبة.",
        scientificReason: "الكلور أعلى في المجموعة، وصغر حجم ذرته يمنحه كهرسلبية وقوة أكسدة أعلى فينتزع الإلكترونات من أيونات البروميد ويزيح البروم الحر Br2.",
        examTip: "الهالوجين الأكثر نشاطاً يطرد الهالوجين الأقل نشاطاً من محاليل أملاحه، والترتيب: F2 > Cl2 > Br2 > I2.",
        physicalState: "انفصال طبقتين",
        colorState: "برتقالي محمر للبروم",
        chemicalProperty: "إزاحة هالوجينية للأيون الأقل نشاطاً",
        equationOrFormula: "Cl2(aq) + 2KBr(aq) ⟶ 2KCl(aq) + Br2(l)",
        telemetry: { temp: 25, ph: 6.0, gas: 0, liquidColor: "#ea580c", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "إضافة ماء البروم البرتقالي إلى محلول يوديد البوتاسيوم KI عديم اللون، ورجه مع CCl4.",
        observation: "يتلون المحلول باللون البني المحمر وينفصل في طبقة CCl4 السفلية بلون بنفسجي ياقوتي ساحر لليود الحر.",
        scientificReason: "البروم يسبق اليود في المجموعة السابعة وهو أقوى منه أكسدة، فيزيح أيونات اليوديد I⁻ متحولة إلى اليود الحر I2 الذائب بلون بنفسجي في المذيب العضوي.",
        examTip: "يستخدم رابع كلوريد الكربون CCl4 لاستخلاص وتأكيد لون الهالوجينات المتحررة غير القطبية.",
        physicalState: "طبقة يود بنفسجية واضحة",
        colorState: "بنفسجي داكن ياقوتي",
        chemicalProperty: "أكسدة اليوديد وإزاحة اليود الحر",
        equationOrFormula: "Br2(aq) + 2KI(aq) ⟶ 2KBr(aq) + I2(s) (بنفسجي في CCl4)",
        telemetry: { temp: 25, ph: 6.0, gas: 0, liquidColor: "#581c87", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u5_l2: {
    id: "u5_l2",
    apparatusType: "gas_prep",
    overallConclusion: "يحضر غاز الكلور معملياً بأكسدة حمض الهيدروكلوريك المركز بواسطة ثاني أكسيد المنجنيز الأسود MnO2 بالتسخين، ويجمع بإزاحة الهواء للأعلى لأنه أثقل من الهواء الجوي مرتين ونصف.",
    cumulativeTable: [
      { sampleName: "MnO2 الأسود + HCl مركز", condition: "تسخين لطيف", result: "تصاعد غاز أخضر مصفر خانق Cl2 وتكون MnCl2", scientificMeaning: "أكسدة واختزال: Mn⁺⁴ يؤكسد Cl⁻ إلى Cl2", status: "positive" },
      { sampleName: "غاز الكلور المتصاعد", condition: "إمرار عبر زجاجات غسيل", result: "الماء يمتص أبخرة HCl وحمض الكبريتيك يجفف الماء", scientificMeaning: "تنقية وتجفيف الغاز للحصول على كلور جاف نقي", status: "positive" },
      { sampleName: "مخبار جمع الكلور", condition: "إزاحة الهواء للأعلى", result: "امتلاء المخبار بغاز أخضر مصفر ثقيل", scientificMeaning: "كثافة الكلور أعلى بكثير من كثافة الهواء الجوي", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "صب حمض HCl المركز على مسحوق MnO2 الأسود في دورق التحضير وتسخينه بلطف.",
        observation: "فوران وتصاعد غاز أخضر مصفر ذي رائحة خانقة نفاذة ومخرشة للحلق.",
        scientificReason: "ثاني أكسيد المنجنيز عامل مؤكسد قوي ينزع الإلكترونات من أيونات الكلوريد ويحولها إلى غاز الكلور الحر Cl2.",
        examTip: "يجمع غاز الكلور بإزاحة الهواء للأعلى (وليس بالماء لأنه يذوب فيه) لكونه أثقل من الهواء الجوي.",
        physicalState: "غاز أخضر مصفر خانق",
        colorState: "أخضر مصفر شاحب",
        chemicalProperty: "أكسدة الكلوريد لغاز الكلور",
        equationOrFormula: "MnO2(s) + 4HCl(aq) ⟶Δ⟶ MnCl2(aq) + Cl2(g)↑ + 2H2O(l)",
        telemetry: { temp: 90, ph: 1.0, gas: 190, liquidColor: "#84cc16", liquidHeight: 0.5, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true }
      }
    ]
  },

  u5_l3: {
    id: "u5_l3",
    apparatusType: "beaker",
    overallConclusion: "غاز الكلور الجاف تماماً عاجز عن قصر الألوان، بينما الكلور الرطب يقصر ويزيل الألوان كلياً بفعل حمض الهيبوكلوروز HClO غير الثابت الذي يتفكك مطلقاً الأكسجين الذري الوليد [O] المؤكسد القوي.",
    cumulativeTable: [
      { sampleName: "ورقة تباع شمس حمراء جافة", condition: "في غاز الكلور الجاف تماماً", result: "بقاء اللون الأحمر ثابتاً دون أي تغير", scientificMeaning: "الكلور الجاف خامل الأثر القاصر", status: "negative" },
      { sampleName: "ورقة تباع شمس حمراء مبللة", condition: "في غاز الكلور", result: "زوال فوري للون وتحولها لبيضاء ناصعة في ثوانٍ", scientificMeaning: "تكون HClO وانطلاق الأكسجين الوليد [O] المؤكسد", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "إدخال ورقة تباع شمس حمراء جافة تماماً في مخبار يحتوي على غاز الكلور الجاف.",
        observation: "تحتفظ الورقة بلونها الأحمر دون أي أثر للقصر أو التبييض.",
        scientificReason: "في غياب جزيئات الماء، لا يمكن لجزيء الكلور Cl2 بمفرده مهاجمة الروابط الملونة في الصبغة العضوية.",
        examTip: "الكلور الجاف لا يقصر الألوان مطلقاً؛ وجود الماء شرط أساسي للأثر القاصر.",
        physicalState: "صبغة ثابتة لا تتأثر",
        colorState: "أحمر ثابت",
        chemicalProperty: "خمول الكلور الجاف تجاه الأصباغ",
        equationOrFormula: "Cl2 (dry) + Dry Dye ⟶ No Bleaching",
        telemetry: { temp: 25, ph: 7.0, gas: 50, liquidColor: "#e0f2fe", liquidHeight: 0.3, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "تبليل ورقة تباع الشمس بالماء وإدخالها في مخبار غاز الكلور.",
        observation: "يزول اللون الأحمر للورقة كلياً وبسرعة البرق متحولة إلى بيضاء ناصعة تماماً!",
        scientificReason: "يتفاعل الكلور مع الماء منتجاً حمض الهيبوكلوروز HClO غير الثابت الذي ينحل سريعاً مطلقاً الأكسجين الذري الوليد [O] فائق النشاط الذي يؤكسد الصبغة ويهدمها كيميائياً.",
        examTip: "علل: الكلور الرطب يقصر الألوان بينما الكلور الجاف لا يقصرها؟ لأن الكلور يتفاعل مع الماء مكوناً حمض HClO الذي يطلق الأكسجين الوليد [O] المبيض.",
        physicalState: "زوال تام للصبغة وتبييض ناصع",
        colorState: "أبيض ناصع (قصر اللون كلياً)",
        chemicalProperty: "أكسدة وتبييض بالأكسجين الوليد",
        equationOrFormula: "Cl2 + H2O ⇌ HCl + HClO ⟶ HCl + [O] (أكسجين وليد يقصر الصبغة)",
        telemetry: { temp: 25, ph: 2.0, gas: 50, liquidColor: "#bef264", liquidHeight: 0.3, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: true }
      }
    ]
  },

  // === UNIT 6: Transition Elements ===
  u6_l1: {
    id: "u6_l1",
    apparatusType: "magnetic_balance",
    overallConclusion: "تثبت التجربة العملية بميزان غوي أن الخاصية البارامغناطيسية وتلون مركبات العناصر الانتقالية تعتمد طرداً على عدد الإلكترونات المفردة غير المزدوجة في أفلاك d؛ فمركبات Fe²⁺ (4 إلكترونات مفردة) تنجذب بقوة وتتلون بالأخضر، بينما Zn²⁺ (3d¹⁰ ممتلئ تماماً) تتنافر مع المغناطيس (دايامغناطيسية) وبيضاء عديمة اللون.",
    cumulativeTable: [
      { sampleName: "كبريتات الحديد FeSO4", condition: "المغناطيس مطفأ (off)", result: "الوزن = 10.00 g", scientificMeaning: "الوزن المرجعي الطبيعي للعينة", status: "neutral" },
      { sampleName: "كبريتات الحديد FeSO4", condition: "المغناطيس مشغل (ON)", result: "الوزن = 11.85 g (زيادة +1.85g)", scientificMeaning: "بارامغناطيسي قوي جداً (4 إلكترونات مفردة بـ 3d⁶)", status: "positive" },
      { sampleName: "كبريتات النحاس CuSO4", condition: "المغناطيس مشغل (ON)", result: "الوزن = 10.42 g (زيادة +0.42g)", scientificMeaning: "بارامغناطيسي متوسط (إلكترون مفرد واحد بـ 3d⁹)", status: "positive" },
      { sampleName: "كلوريد الزنك ZnCl2", condition: "المغناطيس مشغل (ON)", result: "الوزن = 9.92 g (تنافر ونقصان -0.08g)", scientificMeaning: "دايامغناطيسي أبيض (جميع الإلكترونات مزدوجة 3d¹⁰)", status: "negative" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "تعليق أنبوب كبريتات الحديد الخضراء FeSO4 بين قطبي المغناطيس الكهربائي وهو مطفأ ووزنها بدقة على ميزان غوي.",
        observation: "مؤشر ميزان غوي يقف بثبات عند القراءة 10.00 g تحت تأثير الجاذبية الأرضية العادية، والمسحوق ذو لون أخضر زمردي جميل.",
        scientificReason: "في غياب المجال المغناطيسي الخارجي، تكون العزوم المغناطيسية للإلكترونات المفردة موزعة عشوائياً في الفضاء ومحصلتها الكلية صفراً، فيقاس وزنها الحقيقي.",
        examTip: "يجب وزن العينة أولاً والمغناطيس مطفأ لتكون نقطة مرجعية (Zero Reference) لملاحظة الزيادة لاحقاً.",
        physicalState: "مسحوق صلب معلق",
        colorState: "أخضر زمردي ناصع",
        chemicalProperty: "حالة مرجعية بدون مجال",
        equationOrFormula: "Fe²⁺: [Ar] 3d⁶ 4s⁰ (4 Unpaired Electrons)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 10.00, liquidColor: "#10b981", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, magneticFieldOn: false, activeSubstance: "FeSO4" }
      },
      {
        stepNumber: 2,
        action: "تشغيل مفتاح التيار الكهربائي للمغناطيس ومراقبة مؤشر ميزان غوي وحركة الأنبوب.",
        observation: "ينجذب أنبوب كبريتات الحديد الأخضر بقوة هائلة نحو الأسفل بين قطبي المغناطيس، وترتفع قراءة مؤشر الميزان الحساس فوراً من 10.00 g إلى 11.85 g (بزيادة ظاهرة +1.85 g)!",
        scientificReason: "أيون الحديد الثنائي Fe²⁺ يحتوي على 4 إلكترونات مفردة في المستوى الفرعي 3d⁶، وكل إلكترون مفرد يدور حول محوره مولداً عزماً مغناطيسياً قوياً ينجذب بشدة نحو خطوط فيض المجال الخارجي (خاصية بارامغناطيسية عالية).",
        examTip: "علل: مركبات الحديد الثنائي بارامغناطيسية وملونة؟ لوجود 4 إلكترونات مفردة غير مزدوجة في مدارات 3d.",
        physicalState: "انجذاب مغناطيسي سفلي قوي",
        colorState: "أخضر زمردي مع توهج مغناطيسي",
        chemicalProperty: "خاصية بارامغناطيسية فائقة (4 إلكترونات مفردة)",
        equationOrFormula: "ΔW = +1.85 g (قوة الجذب المغناطيسي F = μ · dB/dz)",
        telemetry: { temp: 26, ph: 7.0, gas: 0, weight: 11.85, liquidColor: "#10b981", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, magneticFieldOn: true, activeSubstance: "FeSO4" }
      },
      {
        stepNumber: 3,
        action: "استبدال عينة الحديد بأنبوب كبريتات النحاس المائية CuSO4 الزرقاء وتشغيل المغناطيس.",
        observation: "ينجذب الأنبوب نحو الأسفل بدرجة متوسطة ويسجل الميزان قراءة 10.42 g (زيادة قدرها +0.42 g فقط مقارنة بالوزن المرجعي)، ولون العينة أزرق براق.",
        scientificReason: "أيون النحاس الثنائي Cu²⁺ ينتهي بالتوزيع 3d⁹، ويمتلك إلكتروناً مفرداً واحداً فقط، لذلك تكون قوة جذبه المغناطيسي أقل بكثير من الحديد، ولونه الأزرق ناتج عن امتصاص طيف الضوء الأحمر وترقية هذا الإلكترون الوحيد.",
        examTip: "كلما قل عدد الإلكترونات المفردة قل العزم المغناطيسي وقل مقدار الزيادة في الوزن الظاهري بميزان غوي.",
        physicalState: "انجذاب مغناطيسي متوسط",
        colorState: "أزرق مائي ساطع",
        chemicalProperty: "بارامغناطيسي متوسط (إلكترون مفرد واحد)",
        equationOrFormula: "Cu²⁺: [Ar] 3d⁹ 4s⁰ (1 Unpaired Electron) ⟶ ΔW = +0.42 g",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 10.42, liquidColor: "#0284c7", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, magneticFieldOn: true, activeSubstance: "CuSO4" }
      },
      {
        stepNumber: 4,
        action: "اختبار مسحوق كلوريد الزنك الأبيض ZnCl2 بين قطبي المغناطيس القوي.",
        observation: "يتنافر الأنبوب بخفة نحو الأعلى بعيداً عن القطبين، ويسجل الميزان نقصاناً طفيفاً في الوزن الظاهري ليصل إلى 9.92 g (-0.08 g)، ولون المسحوق أبيض ناصع تماماً.",
        scientificReason: "أيون الزنك Zn²⁺ ينتهي بالتوزيع 3d¹⁰، حيث جميع الأفلاك الخمسة ممتلئة تماماً بإلكترونات مزدوجة متعاكسة في الغزل، فينعدم العزم المغناطيسي كلياً وتتنافر سحب الإلكترونات مع المجال المغناطيسي الخارجي (خاصية دايامغناطيسية)، وهو أبيض لتعذر ترقية الإلكترونات.",
        examTip: "علل: مركبات الزنك والسكانديوم عديمة اللون ودايامغناطيسية؟ لخلو المستوى 3d من الإلكترونات المفردة (Zn²⁺: 3d¹⁰ ممتلئ، Sc³⁺: 3d⁰ فارغ).",
        physicalState: "تنافر مغناطيسي علوي طفيف",
        colorState: "أبيض طباشيري ناصع",
        chemicalProperty: "خاصية دايامغناطيسية (انعدام الإلكترونات المفردة)",
        equationOrFormula: "Zn²⁺: [Ar] 3d¹⁰ (0 Unpaired) ⟶ Diamagnetic (ΔW = -0.08 g)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 9.92, liquidColor: "#f8fafc", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, magneticFieldOn: true, activeSubstance: "ZnCl2" }
      }
    ]
  },

  u6_l2: {
    id: "u6_l2",
    apparatusType: "beaker",
    overallConclusion: "الذهب فلز نبيل ومستقر يقاوم التأكسد بالأحماض المركزة منفرداً، لكنه يذوب تماماً في الماء الملكي (Aqua Regia) المكون من 3 أحجام HCl مركز و1 حجم HNO3 مركز لتولد الكلور الوليد وكلوريد النيتروسيل NOCl اللذين يهاجمان الذهب ويحولانه إلى حمض الكلوروأوريك الذائب.",
    cumulativeTable: [
      { sampleName: "الذهب + حمض HCl المركز", condition: "حمض مفرد مركز", result: "لا يحدث أي تفاعل ويبقى بريق الذهب ثابتاً", scientificMeaning: "الذهب لا يستطيع إزاحة الهيدروجين لجهد تأكسده المنخفض", status: "negative" },
      { sampleName: "الذهب + حمض HNO3 المركز", condition: "حمض مؤكسد مفرد", result: "لا يذوب الذهب مطلقاً", scientificMeaning: "حمض النيتريك بمفرده لا يستطيع أكسدة الذهب لعدم وجود معقد", status: "negative" },
      { sampleName: "الذهب + الماء الملكي (3HCl : 1HNO3)", condition: "خليط الحمضين المركبين", result: "فوران برتقالي وإذابة تامة لسبيكة الذهب", scientificMeaning: "تكون حمض الكلوروأوريك HAuCl4 الذائب بتأثير الكلور الوليد", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "تشغيل دولاب الأبخرة المعملي وارتداء قفازات الأمان والنظارات الواقية.",
        observation: "سحب تيار الهواء في دولاب الأبخرة لضمان سلامة الطالب من الغازات الخانقة.",
        scientificReason: "تفاعل الماء الملكي يطلق غازات الكلور NO2 و NOCl السامة والمخرشة للأغشية المخاطية.",
        examTip: "يجب تحضير الماء الملكي طازجاً في دولاب الأبخرة واستخدامه فوراً لعدم استقراره.",
        physicalState: "معمل أمان نشط",
        colorState: "شفاف",
        chemicalProperty: "احتياطات السلامة الكيميائية",
        equationOrFormula: "Safety Protocol: Chemical Fume Hood Active",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#e0f2fe", liquidHeight: 0.3, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "إسقاط سبيكة الذهب في كأس به حمض HCl المركز بمفرده.",
        observation: "لا يحدث أي تفاعل مطلقاً وتبقى سبيكة الذهب لامعة وبراقة في قاع الكأس.",
        scientificReason: "الذهب يقع في أسفل السلسلة الكهروكيميائية بجهد اختزال قياسي مرتفع (+1.50V)، فلا يستطيع اختزال أيونات H⁺ لأحماض الهيدروكلوريك.",
        examTip: "الذهب والبلاتين لا يذوبان في حمض الهيدروكلوريك أو النيتريك منفرداً.",
        physicalState: "سبيكة صلبة غير ذائبة",
        colorState: "أصفر ذهبي معدني",
        chemicalProperty: "خمول فلز نبيل",
        equationOrFormula: "Au + HCl ⟶ No Reaction",
        telemetry: { temp: 25, ph: 0.2, gas: 0, liquidColor: "#f1f5f9", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "تجربة إضافة حمض النيتريك المركز بمفرده على قطعة ذهب أخرى.",
        observation: "يبقى الذهب سليماً دون أي علامة على التآكل أو الذوبان.",
        scientificReason: "رغم أن HNO3 مؤكسد قوي، إلا أن جهد أكسدة الذهب أعلى من قدرة النيتريك بمفرده في غياب أيونات الكلوريد التي تكون المعقد الذائب.",
        examTip: "حمض النيتريك المركز يؤكسد النحاس والفضة لكنه يعجز عن أكسدة الذهب.",
        physicalState: "سبيكة صلبة غير ذائبة",
        colorState: "ذهبي معدني",
        chemicalProperty: "مقاومة للأكسدة المفردة",
        equationOrFormula: "Au + HNO3 ⟶ No Reaction",
        telemetry: { temp: 25, ph: 0.3, gas: 0, liquidColor: "#fef08a", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "مزج 3 أحجام من HCl المركز مع حجم واحد من HNO3 المركز لتكوين الماء الملكي.",
        observation: "يتغير لون الخليط سريعاً إلى البرتقالي المحمر وتتصاعد أبخرة صفراء بنية ذات رائحة نفاذة.",
        scientificReason: "تفاعل الحمضين معاً يولد كلوريد النيتروسيل NOCl وغاز الكلور الوليد النشط [Cl]، وهي عوامل مؤكسدة خارقة غير موجودة في كل حمض بمفرده.",
        examTip: "نسبة الماء الملكي: 3 هيدروكلوريك مركز إلى 1 نيتريك مركز (3 : 1).",
        physicalState: "محلول مؤكسد فائق النشاط",
        colorState: "برتقالي محمر فاقع",
        chemicalProperty: "توليد الكلور الوليد و NOCl",
        equationOrFormula: "3HCl + HNO3 ⟶ NOCl + Cl2 + 2H2O",
        telemetry: { temp: 45, ph: 0.1, gas: 80, liquidColor: "#ea580c", liquidHeight: 0.6, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 5,
        action: "صب الماء الملكي المحضر فوق سبيكة الذهب ومراقبة النتيجة المذهلة.",
        observation: "فوران شديد وتصاعد أبخرة بنية ويذوب الذهب تماماً متحولاً لمحلول حمض الكلوروأوريك الذهبي الصافي!",
        scientificReason: "يقوم غاز الكلور النشط بأكسدة ذرات الذهب إلى Au³⁺، بينما تقوم أيونات الكلوريد الوفيرة بربطه في معقد أيوني ثابت فائق الذوبان [AuCl4]⁻، مما يزيح اتزان التفاعل ويذيب الذهب كلياً.",
        examTip: "المركب الناتج من إذابة الذهب في الماء الملكي هو حمض الكلوروأوريك HAuCl4.",
        physicalState: "محلول ذهبي متجانس رائق",
        colorState: "أصفر كهرماني ذهبي",
        chemicalProperty: "إذابة تامة وتكوين معقد ذهبي",
        equationOrFormula: "Au(s) + 3HNO3 + 4HCl ⟶ HAuCl4(aq) + 3NO2↑ + 3H2O",
        telemetry: { temp: 85, ph: 0.1, gas: 190, liquidColor: "#eab308", liquidHeight: 0.65, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true }
      }
    ]
  }
};

export const getExperimentReflection = (id: string): ExperimentReflection | null => {
  return LAB_REFLECTIONS[id] || null;
};
