import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Search, HelpCircle, BookOpen, Sparkles, RefreshCw } from "lucide-react";
import { glossaryTerms } from "../data/glossary";
import { curriculumData } from "../data/curriculum";

interface Message {
  id: string;
  sender: "student" | "assistant";
  text: string;
  timestamp: Date;
  reference?: {
    type: "glossary" | "curriculum" | "qa";
    title: string;
    unitId?: string;
  };
}

// Custom Q&A dataset representing common high-yield Sudan chemistry questions
const customQA = [
  {
    keywords: ["ميثان", "الميثان", "methane", "تحضير الميثان", "غاز المستنقعات"],
    question: "كيف يحضر غاز الميثان في المعمل وما هي معادلته؟",
    answer: `<strong>تحضير غاز الميثان (CH₄) معملياً:</strong><br/>
    يحضر الميثان في المختبر بـ <strong>التقطير الجاف لخلات (أسيتات) الصوديوم اللامائية</strong> مع <strong>الجير الصودي</strong> (وهو خليط من الصودا الكاوية NaOH والجير الحي CaO).<br/><br/>
    <strong>دور الجير الحي (CaO):</strong> لا يدخل في التفاعل ولكنه يساعد في خفض درجة انصهار الخليط ومنع تميع زجاج أنبوبة الاختبار.<br/><br/>
    <strong>معادلة التفاعل الكيميائية:</strong><br/>
    <code class="bg-[#F9F8F6] px-2 py-1 rounded block text-center border my-2 font-mono text-[#E67E22] font-bold">
      CH₃COONa (s) + NaOH (s) ⟶[CaO, Δ] CH₄ (g) ↑ + Na₂CO₃ (s)
    </code><br/>
    يجمع الغاز بإزاحة الماء لأسفل لأنه شحيح الذوبان في الماء وأخف من الهواء.`,
    unitId: "3"
  },
  {
    keywords: ["ايثين", "الإيثين", "ethene", "ethylene", "ايثيلين", "تحضير الايثين"],
    question: "كيف يحضر غاز الإيثين (الإيثيلين) في المعمل؟",
    answer: `<strong>تحضير غاز الإيثين (C₂H₄) معملياً:</strong><br/>
    يحضر الإيثين بـ <strong>نزع جزيء ماء من الكحول الإيثيلي (الإيثانول)</strong> بواسطة <strong>حمض الكبريتيك المركز</strong> كعامل نازع للماء عند درجة حرارة ثابتة <strong>180°م</strong>.<br/><br/>
    <strong>معادلة التفاعل الكيميائية:</strong><br/>
    <code class="bg-[#F9F8F6] px-2 py-1 rounded block text-center border my-2 font-mono text-[#E67E22] font-bold">
      C₂H₅OH ⟶[H₂SO₄ / 180°C] C₂H₄ (g) ↑ + H₂O
    </code><br/>
    <strong>الكشف عن الإيثين:</strong> يزيل لون ماء البروم الأحمر سريعاً لكونه هيدروكربوناً غير مشبع يحتوي على رابطة ثنائية (سيجما وباي).`,
    unitId: "3"
  },
  {
    keywords: ["ايثاين", "الإيثاين", "ethyne", "acetylene", "استلين", "الأستيلين", "تحضير الايثاين"],
    question: "كيف يحضر غاز الإيثاين (الأستيلين) وما استخدامات لهبه؟",
    answer: `<strong>تحضير غاز الإيثاين (C₂H₂) معملياً:</strong><br/>
    يحضر الإيثاين بـ <strong>تنقيط الماء على كربيد الكالسيوم (CaC₂)</strong> في درجة حرارة الغرفة العادية.<br/><br/>
    <strong>معادلة التفاعل الكيميائية:</strong><br/>
    <code class="bg-[#F9F8F6] px-2 py-1 rounded block text-center border my-2 font-mono text-[#E67E22] font-bold">
      CaC₂ (s) + 2H₂O (l) ⟶ C₂H₂ (g) ↑ + Ca(OH)₂ (aq)
    </code><br/>
    <strong>لهب الأكسي-أستيلين:</strong> عند احتراق الإيثاين في وفرة من الأكسجين، يعطي لهباً شديد السخونة (أكثر من 3000 درجة مئوية) يسمى لهب الأكسي-أستيلين، ويستخدم في <strong>قطع ولحام المعادن</strong>.`,
    unitId: "3"
  },
  {
    keywords: ["هابر", "Haber", "امونيا", "النشادر", "نشادر", "تحضير الامونيا"],
    question: "ما هي طريقة هابر لتحضير الأمونيا صناعياً؟",
    answer: `<strong>إنتاج الأمونيا (NH₃) صناعياً (طريقة هابر-بوش):</strong><br/>
    تعتمد على الاتحاد المباشر بين غازي النيتروجين والهيدروجين تحت ظروف تشغيل محددة:<br/>
    1. ضغط عالٍ جداً (حوالي 200 ضغط جوي).<br/>
    2. درجة حرارة مرتفعة (حوالي 500 درجة مئوية).<br/>
    3. وجود عامل حفاز (أكسيد الحديد المجزأ بالتشارك مع دقيق المولدبنيوم).<br/><br/>
    <strong>معادلة التفاعل المتزن:</strong><br/>
    <code class="bg-[#F9F8F6] px-2 py-1 rounded block text-center border my-2 font-mono text-[#E67E22] font-bold">
      N₂ (g) + 3H₂ (g) ⇌[Fe / 500°C / 200atm] 2NH₃ (g) + الحرارة
    </code><br/>
    النشادر غاز قلوي التأثير يزرق ورقة عباد الشمس الحمراء المبللة ويذوب بشدة فائقة في الماء (نافورة الأمونيا).`,
    unitId: "4"
  },
  {
    keywords: ["صوديوم", "الصوديوم", "sodium", "خلية داونز", "داونز"],
    question: "كيف يستخلص الصوديوم صناعياً وما تفاعله مع الماء؟",
    answer: `<strong>استخلاص الصوديوم (Na):</strong><br/>
    يستخلص صناعياً في <strong>خلية داونز (Downs Cell)</strong> بالتحليل الكهربائي لـ <strong>مصهور كلوريد الصوديوم اللامائي (NaCl)</strong> وليس محلوله لضمان عدم اختزال الهيدروجين عند الكاثود.<br/><br/>
    <strong>تفاعل الصوديوم العنيف مع الماء:</strong><br/>
    يتفاعل الصوديوم بشدة فائقة مع الماء مطلقاً حرارة عالية كافية لإشعال غاز الهيدروجين المنطلق بفرقعة مميزة:<br/>
    <code class="bg-[#F9F8F6] px-2 py-1 rounded block text-center border my-2 font-mono text-[#E67E22] font-bold">
      2Na (s) + 2H₂O (l) ⟶ 2NaOH (aq) + H₂ (g) ↑ + حرارة
    </code><br/>
    لذا يحفظ الصوديوم مغموراً تحت الكيروسين (الجازولين) لعزله عن الهواء والرطوبة.`,
    unitId: "2"
  },
  {
    keywords: ["كلور", "الكلور", "chlorine", "تحضير الكلور", "قصر الالوان"],
    question: "كيف يحضر غاز الكلور معملياً وما سر قصر الألوان؟",
    answer: `<strong>تحضير غاز الكلور (Cl₂) معملياً:</strong><br/>
    يحضر بأكسدة حمض الهيدروكلوريك المركز بواسطة عامل مؤكسد قوي مثل <strong>ثاني أكسيد المنجنيز (MnO₂)</strong>:<br/>
    <code class="bg-[#F9F8F6] px-2 py-1 rounded block text-center border my-2 font-mono text-[#E67E22] font-bold">
      MnO₂ (s) + 4HCl (aq) ⟶ MnCl₂ (aq) + Cl₂ (g) ↑ + 2H₂O (l)
    </code><br/>
    <strong>سر خاصية قصر الألوان (Bleaching):</strong><br/>
    الكلور لا يقصر الألوان وهو جاف! يحتاج للرطوبة (الماء) ليتفاعل معها مطلقاً <strong>الأكسجين الذري النشط [O]</strong> الذي يؤكسد صبغات المواد العضوية محولاً إياها لمواد عديمة اللون:<br/>
    <code class="bg-[#F9F8F6] px-2 py-1 rounded block text-center border my-2 font-mono text-[#E67E22] font-bold">
      Cl₂ + H₂O ⟶ HCl + HClO ⟶ 2HCl + [O] (أكسجين ذري نشط)
    </code>`,
    unitId: "5"
  },
  {
    keywords: ["بنزين", "البنزين", "benzene", "كيكولي", "رنين", "الرنين"],
    question: "ما هي بنية البنزين العطري وما ظاهرة الرنين فيه؟",
    answer: `<strong>البنزين العطري (C₆H₆):</strong><br/>
    هو أبسط الهيدروكربونات الأروماتية العطرية. توصل العالم الألماني <strong>أوجست كيكولي (Kekulé)</strong> عام 1865م لبنيته الحلقية السداسية المتبادلة بين روابط أحادية وثنائية.<br/><br/>
    <strong>ظاهرة الرنين (Resonance):</strong><br/>
    تبين لاحقاً أن الروابط الثنائية ليست ثابتة، بل تدور الإلكترونات الستة (π) باستمرار حول الحلقة دون تمركز محدد. يرمز لذلك بحلقة سداسية بداخلها دائرة.<br/><br/>
    <strong>نتيجة الرنين:</strong> يمنح البنزين استقراراً كيميائياً وثباتاً استثنائياً؛ لذا يفضل تفاعلات <strong>الاستبدال (الإحلال)</strong> ويقاوم تفاعلات الإضافة رغم عدم تشبعه.`,
    unitId: "3"
  },
  {
    keywords: ["تاصل", "التأصل", "allotropy", "فوسفور", "الفوسفور"],
    question: "ما هي ظاهرة التأصل وما أهم صورها في الفوسفور؟",
    answer: `<strong>ظاهرة التأصل (Allotropy):</strong><br/>
    هي ظاهرة وجود العنصر اللافلزي الصلب في <strong>عدة صور مختلفة في الخواص الفيزيائية</strong> (كاللون والبلورة والصلابة) و<strong>متفقة تماماً في الخواص الكيميائية</strong> لكونها تتكون من ذرات نفس العنصر.<br/><br/>
    <strong>صور الفوسفور المتأصلة:</strong><br/>
    1. <strong>الفوسفور الأبيض:</strong> نشط جداً، شمعي الملمس، يشتعل تلقائياً في الهواء وسام جداً.<br/>
    2. <strong>الفوسفور الأحمر:</strong> أقل نشاطاً، غير سام، بلوري، يستخدم في صناعة أعواد الثقاب.<br/>
    3. <strong>الفوسفور الأسود:</strong> صورة بلورية نادرة تشبه الجرافيت وموصلة ضعيفة للكهرباء.`,
    unitId: "4"
  },
  {
    keywords: ["كهروسالبية", "الكهروسالبية", "جهد التاين", "الالفة", "تدرج الخواص"],
    question: "كيف تتدرج الكهروسالبية وجهد التأين عبر الجدول الدوري؟",
    answer: `<strong>تدرج الخواص الدورية الهامة:</strong><br/>
    - <strong>جهد التأين:</strong> الطاقة اللازمة لنزع الإلكترون الأضعف ارتباطاً بالذرة.<br/>
    - <strong>الألفة الإلكترونية:</strong> الطاقة المنطلقة عند اكتساب إلكترون.<br/>
    - <strong>الكهروسالبية:</strong> قدرة الذرة في الجزيء على جذب إلكترونات الرابطة.<br/><br/>
    <strong>نمط التدرج الدوري:</strong><br/>
    1. <strong>عبر الدورة (من اليمين لليسار):</strong> <strong>تزداد</strong> هذه الخواص الثلاث بزيادة العدد الذري والشحنة الموجبة الفعالة للنواة وصغر الحجم الذري (نصف القطر).<br/>
    2. <strong>عبر المجموعة (من الأعلى للأسفل):</strong> <strong>تقل</strong> هذه الخواص الثلاث لزيادة الحجم الذري وحجب النواة بمستويات طاقة مكتملة.<br/><br/>
    أقوى اللافلزات كهروسالبية وألفة هو <strong>الفلور (F)</strong> في أعلى يمين الجدول الدوري.`,
    unitId: "1"
  }
];

// Normalize Arabic text to ensure maximum matching coverage (removes accents, normalizes letters)
function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u0652]/g, "") // Remove Harakat (Fatha, Damma, Kasra, etc.)
    .replace(/[أإآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export const StudentAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "مرحباً بك يا بطل كيمياء الثاني الثانوي! 👋<br/>أنا مساعدك الكيميائي الفوري للمنهج السوداني. اكتب أي موضوع أو كلمة تبحث عنها (مثال: <strong>ميثان، صوديوم، هابر، كهروسالبية، كلور، تأصل</strong>) وسأرد عليك فوراً بالمعادلات والمعلومات الكافية الخالية من الذكاء الاصطناعي!",
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // 1. Add student message
    const studentMsg: Message = {
      id: Math.random().toString(),
      sender: "student",
      text: trimmed,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, studentMsg]);
    setQuery("");

    // 2. Perform local non-AI search response
    setTimeout(() => {
      const response = executeLocalSearch(trimmed);
      setMessages((prev) => [...prev, response]);
    }, 400);
  };

  const executeLocalSearch = (userQuery: string): Message => {
    const normalizedQuery = normalizeArabic(userQuery);

    // -- Stage 1: Search in custom comprehensive Q&A dataset --
    const foundQA = customQA.find((qa) =>
      qa.keywords.some((kw) => normalizedQuery.includes(normalizeArabic(kw)))
    );

    if (foundQA) {
      return {
        id: Math.random().toString(),
        sender: "assistant",
        text: `<strong>إجابة وافية عن سؤالك: "${foundQA.question}"</strong><br/><br/>${foundQA.answer}`,
        timestamp: new Date(),
        reference: {
          type: "qa",
          title: foundQA.question,
          unitId: foundQA.unitId
        }
      };
    }

    // -- Stage 2: Search in Glossary Terms --
    const foundGlossary = glossaryTerms.find((term) => {
      const normTerm = normalizeArabic(term.term);
      const normEng = term.englishTerm ? normalizeArabic(term.englishTerm) : "";
      return normalizedQuery.includes(normTerm) || (normEng && normalizedQuery.includes(normEng)) || normTerm.includes(normalizedQuery);
    });

    if (foundGlossary) {
      return {
        id: Math.random().toString(),
        sender: "assistant",
        text: `<strong>وجدنا هذا المصطلح العلمي في القاموس الكيميائي:</strong><br/><br/>
        <strong>المصطلح:</strong> ${foundGlossary.term} ${foundGlossary.englishTerm ? `(${foundGlossary.englishTerm})` : ""}<br/>
        <strong>التعريف الدقيق:</strong> ${foundGlossary.definition}<br/>
        <strong>الوحدة الدراسية:</strong> الوحدة ${foundGlossary.unitId}`,
        timestamp: new Date(),
        reference: {
          type: "glossary",
          title: foundGlossary.term,
          unitId: foundGlossary.unitId
        }
      };
    }

    // -- Stage 3: Deep search in curriculum lessons and content paragraphs --
    let bestParagraphMatch = "";
    let matchedLessonTitle = "";
    let matchedUnitId = "";

    for (const unit of curriculumData) {
      for (const lesson of unit.lessons) {
        // Search lesson title or subtitle
        if (normalizeArabic(lesson.title).includes(normalizedQuery) || normalizeArabic(lesson.subtitle || "").includes(normalizedQuery)) {
          bestParagraphMatch = lesson.content.slice(0, 2).join("<br/><br/>") + (lesson.content.length > 2 ? "<br/><br/>..." : "");
          matchedLessonTitle = lesson.title;
          matchedUnitId = unit.id;
          break;
        }

        // Search lesson content paragraphs
        for (const paragraph of lesson.content) {
          const normPara = normalizeArabic(paragraph);
          if (normPara.includes(normalizedQuery)) {
            bestParagraphMatch = paragraph;
            matchedLessonTitle = lesson.title;
            matchedUnitId = unit.id;
            break;
          }
        }
        if (bestParagraphMatch) break;
      }
      if (bestParagraphMatch) break;
    }

    if (bestParagraphMatch) {
      return {
        id: Math.random().toString(),
        sender: "assistant",
        text: `<strong>وجدنا مرجعاً في كتاب المنهج بدرس "${matchedLessonTitle}":</strong><br/><br/>
        "... ${bestParagraphMatch} ..."`,
        timestamp: new Date(),
        reference: {
          type: "curriculum",
          title: matchedLessonTitle,
          unitId: matchedUnitId
        }
      };
    }

    // -- Stage 4: Generic Fallback search --
    return {
      id: Math.random().toString(),
      sender: "assistant",
      text: `عذراً يا كيميائي المستقبلي! لم أجد إجابة دقيقة على كلمة "${userQuery}" في المنهج الكيميائي.<br/><br/>
      💡 <strong>جرّب كلمات مفتاحية مثل:</strong><br/>
      • <strong>ميثان</strong> (لتحضير ومعادلة غاز الميثان)<br/>
      • <strong>هابر</strong> (لتحضير غاز الأمونيا والنشادر)<br/>
      • <strong>صوديوم</strong> (لخلية داونز واستخلاصه وتفاعله)<br/>
      • <strong>كلور</strong> (لتحضير الكلور وقصر الألوان البصري)<br/>
      • <strong>بنزين</strong> (لبنية كيكولي وظاهرة الرنين والروابط)<br/>
      • <strong>كهروسالبية</strong> (لتدرج خواص الجدول الدوري الحديث)`,
      timestamp: new Date()
    };
  };

  const handleSuggestClick = (qText: string) => {
    handleSearch(qText);
  };

  return (
    <>
      {/* Bottom Right Floating Icon */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-start gap-2" dir="ltr">
        <button
          id="student-helper-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-all relative ${
            isOpen ? "bg-red-600 rotate-90" : "bg-gradient-to-r from-[#E67E22] to-[#D35400] animate-bounce"
          }`}
          title="مساعد واستفسارات طلاب الكيمياء"
          style={{ animationDuration: "3s" }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          
          {/* Notification Badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2C3E50] border-2 border-white rounded-full text-[10px] font-bold text-white flex items-center justify-center font-sans">
              ١
            </span>
          )}
        </button>
      </div>

      {/* Popover Assistant Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm md:max-w-md bg-white border border-[#E5E2DE] rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[500px]"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-[#2C3E50] text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-bold font-sans">المساعد الكيميائي الفوري</h3>
                  <span className="text-[9px] text-gray-300 block leading-none">مستفسر المنهج التفاعلي (بدون ذكاء اصطناعي)</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested quick questions */}
            <div className="bg-[#F9F8F6] border-b border-[#E5E2DE] p-2 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none" dir="rtl">
              <span className="text-[9px] text-[#7F8C8D] font-bold shrink-0 self-center px-1 font-sans">أسئلة شائعة:</span>
              {customQA.slice(0, 4).map((qa, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestClick(qa.keywords[0])}
                  className="bg-white border border-[#E5E2DE] hover:border-[#E67E22] text-[#2C3E50] hover:text-[#E67E22] px-2 py-1 rounded text-[10px] font-sans font-bold whitespace-nowrap shrink-0 transition-all"
                >
                  {qa.keywords[0]} 🧪
                </button>
              ))}
            </div>

            {/* Chat message body list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCFBF9]" dir="rtl">
              {messages.map((msg) => {
                const isAssistant = msg.sender === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAssistant ? "justify-start" : "justify-end"} items-start gap-2 text-right`}
                  >
                    {isAssistant && (
                      <div className="w-6 h-6 rounded-full bg-[#2C3E50]/10 border border-[#2C3E50]/20 flex items-center justify-center text-[#2C3E50] text-[10px] shrink-0 font-bold">
                        أ
                      </div>
                    )}
                    <div className="max-w-[85%] space-y-1">
                      <div
                        className={`p-3 rounded-lg text-xs leading-relaxed ${
                          isAssistant
                            ? "bg-white border border-[#E5E2DE] text-[#1A1A1A] rounded-tr-none"
                            : "bg-[#2C3E50] text-white rounded-tl-none font-bold"
                        }`}
                      >
                        <p dangerouslySetInnerHTML={{ __html: msg.text }} />
                      </div>

                      {/* Display reference if exists */}
                      {isAssistant && msg.reference && (
                        <div className="flex items-center gap-1 text-[9px] text-[#7F8C8D] font-bold px-1 justify-start">
                          <BookOpen className="w-3 h-3 text-[#E67E22]" />
                          <span>المرجع: {msg.reference.title}</span>
                          {msg.reference.unitId && (
                            <span className="bg-[#2C3E50]/5 px-1 rounded text-[#2C3E50] font-mono text-[8px]">الوحدة {msg.reference.unitId}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(query);
              }}
              className="p-3 bg-white border-t border-[#E5E2DE] flex gap-2 items-center shrink-0"
              dir="rtl"
            >
              <input
                type="text"
                placeholder="اسألني عن غاز، معادلة تحضير، أو مصطلح..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-[#F9F8F6] border border-[#E5E2DE] rounded-xl px-3 py-2 text-xs text-right focus:outline-none focus:border-[#E67E22] font-sans"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  query.trim() ? "bg-[#E67E22] text-white hover:bg-[#d6721b]" : "bg-[#BDC3C7] text-white cursor-not-allowed"
                }`}
              >
                <Send className="w-3.5 h-3.5 transform rotate-180" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
