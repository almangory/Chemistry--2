/**
 * 🖍️ Smart Highlighter Engine for Sudanese Secondary 2 Chemistry Curriculum
 * Parses HTML paragraphs and wraps critical curriculum concepts, exam reasoning (علل),
 * reaction conditions, and golden takeaways in distinctive educational highlighter marks.
 */

interface HighlightPattern {
  regex: RegExp;
  className: string;
  category: "concept" | "reason" | "equation" | "tip";
}

const highlightPatterns: HighlightPattern[] = [
  // 🟣 1. Exam Reasoning & Justifications (علل / اذكر السبب / يرجع ذلك إلى)
  {
    regex: /(علل(?::| )|اذكر السبب(?::| )|يرجع ذلك إلى|يعزى ذلك إلى|نظراً لـ|بسبب زيادة الشحنة النووية الفعالة|لتناقص طاقة التأين|لصعوبة فقد إلكترونات|لسهولة حركة إلكترونات|لثبات إلكترونات|لتفادي الانفجار|بسبب وجود إلكترونات مفردة|لعدم تمركز إلكترونات باي)/gu,
    className: "hl-reason",
    category: "reason"
  },

  // 🟡 2. Core Concepts, Laws & Named Scientists / Rules (المفاهيم والقوانين والمصطلحات)
  {
    regex: /(قانون ثلاثيات دوبرينر|ثلاثيات دوبرينر|قانون الثمانيات|القانون الدوري الحديث|جدول مندلييف|تعديل موزلي|فئات الجدول الدوري|فئة s|فئة p|فئة d|فئة f|طاقة التأين|الكهروسالبية|الحجم الذري|نصف القطر الذري|فلزات الأقلاء|الأقلاء الأرضية|خلية داونز|كشف اللهب|الكشف الجاف|نظرية القوة الحيوية|تجربة فوهلر|تخليق اليوريا|نظام IUPAC|السلسلة المتجانسة|السلسلة المتشاكلة|المركبات المتقابلة|التشكل السلسلي|التماكب السلسلي|الأيزوميرية|رابطة سيجما|رابطة باي|قاعدة ماركونيكوف|لهب الأكسي-أسيتلين|ظاهرة الرنين|تركيب كيكولي|التوتر الزاوي|شد الرابطة|ظاهرة التأصل|الفوسفور الأبيض|الفوسفور الأحمر|نافورة النشادر|سماد السوبر فوسفات|حمض الهيبوكلوروز|الأكسجين الذري الوليد|خلية الكاثود الزئبقي|ملغم الصوديوم|العناصر الانتقالية|الخاصية البارامغناطيسية|الخاصية الدايامغناطيسية|الماء الملكي|خمول الحديد)/gu,
    className: "hl-concept",
    category: "concept"
  },

  // 🟢 3. Chemical Conditions, Temperatures & Reaction Hallmarks (شروط التفاعل والمعادلات)
  {
    regex: /(3000°م|3000°C|180°م|180°C|30°C|حمض الكبريتيك المركز|الجير الصودي|خلات الصوديوم اللامائية|ماء البروم الأحمر|يزيل لون ماء البروم|برمنجنات البوتاسيوم|كربيد الكالسيوم|نتريت الأمونيوم|التقطير الجاف|الانحلال الحراري|بإزاحة الماء لأسفل|أثقل من الهواء|3 هيدروكلوريك إلى 1 نيتريك|3HCl : 1HNO3)/gu,
    className: "hl-equation",
    category: "equation"
  },

  // 🔵 4. Critical Exam Tips & Observations (ملاحظات وتنبيهات امتحانية)
  {
    regex: /(لاحظ كيف|تنبيه امتحاني|قاعدة أساسية|من أهم الأسئلة|لا يتفاعل في الظلام|يشتعل تلقائياً|غاز خانق شديد السمية|راسب أبيض كثيف|راسب بني|كرة منصهرة تسبح|فرقعة شديدة)/gu,
    className: "hl-tip",
    category: "tip"
  }
];

/**
 * Apply smart highlights to text or HTML string safely
 * Avoids replacing inside existing HTML tags or attributes
 */
export function applySmartHighlights(html: string, isEnabled: boolean): string {
  if (!isEnabled) return html;

  // Split HTML by tags to only modify text content outside tags
  const parts = html.split(/(<[^>]+>)/g);

  return parts
    .map((part) => {
      // If it's a tag, return untouched
      if (part.startsWith("<") && part.endsWith(">")) {
        return part;
      }

      // It's text content, apply patterns sequentially
      let modifiedText = part;
      for (const pattern of highlightPatterns) {
        modifiedText = modifiedText.replace(pattern.regex, (match) => {
          return `<mark class="${pattern.className}" title="عنصر منهجي هام">${match}</mark>`;
        });
      }
      return modifiedText;
    })
    .join("");
}
