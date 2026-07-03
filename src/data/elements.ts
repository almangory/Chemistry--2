export interface ChemicalReaction {
  equation: string;
  reactants: string;
  products: string;
  description: string;
}

export interface ChemicalElement {
  symbol: string;
  nameAr: string;
  nameEn: string;
  atomicNumber: number;
  atomicMass: number;
  category: "alkali" | "halogen" | "noble" | "transition" | "nonmetal" | "other";
  categoryLabel: string;
  state: "solid" | "liquid" | "gas";
  stateLabel: string;
  description: string;
  reactions: ChemicalReaction[];
}

export const chemicalElements: ChemicalElement[] = [
  {
    symbol: "H",
    nameAr: "الهيدروجين",
    nameEn: "Hydrogen",
    atomicNumber: 1,
    atomicMass: 1.008,
    category: "nonmetal",
    categoryLabel: "لا فلز نشط",
    state: "gas",
    stateLabel: "غاز",
    description: "أخف العناصر الكيميائية وأكثرها وفرة في الكون، غاز سريع الاشتعال بلهب أزرق باهت ومحدثاً فرقعة.",
    reactions: [
      {
        equation: "2H₂ + O₂ ➔ 2H₂O + Heat",
        reactants: "هيدروجين + أكسجين",
        products: "ماء + طاقة حرارية",
        description: "تفاعل احتراق الهيدروجين العنيف لإنتاج الماء وهو تفاعل طارد للحرارة بشدة."
      },
      {
        equation: "H₂ + Cl₂ ➔ 2HCl (في الضوء)",
        reactants: "هيدروجين + غاز الكلور",
        products: "كلوريد الهيدروجين",
        description: "يتحد الهيدروجين مباشرة مع الكلور في وجود الضوء غير المباشر لإنتاج غاز كلوريد الهيدروجين."
      }
    ]
  },
  {
    symbol: "Li",
    nameAr: "الليثيوم",
    nameEn: "Lithium",
    atomicNumber: 3,
    atomicMass: 6.94,
    category: "alkali",
    categoryLabel: "فلزات الأقلاء (المجموعة 1)",
    state: "solid",
    stateLabel: "صلب",
    description: "أقل الفلزات كثافة على الإطلاق، فلز لينة فضي اللون يتفاعل بنشاط مع الماء والهواء.",
    reactions: [
      {
        equation: "2Li + 2H₂O ➔ 2LiOH + H₂↑",
        reactants: "ليثيوم + ماء",
        products: "هيدروكسيد الليثيوم + غاز الهيدروجين",
        description: "يتفاعل الليثيوم بهدوء مع الماء مقارنة بباقي الأقلاء، محرراً غاز الهيدروجين ومحلولاً قلوياً."
      },
      {
        equation: "6Li + N₂ ➔ 2Li₃N (بالتسخين)",
        reactants: "ليثيوم + غاز النيتروجين",
        products: "نيتريد الليثيوم",
        description: "الليثيوم هو الفلز الوحيد من الأقلاء الذي يتفاعل مباشرة مع النيتروجين الجوي بالتسخين لإنتاج نيتريد الليثيوم."
      }
    ]
  },
  {
    symbol: "Na",
    nameAr: "الصوديوم",
    nameEn: "Sodium",
    atomicNumber: 11,
    atomicMass: 22.99,
    category: "alkali",
    categoryLabel: "فلزات الأقلاء (المجموعة 1)",
    state: "solid",
    stateLabel: "صلب",
    description: "فلز شديد النشاط كيميائياً، طري يمكن قطعه بالسكين، يحفظ تحت الكيروسين لمنع تفاعله مع رطوبة الهواء.",
    reactions: [
      {
        equation: "2Na + 2H₂O ➔ 2NaOH + H₂↑ + حرارة",
        reactants: "صوديوم + ماء",
        products: "هيدروكسيد الصوديوم + غاز الهيدروجين",
        description: "تفاعل شديد وعنيف يشتعل فيه الهيدروجين المتصاعد بفرقعة ولون لهب أصفر مميز بفعل طاقة التفاعل."
      },
      {
        equation: "2Na + Cl₂ ➔ 2NaCl",
        reactants: "صوديوم + غاز الكلور",
        products: "كلوريد الصوديوم (ملح الطعام)",
        description: "يحترق الصوديوم الساخن بعنف في جو من غاز الكلور الأخضر ليعطي سحابة بيضاء من ملح الطعام."
      },
      {
        equation: "2Na + O₂ ➔ Na₂O₂ (بالتسخين عند 300م°)",
        reactants: "صوديوم + أكسجين",
        products: "بيروكسيد الصوديوم",
        description: "يحترق الصوديوم بالتسخين في وفرة من الأكسجين ليعطي مركب بيروكسيد الصوديوم (عامل مؤكسد قوي)."
      }
    ]
  },
  {
    symbol: "K",
    nameAr: "البوتاسيوم",
    nameEn: "Potassium",
    atomicNumber: 19,
    atomicMass: 39.098,
    category: "alkali",
    categoryLabel: "فلزات الأقلاء (المجموعة 1)",
    state: "solid",
    stateLabel: "صلب",
    description: "فلز قلوي شديد الليونة والنشاط الكيميائي، يتفاعل بعنف أكبر من الصوديوم ويكسب اللهب لوناً بنفسجياً.",
    reactions: [
      {
        equation: "2K + 2H₂O ➔ 2KOH + H₂↑ + طاقة هائلة",
        reactants: "بوتاسيوم + ماء",
        products: "هيدروكسيد البوتاسيوم + غاز الهيدروجين",
        description: "يتفاعل البوتاسيوم انفجارياً مع الماء، وتكفي الحرارة لإشعال البوتاسيوم والهيدروجين بلهب بنفسجي فوري."
      },
      {
        equation: "K + O₂ ➔ KO₂ (احتراق مباشر)",
        reactants: "بوتاسيوم + أكسجين غازي",
        products: "سوبر أكسيد البوتاسيوم",
        description: "يحترق البوتاسيوم بسهولة ليعطي سوبر أكسيد البوتاسيوم KO₂ المستعمل في غواصات الفضاء لتنقية الهواء."
      }
    ]
  },
  {
    symbol: "N",
    nameAr: "النيتروجين",
    nameEn: "Nitrogen",
    atomicNumber: 7,
    atomicMass: 14.007,
    category: "nonmetal",
    categoryLabel: "لا فلز (المجموعة 15)",
    state: "gas",
    stateLabel: "غاز",
    description: "غاز خامل كيميائياً في درجات الحرارة العادية لوجود الرابطة التساهمية الثلاثية القوية، ويشكل 78٪ من الهواء.",
    reactions: [
      {
        equation: "N₂ + 3H₂ ➔ 2NH₃ (تحت 500م° وعامل حفاز)",
        reactants: "نيتروجين + هيدروجين",
        products: "غاز الأمونيا (النشادر)",
        description: "تفاعل هابر-بوش الأساسي لإنتاج الأمونيا صناعياً تحت ضغط (200 ضغط جوي) وحرارة 500م° وجود عامل حديدي."
      },
      {
        equation: "N₂ + O₂ ➔ 2NO (بواسطة قوس كهربائي 3000م°)",
        reactants: "نيتروجين + أكسجين",
        products: "أول أكسيد النيتروجين",
        description: "بسبب خمول النيتروجين، لا يتحد مع الأكسجين إلا عبر حرارة البرق العالية أو القوس الكهربائي لإنتاج NO."
      },
      {
        equation: "N₂ + 3Mg ➔ Mg₃N₂ (عند درجة الاحمرار)",
        reactants: "نيتروجين + مغنيسيوم ساخن",
        products: "نيتريد المغنيسيوم",
        description: "يتحد النيتروجين مع الفلزات النشطة المسخنة لدرجة الاحمرار ليعطي نيتريت الفلز الذي يتحلل بالماء ليعطي أمونيا."
      }
    ]
  },
  {
    symbol: "P",
    nameAr: "الفوسفور",
    nameEn: "Phosphorus",
    atomicNumber: 15,
    atomicMass: 30.974,
    category: "nonmetal",
    categoryLabel: "لا فلز (المجموعة 15)",
    state: "solid",
    stateLabel: "صلب",
    description: "لا فلز نشط يتواجد في عدة صور تأصلية كالأسود والأحمر والأبيض (الذي يشتعل تلقائياً بالهواء ويضيء بالظلام).",
    reactions: [
      {
        equation: "4P + 5O₂ ➔ P₄O₁₀ (أو 2P₂O₅)",
        reactants: "فوسفور + وفرة من الأكسجين",
        products: "خامس أكسيد ثنائي الفوسفور",
        description: "يحترق الفوسفور بلهب ساطع منتجاً سحابة بيضاء كثيفة جداً من خامس أكسيد الفوسفور الجاف."
      },
      {
        equation: "P₄O₁₀ + 6H₂O ➔ 4H₃PO₄",
        reactants: "خامس أكسيد الفوسفور + ماء",
        products: "حمض الفوسفوريك",
        description: "يتفاعل أكسيد الفوسفور الحمضي بشدة مع الماء الدافئ لإنتاج حمض الفوسفوريك."
      }
    ]
  },
  {
    symbol: "F",
    nameAr: "الفلور",
    nameEn: "Fluorine",
    atomicNumber: 9,
    atomicMass: 18.998,
    category: "halogen",
    categoryLabel: "الهالوجينات (المجموعة 17)",
    state: "gas",
    stateLabel: "غاز",
    description: "غاز أصفر شاحب سام للغاية، وهو أقوى العناصر اللافليزية نشاطاً وأعلاها كهروسالبية على الإطلاق.",
    reactions: [
      {
        equation: "H₂ + F₂ ➔ 2HF (حتى في الظلام والبرودة)",
        reactants: "فلور + هيدروجين",
        products: "فلوريد الهيدروجين",
        description: "يتحد الفلور انفجارياً مع غاز الهيدروجين حتى تحت درجات حرارة منخفضة جداً وفي الظلام الحالك لشراسته الكيميائية."
      },
      {
        equation: "2H₂O + 2F₂ ➔ 4HF + O₂↑",
        reactants: "فلور + ماء",
        products: "حمض الهيدروفلوريك + غاز الأكسجين",
        description: "يؤكسد الفلور الماء منتزعاً الهيدروجين ومطلقاً غاز الأكسجين في تفاعل كيميائي طارد وعنيف."
      }
    ]
  },
  {
    symbol: "Cl",
    nameAr: "الكلور",
    nameEn: "Chlorine",
    atomicNumber: 17,
    atomicMass: 35.45,
    category: "halogen",
    categoryLabel: "الهالوجينات (المجموعة 17)",
    state: "gas",
    stateLabel: "غاز",
    description: "غاز مخضر اللون ذو رائحة خانقة، يستعمل لتعقيم المياه وقصر الألوان كعامل مؤكسد قوي.",
    reactions: [
      {
        equation: "Cl₂ + H₂O ⇄ HCl + HClO",
        reactants: "كلور + ماء",
        products: "حمض الهيدروكلوريك + حمض الهيبوكلوروز",
        description: "يذوب الكلور في الماء ليعطي خليطاً حمضياً، وحمض HClO غير الثابت ينحل ليعطي أكسيداً ذرياً يقصر الألوان."
      },
      {
        equation: "Cl₂ + 2KBr ➔ 2KCl + Br₂",
        reactants: "كلور + بروميد البوتاسيوم",
        products: "كلوريد البوتاسيوم + سائل البروم الأحمر",
        description: "الكلور هالوجين أكثر نشاطاً من البروم واليود، لذلك يحل محلهما في محاليل أملاحهما المائية."
      },
      {
        equation: "2Fe + 3Cl₂ ➔ 2FeCl₃ (بالتسخين)",
        reactants: "حديد ساخن + كلور غازي",
        products: "كلوريد الحديد الثلاثي",
        description: "يتفاعل الكلور (كعامل مؤكسد قوي) مع الحديد المسخن ليعطي كلوريد الحديد الثلاثي FeCl₃ وليس الثنائي."
      }
    ]
  },
  {
    symbol: "Fe",
    nameAr: "الحديد",
    nameEn: "Iron",
    atomicNumber: 26,
    atomicMass: 55.845,
    category: "transition",
    categoryLabel: "عنصر انتقالي (المجموعة 8)",
    state: "solid",
    stateLabel: "صلب",
    description: "العمود الفقري للصناعة الحديثة، فلز رمادي مغناطيسي له حالات تأكسد متعددة (+2، +3) ويشكل سبائك فائقة.",
    reactions: [
      {
        equation: "3Fe + 2O₂ ➔ Fe₃O₄ (تسخين للاحمرار)",
        reactants: "حديد مسخن + أكسجين",
        products: "أكسيد الحديد المغناطيسي (المغنتيت)",
        description: "يتحد الحديد لدرجة الاحمرار مع الأكسجين ليعطي أكسيد الحديد الأسود المختلط ذي الخواص المغناطيسية."
      },
      {
        equation: "Fe + H₂SO₄ (مخفف) ➔ FeSO₄ + H₂↑",
        reactants: "حديد + حمض كبريتيك مخفف",
        products: "كبريتات الحديد الثنائي + غاز الهيدروجين",
        description: "يحل الحديد محل هيدروجين الحمض المخفف بسهولة محرراً الهيدروجين الذي يمنع تأكسد الحديد للحالة الثلاثية."
      },
      {
        equation: "Fe + 6HNO₃ (مركز) ➔ خمول كيميائي مؤقت",
        reactants: "حديد + حمض نيتريك مركز",
        products: "طبقة أكسيد واقية مانعة للتفاعل",
        description: "يسبب حمض النيتريك المركز خمولاً كيميائياً للحديد بسبب تكوين طبقة رقيقة صلبة من الأكسيد على سطحه تحميه من استمرار الذوبان."
      }
    ]
  },
  {
    symbol: "Cu",
    nameAr: "النحاس",
    nameEn: "Copper",
    atomicNumber: 29,
    atomicMass: 63.546,
    category: "transition",
    categoryLabel: "عنصر انتقالي (المجموعة 11)",
    state: "solid",
    stateLabel: "صلب",
    description: "فلز برتقالي أحمر ممتاز التوصيل للكهرباء والحرارة، قليل النشاط ويقع تحت الهيدروجين بسلسلة النشاط.",
    reactions: [
      {
        equation: "Cu + HCl (مخفف) ➔ لا يحدث تفاعل",
        reactants: "نحاس + حمض الهيدروكلوريك المخفف",
        products: "لا نواتج",
        description: "النحاس فلز ضعيف النشاط يقع أسفل الهيدروجين في السلسلة الكهروميكانيكية، فلا يمكنه إزاحة هيدروجين الأحماض المخففة."
      },
      {
        equation: "Cu + 4HNO₃ (مركز) ➔ Cu(NO₃)₂ + 2NO₂↑ + 2H₂O",
        reactants: "نحاس + حمض نيتريك مركز ساخن",
        products: "نترات النحاس الزرقاء + غاز ثاني أكسيد النيتروجين البني + ماء",
        description: "يتفاعل النحاس مع حمض النيتريك المركز نظراً لأن الحمض عامل مؤكسد قوي جداً يؤكسد النحاس أولاً ثم يتفاعل معه، ويتحرر غاز NO₂ البني الكثيف."
      }
    ]
  },
  {
    symbol: "Ca",
    nameAr: "الكالسيوم",
    nameEn: "Calcium",
    atomicNumber: 20,
    atomicMass: 40.078,
    category: "other",
    categoryLabel: "فلز ترابي (المجموعة 2)",
    state: "solid",
    stateLabel: "صلب",
    description: "فلز فضي رمادي مهم لبناء العظام والأصداف وصخور الكربونات، خفيف الوزن ويتفاعل بنشاط مع الماء.",
    reactions: [
      {
        equation: "Ca + 2H₂O ➔ Ca(OH)₂ + H₂↑",
        reactants: "كالسيوم + ماء بارد",
        products: "هيدروكسيد الكالسيوم (الجير المطفأ) + غاز الهيدروجين",
        description: "يتفاعل الكالسيوم مع الماء ليعطي الجير المطفأ الذي يعكر غاز ثاني أكسيد الكربون."
      },
      {
        equation: "CaCO₃ ➔ CaO + CO₂↑ (بالتسخين القوي عند 900م°)",
        reactants: "كربونات الكالسيوم (الحجر الجيري)",
        products: "أكسيد الكالسيوم (الجير الحي) + ثاني أكسيد الكربون",
        description: "الانحلال الحراري للحجر الجيري في الأفران لإنتاج الجير الحي المستخدم في صناعة الإسمنت والخرسانة."
      }
    ]
  },
  {
    symbol: "He",
    nameAr: "الهيليوم",
    nameEn: "Helium",
    atomicNumber: 2,
    atomicMass: 4.0026,
    category: "noble",
    categoryLabel: "الغازات النبيلة (المجموعة 18)",
    state: "gas",
    stateLabel: "غاز",
    description: "غاز خامل جداً عديم اللون والرائحة، يمتلك غلافاً مكتملاً بالإلكترونات (1s²)، ولا يدخل في تفاعلات كيميائية في الظروف العادية.",
    reactions: [
      {
        equation: "He + أي مادة ➔ لا يحدث تفاعل مطلقاً",
        reactants: "هيليوم + أي كاشف",
        products: "لا نواتج",
        description: "نظراً لامتلاء مداره الإلكتروني الوحيد تماماً، فإن الهيليوم يمتلك استقراراً تاماً يمنعه من كسب أو خسارة أو مشاركة الإلكترونات."
      }
    ]
  }
];
