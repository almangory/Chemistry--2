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
      { sampleName: "الكالسيوم (Ca)", condition: "العنصر الأول في الثلاثية", result: "الكتلة الذرية = 40.0 g/mol", scientificMeaning: "طرف الثلاثية السفلي", status: "neutral" },
      { sampleName: "الباريوم (Ba)", condition: "العنصر الثالث في الثلاثية", result: "الكتلة الذرية = 137.3 g/mol", scientificMeaning: "طرف الثلاثية العلوي", status: "neutral" },
      { sampleName: "الاسترونشيوم (Sr)", condition: "العنصر الأوسط المحسوب vs الفعلي", result: "المتوسط الحسابي = 88.65 ≈ الكتلة الفعلية (87.6)", scientificMeaning: "تطابق مذهل يثبت قانون الثلاثيات لدوبرينر", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "زن عينة نقية من الكالسيوم Ca (الكتلة الذرية 40.0) وسجل قراءتها في حاسبة المعمل.",
        observation: "استقرار مؤشر الميزان الحساس عند قراءة الكتلة الذرية للكالسيوم 40.0 g/mol بدقة متناهية.",
        scientificReason: "عناصر المجموعة الواحدة (الفلزات القلوية الترابية) تشترك في الخواص الكيميائية التكافئية وتتدرج كتلها بانتظام.",
        examTip: "قانون ثلاثيات دوبرينر: كتلة العنصر الأوسط تساوي متوسط طرفي الثلاثية.",
        physicalState: "صلب فلزي",
        colorState: "رمادي فضي",
        chemicalProperty: "فلز قلوي ترابي ثنائي التكافؤ",
        equationOrFormula: "Mass(Ca) = 40.08 g/mol",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 40.0, liquidColor: "#f0f9ff", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "زن عينة مماثلة من الباريوم Ba (الكتلة الذرية 137.3) وسجل وزنها.",
        observation: "تسجيل كتلة الباريوم الذرية الأثقل في قاع المجموعة والبالغة 137.3 g/mol.",
        scientificReason: "زيادة عدد مستويات الطاقة الرئيسية الممتلئة بالإلكترونات ترفع الكتلة الذرية لعنصر الباريوم بصورة ملحوظة.",
        examTip: "الباريوم يقع أسفل الكالسيوم في المجموعة الثانية بالجدول الدوري.",
        physicalState: "صلب فلزي ثقيل",
        colorState: "فضي باهت",
        chemicalProperty: "طرف الثلاثية العلوي الأثقل",
        equationOrFormula: "Mass(Ba) = 137.33 g/mol",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 137.3, liquidColor: "#f0f9ff", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "احسب كيميائياً المتوسط الحسابي لكتلتي الكالسيوم والباريوم بالأرقام.",
        observation: "ظهور ناتج الحساب الرياضي على شاشة المعمل: (40.0 + 137.3) ÷ 2 = 88.65 g/mol.",
        scientificReason: "العلاقة الرياضية لدوبرينر تعتمد على الربط الإحصائي بين خواص العناصر المتشابهة في العائلة الواحدة.",
        examTip: "احفظ نص قانون ثلاثيات دوبرينر كما ورد في كتاب بخت الرضا حرفياً.",
        physicalState: "حساب رياضي نظري",
        colorState: "شاشة بيانات رقمية",
        chemicalProperty: "متوسط كتلتي طرفي الثلاثية",
        equationOrFormula: "Average = (40.0 + 137.3) / 2 = 88.65",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 88.65, liquidColor: "#e0f2fe", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "زن الآن عينة من العنصر الأوسط في الثلاثية وهو الاسترونشيوم Sr لتكتشف كتلته الفعلية.",
        observation: "كتلة الاسترونشيوم الفعلية تظهر بقيمة 87.6 g/mol، وهي مطابقة بنسبة تقارب فائقة للمتوسط المحسوب (88.65).",
        scientificReason: "التماثل في البناء الإلكتروني لغلاف التكافؤ يربط التدرج الكتلي بالتدرج الدوري في الخواص الفيزيائية والكيميائية.",
        examTip: "من ثلاثيات دوبرينر الشهيرة: (Li, Na, K) و (Ca, Sr, Ba) و (Cl, Br, I).",
        physicalState: "صلب فلزي وسطي",
        colorState: "فضي برّاق",
        chemicalProperty: "تطابق تجريبي لقانون الثلاثيات",
        equationOrFormula: "Mass(Sr) = 87.62 ≈ 88.65 (Verified)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 87.6, liquidColor: "#e0f2fe", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u1_l2: {
    id: "u1_l2",
    apparatusType: "test_tubes",
    overallConclusion: "التصنيف الفئوي (s, p, d, f) يعكس التركيب الإلكتروني الدقيق؛ عناصر s و d جيدة التوصيل وملونة ومغناطيسية، بينما عناصر p رديئة التوصيل.",
    cumulativeTable: [
      { sampleName: "الصوديوم (s-block)", condition: "دائرة الناقلية الكهربية", result: "إضاءة ساطعة وفورية للمصباح", scientificMeaning: "فلز نشط ذو إلكترون تكافؤ حر وسهل الحركة", status: "positive" },
      { sampleName: "الكلور (p-block)", condition: "أنبوب غاز في دائرة كهربية", result: "المصباح لا يضيء نهائياً", scientificMeaning: "لا فلز عازل لعدم توفر إلكترونات حرة", status: "negative" },
      { sampleName: "النحاس (d-block)", condition: "محلول مائي لمطياف الضوء", result: "محلول أزرق وتوصيل ممتاز", scientificMeaning: "عنصر انتقالي ملون لوجود أفلاك d غير ممتلئة", status: "positive" },
      { sampleName: "اليوروبيوم (f-block)", condition: "مقارنة المجال المغناطيسي", result: "استجابة مغناطيسية متقدمة", scientificMeaning: "لانثانيد ذو إلكترونات مفردة عديدة في المدار f", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "اختبر سلك الصوديوم من فئة s بجهاز الناقلية الكهربية.",
        observation: "إضاءة المصباح الكهربائي بتوهج قوي وتوصيل فائق للتيار الكهربي.",
        scientificReason: "يمتلك الصوديوم إلكترون تكافؤ حراً في فلك 3s1 سهل الحركة ونقل الشحنات في الشبكة البلورية الفلزية.",
        examTip: "عناصر الفئة s تشمل عناصر المجموعتين الأولى والثانية وتقع أقصى يسار الجدول.",
        physicalState: "سلك فلزي موصل",
        colorState: "فضي رمادي",
        chemicalProperty: "توصيل كهربي فائق لعناصر s",
        equationOrFormula: "Na: [Ne] 3s¹",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "اختبر غاز الكلور من فئة p في الأنبوب المغلق لمقارنة التوصيل.",
        observation: "المصباح الكهربائي مطفأ تماماً مع انبعاث غاز أخضر مصفر في الأنبوب دون أي مرور للتيار.",
        scientificReason: "عناصر فئة p تميل لجذب الإلكترونات بشدة لإكمال الغلاف الخارجي وتفتقر للإلكترونات الحرة اللازمة للتوصيل.",
        examTip: "عناصر فئة p تشمل اللافلزات وأشباه الفلزات والغازات الخاملة وتقع يمين الجدول.",
        physicalState: "غاز عازل",
        colorState: "أخضر مصفر شاحب",
        chemicalProperty: "خاصية لا فلزية عازلة",
        equationOrFormula: "Cl: [Ne] 3s² 3p⁵",
        telemetry: { temp: 25, ph: 7.0, gas: 50, liquidColor: "#fef08a", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "ألقِ نظرة على محلول أيونات النحاس من فئة d تحت مطياف الضوء.",
        observation: "المحلول يمتص أطوالاً موجية محددة ويظهر بلون أزرق مائي ساحر وناصع مع توصيل إلكتروليتي ممتاز.",
        scientificReason: "وجود إلكترونات في أفلاك d غير الممتلئة يسمح بامتصاص الضوء المرئي وترقية الإلكترونات بين المستويات الجزئية.",
        examTip: "تتميز عناصر الفئة d (العناصر الانتقالية) بتعدد حالات التأكسد وتكوين مركبات ملونة.",
        physicalState: "محلول مائي متجانس",
        colorState: "أزرق سماوي ناصع",
        chemicalProperty: "أيونات انتقالية ملونة",
        equationOrFormula: "Cu²⁺: [Ar] 3d⁹",
        telemetry: { temp: 25, ph: 6.0, gas: 0, liquidColor: "#0284c7", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "افحص عينة اليوروبيوم من فئة f اللانثانيدات لمشاهدة المظهر المغناطيسي.",
        observation: "انجذاب مغناطيسي واضح نحو القطب المغناطيسي نتيجة لعدم اكتمال المدارات f الداخلية.",
        scientificReason: "احتواء مدارات f على إلكترونات مفردة عديدة يعطي هذه العناصر خواص بارامغناطيسية استثنائية وأطياف انبعاث فريدة.",
        examTip: "الفئة f تفصل أسفل الجدول الدوري وتشمل سلسلتي اللانثانيدات والأكتينيدات.",
        physicalState: "صلب فلزي بارامغناطيسي",
        colorState: "رمادي داكن",
        chemicalProperty: "خواص مغناطيسية للفئة f",
        equationOrFormula: "Eu: [Xe] 4f⁷ 6s²",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, magneticFieldOn: true }
      }
    ]
  },

  u1_l3: {
    id: "u1_l3",
    apparatusType: "test_tubes",
    overallConclusion: "التدرج عبر الدورة الثالثة يظهر تناقص نصف القطر الذري وزيادة شحنة النواة الفعالة؛ الصوديوم يتفاعل بعنف مع الماء البارد، بينما المغنيسيوم لا يتفاعل إلا بالتسخين مع الماء المغلي.",
    cumulativeTable: [
      { sampleName: "الماء المقطر + الفينولفثالين", condition: "الوسط المائي الأولي", result: "سائل صافٍ عديم اللون تماماً", scientificMeaning: "الماء متعادل والفينولفثالين عديم اللون في الوسط المتعادل", status: "neutral" },
      { sampleName: "الصوديوم Na", condition: "ماء بارد + كاشف", result: "فوران عنيف، اشتعال أصفر، وتلون وردي فوري", scientificMeaning: "نشاط فلزي فائق لكبر نصف القطر وسهولة فقد الإلكترون", status: "positive" },
      { sampleName: "المغنيسيوم Mg", condition: "ماء بارد", result: "لا يحدث أي تفاعل والماء يبقى عديم اللون", scientificMeaning: "نقصان نصف القطر وزيادة جذب النواة يمنع التفاعل على البارد", status: "neutral" },
      { sampleName: "المغنيسيوم Mg (ساخن)", condition: "تسخين حتى الغليان", result: "تصاعد بطيء لفقاعات H2 وتلون بالوردي الخفيف", scientificMeaning: "الحرارة توفر طاقة التنشيط اللازمة لتأيين المغنيسيوم", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "أضف ماءً مقطراً مع قطرات من دليل الفينول فثالين في كلتا الأنبوبتين.",
        observation: "يبقى الماء في كلتا الأنبوبتين صافياً كلياً وعديم اللون تماماً؛ دليل الفينول فثالين لا يعطي أي لون في الوسط المتعادل.",
        scientificReason: "الماء المقطر نقي ومتعادل كيميائياً (pH = 7.0)، ودليل الفينول فثالين يكون عديم اللون في الوسط المتعادل والحمضي.",
        examTip: "الفينول فثالين عديم اللون في الوسط الحمضي والمتعادل، ووردي قرمزي في الوسط القاعدي فقط.",
        physicalState: "ماء مقطر نقي",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "وسط متعادل pH = 7.0",
        equationOrFormula: "H2O(l) ⇌ H⁺(aq) + OH⁻(aq) [pH = 7.0]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "ألقِ قطعة الصوديوم Na بحذر في الأنبوبة الأولى وراقب سرعة التفاعل.",
        observation: "تتحول قطعة الصوديوم لكرة منصهرة تجري بسرعة وتشتعل بفرقعة ولهب أصفر، ويتلون المحلول فوراً باللون الوردي الزاهي!",
        scientificReason: "كبر نصف القطر الذري للصوديوم وصغر شحنة النواة الفعالة يسهل فقد إلكترون 3s1 فوراً متفاعلاً مع الماء لإنتاج NaOH القلوي وغاز H2.",
        examTip: "تفاعل الصوديوم مع الماء طارد للحرارة بشدة مما يسبب اشتعال غاز الهيدروجين المتصاعد.",
        physicalState: "محلول قلوي متفاعل",
        colorState: "وردي زاهٍ (وسط قلوي)",
        chemicalProperty: "قاعدية قوية pH = 13.5",
        equationOrFormula: "2Na(s) + 2H2O(l) ⟶ 2NaOH(aq) + H2(g)↑",
        telemetry: { temp: 85, ph: 13.5, gas: 60, liquidColor: "#ec4899", liquidHeight: 0.55, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: true, flameColor: "#eab308" }
      },
      {
        stepNumber: 3,
        action: "ألقِ قطعة المغنيسيوم Mg في الأنبوبة الثانية وراقب النتيجة.",
        observation: "لا يلاحظ أي تفاعل إطلاقاً؛ تظل قطعة المغنيسيوم مستقرة في القاع ويبقى الماء صافياً وعديم اللون كلياً.",
        scientificReason: "صغر نصف القطر الذري للمغنيسيوم وزيادة شحنة النواة الفعالة (+12) يرفع طاقة التأين ويمنع فقد إلكتروني التكافؤ على البارد.",
        examTip: "المغنيسيوم أقل نشاطاً كيميائياً من الصوديوم لنقصان نصف قطره الذري وزيادة شحنة نواته.",
        physicalState: "فلز غير متفاعل على البارد",
        colorState: "صافٍ عديم اللون",
        chemicalProperty: "خمول نسبي على البارد pH = 7.0",
        equationOrFormula: "Mg(s) + H2O(cold) ⟶ No Reaction",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "سخن أنبوبة المغنيسيوم باستخدام الموقد بلطف وشاهد التغير.",
        observation: "عند الغليان، تبدأ فقاعات غاز الهيدروجين بالتصاعد ببطء ويتحول المحلول تدريجياً للون وردي خفيف باهت.",
        scientificReason: "الحرارة تمد ذرات المغنيسيوم بطاقة التنشيط اللازمة للتغلب على طاقة التأين وتكوين هيدروكسيد المغنيسيوم Mg(OH)2 الضعيف القلوية.",
        examTip: "المغنيسيوم يتفاعل ببطء مع الماء المغلي، لكنه يحترق في بخار الماء بشدة مكوناً MgO الأبيض.",
        physicalState: "محلول قلوي ضعيف ساخن",
        colorState: "وردي باهت خفيف",
        chemicalProperty: "تفاعل فلزي مشروط بالحرارة",
        equationOrFormula: "Mg(s) + 2H2O(boiling) ⟶ Mg(OH)2(aq) + H2(g)↑",
        telemetry: { temp: 95, ph: 9.8, gas: 45, liquidColor: "#f472b6", liquidHeight: 0.55, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true }
      }
    ]
  },

  // === UNIT 2: Alkali & Alkaline Earth Metals ===
  u2_l1: {
    id: "u2_l1",
    apparatusType: "glass_basin",
    overallConclusion: "تفاعل فلزات الأقلاء مع الماء طارد للحرارة بشدة وعنيف جداً، وتزداد شدة العنف والنشاط بالنزول لأسفل من Li إلى Na ثم K لكبر الحجم الذري وسهولة فقد إلكترون التكافؤ، منتجاً هيدروكسيد الفلز القلوي الذي يلون الفينولفثالين بالوردي وغاز الهيدروجين المشتعل.",
    cumulativeTable: [
      { sampleName: "الماء المقطر في الحوض", condition: "بداية التجربة (قبل التفاعل)", result: "ماء نقي شفاف وعديم اللون كلياً (pH = 7.0)", scientificMeaning: "وسط مائي متعادل نقي خالٍ من الشوائب", status: "neutral" },
      { sampleName: "الماء + دليل الفينولفثالين", condition: "إضافة الكاشف للماء النقي", result: "يبقى المحلول عديم اللون وشفافاً تماماً", scientificMeaning: "دليل الفينولفثالين عديم اللون في الوسط المتعادل", status: "neutral" },
      { sampleName: "الصوديوم (Na)", condition: "إسقاطه في الحوض المائي", result: "كرة منصهرة تجري وتشتعل بلهب أصفر، والمحلول يتحول لوردي فاقع", scientificMeaning: "تفاعل طارد للحرارة وتكون محلول NaOH قلوي قوي", status: "positive" },
      { sampleName: "البوتاسيوم (K)", condition: "إسقاطه في الحوض المائي", result: "اشتعال فوري عنيف جداً بلهب بنفسجي ليلكي خاطف وفرقعات قوية", scientificMeaning: "تفاعل أشد عنفاً من الصوديوم لكبر نصف قطر البوتاسيوم", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "ارتدِ النظارات الواقية والقفازات كإجراء وقائي هام.",
        observation: "الحوض الزجاجي الكبير يحتوي على ماء مقطر نقي عديم اللون وشفاف تماماً، والبيئة المعملية مهيأة وآمنة.",
        scientificReason: "تفاعلات الفلزات القلوية مع الماء شديدة العنف وتطلق حرارة وغاز هيدروجين مشتعل، وارتداء واقيات العين والقفازات حماية إلزامية.",
        examTip: "الأمان في معمل الكيمياء أولاً: لا تقرب وجهك أبداً من حوض تفاعل فلزات الأقلاء.",
        physicalState: "ماء مقطر راكد",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "وسط مائي نقي متعادل pH = 7.0",
        equationOrFormula: "H2O (Distilled Pure Water) [pH = 7.0]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "املأ الحوض الزجاجي بالماء المقطر وأضف قطرتين من دليل الفينول فثالين عديم اللون.",
        observation: "يظل الماء في الحوض الزجاجي صافياً كلياً وعديم اللون تماماً؛ لا يحدث أي تغير لوني على الإطلاق.",
        scientificReason: "الماء المقطر وسط متعادل (pH = 7.0)، ودليل الفينول فثالين لا يتلون إطلاقاً إلا في الأوساط القاعدية والقلوية (pH > 8.2).",
        examTip: "علل: لا يتلون الماء عند إضافة دليل الفينول فثالين إليه؟ لأن الماء المقطر وسط متعادل والفينول فثالين عديم اللون في الوسط المتعادل.",
        physicalState: "ماء مقطر مع كاشف متعادل",
        colorState: "عديم اللون كلياً (شفاف زجاجي)",
        chemicalProperty: "وسط متعادل pH = 7.0",
        equationOrFormula: "Phenolphthalein (in neutral H2O) ⟶ Colorless",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "باستخدام الملقط والسكين، اقطع قطعة صغيرة جداً من فلز الصوديوم Na وجففها بورق الترشيح.",
        observation: "يظهر السطح المقطوع لفلز الصوديوم بريقاً فضياً ناصعاً سرعان ما ينطفئ في الهواء، والماء في الحوض ما يزال صافياً وعديم اللون كلياً.",
        scientificReason: "فلز الصوديوم لين يسهل قطعه بالسكين، وتجفيفه بورق الترشيح يزيل كيروسين الحفظ الذي يمنع تماسه المباشر مع الماء.",
        examTip: "تحفظ فلزات الأقلاء تحت سطح الكيروسين أو البارافين لعزلها التام عن أكسجين الهواء الجوي ورطوبته.",
        physicalState: "فلز صلب لين مقطوع وجاف",
        colorState: "بريق فضي برّاق حديث القطع",
        chemicalProperty: "جاهز للتفاعل الفوري مع الماء",
        equationOrFormula: "Na(s) [Freshly cut, kerosene removed]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "ضع قطعة الصوديوم بحذر في الحوض باستخدام الملقط وابتعد فوراً!",
        observation: "تنصهر قطعة الصوديوم إلى كرة فضية لامعة تسبح بسرعة جنونية فوق سطح الماء بلهب أصفر ساطع وفرقعات، ويتلون المحلول فوراً بالوردي البنفسجي الزاهي!",
        scientificReason: "حرارة التفاعل العالية تصهر الصوديوم لانخفاض درجة انصهاره (97.8°C)، ويتصاعد H2 مشتعلاً بالحرارة، وتتولد أيونات OH⁻ القلوية التي تحول الفينول فثالين للوردي.",
        examTip: "المعادلة المعتمدة في امتحان الشهادة: 2Na(s) + 2H2O(l) ⟶ 2NaOH(aq) + H2(g)↑ + حرارة.",
        physicalState: "كرة منصهرة طافية + غاز متصاعد",
        colorState: "لهب أصفر ذهبي ومحلول وردي زاهٍ",
        chemicalProperty: "تفاعل طارد للحرارة وقاعدية قوية pH = 13.8",
        equationOrFormula: "2Na(s) + 2H2O(l) ⟶ 2NaOH(aq) + H2(g)↑ + ΔH",
        telemetry: { temp: 92, ph: 13.8, gas: 180, liquidColor: "#ec4899", liquidHeight: 0.6, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true, flameColor: "#eab308" }
      },
      {
        stepNumber: 5,
        action: "لاحظ تغير لون المحلول في الحوض إلى اللون الوردي البنفسجي المميز.",
        observation: "المحلول بأكمله اكتسى لوناً وردياً بنفسجياً ثابتاً دلالة على تكوّن محلول هيدروكسيد الصوديوم، مع جاهزية اختبار البوتاسيوم الأكثر عنفاً.",
        scientificReason: "تحول الوسط إلى قلوي مركز ناتج عن ذوبان NaOH، وفي حال استبداله بالبوتاسيوم K يكون التفاعل أسرع وأعنف ويكون اللهب بنفسجياً ليلكياً.",
        examTip: "علل: البوتاسيوم أكثر نشاطاً وعنفاً من الصوديوم؟ لكبر حجم ذرته وسهولة فقد إلكترون تكافئه الوحيد.",
        physicalState: "محلول قلوي متجانس مستقر",
        colorState: "وردي بنفسجي ناصع (أرجواني)",
        chemicalProperty: "اكتمال إنتاج هيدروكسيد الصوديوم القلوي",
        equationOrFormula: "NaOH(aq) ⟶ Na⁺(aq) + OH⁻(aq) [Strong Base]",
        telemetry: { temp: 45, ph: 13.8, gas: 180, liquidColor: "#ec4899", liquidHeight: 0.6, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u2_l2: {
    id: "u2_l2",
    apparatusType: "test_tubes",
    overallConclusion: "كشف اللهب الجاف يحدد هوية كاتيونات فلزات الأقلاء بدقة بناءً على الطيف الخطي المميز الذي تطلقه عند إثارة إلكترونات التكافؤ بحرارة لهب بنزن وعودتها للمستويات المستقرة.",
    cumulativeTable: [
      { sampleName: "كلوريد الصوديوم NaCl", condition: "سلك بلاتين في لهب بنزن", result: "لهب أصفر ذهبي ساطع جداً (589 nm)", scientificMeaning: "طول موجي مميز لإلكترونات الصوديوم المثارة", status: "positive" },
      { sampleName: "كلوريد البوتاسيوم KCl", condition: "سلك بلاتين في لهب بنزن", result: "لهب بنفسجي فاتح باهت (ليلكي)", scientificMeaning: "إثارة إلكترونات ذرة البوتاسيوم", status: "positive" },
      { sampleName: "كلوريد الليثيوم LiCl", condition: "سلك بلاتين في لهب بنزن", result: "لهب قرمزي أحمر كرزي عميق", scientificMeaning: "انبعاث طيفي مميز لكاتيون الليثيوم", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "اغمس سلك البلاتين في حمض HCl المركز ثم ضعه على لهب بنزين الساخن لتنظيفه تماماً.",
        observation: "توهج سلك البلاتين دون إعطاء أي لون على لهب موقد بنزن الأزرق الهادئ.",
        scientificReason: "حمض الهيدروكلوريك يحول الشوائب الفلزية العالقة إلى كلوريدات سريعة التطاير تزول بحرارة اللهب لضمان نقاء الاختبار.",
        examTip: "يستخدم حمض HCl لتنظيف سلك البلاتين لأنه يكون كلوريدات فلزية متطايرة.",
        physicalState: "سلك بلاتيني نقي",
        colorState: "لهب أزرق باهت غير مضيء",
        chemicalProperty: "إزالة الشوائب الفلزية العالقة",
        equationOrFormula: "Pt wire cleaned with conc. HCl",
        telemetry: { temp: 600, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#3b82f6" }
      },
      {
        stepNumber: 2,
        action: "اغمس السلك النظيف في ملح كلوريد الصوديوم NaCl، ثم قربه من لهب موقد بنزين.",
        observation: "يتوهج اللهب فوراً بلون أصفر ذهبي ساطع ومبهر يغطي شعلة الموقد بالكامل.",
        scientificReason: "الحرارة تثير إلكترون تكافؤ الصوديوم إلى مدار طاقة أعلى، وعند هبوطه يطلق فوتونات بطول موجي 589 nm باللون الأصفر.",
        examTip: "الصوديوم يعطي دائماً لهباً أصفر ذهبياً.",
        physicalState: "طيف انبعاث ذري",
        colorState: "أصفر ذهبي ساطع",
        chemicalProperty: "بصمة طيفية لعنصر الصوديوم",
        equationOrFormula: "Na* ⟶ Na + hν (λ = 589 nm)",
        telemetry: { temp: 650, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#eab308" }
      },
      {
        stepNumber: 3,
        action: "كرر خطوة غمس سلك البلاتين النظيف بملح كلوريد البوتاسيوم KCl وضعه على اللهب.",
        observation: "يتحول لهب الموقد إلى لون بنفسجي فاتح باهت (يمكن تدقيقه عبر زجاج الكوبالت الأزرق).",
        scientificReason: "فارق الطاقة بين مدارات الإثارة والاستقرار في ذرة البوتاسيوم يصدر فوتونات تقع في النطاق البنفسجي للطيف المرئي.",
        examTip: "تستخدم شريحة زجاج الكوبالت الأزرق عند فحص البوتاسيوم لحجب وميض شوائب الصوديوم الصفراء.",
        physicalState: "طيف انبعاث ذري",
        colorState: "بنفسجي فاتح هادئ",
        chemicalProperty: "بصمة طيفية للبوتاسيوم",
        equationOrFormula: "K* ⟶ K + hν (Violet Light)",
        telemetry: { temp: 680, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#a855f7" }
      },
      {
        stepNumber: 4,
        action: "جرب كشف ملح كلوريد الليثيوم LiCl على لهب موقد بنزين الساخن.",
        observation: "يشتعل اللهب بلون أحمر قرمزي كرزي داكن وخلاب.",
        scientificReason: "التركيب الإلكتروني لذرة الليثيوم يصدر فوتونات ذات تردد يتوافق مع الضوء الأحمر القرمزي عند استرخاء إلكترونات التكافؤ.",
        examTip: "ألوان كشف اللهب المقررة: الليثيوم قرمزي، الصوديوم أصفر ذهبي، البوتاسيوم بنفسجي فاتح.",
        physicalState: "طيف انبعاث ذري",
        colorState: "أحمر قرمزي كرزي",
        chemicalProperty: "بصمة طيفية لليثيوم",
        equationOrFormula: "Li* ⟶ Li + hν (Crimson Red)",
        telemetry: { temp: 660, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.4, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#e11d48" }
      }
    ]
  },

  // === UNIT 3: Organic Chemistry ===
  u3_l1: {
    id: "u3_l1",
    apparatusType: "beaker",
    overallConclusion: "تحضير فوهلر لليوريا عام 1828 أثبت إمكانية تخليق المركبات العضوية معملياً من مواد غير عضوية بسيطة، وهدم نظرية القوة الحيوية لبرزيليوس وفتح الباب لعصر الكيمياء العضوية الحديثة.",
    cumulativeTable: [
      { sampleName: "NH4Cl + AgCNO", condition: "مزج المحلولين على البارد", result: "راسب أبيض كثيف من AgCl ومحلول سيانات الأمونيوم", scientificMeaning: "تفاعل تبادل مزدوج بين أملاح غير عضوية", status: "neutral" },
      { sampleName: "محلول سيانات الأمونيوم", condition: "ترشيح المحلول وفصله", result: "محلول مائي رائق عديم اللون", scientificMeaning: "تنقية سيانات الأمونيوم غير الثابتة حرارياً", status: "neutral" },
      { sampleName: "التبخير والتسخين الهادئ", condition: "تسخين حتى الجفاف", result: "بلورات بيضاء نقية لليوريا (البولينة)", scientificMeaning: "إعادة ترتيب جزيئي وتكوين مركب عضوي بنجاح", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "امزج محلولي كلوريد الأمونيوم وسيانات الفضة في الدورق في حرارة الغرفة.",
        observation: "حدوث تفاعل تبادل مزدوج فوري، وتكون راسب أبيض كثيف من كلوريد الفضة AgCl مع محلول سيانات الأمونيوم الشفاف.",
        scientificReason: "أيونات الفضة تتحد مع أيونات الكلوريد لترسيب ملح AgCl شحيح الذوبان في الماء، تاركة سيانات الأمونيوم في المحلول.",
        examTip: "المعادلة الأولى: NH4Cl(aq) + AgCNO(aq) ⟶ AgCl(s)↓ + NH4CNO(aq).",
        physicalState: "راسب أبيض في محلول رائق",
        colorState: "أبيض حليبي معلق",
        chemicalProperty: "تفاعل تبادل مزدوج غير عضوي",
        equationOrFormula: "NH4Cl + AgCNO ⟶ NH4CNO + AgCl↓",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f1f5f9", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: true, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "قم بترشيح الراسب الأبيض الكثيف AgCl للحصول على محلول سيانات الأمونيوم الصافي.",
        observation: "استقرار الراسب الأبيض على ورقة الترشيح ونزول سائل شفاف رائق عديم اللون كلياً في الكأس.",
        scientificReason: "عملية الترشيح تفصل المادة الصلبة غير الذائبة AgCl للحصول على محلول مائي نقي من ملح سيانات الأمونيوم غير العضوي.",
        examTip: "سيانات الأمونيوم NH4CNO مركب غير عضوي غير ثابت حرارياً.",
        physicalState: "محلول مائي مرشح رائق",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "سيانات الأمونيوم النقية في الماء",
        equationOrFormula: "Filtrate: NH4CNO (Aqueous Solution)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.4, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "سخن محلول سيانات الأمونيوم الصافي تدريجياً وببطء على موقد التدفئة حتى يتبخر الماء.",
        observation: "تصاعد بخار الماء وتناقص حجم السائل تدريجياً مع بدء تشكل ترسبات بلورية بيضاء في قاع الدورق.",
        scientificReason: "الحرارة تسبب إعادة ترتيب جزيئي للروابط داخل جزيء سيانات الأمونيوم دون فقد أي ذرة، متحولاً إلى اليوريا.",
        examTip: "تفاعل تحول سيانات الأمونيوم إلى يوريا هو تفاعل إعادة ترتيب ذري (Rearrangement).",
        physicalState: "سائل ساخن يتبخر",
        colorState: "صافٍ مع بداية تبلور",
        chemicalProperty: "إعادة ترتيب جزيئي بالحرارة",
        equationOrFormula: "NH4CNO (aq) ⟶ (heat) ⟶ CO(NH2)2",
        telemetry: { temp: 105, ph: 7.2, gas: 30, liquidColor: "#f0f9ff", liquidHeight: 0.25, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 4,
        action: "راقب تكون بلورات بيضاء نقية في قاع الدورق.",
        observation: "تجمع بلورات بيضاء نقية جميلة في قاع الدورق تمثل مركب اليوريا (البولينة) العضوي.",
        scientificReason: "تكون مركب اليوريا CO(NH2)2 العضوي بنجاح من مادة غير عضوية أسقط فرضية القوة الحيوية لبرزيليوس إلى الأبد.",
        examTip: "العالم الألماني فريدريك فوهلر هو محطم نظرية القوة الحيوية بتحضير أول مركب عضوي معملياً (اليوريا).",
        physicalState: "بلورات صلبة عضوية بيضاء",
        colorState: "أبيض بلوري ناصع",
        chemicalProperty: "تخليق عضوي تاريخي ناجح",
        equationOrFormula: "CO(NH2)2 (Urea Crystals)",
        telemetry: { temp: 35, ph: 7.0, gas: 0, liquidColor: "#f8fafc", liquidHeight: 0.15, isHeating: false, isBubbling: false, isPrecipitating: true, isSmoking: false }
      }
    ]
  },

  u3_l2: {
    id: "u3_l2",
    apparatusType: "beaker",
    overallConclusion: "نظام التسمية المنهجي الدولي (IUPAC) يحدد اسم المركب العضوي بدقة لا تقبل اللبس عبر تحديد أطول سلسلة كربونية والترقيم من الطرف الأقرب لأول تفرع واستخدام السوابق اللاتينية الدالة على التكرار.",
    cumulativeTable: [
      { sampleName: "السلسلة الأم (5 ذرات C)", condition: "أطول سلسلة كربونية مستمرة", result: "بنتان (Pentane)", scientificMeaning: "السلسلة الأساسية التي يشتق منها الاسم", status: "neutral" },
      { sampleName: "تفرع ميثيل على C2", condition: "ترقيم من الطرف الأيمن الأقرب", result: "2-ميثيل بنتان", scientificMeaning: "تطبيق قاعدة أقل أرقام ممكنة للمتفرعات", status: "positive" },
      { sampleName: "تفرع ميثيل آخر على C4", condition: "تكرار نفس المجموعة الألكيلية", result: "2,4-ثنائي ميثيل بنتان", scientificMeaning: "استخدام سابقة (ثنائي) مع ذكر موضع كل تفرع", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "قم ببناء سلسلة كربون رئيسية مستمرة مكونة من 5 ذرات كربون واعتبرها السلسلة الأم.",
        observation: "تشكل نموذج جزيئي ثلاثي الأبعاد لسلسلة خماسية من ذرات الكربون المشبعة بالهيدروجين تمثل جزيء البنتان.",
        scientificReason: "الخطوة الأولى الإلزامية في نظام IUPAC هي اختيار أطول سلسلة متصلة من ذرات الكربون لتسمية المركب وفقاً للألكان المقابل.",
        examTip: "السلسلة الأم تحدد باسم الألكان المطابق لعدد ذرات الكربون (5 = بنتان).",
        physicalState: "نموذج جزيئي 3D",
        colorState: "ذرات كربون سوداء وهيدروجين أبيض",
        chemicalProperty: "سلسلة هيدروكربونية أم C5H12",
        equationOrFormula: "CH3-CH2-CH2-CH2-CH3 (Pentane)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "أضف تفرعاً ألكيلياً (مجموعة ميثيل -CH3) على ذرة الكربون رقم 2 بدءاً بالترقيم من الطرف الأيمن الأقرب.",
        observation: "ارتباط مجموعة ميثيل بذرة الكربون رقم 2، ليصبح اسم المركب 2-ميثيل بنتان وليس 4-ميثيل بنتان.",
        scientificReason: "تنص قواعد التسمية على ترقيم ذرات كربون السلسلة الرئيسية بدءاً من الطرف الأقرب لموضع التفرع لإعطائه أصغر رقم ممكن.",
        examTip: "الترقيم يبدأ دائماً من الطرف الأقرب للتفرع للحصول على أصغر مجموع للأرقام.",
        physicalState: "ألكان متفرع",
        colorState: "تفرع ألكيلي متناسق",
        chemicalProperty: "2-ميثيل بنتان",
        equationOrFormula: "CH3-CH(CH3)-CH2-CH2-CH3",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "أضف مجموعة ميثيل أخرى على ذرة الكربون رقم 4 ولاحظ استخدام السابقة (ثنائي).",
        observation: "اكتمال بناء المركب العضوي المتفرع، واعتماد اسمه المنهجي المعتمد: 2,4-ثنائي ميثيل بنتان.",
        scientificReason: "عند تكرار نفس المتفرع، تستخدم السوابق (ثنائي، ثلاثي، رباعي...) مع ذكر رقم موقع كل متفرع مفصولاً بفاصلة.",
        examTip: "يفصل بين الأرقام بفواصل (,) وبين الرقم والاسم بشرطة (-) مثل: 2,4-ثنائي ميثيل بنتان.",
        physicalState: "مركب هيدروكربوني تام التسمية",
        colorState: "بناء هندسي فراغي متقن",
        chemicalProperty: "2,4-ثنائي ميثيل بنتان IUPAC",
        equationOrFormula: "CH3-CH(CH3)-CH2-CH(CH3)-CH3",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u3_l3: {
    id: "u3_l3",
    apparatusType: "test_tubes",
    overallConclusion: "الهيدروكربونات تنقسم إلى سلاسل مفتوحة (ألكانات مشبعة، ألكينات غير مشبعة بروابط ثنائية، وألكاينات بروابط ثلاثية) وسلاسل مغلقة (حلقية)، وتحدد طبيعة الروابط درجة النشاط الكيميائي وقابلية تفاعلات الإضافة والاستبدال.",
    cumulativeTable: [
      { sampleName: "الإيثان C2H6", condition: "رابطة أحادية سيجما σ", result: "ألكان مشبع خامل نسبياً", scientificMeaning: "يتفاعل بالاستبدال فقط لقوة روابطه الأحادية", status: "neutral" },
      { sampleName: "الإيثين C2H4", condition: "رابطة ثنائية (1σ + 1π)", result: "ألكين غير مشبع نشط", scientificMeaning: "يتفاعل بالإضافة لسهولة كسر رابطة باي π", status: "positive" },
      { sampleName: "الإيثاين C2H2", condition: "رابطة ثلاثية (1σ + 2π)", result: "ألكاين غير مشبع فائق النشاط", scientificMeaning: "يتفاعل بالإضافة على مرحلتين لوجود رابطتي باي", status: "positive" },
      { sampleName: "البروبان الحلقي C3H6", condition: "هيدروكربون حلقي مشبع", result: "حلقة ثلاثية متوترة الزوايا (60°)", scientificMeaning: "سهل فتح الحلقة لنقصان الزاوية عن 109.5°", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "افحص نموذج جزيء الإيثان C2H6 ذي الروابط الأحادية المشبعة.",
        observation: "ظهور روابط تساهمية أحادية قوية من نوع سيجما (σ) بين ذرتي الكربون والست ذرات هيدروجين بزوايا 109.5°.",
        scientificReason: "الإيثان ألكان مشبع مستقر تتوزع إلكتروناته التكافئية في أفلاك sp3 مهجنة بزوايا رباعية الأوجه تمنحه ثباتاً كيميائياً.",
        examTip: "الألكانات هيدروكربونات مشبعة ترتبط جميع ذراتها بروابط أحادية قوية من نوع سيجما (σ).",
        physicalState: "نموذج ألكان غازي",
        colorState: "بناء هندسي رباعي الأوجه",
        chemicalProperty: "خمول كيميائي نسبي",
        equationOrFormula: "C2H6: CH3-CH3 (Single Bonds σ)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "قارن نموذج الإيثين C2H4 المحتوي على رابطة تساهمية ثنائية.",
        observation: "وجود رابطة مزدوجة بين ذرتي الكربون إحداهما سيجما القوية والأخرى باي الضعيفة وسهلة الكسر.",
        scientificReason: "الألكينات تتميز بوجود رابطة باي (π) ضعيفة ناتجة عن التداخل الجانبي لأفلاك p، مما يجعلها مركزاً للنشاط وتفاعلات الإضافة.",
        examTip: "الرابطة الثنائية تتكون من رابطة واحدة سيجما (σ) ورابطة واحدة باي (π).",
        physicalState: "نموذج ألكين غير مشبع",
        colorState: "بناء مستوٍ بزوايا 120°",
        chemicalProperty: "نشاط كيميائي وقابلية الإضافة",
        equationOrFormula: "C2H4: CH2=CH2 (1σ + 1π)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "افحص نموذج الإيثاين C2H2 ذي الرابطة التساهمية الثلاثية.",
        observation: "بناء خطي مستقيم بزاوية 180° يحتوي على رابطة ثلاثية تشمل رابطة سيجما ورابطتي باي.",
        scientificReason: "التهجين من نوع sp يمنح الإيثاين كثافة إلكترونية هائلة بين ذرتي الكربون ويجعله شديد النشاط في تفاعلات الإضافة والاحتراق.",
        examTip: "الرابطة الثلاثية تتكون من رابطة واحدة سيجما (σ) ورابطتين من نوع باي (2π).",
        physicalState: "نموذج ألكاين خطي",
        colorState: "بناء خطي مستقيم 180°",
        chemicalProperty: "ألكاين فائق النشاط",
        equationOrFormula: "C2H2: CH≡CH (1σ + 2π)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "افحص نموذج البروبان الحلقي C3H6 كسلسلة هيدروكربونية حلقية مشبعة.",
        observation: "حلقة كربونية مثلثة الشكل مغلقة بزوايا ضيقة تبلغ 60° متوترة بشدة مقارنة بالزاوية الطبيعية 109.5°.",
        scientificReason: "التوتر الحلقي الناتج عن صغر الزاوية (60°) يضعف الروابط ويجعل البروبان الحلقي أنشط بكثير من البروبان ذي السلسلة المفتوحة.",
        examTip: "البروبان الحلقي هيدروكربون أليفاتي حلقي مشبع يتشابه في صيغته الجزيئية مع الألكينات (CnH2n).",
        physicalState: "نموذج حلقي متوتر",
        colorState: "حلقة مثلثة مغلقة",
        chemicalProperty: "توتر زاوي وقابلية لفتح الحلقة",
        equationOrFormula: "Cyclopropane: C3H6 (Ring Strain)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u3_l4: {
    id: "u3_l4",
    apparatusType: "gas_prep",
    overallConclusion: "يحضر غاز الميثان في المعمل بالتقطير الجاف لخلات الصوديوم اللامائية مع الجير الصودي، ويجمع بإزاحة الماء لأسفل لعدم ذوبانه في الماء ولأنه أخف من الهواء، ويشتعل بلهب أزرق باهت غير مدخن.",
    cumulativeTable: [
      { sampleName: "الماء في حوض التجميع", condition: "بداية التجربة", result: "ماء مقطر صافٍ عديم اللون كلياً", scientificMeaning: "وسط نقي لإزاحة وتجميع الغاز", status: "neutral" },
      { sampleName: "خلات الصوديوم + الجير الصودي", condition: "تسخين شديد مباشر", result: "انصهار وتفاعل صلب-صلب وتصاعد غاز", scientificMeaning: "انتزاع مجموعة الكربوكسيل وإنتاج غاز الميثان CH4", status: "positive" },
      { sampleName: "غاز الميثان CH4 في المخبار", condition: "تجميعه بإزاحة الماء لأسفل", result: "غاز عديم اللون والرائحة يزيح الماء", scientificMeaning: "شحيح الذوبان في الماء وأقل كثافة من الهواء", status: "positive" },
      { sampleName: "اشتعال غاز الميثان", condition: "تقريب شظية مشتعلة", result: "اشتعال هادئ بلهب أزرق باهت غير مدخن", scientificMeaning: "احتراق تام للألكانات القصيرة لوفرة الأكسجين وصغر نسبة الكربون", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "ضع خليطاً جافاً من خلات الصوديوم اللامائية والجير الصودي (NaOH + CaO) في أنبوبة الاختبار الجافة.",
        observation: "مسحوق أبيض جاف في الأنبوبة، وحوض التجميع يحتوي على ماء مقطر صافٍ كلياً وعديم اللون وبارد (25°C).",
        scientificReason: "يستخدم الجير الصودي بدلاً من هيدروكسيد الصوديوم النقي لأن أكسيد الكالسيوم CaO يقلل من انصهار الزجاج ويمتص الرطوبة.",
        examTip: "علل: يستخدم الجير الصودي بدلاً من الصودا الكاوية بمفردها؟ لخفض درجة انصهار الخليط ومنع تآكل زجاج الأنبوبة.",
        physicalState: "خليط صلب جاف",
        colorState: "أبيض مسحوق ناصع",
        chemicalProperty: "تقطير جاف لإنتاج الألكانات",
        equationOrFormula: "CH3COONa(s) + NaOH(s) [CaO catalyst]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "صل أنبوبة التوصيل إلى حوض الماء المنكس فيه مخبار التجميع المليء بالماء المقطر النقي.",
        observation: "إحكام سدادة الأنبوبة تماماً وغمر فوهة أنبوب التوصيل تحت سطح الماء الصافي الشفاف في الحوض.",
        scientificReason: "التأكد من خلو الجهاز من أي تسريب للغاز ولضمان إزاحة الهواء بالكامل قبل جمع عينات الغاز النقي.",
        examTip: "يجمع غاز الميثان بإزاحة الماء لأسفل لأنه شحيح الذوبان في الماء.",
        physicalState: "جهاز تحضير غازات متكامل",
        colorState: "ماء حوض صافٍ شفاف",
        chemicalProperty: "إزاحة الماء لأسفل",
        equationOrFormula: "Gas Collection Apparatus: Pneumatic Trough",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "سخن الأنبوبة الصلبة تسخيناً شديداً بموقد بنزين حتى يتحرر غاز الميثان.",
        observation: "انصهار الخليط وتدفق سيل مستمر من فقاعات الغاز المتصاعدة في مخبار الماء وتناقص منسوب الماء في المخبار.",
        scientificReason: "الحرارة تفكك خلات الصوديوم وتطلق غاز الميثان CH4 مع تكوّن كربونات الصوديوم Na2CO3 في الأنبوبة الصلبة.",
        examTip: "معادلة تحضير الميثان: CH3COONa(s) + NaOH(s) ⟶ (CaO/heat) ⟶ Na2CO3(s) + CH4(g)↑.",
        physicalState: "تفاعل غازي نشط",
        colorState: "فقاعات غازية صافية",
        chemicalProperty: "انطلاق غاز الميثان CH4",
        equationOrFormula: "CH3COONa + NaOH ⟶ Na2CO3 + CH4↑",
        telemetry: { temp: 250, ph: 7.0, gas: 220, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true, flameColor: "#3b82f6" }
      },
      {
        stepNumber: 4,
        action: "اجمع الغاز المتصاعد في المخبار المقلوب وقربه بحذر من لهب مشتعل.",
        observation: "يزاح الماء بالكامل لأسفل، وعند تقريب لهب يشتعل غاز الميثان بهدوء بلهب أزرق باهت غير مدخن.",
        scientificReason: "الميثان يحترق احتراقاً تاماً في وفرة الأكسجين مكوناً CO2 وبخار الماء، ونظراً لصغر نسبة الكربون في جزيئه يكون اللهب غير مدخن.",
        examTip: "يحترق الميثان بلهب أزرق غير مدخن: CH4 + 2O2 ⟶ CO2 + 2H2O + طاقة حرارية.",
        physicalState: "غاز قابل للاشتعال",
        colorState: "لهب أزرق باهت هادئ",
        chemicalProperty: "احتراق تام للألكان",
        equationOrFormula: "CH4(g) + 2O2(g) ⟶ CO2(g) + 2H2O(g) + Heat",
        telemetry: { temp: 300, ph: 7.0, gas: 250, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, flameColor: "#38bdf8" }
      }
    ]
  },

  u3_l5: {
    id: "u3_l5",
    apparatusType: "beaker",
    overallConclusion: "يحضر غاز الإيثين بنزع جزيء ماء من الكحول الإيثيلي باستخدام حمض الكبريتيك المركز عند 180°C، ويميز عملياً عن الألكانات بقدرته الفائقة على إزالة اللون الأحمر لماء البروم الفوري وتكوين 1,2-ثنائي برومو إيثان عديم اللون.",
    cumulativeTable: [
      { sampleName: "كحول إيثيلي + H2SO4 مركز", condition: "بداية الخلط على البارد", result: "سائل رائق شفاف عديم اللون (25°C)", scientificMeaning: "تكوّن كبريتات الإيثيل الهيدروجينية عند 80°C", status: "neutral" },
      { sampleName: "التسخين حتى 180°C", condition: "نزع جزيء ماء كامل", result: "فوران وانطلاق فقاعات غاز الإيثين C2H4", scientificMeaning: "تفكك كبريتات الإيثيل وإنتاج الألكين غير المشبع", status: "positive" },
      { sampleName: "إضافة ماء البروم الأحمر للإيثين", condition: "رج المحلول جيداً", result: "زوال فوري وسريع للون الأحمر لماء البروم", scientificMeaning: "تفاعل إضافة على الرابطة الثنائية وتكوين مركب مشبع عديم اللون", status: "positive" },
      { sampleName: "المحلول الناتج النهائي", condition: "فحص ما بعد التفاعل", result: "محلول زيتي رائق عديم اللون كلياً", scientificMeaning: "تكوّن 1,2-ثنائي برومو إيثان النقي عديم اللون", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "ضع الكحول الإيثيلي وحمض الكبريتيك المركز بنسبة 1 : 2 في دورق التفاعل مع قطع صغيرة من الفخار المكسور.",
        observation: "محلول زيتي رائق شفاف عديم اللون في قاع الدورق، والوسط بارد في درجة حرارة الغرفة (25°C).",
        scientificReason: "حمض الكبريتيك المركز عامل نزع ماء قوي يتحد مع الكحول في البداية مكوناً كبريتات الإيثيل الهيدروجينية والماء.",
        examTip: "فائدة قطع الفخار أو حجر الغليان: تنظيم الغليان ومنع الفوران الشديد داخل الدورق.",
        physicalState: "سائل كيميائي ممتزج",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "خليط نزع الماء على البارد",
        equationOrFormula: "C2H5OH + H2SO4 (conc.) [Room Temp 25°C]",
        telemetry: { temp: 25, ph: 1.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "سخن الدورق تدريجياً حتى تصل درجة الحرارة إلى 180°C لتحرير غاز الإيثين.",
        observation: "اسوداد خفيف للمحلول وتصاعد فقاعات غزيرة من غاز الإيثين C2H4 المتدفق عبر أنبوب التوصيل.",
        scientificReason: "عند 180°C تنحل كبريتات الإيثيل الهيدروجينية حرارياً لتعيد توليد حمض الكبريتيك وتنطلق جزيئات الإيثين غير المشبعة.",
        examTip: "معادلة تحضير الإيثين النهائية: C2H5OH ⟶ (conc. H2SO4 / 180°C) ⟶ C2H4↑ + H2O.",
        physicalState: "تفاعل نزع ماء حراري",
        colorState: "بني داكن خفيف",
        chemicalProperty: "انطلاق غاز الإيثين غير المشبع",
        equationOrFormula: "C2H5OH ⟶ (180°C / H2SO4) ⟶ C2H4↑ + H2O",
        telemetry: { temp: 180, ph: 1.0, gas: 190, liquidColor: "#fed7aa", liquidHeight: 0.4, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 3,
        action: "الآن، أضف 3 قطرات من ماء البروم الأحمر إلى أنبوبة غاز الإيثين ورج جيداً.",
        observation: "دخول قطرات محلول ماء البروم الأحمر الداكن المذاب في CCl4 وملامستها لغاز الإيثين المتجمع في الأنبوبة.",
        scientificReason: "ماء البروم كاشف لعدم التشبع؛ تهاجم ذرات البروم الرابطة الثنائية الضعيفة باي (π) وتبدأ بكسرها لإجراء تفاعل إضافة.",
        examTip: "يستخدم ماء البروم المذاب في رابع كلوريد الكربون CCl4 للتمييز بين الألكانات والألكينات عملياً.",
        physicalState: "بدء تفاعل إضافة غير مشبع",
        colorState: "أحمر برتقالي يبهت تدريجياً",
        chemicalProperty: "تفاعل إضافة الهالوجين",
        equationOrFormula: "CH2=CH2 + Br2 (Red Solution in CCl4)",
        telemetry: { temp: 25, ph: 6.5, gas: 0, liquidColor: "#ea580c", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "لاحظ زوال اللون الأحمر لماء البروم فوراً في أنبوبة الإيثين وتحوله إلى محلول عديم اللون.",
        observation: "اختفاء اللون الأحمر للبروم تماماً وتحول السائل في الأنبوبة إلى محلول زيتي رائق شفاف وعديم اللون كلياً.",
        scientificReason: "كسر رابطة باي في الإيثين وارتباط ذرتي البروم بذرتي الكربون مكوناً 1,2-ثنائي برومو إيثان المشبع عديم اللون.",
        examTip: "علل: يزول لون ماء البروم الأحمر عند إمراره على الإيثين؟ لتكون مركب 1,2-ثنائي برومو إيثان عديم اللون بالاضافة.",
        physicalState: "مركب مشبع عديم اللون",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "إثبات عدم التشبع بزوال اللون",
        equationOrFormula: "CH2=CH2 + Br2 ⟶ CH2Br-CH2Br (Colorless)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u3_l6: {
    id: "u3_l6",
    apparatusType: "gas_prep",
    overallConclusion: "يحضر غاز الإيثاين (الأسيتيلين) في المعمل بتنقيط الماء البارد على كربيد الكالسيوم CaC2، وينقى بإمراره في كبريتات النحاس المحمضة، ويشتعل بلهب مدخن في الهواء ولكن بلهب أكسي-أسيتيلين فائق السخونة (3000°C) في وفرة الأكسجين المستخدم في لحام وقطع المعادن.",
    cumulativeTable: [
      { sampleName: "الماء في قمع التنقيط", condition: "بداية التجربة", result: "ماء مقطر نقي صافٍ عديم اللون تماماً", scientificMeaning: "وسط التفاعل لتنقيطه على الكاربيد الصلب", status: "neutral" },
      { sampleName: "تنقيط الماء على CaC2", condition: "ملامسة الماء للكاربيد", result: "فوران عنيف فوري وتصاعد حرارة وغاز كثيف", scientificMeaning: "تفاعل إماهة قوي وتحرر غاز الإيثاين C2H2", status: "positive" },
      { sampleName: "تنقية الغاز في CuSO4", condition: "إمرار الغاز في المحلول الحامضي", result: "ترسيب شوائب كبريتيد وفوسفيد النحاس", scientificMeaning: "تنقية الغاز من H2S و PH3 الشائبين ذوي الرائحة الكريهة", status: "positive" },
      { sampleName: "لهب الأكسي-أسيتيلين", condition: "حرق الغاز مع أكسجين نقي", result: "لهب ساطع فائق البياض وحرارة تصل 3000°C", scientificMeaning: "احتراق فائق الحرارة يستخدم في قطع ولحام المعادن", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "ضع قطعاً صلبة رمادية من كاربيد الكالسيوم في الدورق المخروطي الجاف.",
        observation: "قطع صلبة رمادية جافة في قاع الدورق، وقمع التنقيط العلوي مليء بماء مقطر صافٍ عديم اللون كلياً.",
        scientificReason: "كاربيد الكالسيوم مادة صلبة غير عضوية شديدة الشغف بالماء، ويجب التأكد من جفاف الدورق تماماً قبل بدء التجربة.",
        examTip: "الصيغة الكيميائية لكاربيد الكالسيوم هي CaC2.",
        physicalState: "صلب رمادي صخري جاف",
        colorState: "رمادي داكن + ماء نقي شفاف",
        chemicalProperty: "مركب كاربيد الكالسيوم CaC2",
        equationOrFormula: "CaC2(s) + Dry Flask Setup",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "افتح صنبور قمع التنقيط لينزل الماء قطرة قطرة على الكاربيد بشكل هادئ.",
        observation: "فوران عنيف وتصاعد فوري لفقاعات غازية كثيفة وارتفاع ملحوظ في درجة حرارة قاع الدورق المخروطي.",
        scientificReason: "الماء يتفاعل فورياً وبقوة مع كاربيد الكالسيوم في تفاعل طارد للحرارة منتجاً هيدروكسيد الكالسيوم وغاز الأسيتيلين.",
        examTip: "معادلة تحضير الإيثاين: CaC2(s) + 2H2O(l) ⟶ Ca(OH)2(aq) + C2H2(g)↑.",
        physicalState: "تفاعل إماهة عنيف طارد للحرارة",
        colorState: "أبيض جيري معلق وغاز متدفق",
        chemicalProperty: "انطلاق غاز الإيثاين C2H2",
        equationOrFormula: "CaC2 + 2H2O ⟶ Ca(OH)2 + C2H2↑",
        telemetry: { temp: 75, ph: 12.0, gas: 210, liquidColor: "#cbd5e1", liquidHeight: 0.5, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 3,
        action: "مرر الغاز المتصاعد عبر محلول كبريتات النحاس المحمضة بحمض الكبريتيك.",
        observation: "تغير طفيف في لون محلول كبريتات النحاس وتجمع راسب أسود خفيف جداً من الشوائب مع خروج غاز الإيثاين النقي.",
        scientificReason: "كبريتات النحاس المحمضة تتفاعل مع شوائب غاز الفوسفين PH3 وغاز كبريتيد الهيدروجين H2S الناتجة عن شوائب الكاربيد لتنقية الغاز.",
        examTip: "علل: يمرر غاز الإيثاين قبل جمعه على محلول كبريتات النحاس المحمضة؟ لإزالة غازي الفوسفين وكبريتيد الهيدروجين الشائبين.",
        physicalState: "تنقية غازية كيميائية",
        colorState: "أزرق حامضي يمتص الشوائب",
        chemicalProperty: "تنقية غاز الإيثاين النقي",
        equationOrFormula: "CuSO4 + H2S ⟶ CuS↓(Black) + H2SO4",
        telemetry: { temp: 35, ph: 2.0, gas: 180, liquidColor: "#0284c7", liquidHeight: 0.45, isHeating: false, isBubbling: true, isPrecipitating: true, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "اجمع الغاز في مخبار مقلوب بالماء وقربه من لهب موقد.",
        observation: "يزاح الماء لأسفل، وعند اشتعال الغاز بلهب أكسي-أسيتيلين يطلق شعلة ساطعة فائقة البياض والحرارة الشديدة (3000°C).",
        scientificReason: "احتراق الإيثاين في وفرة من غاز الأكسجين النقي احتراق تام يولد طاقة حرارية هائلة ترفع درجة الحرارة إلى 3000°C تكفي لصهر الحديد.",
        examTip: "يستخدم لهب الأكسي-أسيتيلين في قطع ولحام المعادن لأن درجة حرارته تصل إلى 3000°C.",
        physicalState: "شعلة أكسي-أسيتيلين جبارة",
        colorState: "أبيض ساطع فائق التوهج",
        chemicalProperty: "احتراق تام فائق الطاقة الحرارية",
        equationOrFormula: "2C2H2 + 5O2 ⟶ 4CO2 + 2H2O + 3000°C Heat",
        telemetry: { temp: 3000, ph: 7.0, gas: 240, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: true, flameColor: "#f8fafc" }
      }
    ]
  },

  u3_l7: {
    id: "u3_l7",
    apparatusType: "test_tubes",
    overallConclusion: "حلقة البنزين العطري تتميز بثبات استثنائي وطاقة رنين (Resonance Energy) هائلة تمنع تفاعلات الإضافة والأكسدة العادية؛ بينما الهكسين (الألكين غير الحلقي) يزيل لون برمنجنات البوتاسيوم فورياً لتأكسد رابطته الثنائية.",
    cumulativeTable: [
      { sampleName: "الهكسين + KMnO4 البنفسجية", condition: "إضافة ورج قوي", result: "زوال فوري للون البنفسجي وتكون راسب بني MnO2", scientificMeaning: "تأكسد الرابطة الثنائية في الألكينات (اختبار باير)", status: "positive" },
      { sampleName: "البنزين + KMnO4 البنفسجية", condition: "إضافة ورج قوي في حرارة الغرفة", result: "يبقى اللون البنفسجي ثابتاً ولا يزول مطلقاً", scientificMeaning: "ثبات حلقة البنزين بسبب عدم تمركز إلكترونات باي (الرنين)", status: "negative" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "ضع الهكسين في الأنبوبة الأولى والبنزين العطري في الأنبوبة الثانية.",
        observation: "كلا السائلين في الأنبوبتين رائق شفاف تماماً وعديم اللون في درجة حرارة الغرفة (25°C).",
        scientificReason: "كلاهما هيدروكربونات سائلة نقية لا لون لها، لكن الهكسين أليفاتي غير مشبع برابطة ثنائية والبنزين أروماتي حلقي رنيني.",
        examTip: "البنزين العطري C6H6 مركب أروماتي يحتوي على ستة إلكترونات باي غير متمركزة.",
        physicalState: "سوائل هيدروكربونية نقية",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "هكسين غير مشبع مقابل بنزين رنيني",
        equationOrFormula: "Tube 1: Hexene C6H12 | Tube 2: Benzene C6H6",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "أضف قطرات من برمنجنات البوتاسيوم البنفسجية المؤكسدة لـ الهكسين ورج بقوة.",
        observation: "اختفاء اللون البنفسجي لبرمنجنات البوتاسيوم فورياً وتحول المحلول للون شفاف مع راسب بني خفيف من ثاني أكسيد المنجنيز MnO2.",
        scientificReason: "الرابطة الثنائية في الهكسين سهلة الكسر والأكسدة بواسطة KMnO4 وتتحول إلى جليكول ثنائي الهيدروكسيل (تفاعل باير).",
        examTip: "اختبار باير: استخدام محلول برمنجنات البوتاسيوم القلوية المخففة للكشف عن عدم التشبع حيث يزول اللون البنفسجي.",
        physicalState: "أكسدة ألكين نشطة",
        colorState: "زوال اللون البنفسجي وتحوله لعديم اللون",
        chemicalProperty: "تأكسد الرابطة الثنائية بسهولة",
        equationOrFormula: "C6H12 + [O] + H2O ⟶ Diol Glycol (Colorless)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: true, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "الآن أضف برمنجنات البوتاسيوم البنفسجية لـ البنزين العطري ورج بقوة.",
        observation: "يبقى المحلول بنفسجياً داكناً ناصعاً ولا يتغير لونه إطلاقاً مهما طال الرج والانتظار.",
        scientificReason: "إلكترونات باي الستة في حلقة البنزين تدور في سحابة رنينية متصلة غير متمركزة تمنح الحلقة طاقة رنين وثباتاً يعصمها من الأكسدة العادية.",
        examTip: "علل: البنزين العطري لا يزيل لون محلول برمنجنات البوتاسيوم؟ لثبات حلقة البنزين بسبب ظاهرة الرنين وعدم تمركز إلكترونات باي.",
        physicalState: "عدم حدوث تفاعل",
        colorState: "بنفسجي داكن ثابت ومستقر",
        chemicalProperty: "خمول ومقاومة تامة للأكسدة بالرنين",
        equationOrFormula: "C6H6 + KMnO4 ⟶ No Reaction (Resonance Stability)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#7e22ce", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u3_l8: {
    id: "u3_l8",
    apparatusType: "test_tubes",
    overallConclusion: "التماكب السلسلي يمثل اتفاق المركبات في الصيغة الجزيئية واختلافها في الصيغة البنائية؛ ومتماكبا الصيغة C3H6 (البروبين والبروبان الحلقي) يميز بينهما عملياً بماء البروم؛ حيث يزيل البروبين اللون فوراً بالإضافة، بينما البروبان الحلقي لا يزيل اللون في الظلام.",
    cumulativeTable: [
      { sampleName: "متماكبات البنتان C5H12", condition: "فحص المتماكبات الثلاثة", result: "بنتان عادي، 2-ميثيل بيوتان، 2,2-ثنائي ميثيل بروبان", scientificMeaning: "تماكب هيكلي سلسلي يتدرج في درجات الغليان", status: "neutral" },
      { sampleName: "البروبين C3H6 + ماء البروم", condition: "إضافة ماء البروم الأحمر والرج", result: "زوال فوري وسريع للون الأحمر", scientificMeaning: "ألكين غير مشبع يتفاعل بالإضافة ويكسر الرابطة الثنائية", status: "positive" },
      { sampleName: "البروبان الحلقي C3H6 + ماء البروم", condition: "إضافة ماء البروم في الظلام", result: "يبقى اللون الأحمر ثابتاً دون تغير", scientificMeaning: "هيدروكربون مشبع بجميع روابطه سيجما لا يتفاعل في الظلام", status: "negative" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "افحص الهيكل البنائي لمتماكبات البنتان الثلاثة: البنتان العادي، 2-ميثيل بيوتان، و2,2-ثنائي ميثيل بروبان.",
        observation: "ثلاثة تراكيب بنائية مختلفة للصيغة الجزيئية نفسها C5H12 تختلف في تفرع السلسلة ودرجات الغليان.",
        scientificReason: "التماكب السلسلي ينشأ من اختلاف طريقة ترتيب وربط ذرات الكربون في الفراغ مع تساوي عدد الذرات في كل جزيء.",
        examTip: "عدد متماكبات البنتان C5H12 هو ثلاثة متماكبات فقط.",
        physicalState: "نماذج متماكبات جزيئية",
        colorState: "نماذج بنائية ملونة",
        chemicalProperty: "تماكب سلسلي لألكان C5H12",
        equationOrFormula: "C5H12: Pentane, Isopentane, Neopentane",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "جهز أنبوبتين تحتويان على متماكبين للصيغة C3H6 (أنبوبة البروبين وأنبوبة البروبان الحلقي) وفق تمرين ص 68 بكتاب الوزارة.",
        observation: "كلا الأنبوبتين تحتويان على سائل شفاف رائق عديم اللون تماماً وبدرجة حرارة 25°C.",
        scientificReason: "كلاهما يتفق في الصيغة الجزيئية C3H6 لكن البروبين ألكين مفتوح السلسلة ذو رابطة ثنائية والبروبان الحلقي ألكان حلقي مشبع.",
        examTip: "سؤال متكرر: كيف تميز عملياً بين البروبين والبروبان الحلقي؟ بإضافة ماء البروم الأحمر في الظلام.",
        physicalState: "متماكبان متطابقان مظهرياً",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "متماكبا الصيغة C3H6",
        equationOrFormula: "Tube 1: Propene CH3-CH=CH2 | Tube 2: Cyclopropane C3H6",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "أضف قطرات من ماء البروم الأحمر إلى أنبوبة البروبين ورج جيداً.",
        observation: "اختفاء اللون الأحمر للبروم فوراً وتحول المحلول إلى سائل شفاف رائق عديم اللون تماماً.",
        scientificReason: "البروبين يمتلك رابطة ثنائية تفتح فورياً بتفاعل إضافة مع جزيئات البروم لتكوين 1,2-ثنائي برومو بروبان عديم اللون.",
        examTip: "البروبين يزيل لون ماء البروم الأحمر لتكون 1,2-ثنائي برومو بروبان.",
        physicalState: "تفاعل إضافة سريع",
        colorState: "زوال اللون الأحمر إلى الشفاف التام",
        chemicalProperty: "ألكين غير مشبع سريع الإضافة",
        equationOrFormula: "CH3-CH=CH2 + Br2 ⟶ CH3-CHBr-CH2Br (Colorless)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "أضف قطرات من ماء البروم الأحمر إلى أنبوبة البروبان الحلقي ورج في الظلام.",
        observation: "يبقى المحلول محتفظاً باللون الأحمر للبروم ثابتاً دون أي تغير ولا يزول اللون إطلاقاً.",
        scientificReason: "البروبان الحلقي مركب مشبع بروابط سيجما لا يتفاعل مع البروم في الظلام (يحتاج ضوء شمس مباشر أو تسخين شديد لكسر حلقته بالاستبدال).",
        examTip: "البروبان الحلقي لا يزيل لون ماء البروم في الظلام لغياب الروابط الثنائية باي.",
        physicalState: "لا يحدث تفاعل في الظلام",
        colorState: "أحمر برتقالي ثابت ومستقر",
        chemicalProperty: "مركب مشبع لا يتفاعل بالإضافة في الظلام",
        equationOrFormula: "Cyclopropane + Br2 (in dark) ⟶ No Reaction",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#ea580c", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  // === UNIT 4: Group 5 Elements ===
  u4_l1: {
    id: "u4_l1",
    apparatusType: "beaker",
    overallConclusion: "التأصل هو وجود العنصر في عدة صور بلورية تختلف في الخواص الفيزيائية وتتفق في الخواص الكيميائية؛ الفوسفور الأبيض أنشط بكثير من الأحمر ويشتعل تلقائياً عند 30°C بينما الأحمر يحتاج تسخيناً حتى 240°C.",
    cumulativeTable: [
      { sampleName: "الفوسفور الأحمر", condition: "تسخين على ملعقة الاحتراق", result: "لا يشتعل إلا عند تسخينه فوق 240°C", scientificMeaning: "صورة تأصلية متبلمرة ثابتة ومستقرة نسبياً", status: "neutral" },
      { sampleName: "الفوسفور الأبيض (الرطب)", condition: "محفوظ تحت سطح الماء", result: "مادة شمعية صفراء باهتة لا تتفاعل تحت الماء", scientificMeaning: "الماء يعزله تماماً عن أكسجين الهواء لمنع اشتعاله", status: "neutral" },
      { sampleName: "الفوسفور الأبيض (المجفف)", condition: "تعريضه للهواء في درجة 30°C", result: "اشتعال ذاتي تلقائي بلهب أصفر وأبخرة بيضاء P2O5 كثيفة", scientificMeaning: "صورة جزيئية P4 متوترة الزوايا (60°) شديدة النشاط والسمية", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "أخرج بلطف قطعة صغيرة من الفوسفور الأحمر الصلب وضعه على ملعقة الاحتراق وقربه من اللهب لتسخينه.",
        observation: "لا يشتعل الفوسفور الأحمر في البداية إلا بعد تسخين شديد ومستمر فوق 240°C، حيث يشتعل حينها بلهب أصفر وأبخرة بيضاء كثيفة.",
        scientificReason: "الفوسفور الأحمر يتكون من سلاسل بوليمرية معقدة وثابتة شبكياً تتطلب طاقة حرارية عالية لكسرها وبدء التفاعل مع الأكسجين.",
        examTip: "درجة اشتعال الفوسفور الأحمر مرتفعة نسبياً (حوالي 240°C) وهو غير سام ولا يحفظ تحت الماء.",
        physicalState: "صلب بلوري أحمر متبلمر",
        colorState: "أحمر قرميدي داكن",
        chemicalProperty: "صورة تأصلية مستقرة",
        equationOrFormula: "4P(red) + 5O2 ⟶ (240°C) ⟶ 2P2O5↑",
        telemetry: { temp: 245, ph: 7.0, gas: 40, liquidColor: "#f0f9ff", liquidHeight: 0.3, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: true, flameColor: "#facc15" }
      },
      {
        stepNumber: 2,
        action: "بحذر شديد باستخدام الملقط، أخرج قطعة صغيرة من الفوسفور الأبيض المحفوظ تحت الماء وجففها تماماً.",
        observation: "قطعة شمعية مائلة للاصفرار طرية الملمس، كانت معزولة تحت الماء المقطر الشفاف الذي يمنع وصول الأكسجين إليها.",
        scientificReason: "الفوسفور الأبيض يتكون من جزيئات رباعية الذرات P4 ذات شكل هرمي بزوايا ضيقة (60°) متوترة بشدة وشديدة الشغف بالتأكسد.",
        examTip: "يحفظ الفوسفور الأبيض تحت سطح الماء لأنه يشتعل تلقائياً في الهواء الجوي ولا يذوب في الماء.",
        physicalState: "مادة شمعية متبلورة رطبة",
        colorState: "أبيض مصفر شمعي",
        chemicalProperty: "شديد السمية وسريع الاشتعال",
        equationOrFormula: "P4(white) [Preserved under pure water]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.3, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "اترك قطعة الفوسفور الأبيض الجافة معرضة لأكسجين الهواء عند درجة حرارة الغرفة (30 درجة مئوية).",
        observation: "اشتعال ذاتي وتلقائي فوري دون تقريب أي لهب، مع وميض أصفر ساطع وانبعاث سحب بيضاء خانقة وخارقة الكثافة من P2O5.",
        scientificReason: "درجة الاشتعال الذاتي للفوسفور الأبيض منخفضة جداً (حوالي 30-34°C)، ويتأكسد ذاتياً بمجرد ملامسة أكسجين الهواء مطبقاً ظاهرة التأصل.",
        examTip: "خامس أكسيد الفوسفور P2O5 هو الأبخرة البيضاء الكثيفة الناتجة من احتراق الفوسفور في الهواء.",
        physicalState: "اشتعال ذاتي تلقائي",
        colorState: "لهب أصفر متوهج وسحب بيضاء كثيفة",
        chemicalProperty: "احتراق تلقائي Spontaneous Combustion",
        equationOrFormula: "P4(white) + 5O2 ⟶ (30°C Auto) ⟶ 2P2O5↑ (White Dense Smoke)",
        telemetry: { temp: 350, ph: 3.0, gas: 150, liquidColor: "#fef08a", liquidHeight: 0.3, isHeating: true, isBubbling: false, isPrecipitating: false, isSmoking: true, flameColor: "#facc15" }
      }
    ]
  },

  u4_l2: {
    id: "u4_l2",
    apparatusType: "gas_prep",
    overallConclusion: "يحضر غاز النيتروجين في المعمل بالتسخين الهين لمحلول مائي من كلوريد الأمونيوم ونتريت الصوديوم لتكوين نتريت الأمونيوم الذي ينحل حرارياً لغاز النيتروجين والماء، ويجمع بإزاحة الماء لأسفل لشح ذوبانه في الماء.",
    cumulativeTable: [
      { sampleName: "الماء في حوض التجميع", condition: "بداية التجربة", result: "ماء مقطر صافٍ كلياً وعديم اللون", scientificMeaning: "وسط مائي نقي متعادل لإزاحة الغاز وتجميعه", status: "neutral" },
      { sampleName: "NH4Cl + NaNO2 + ماء", condition: "بداية الخلط على البارد", result: "محلول مائي رائق عديم اللون (25°C)", scientificMeaning: "تفاعل تبادل مزدوج لتكوين نتريت الأمونيوم الذائب", status: "neutral" },
      { sampleName: "التسخين الهين اللطيف", condition: "تسخين الدورق بموقد بنزن", result: "فوران منتظم وتدفق لفقاعات غاز النيتروجين", scientificMeaning: "انحلال حراري سريع لـ NH4NO2 غير الثابت إلى N2 و 2H2O", status: "positive" },
      { sampleName: "غاز النيتروجين N2 المتجمع", condition: "فحص الغاز في المخبار", result: "غاز عديم اللون والرائحة يزيح الماء لأسفل", scientificMeaning: "غاز خامل لا يشتعل ولا يساعد على الاشتعال", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "ضع خليطاً متساوياً من ملح كلوريد الأمونيوم ونتريت الصوديوم مع قليل من الماء في دورق التسخين.",
        observation: "ذوبان الملحين تماماً وتكوّن محلول مائي صافٍ شفاف عديم اللون في الدورق، والوسط بارد (25°C).",
        scientificReason: "الماء ضروري لإذابة الملحين وتأيينهما لحدوث تفاعل التبادل المزدوج وتجنب انفجار نتريت الأمونيوم الجاف.",
        examTip: "علل: يضاف الماء لخليط كلوريد الأمونيوم ونتريت الصوديوم؟ لمنع تفكك نتريت الأمونيوم الانفجاري والتحكم في التفاعل.",
        physicalState: "محلول مائي متجانس",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "تفاعل تبادل مزدوج في وسط مائي",
        equationOrFormula: "NH4Cl(aq) + NaNO2(aq) ⟶ NaCl(aq) + NH4NO2(aq)",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "صل دورق التحضير بأنبوب توصيل يمتد إلى حوض الماء المنكس فيه مخبار التجميع المليء بالماء المقطر.",
        observation: "إحكام السدادة وغمر أنبوب التوصيل تحت سطح الماء الصافي العديم اللون في حوض التجميع البارد.",
        scientificReason: "إحكام الجهاز يمنع تسرب الغاز ويضمن إزاحة الهواء النقي وتجمع النيتروجين الصافي في المخبار.",
        examTip: "يجمع غاز النيتروجين في المعمل بإزاحة الماء لأسفل لأنه شحيح الذوبان في الماء.",
        physicalState: "جهاز جمع غازات محكم",
        colorState: "ماء مقطر نقي شفاف كلياً",
        chemicalProperty: "إزاحة الماء لأسفل",
        equationOrFormula: "Apparatus Setup: Water Displacement Trough",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "سخن دورق التفاعل تسخيناً هيناً ولطيفاً باستخدام موقد بنزين.",
        observation: "بدء حدوث فوران منتظم وتصاعد مستمر لفقاعات غاز النيتروجين عبر أنبوب التوصيل نحو المخبار.",
        scientificReason: "الحرارة الهينة تفكك نتريت الأمونيوم غير الثابت حرارياً إلى غاز النيتروجين وبخار الماء وفق المعادلة المعتمدة.",
        examTip: "معادلة انحلال نتريت الأمونيوم: NH4NO2(aq) ⟶ (heat) ⟶ N2(g)↑ + 2H2O(l).",
        physicalState: "تفكك حراري منتظم",
        colorState: "صافٍ مع فقاعات غازية",
        chemicalProperty: "تحرر غاز النيتروجين النقي",
        equationOrFormula: "NH4NO2 ⟶ (Gentle Heat) ⟶ N2↑ + 2H2O",
        telemetry: { temp: 85, ph: 7.0, gas: 180, liquidColor: "#f0f9ff", liquidHeight: 0.45, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "راقب تصاعد فقاعات غاز النيتروجين وتجمعها في أعلى المخبار منكسة الماء لأسفل.",
        observation: "هبوط منسوب الماء في المخبار المقلوب حتى يفرغ تماماً ويصبح المخبار مليئاً بغاز النيتروجين عديم اللون والرائحة.",
        scientificReason: "غاز النيتروجين كتلته الجزيئية (28) شحيح الذوبان في الماء مما يتيح إزاحة عمود الماء لأسفل واحتجاز الغاز النقي.",
        examTip: "خواص النيتروجين: غاز عديم اللون والرائحة، شحيح الذوبان في الماء، خامل كيميائياً في درجات الحرارة العادية لقوة رابطته الثلاثية.",
        physicalState: "غاز نقي مجمع",
        colorState: "غاز عديم اللون والرائحة",
        chemicalProperty: "غاز خامل متعادل N2",
        equationOrFormula: "N2(g) [Pure Collected Gas]",
        telemetry: { temp: 40, ph: 7.0, gas: 220, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u4_l3: {
    id: "u4_l3",
    apparatusType: "gas_prep",
    overallConclusion: "تجربة نافورة النشادر تثبت خاصيتين جوهريتين لغاز الأمونيا NH3: الشراهة الفائقة للذوبان في الماء (يذوب منه 700 حجم في حجم واحد من الماء) والطبيعة القلوية القاعدية لمحلوله المائي الذي يغير لون كاشف تباع الشمس إلى الأزرق البراق.",
    cumulativeTable: [
      { sampleName: "غاز النشادر في الدورق العلوي", condition: "دورق مقلوب جاف", result: "غاز عديم اللون ذو رائحة نفاذة", scientificMeaning: "غاز أمونيا نقي جاف أخف من الهواء", status: "neutral" },
      { sampleName: "الماء في الحوض السفلي", condition: "إضافة دليل تباع الشمس الأحمر", result: "محلول مائي أحمر وردي (pH = 5.5)", scientificMeaning: "وسط مائي حامضي خفيف معد للكشف عن القلوية", status: "neutral" },
      { sampleName: "حقن قطرات الماء العلوية", condition: "ضغط الحقنة الجانبية", result: "هبوط هائل ومفاجئ في الضغط الداخلي", scientificMeaning: "ذوبان فوري لشحنة هائلة من غاز النشادر في قطرات الماء", status: "positive" },
      { sampleName: "نافورة النشادر المتدفقة", condition: "اندفاع الماء للأعلى", result: "نافورة مائية قوية زرقاء براقة ساحرة", scientificMeaning: "تكوّن هيدروكسيد الأمونيوم القلوي NH4OH (pH = 11.5)", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "املأ الدورق المستدير العلوي تماماً بغاز النشادر NH3 الجاف وركبه مقلوباً بشكل آمن.",
        observation: "الدورق العلوي المقلوب يبدو فارغاً وعديم اللون لاحتوائه على غاز النشادر النقي الجاف ذي الرائحة النفاذة.",
        scientificReason: "غاز النشادر أخف من الهواء (كثافته 0.6) فيجمع بإزاحة الهواء لأسفل في دورق جاف مقلوب.",
        examTip: "يجفف غاز النشادر بإمراره على الجير الحي (أكسيد الكالسيوم CaO) ولا يستخدم حمض الكبريتيك لأنه يتفاعل معه.",
        physicalState: "غاز جاف نقي",
        colorState: "صافٍ عديم اللون",
        chemicalProperty: "غاز النشادر الجاف NH3",
        equationOrFormula: "NH3(g) [Pure Dry Ammonia]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.4, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "اغمر الأنبوب الزجاجي المستدق الممتد من الدورق في حوض الماء السفلي المضاف إليه دليل تباع الشمس الأحمر.",
        observation: "الماء في الحوض السفلي يكتسي لوناً أحمر هادئاً لوجود دليل تباع الشمس في الوسط المتعادل/الحامضي الخفيف، دون صعود للماء.",
        scientificReason: "الأنبوب الزجاجي المستدق مغمور تحت الماء، والضغط الجوي داخل الدورق وخارجه متوازن في هذه المرحلة.",
        examTip: "دليل تباع الشمس يكون أحمر في الوسط الحمضي وأزرق في الوسط القاعدي.",
        physicalState: "محلول كاشف أحمر",
        colorState: "أحمر وردي شفاف",
        chemicalProperty: "ماء حوض مضاف إليه تباع الشمس الأحمر",
        equationOrFormula: "Red Litmus in Water [pH ≈ 6.0]",
        telemetry: { temp: 25, ph: 6.0, gas: 0, liquidColor: "#f87171", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "باستخدام حقنة الضغط الجانبية، احقن بضع قطرات من الماء داخل الدورق العلوي.",
        observation: "بمجرد دخول قطرات الماء، يذوب فيها غاز النشادر فورياً ويحدث تفريغ جزئي مفاجئ للضغط داخل الدورق العلوي.",
        scientificReason: "شراهة ذوبان الأمونيا الهائلة تجعل حجماً كبيراً جداً من الغاز يذوب في قطرات الماء القليلة، مما يهبط بالضغط الداخلي هبوطاً ساحقاً.",
        examTip: "علل: اندفاع الماء في تجربة نافورة النشادر؟ لأن شراهة ذوبان النشادر في الماء تحدث فرق ضغط هائل يدفع الماء بقوة للأعلى.",
        physicalState: "هبوط ساحق في الضغط الداخلي",
        colorState: "بدء امتصاص الغاز",
        chemicalProperty: "شراهة ذوبان الأمونيا في الماء",
        equationOrFormula: "NH3(g) + H2O(l) ⟶ NH4OH(aq) [Vacuum Generated]",
        telemetry: { temp: 25, ph: 10.0, gas: 0, liquidColor: "#60a5fa", liquidHeight: 0.45, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "راقب اندفاع الماء بقوة من الحوض السفلي إلى الدورق العلوي.",
        observation: "يندفع الماء بقوة نفاثة عبر الأنبوب المستدق كنافورة ساحرة ويتحول لونه فور دخوله الدورق من الأحمر إلى الأزرق البراق!",
        scientificReason: "الضغط الجوي الخارجي يدفع ماء الحوض للأعلى لملء الفراغ، وذوبان النشادر يولد محلول هيدروكسيد الأمونيوم القلوي الذي يزرق تباع الشمس فوراً.",
        examTip: "تثبت تجربة نافورة النشادر: 1. الشراهة العالية لذوبان النشادر في الماء. 2. الخواص القلوية لمحلول النشادر المائي.",
        physicalState: "نافورة مائية قلوية مندفعة",
        colorState: "أزرق براق ناصع",
        chemicalProperty: "قاعدية قلوية مميزة pH = 11.5",
        equationOrFormula: "NH4OH(aq) ⇌ NH4⁺(aq) + OH⁻(aq) [pH = 11.5]",
        telemetry: { temp: 28, ph: 11.5, gas: 0, liquidColor: "#1d4ed8", liquidHeight: 0.65, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u4_l4: {
    id: "u4_l4",
    apparatusType: "beaker",
    overallConclusion: "سماد كبريتات الأمونيوم (NH4)2SO4 يكشف عنه كيميائياً بتحليل شقيه: الشق القاعدي (الأمونيوم NH4⁺) بإضافة قاعدة قوية NaOH والتسخين وتصاعد غاز النشادر ذي الرائحة النفاذة، والشق الحمضي (الكبريتات SO4²⁻) بإضافة محلول BaCl2 وتكوين راسب أبيض من BaSO4 لا يذوب في الأحماض.",
    cumulativeTable: [
      { sampleName: "محلول السماد في الماء", condition: "إذابة حبيبات السماد", result: "محلول مائي رائق شفاف عديم اللون", scientificMeaning: "سماد سريع الذوبان في الماء ذو شحنات أيونية حرة", status: "neutral" },
      { sampleName: "الكشف عن كاتيون الأمونيوم NH4⁺", condition: "إضافة NaOH والتسخين الهين", result: "تصاعد غاز النشادر وتزريق ورقة تباع الشمس", scientificMeaning: "إزاحة الأمونيا بقاعدة أقوى: NH4⁺ + OH⁻ ⟶ NH3↑ + H2O", status: "positive" },
      { sampleName: "الكشف عن أنيون الكبريتات SO4²⁻", condition: "إضافة محلول BaCl2", result: "راسب أبيض كثيف لا يذوب في حمض HCl", scientificMeaning: "تكوّن كبريتات الباريوم BaSO4 شحيحة الذوبان", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "أذب القليل من حبيبات السماد (كبريتات الأمونيوم) في الماء المقطر لتحصل على محلول واضح.",
        observation: "ذوبان تام وسريع لحبيبات السماد البيضاء في الماء المقطر وتكوّن محلول رائق متجانس وعديم اللون كلياً (25°C).",
        scientificReason: "كبريتات الأمونيوم مركب أيوني تام الذوبان في الماء يتفكك إلى كاتيونات الأمونيوم NH4⁺ وأنيونات الكبريتات SO4²⁻.",
        examTip: "الصيغة الكيميائية لسماد كبريتات الأمونيوم (سلفات النشادر): (NH4)2SO4.",
        physicalState: "محلول مائي أيوني رائق",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "تأين تام في الماء المقطر",
        equationOrFormula: "(NH4)2SO4(s) ⟶ 2NH4⁺(aq) + SO4²⁻(aq)",
        telemetry: { temp: 25, ph: 6.5, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "أضف هيدروكسيد الصوديوم NaOH إلى المحلول وسخنه بلطف على الموقد.",
        observation: "فوران خفيف مع انبعاث غاز ذي رائحة نفاذة حادة ومميزة (غاز الأمونيا).",
        scientificReason: "هيدروكسيد الصوديوم قاعدة قوية تطرد النشادر من أملاحه بالتسخين مكونة كبريتات الصوديوم والماء وغاز النشادر.",
        examTip: "معادلة الكشف عن الأمونيوم: (NH4)2SO4 + 2NaOH ⟶ Na2SO4 + 2H2O + 2NH3↑.",
        physicalState: "تفاعل طرد قاعدة ضعيفة",
        colorState: "صافٍ مع تصاعد غاز",
        chemicalProperty: "انطلاق غاز النشادر النفاذ",
        equationOrFormula: "NH4⁺ + OH⁻ ⟶ (heat) ⟶ NH3↑ + H2O",
        telemetry: { temp: 80, ph: 10.0, gas: 90, liquidColor: "#f0f9ff", liquidHeight: 0.4, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 3,
        action: "ضع ورقة كاشف مبللة بالماء فوق فوهة الأنبوبة لمراقبة تغير الألوان.",
        observation: "تحول لون ورقة تباع الشمس الحمراء المبللة فوراً إلى اللون الأزرق البراق عند ملامستها للأبخرة المتصاعدة.",
        scientificReason: "غاز النشادر المتصاعد يذوب في رطوبة ورقة الكاشف مكوناً محلولاً قلوياً يرفع الرقم الهيدروجيني ويزرق الكاشف.",
        examTip: "يكشف عن غاز النشادر بتقريب ساق زجاجية مبللة بحمض HCl المركز حيث تتكون سحب بيضاء كثيفة من NH4Cl.",
        physicalState: "كشف لوني نوعي",
        colorState: "تحول الورقة للون الأزرق",
        chemicalProperty: "تأكيد قلوية غاز النشادر",
        equationOrFormula: "NH3 + H2O ⟶ NH4⁺ + OH⁻ [Turns Litmus Blue]",
        telemetry: { temp: 50, ph: 10.5, gas: 60, liquidColor: "#f0f9ff", liquidHeight: 0.4, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 4,
        action: "أضف محلول كلوريد الباريوم BaCl2 في أنبوبة اختبار أخرى لعينة السماد.",
        observation: "تكون راسب أبيض كثيف كالحليب لا يذوب عند إضافة حمض الهيدروكلوريك HCl المخفف.",
        scientificReason: "أيونات الباريوم Ba²⁺ تتحد فورياً مع أيونات الكبريتات SO4²⁻ لترسيب ملح كبريتات الباريوم BaSO4 عديم الذوبان في الأحماض.",
        examTip: "الكشف عن أنيون الكبريتات: إضافة محلول كلوريد الباريوم يعطي راسباً أبيض من BaSO4 لا يذوب في حمض HCl المخفف.",
        physicalState: "راسب أبيض كثيف غير ذائب",
        colorState: "أبيض حليبي ناصع",
        chemicalProperty: "تأكيد وجود أنيون الكبريتات SO4²⁻",
        equationOrFormula: "Ba²⁺(aq) + SO4²⁻(aq) ⟶ BaSO4(s)↓ (White Precipitate)",
        telemetry: { temp: 25, ph: 6.0, gas: 0, liquidColor: "#f1f5f9", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: true, isSmoking: false }
      }
    ]
  },

  // === UNIT 5: Halogens ===
  u5_l1: {
    id: "u5_l1",
    apparatusType: "test_tubes",
    overallConclusion: "الهالوجينات تتدرج في نشاطها الكيميائي وقدرتها المؤكسدة تنازلياً: الكلور يزيح البروم واليود من محاليل أملاحهما، والبروم يزيح اليود فقط؛ لأن نصف القطر يزداد وتتناقص السالبية الكهربية بالنزول لأسفل المجموعة.",
    cumulativeTable: [
      { sampleName: "محاليل KBr و KI", condition: "بداية التجربة قبل الإضافة", result: "محاليل مائية نقية شفافة وعديمة اللون تماماً", scientificMeaning: "أملاح هاليدية متأينة بالكامل في الماء", status: "neutral" },
      { sampleName: "KBr + ماء الكلور", condition: "إضافة ماء الكلور الأصفر الشاحب", result: "تحول المحلول فوراً للون البرتقالي المحمر", scientificMeaning: "الكلور الأنشط يزيح البروم الأقل نشاطاً: Cl2 + 2Br⁻ ⟶ 2Cl⁻ + Br2", status: "positive" },
      { sampleName: "استخلاص البروم في CCl4", condition: "إضافة المذيب العضوي والرج", result: "طبقة سفلية برتقالية محمرة داكنة مركزة", scientificMeaning: "البروم غير قطبي يذوب بشراهة في المذيبات العضوية", status: "positive" },
      { sampleName: "KI + ماء البروم", condition: "إضافة ماء البروم لمحلول اليوديد", result: "تحول المحلول للبني وتكون لون بنفسجي في CCl4", scientificMeaning: "البروم يزيح اليود الأقل نشاطاً: Br2 + 2I⁻ ⟶ 2Br⁻ + I2", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "صب محلول بروميد البوتاسيوم KBr عديم اللون في الأنبوبة الأولى ومحلول يوديد البوتاسيوم KI في الثانية.",
        observation: "كلا الأنبوبتين تحتويان على محلول مائي صافٍ كلياً وعديم اللون تماماً كقطرة الماء المقطر (25°C).",
        scientificReason: "أملاح الهاليدات القلوية (KBr و KI) تامة التأين في الماء ومحاليلها المائية شفافة وعديمة اللون لعدم وجود إلكترونات حرة ممتصة للضوء.",
        examTip: "محاليل كلوريد، بروميد، ويوديد البوتاسيوم جميعها محاليل مائية عديمة اللون.",
        physicalState: "محاليل مائية متأينة",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "أملاح هاليدية متعادلة عديمة اللون",
        equationOrFormula: "KBr(aq) and KI(aq) [Colorless Solutions]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "أضف قطرات من ماء الكلور الأصفر الشاحب النشط إلى أنبوبة بروميد البوتاسيوم.",
        observation: "تحول فوري للمحلول عديم اللون إلى لون برتقالي محمر ناصع.",
        scientificReason: "الكلور أكثر كهرسالبية ونشاطاً كيميائياً من البروم، فيقوم بأكسدة أيونات البروميد Br⁻ إلى عنصر البروم الحر Br2 الملون بالبرتقالي.",
        examTip: "معادلة إزاحة البروم بالكلور: Cl2(aq) + 2KBr(aq) ⟶ 2KCl(aq) + Br2(aq).",
        physicalState: "تفاعل إزاحة وتأكسد هالوجيني",
        colorState: "برتقالي محمر (عنصر البروم)",
        chemicalProperty: "تحرر عنصر البروم الحر Br2",
        equationOrFormula: "Cl2 + 2Br⁻ ⟶ 2Cl⁻ + Br2 (Orange Red)",
        telemetry: { temp: 25, ph: 5.0, gas: 0, liquidColor: "#ea580c", liquidHeight: 0.55, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "أضف بضع قطرات من المذيب العضوي CCl4 ورج الأنبوبة جيداً.",
        observation: "انفصال السائل إلى طبقتين، وتجمع طبقة سفلية عضوية ثقيلة ذات لون برتقالي محمر كثيف وبراق.",
        scientificReason: "البروم جزيء غير قطبي يذوب بشدة في رابع كلوريد الكربون CCl4 غير القطبي، ونظراً لكثافة المذيب العضوي العالية يستقر في الأسفل.",
        examTip: "يستخدم مذيب CCl4 أو الكلوروفورم لتأكيد لون الهالوجين الحر المستخلص في طبقته العضوية.",
        physicalState: "استخلاص عضوي سائل-سائل",
        colorState: "طبقة برتقالية محمرة مركزة",
        chemicalProperty: "ذوبان الهالوجين غير القطبي",
        equationOrFormula: "Br2 in CCl4 Organic Layer (Heavy Bottom Layer)",
        telemetry: { temp: 25, ph: 5.0, gas: 0, liquidColor: "#c2410c", liquidHeight: 0.6, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "الآن، أضف ماء البروم البرتقالي إلى أنبوبة يوديد البوتاسيوم KI وراقب النتيجة.",
        observation: "تحول المحلول إلى لون بني قاتم، وعند إضافة CCl4 تتلون الطبقة العضوية بلون بنفسجي أرجواني ساحر.",
        scientificReason: "البروم يزيح اليود الأقل منه نشاطاً كيميائياً، ويتحرر اليود I2 الحر الذي يظهر بلون أرجواني بنفسجي في المذيب العضوي.",
        examTip: "الكلور يزيح البروم واليود؛ والبروم يزيح اليود فقط؛ بينما اليود لا يزيح أياً منهما.",
        physicalState: "تحرر اليود الحر",
        colorState: "بنفسجي أرجواني (اليود في CCl4)",
        chemicalProperty: "إزاحة اليود الأقل نشاطاً",
        equationOrFormula: "Br2 + 2I⁻ ⟶ 2Br⁻ + I2 (Violet in CCl4)",
        telemetry: { temp: 25, ph: 5.5, gas: 0, liquidColor: "#581c87", liquidHeight: 0.6, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      }
    ]
  },

  u5_l2: {
    id: "u5_l2",
    apparatusType: "gas_prep",
    overallConclusion: "يحضر غاز الكلور في المعمل بأكسدة حمض الهيدروكلوريك المركز بواسطة ثاني أكسيد المنجنيز MnO2 مع التسخين الهين، وينقى بإمراره في الماء لامتصاص HCl ثم حمض الكبريتيك لتجفيفه، ويجمع بإزاحة الهواء لأعلى لثقله وخنقته.",
    cumulativeTable: [
      { sampleName: "الماء في زجاجة الغسيل", condition: "بداية التجربة", result: "ماء مقطر نقي صافٍ عديم اللون تماماً", scientificMeaning: "وسط مائي لامتصاص غاز HCl الشائب فقط دون حبس الكلور", status: "neutral" },
      { sampleName: "MnO2 + HCl مركز", condition: "تسخين هين بموقد بنزن", result: "فوران وانطلاق غاز أخضر مصفر خانق", scientificMeaning: "أكسدة أيونات الكلوريد Cl⁻ إلى غاز الكلور Cl2", status: "positive" },
      { sampleName: "التجفيف في H2SO4 مركز", condition: "إمرار الغاز في الحمض المركز", result: "غاز نقي جاف خالٍ من رطوبة الماء", scientificMeaning: "حمض الكبريتيك يمتص بخار الماء بشراهة فائقة", status: "positive" },
      { sampleName: "جمع الكلور في المخبار الجاف", condition: "إزاحة الهواء لأعلى", result: "امتلاء المخبار بغاز أخضر مصفر ثقيل", scientificMeaning: "كثافة الكلور تعادل 2.5 مرة كثافة الهواء الجوي", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "ضع كمية من مسحوق ثاني أكسيد المنجنيز الأسود (عامل مؤكسد قوي) في دورق التفاعل.",
        observation: "مسحوق صلب أسود جاف في قاع الدورق، وزجاجة الغسيل الموصولة تحتوي على ماء مقطر نقي صافٍ عديم اللون كلياً.",
        scientificReason: "ثاني أكسيد المنجنيز MnO2 مادة مؤكسدة قوية قادرة على انتزاع الإلكترونات من أيونات الكلوريد وتحويلها لغاز الكلور.",
        examTip: "دور MnO2 في تحضير غاز الكلور: عامل مؤكسد قوي يؤكسد HCl إلى Cl2.",
        physicalState: "مسحوق صلب أسود جاف",
        colorState: "أسود فحمي + ماء غسيل صافٍ",
        chemicalProperty: "عامل مؤكسد MnO2",
        equationOrFormula: "MnO2(s) [Solid Oxidizing Agent]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#475569", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "صب حمض HCl المركز عبر القمع ببطء وسخن الدورق تسخيناً هيناً.",
        observation: "فوران سريع وانبعاث غاز أخضر مصفر ذي رائحة نفاذة خانقة ومخرشة للأغشية.",
        scientificReason: "تفاعل الأكسدة والاختزال يختزل المنجنيز من +4 إلى +2 في كلوريد المنجنيز MnCl2 ويؤكسد الكلوريد لغاز الكلور الحر Cl2.",
        examTip: "معادلة تحضير الكلور: MnO2(s) + 4HCl(conc.) ⟶ (heat) ⟶ MnCl2(aq) + 2H2O(l) + Cl2(g)↑.",
        physicalState: "تفاعل أكسدة واختزال ساخن",
        colorState: "غاز أخضر مصفر متدفق",
        chemicalProperty: "انطلاق غاز الكلور النشط",
        equationOrFormula: "MnO2 + 4HCl ⟶ MnCl2 + 2H2O + Cl2↑",
        telemetry: { temp: 85, ph: 0.5, gas: 190, liquidColor: "#84cc16", liquidHeight: 0.45, isHeating: true, isBubbling: true, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 3,
        action: "مرر الغاز المتصاعد عبر زجاجة غسيل تحتوي على ماء ثم عبر زجاجة حمض الكبريتيك المركز.",
        observation: "تدفق فقاعات الغاز عبر الماء الصافي ثم عبر حمض الكبريتيك دون فقدان لونه الأخضر المصفر.",
        scientificReason: "الماء يذيب غاز HCl الشائب المتطاير، بينما حمض الكبريتيك المركز يمتص بخار الماء تماماً لإنتاج غاز كلور جاف 100%.",
        examTip: "علل: يمرر الكلور على الماء ثم حمض الكبريتيك المركز؟ الماء لامتصاص كلوريد الهيدروجين الشائب، والحمض لتجفيف الغاز.",
        physicalState: "تنقية وتجفيف غازي",
        colorState: "أخضر مصفر شاحب رائق",
        chemicalProperty: "غاز كلور نقي جاف",
        equationOrFormula: "Purification: 1. Water (removes HCl) 2. conc. H2SO4 (Drying)",
        telemetry: { temp: 35, ph: 1.0, gas: 180, liquidColor: "#f0f9ff", liquidHeight: 0.4, isHeating: false, isBubbling: true, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "اجمع الغاز في مخبار جاف بإزاحة الهواء للأعلى.",
        observation: "امتلاء المخبار من الأسفل للأعلى بالغاز الأخضر المصفر الثقيل وتصاعد الهواء الخفيف لطرده من الفوهة.",
        scientificReason: "غاز الكلور أثقل من الهواء بحوالي مرتين ونصف (كثافته 3.2 g/L)، لذا يجمع بإزاحة الهواء لأعلى في مخبار جاف.",
        examTip: "يجمع غاز الكلور بإزاحة الهواء لأعلى لأنه أثقل من الهواء الجوي وشديد الذوبان في الماء فلا يجمع فوقه.",
        physicalState: "غاز ثقيل مجمع",
        colorState: "أخضر مصفر كثيف",
        chemicalProperty: "غاز سام ومؤكسد فائق",
        equationOrFormula: "Cl2(g) [Upward Air Displacement]",
        telemetry: { temp: 25, ph: 2.0, gas: 210, liquidColor: "#a3e635", liquidHeight: 0.5, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: true }
      }
    ]
  },

  u5_l3: {
    id: "u5_l3",
    apparatusType: "beaker",
    overallConclusion: "غاز الكلور الجاف تماماً لا يقصر الألوان ولا يبيضها؛ بينما غاز الكلور الرطب يقصر الألوان النباتية ويزيلها فورياً؛ لأن تفاعله مع الماء يولد حمض الهيبوكلوروز HClO غير الثابت الذي ينحل طالقاً الأكسجين الوليد [O] الذري المؤكسد والقاصر للألوان.",
    cumulativeTable: [
      { sampleName: "الكلور الجاف + ورقة حمراء جافة", condition: "غياب تام للرطوبة والماء", result: "الورقة تبقى حمراء تماماً ولا يتغير لونها", scientificMeaning: "غاز الكلور الجاف ليس له أي أثر قاصر للألوان", status: "negative" },
      { sampleName: "الماء المقطر على الورقة", condition: "تبليل الورقة بالماء النقي", result: "ورقة مبللة صافية", scientificMeaning: "توفير الرطوبة اللازمة لتفاعل الإماهة وإنتاج حمض الهيبوكلوروز", status: "neutral" },
      { sampleName: "الكلور الرطب + ورقة مبللة", condition: "وجود الرطوبة والماء", result: "زوال اللون فوراً وتحول الورقة للأبيض الناصع", scientificMeaning: "تولد الأكسجين الذري الوليد [O] من تحلل حمض HClO المؤكسد", status: "positive" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "أدخل ورقة تباع الشمس الحمراء الجافة تماماً بملقط في المخبار الأول المحتوي على كلور جاف.",
        observation: "تبقى ورقة تباع الشمس حمراء بلونها الأصلي ثابتاً تماماً دون أن تفقد أي جزء من لونها مهما طال بقاؤها في الغاز.",
        scientificReason: "غاز الكلور بمفرده لا يستطيع أكسدة الصبغات النباتية في غياب الماء؛ فالقصر اللوني يتطلب وسيطاً كيميائياً نشطاً.",
        examTip: "علل: غاز الكلور الجاف لا يقصر ألوان زهرة تباع الشمس؟ لعدم وجود الماء اللازم لتكوين حمض الهيبوكلوروز HClO.",
        physicalState: "غاز جاف وورقة جافة",
        colorState: "ورقة حمراء داكنة ثابتة",
        chemicalProperty: "خمول في القصر اللوني بدون ماء",
        equationOrFormula: "Dry Cl2 + Dry Red Paper ⟶ No Bleaching",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.3, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "بلل ورقة تباع شمس حمراء أخرى بالماء المقطر وأدخلها في المخبار الثاني.",
        observation: "ملامسة الورقة المبللة بالماء الصافي الشفاف لغاز الكلور في المخبار.",
        scientificReason: "الماء المقطر الموجود على سطح الورقة يتفاعل فورياً مع غاز الكلور مكوناً خليطاً من حمض الهيدروكلوريك وحمض الهيبوكلوروز.",
        examTip: "معادلة ذوبان الكلور في الماء: Cl2 + H2O ⇌ HCl + HClO.",
        physicalState: "بدء تفاعل التبييض الرطب",
        colorState: "أحمر يبدأ بالبهتان الفوري",
        chemicalProperty: "تولد حمض الهيبوكلوروز HClO",
        equationOrFormula: "Cl2 + H2O ⇌ HCl + HClO (Hypochlorous Acid)",
        telemetry: { temp: 25, ph: 2.5, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.3, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: true }
      },
      {
        stepNumber: 3,
        action: "راقب بدقة زوال اللون الأحمر لتباع الشمس وتحوله الفوري للأبيض الناصع.",
        observation: "زوال فوري ومبهر للون الأحمر، وتتحول الورقة النباتية المبللة إلى اللون الأبيض الناصع الشبيه بالقطن!",
        scientificReason: "حمض الهيبوكلوروز HClO حمض غير ثابت ينحل سريعاً مطلقاً الأكسجين الذري الوليد [O] فائق النشاط الذي يؤكسد الصبغة ويزيل لونها نهائياً.",
        examTip: "الأثر المبيض للكلور الرطب يرجع إلى الأكسجين الوليد الناتج من تحلل حمض الهيبوكلوروز: HClO ⟶ HCl + [O].",
        physicalState: "تبييض وقصر لوني تام",
        colorState: "أبيض ناصع تام التبييض",
        chemicalProperty: "أكسدة قاصرة للألوان بالأكسجين الوليد",
        equationOrFormula: "HClO ⟶ HCl + [O] (Nascent Oxygen Bleach)",
        telemetry: { temp: 25, ph: 2.0, gas: 0, liquidColor: "#f8fafc", liquidHeight: 0.3, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: true }
      }
    ]
  },

  // === UNIT 6: Transition Elements ===
  u6_l1: {
    id: "u6_l1",
    apparatusType: "magnetic_balance",
    overallConclusion: "العناصر الانتقالية ومركباتها تتميز بالخاصية البارامغناطيسية وتكوين مركبات ملونة لوجود إلكترونات مفردة في أفلاك d، وتزداد قوة الانجذاب للمغناطيس طرداً مع زيادة عدد الإلكترونات المفردة (Fe²⁺ به 4 إلكترونات مفردة فهو أقوى من Cu²⁺ المفرد الواحد، بينما Zn²⁺ دايامغناطيسي لامتلاء أربتالاته العشرة).",
    cumulativeTable: [
      { sampleName: "كبريتات الحديد FeSO4", condition: "مغناطيس مشغل (4 إلكترونات مفردة)", result: "انجذاب قوي للمغناطيس وزيادة الوزن الظاهري إلى 11.85 g", scientificMeaning: "خاصية بارامغناطيسية قوية جداً", status: "positive" },
      { sampleName: "كبريتات النحاس CuSO4", condition: "مغناطيس مشغل (إلكترون مفرد واحد)", result: "انجذاب خفيف للمغناطيس وزيادة طفيفة في الوزن إلى 10.42 g", scientificMeaning: "خاصية بارامغناطيسية خفيفة ولون أزرق ناصع", status: "positive" },
      { sampleName: "كلوريد الزنك ZnCl2", condition: "مغناطيس مشغل (صفر إلكترون مفرد)", result: "تنافر ضعيف مع المغناطيس ونقصان طفيف للوزن إلى 9.92 g", scientificMeaning: "خاصية دايامغناطيسية لامتلاء غلاف d تماماً بـ 10 إلكترونات", status: "negative" }
    ],
    steps: [
      {
        stepNumber: 1,
        action: "علق أنبوبة كبريتات الحديد الخضراء FeSO4 بين قطبي المغناطيس الكهربائي وهو مطفأ وقم بوزنها بدقة.",
        observation: "استقرار مؤشر الميزان التحليلي الحساس بدقة متناهية عند الوزن الأولي الحقيقي البالغ 10.00 g والمغناطيس مطفأ تماماً.",
        scientificReason: "المغناطيس المطفأ لا يؤثر بأي قوة خارجية، والوزن المسجل يمثل الكتلة الحقيقية النقية لمسحوق كبريتات الحديد.",
        examTip: "جهاز ميزان غوي (Gouy Balance) يستخدم لقياس العزم المغناطيسي وتحديد عدد الإلكترونات المفردة في العناصر الانتقالية.",
        physicalState: "مسحوق بلوري أخضر معلق",
        colorState: "أخضر فاتح",
        chemicalProperty: "وزن حقيقي ساكن للمركب",
        equationOrFormula: "Fe²⁺: [Ar] 3d⁶ (4 Unpaired Electrons) [Field Off: 10.00g]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 10.00, liquidColor: "#86efac", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, magneticFieldOn: false, activeSubstance: "FeSO4" }
      },
      {
        stepNumber: 2,
        action: "قم بتشغيل المغناطيس الكهربائي وراقب مؤشر الميزان الحساس.",
        observation: "انجذاب أنبوبة كبريتات الحديد بقوة ملحوظة لأسفل نحو القطبين المغناطيسيين، وارتفاع قراءة الميزان فورياً إلى 11.85 g!",
        scientificReason: "أيون الحديد Fe²⁺ يحتوي على 4 إلكترونات مفردة تدور حول نفسها وتولد عزوماً مغناطيسية تتجاذب بشدة مع المجال الخارجي (بارامغناطيسية).",
        examTip: "المادة البارامغناطيسية: مادة تنجذب نحو المجال المغناطيسي الخارجي لاحتوائها على إلكترونات مفردة في أفلاكها.",
        physicalState: "انجذاب بارامغناطيسي فائق",
        colorState: "أخضر تفاعلي",
        chemicalProperty: "خاصية بارامغناطيسية قوية (4 إلكترونات مفردة)",
        equationOrFormula: "Magnetic Attraction Force: Weight increases to 11.85g",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 11.85, liquidColor: "#86efac", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, magneticFieldOn: true, activeSubstance: "FeSO4" }
      },
      {
        stepNumber: 3,
        action: "استبدل عينة الحديد بمسحوق كبريتات النحاس CuSO4 الزرقاء وشغل المغناطيس.",
        observation: "ارتفاع قراءة الميزان إلى 10.42 g، وهو انجذاب واضح لكنه أقل بكثير من عينة كبريتات الحديد.",
        scientificReason: "أيون النحاس Cu²⁺ تركيبه [Ar] 3d⁹ ويحتوي على إلكترون مفرد واحد فقط، فيكون عزمه المغناطيسي وانجذابه أقل بمقدار الربع من عينة الحديد.",
        examTip: "تزداد قوة العزم المغناطيسي للمادة البارامغناطيسية بزيادة عدد الإلكترونات المفردة في المستوى الفرعي d.",
        physicalState: "انجذاب بارامغناطيسي معتدل",
        colorState: "أزرق سماوي ناصع",
        chemicalProperty: "بارامغناطيسي بإلكترون مفرد وحيد",
        equationOrFormula: "Cu²⁺: [Ar] 3d⁹ (1 Unpaired Electron) [Weight: 10.42g]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 10.42, liquidColor: "#38bdf8", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, magneticFieldOn: true, activeSubstance: "CuSO4" }
      },
      {
        stepNumber: 4,
        action: "اختبر الآن مسحوق كلوريد الزنك ZnCl2 الأبيض تحت المغناطيس القوي.",
        observation: "المسحوق أبيض تماماً، وعند تشغيل المغناطيس ينحرف مؤشر الميزان بشكل طفيف جداً للخلف مسجلاً 9.92 g دلالة على التنافر!",
        scientificReason: "أيون الزنك Zn²⁺ تركيبه [Ar] 3d¹⁰؛ جميع أفلاك d ممتلئة ومزدوجة تماماً بالكترونات متعاكسة تلغي عزومها (دايامغناطيسي)، وخلوه من إلكترونات مفردة يجعله عديم اللون.",
        examTip: "مركبات الزنك والسكانديوم عديمة اللون ودايامغناطيسية لعدم وجود إلكترونات مفردة في أفلاك d.",
        physicalState: "تنافر دايامغناطيسي خفيف",
        colorState: "أبيض مسحوق ناصع (عديم اللون)",
        chemicalProperty: "خاصية دايامغناطيسية ومظهر غير ملون",
        equationOrFormula: "Zn²⁺: [Ar] 3d¹⁰ (0 Unpaired Electrons) [Diamagnetic: 9.92g]",
        telemetry: { temp: 25, ph: 7.0, gas: 0, weight: 9.92, liquidColor: "#f8fafc", liquidHeight: 0.35, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false, magneticFieldOn: true, activeSubstance: "ZnCl2" }
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
        action: "شغل دولاب الأبخرة لحماية المختبر من انبعاث الغازات الخانقة والسامة.",
        observation: "سحب تيار الهواء في دولاب الأبخرة لحماية الطلاب، والكأس يحتوي على وسط أمان صافٍ شفاف عديم اللون كلياً (25°C).",
        scientificReason: "تفاعل الماء الملكي يطلق غازات الكلور و NO2 و NOCl السامة والمخرشة للأغشية المخاطية، فتشغيل دولاب الأبخرة إجراء وقائي إلزامي.",
        examTip: "يجب تحضير الماء الملكي طازجاً في دولاب الأبخرة واستخدامه فوراً لعدم استقراره.",
        physicalState: "دولاب أمان نشط",
        colorState: "صافٍ عديم اللون كلياً",
        chemicalProperty: "احتياطات السلامة الكيميائية",
        equationOrFormula: "Safety Protocol: Chemical Fume Hood Active",
        telemetry: { temp: 25, ph: 7.0, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.3, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 2,
        action: "ضع قطعة الذهب النقي داخل الكأس الزجاجي ثم صب فوقها حمض HCl المركز بمفرده.",
        observation: "لا يحدث أي تفاعل مطلقاً وتبقى سبيكة الذهب لامعة وبراقة في قاع الكأس، والحمض رائق شفاف عديم اللون.",
        scientificReason: "الذهب يقع في أسفل السلسلة الكهروكيميائية بجهد اختزال قياسي مرتفع (+1.50V)، فلا يستطيع اختزال أيونات H⁺ لأحماض الهيدروكلوريك.",
        examTip: "الذهب والبلاتين لا يذوبان في حمض الهيدروكلوريك أو النيتريك منفرداً.",
        physicalState: "سبيكة صلبة غير ذائبة",
        colorState: "أصفر ذهبي معدني وحمض رائق شفاف",
        chemicalProperty: "خمول فلز نبيل",
        equationOrFormula: "Au + HCl(conc.) ⟶ No Reaction",
        telemetry: { temp: 25, ph: 0.2, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 3,
        action: "أضف حمض النيتريك المركز بمفرده إلى كأس ذهب آخر للتجربة.",
        observation: "يبقى الذهب سليماً دون أي علامة على التآكل أو الذوبان، مع بقاء الحمض صافياً شفافاً دون فوران.",
        scientificReason: "رغم أن HNO3 مؤكسد قوي، إلا أن جهد أكسدة الذهب أعلى من قدرة النيتريك بمفرده في غياب أيونات الكلوريد التي تكون المعقد الذائب.",
        examTip: "حمض النيتريك المركز يؤكسد النحاس والفضة لكنه يعجز عن أكسدة الذهب.",
        physicalState: "سبيكة صلبة غير ذائبة",
        colorState: "ذهبي معدني وحمض رائق شفاف",
        chemicalProperty: "مقاومة للأكسدة المفردة",
        equationOrFormula: "Au + HNO3(conc.) ⟶ No Reaction",
        telemetry: { temp: 25, ph: 0.3, gas: 0, liquidColor: "#f0f9ff", liquidHeight: 0.45, isHeating: false, isBubbling: false, isPrecipitating: false, isSmoking: false }
      },
      {
        stepNumber: 4,
        action: "الآن، امزج حمض HCl المركز وحمض HNO3 المركز بنسبة حجمية دقيقة 3 : 1 لإنتاج الماء الملكي الجبار.",
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
        action: "صب الماء الملكي فوق سبيكة الذهب وراقب التفاعل المبهر.",
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
