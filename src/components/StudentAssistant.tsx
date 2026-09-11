import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Volume2,
  Square,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Zap,
  FlaskConical,
  Atom,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Wifi,
  Cloud
} from "lucide-react";
import { glossaryTerms } from "../data/glossary";
import { curriculumData } from "../data/curriculum";

interface MediaData {
  type?: string;
  title: string;
  channel?: string;
  search_url?: string;
  watch_url?: string;
  embed_url?: string;
  thumbnail?: string;
  badge?: string;
}

interface Message {
  id: string;
  sender: "student" | "assistant";
  text: string;
  timestamp: Date;
  media?: MediaData | null;
  toolsUsed?: any[];
  reference?: {
    type: "glossary" | "curriculum" | "qa" | "ai";
    title: string;
    unitId?: string;
  };
}

const LOCAL_TUNNEL_CHECK_URL = "https://local-ai-arsenal.pages.dev/static/tunnel_status.json";
const CLOUD_MENTOR_ENDPOINT = "https://local-ai-arsenal.pages.dev/api/mentor/chat";
const CLOUD_TTS_ENDPOINT = "https://local-ai-arsenal.pages.dev/api/tts";

const HIGH_YIELD_CHEMISTRY_PRESETS = [
  { label: "⚡ مسائل قوانين فاراداي", query: "اشرح قوانين فاراداي للتحليل الكهربي وكيف أحل مسألة حساب كمية الكهرباء والكتلة المترسبة خطوة بخطوة؟" },
  { label: "🧪 مسائل المعايرة الحجمية", query: "كيف أحل مسائل معايرة الأحماض والقواعد وقانون التعادل وحساب التركيز المولي والنسبة المئوية؟" },
  { label: "🌿 تسمية الكيمياء العضوية IUPAC", query: "وضح القواعد الصارمة لتسمية مشتقات الهيدروكربونات (الكحولات، الألدهيدات، الأحماض، والإسترات) حسب نظام IUPAC." },
  { label: "⚖️ قاعدة لوشاتيليه والاتزان", query: "اشرح قاعدة لوشاتيليه وأثر تغير الضغط والحرارة والتركيز على موضع الاتزان وقيمة ثابت الاتزان Kc." },
  { label: "🔥 قانون هس والمحتوى الحراري", query: "كيف أحسب التغير في المحتوى الحراري للتفاعل ΔH باستخدام قانون هس وطاقة الروابط؟" },
  { label: "🎯 اديني الزيت في الكيمياء", query: "اديني الزيت في كيمياء الشهادة السودانية" }
];

// Custom Q&A dataset representing common high-yield Sudan chemistry questions (Offline Fallback)
const customQA = [
  {
    keywords: ["ميثان", "الميثان", "methane", "تحضير الميثان", "غاز المستنقعات"],
    question: "كيف يحضر غاز الميثان في المعمل وما هي معادلته؟",
    answer: `<strong>تحضير غاز الميثان (CH₄) معملياً:</strong><br/>
    يحضر الميثان في المختبر بـ <strong>التقطير الجاف لخلات (أسيتات) الصوديوم اللامائية</strong> مع <strong>الجير الصودي</strong> (وهو خليط من الصودا الكاوية NaOH والجير الحي CaO).<br/><br/>
    <strong>دور الجير الحي (CaO):</strong> لا يدخل في التفاعل ولكنه يساعد في خفض درجة انصهار الخليط ومنع تميع زجاج أنبوبة الاختبار.<br/><br/>
    <strong>معادلة التفاعل الكيميائية:</strong><br/>
    <code class="bg-[#0f2d24] text-emerald-300 px-3 py-1.5 rounded-lg block text-center border border-emerald-700/50 my-2 font-mono text-sm font-bold dir-ltr">
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
    <code class="bg-[#0f2d24] text-emerald-300 px-3 py-1.5 rounded-lg block text-center border border-emerald-700/50 my-2 font-mono text-sm font-bold dir-ltr">
      C₂H₅OH ⟶[H₂SO₄ / 180°C] C₂H₄ (g) ↑ + H₂O
    </code><br/>
    <strong>الكشف عن الإيثين:</strong> يزيل لون ماء البروم الأحمر سريعاً لكونه هيدروكربوناً غير مشبع يحتوي على رابطة ثنائية (سيجما وباي).`,
    unitId: "3"
  },
  {
    keywords: ["فاراداي", "Faraday", "التحليل الكهربي", "كولوم"],
    question: "ما هما قانونا فاراداي للتحليل الكهربي وما صيغتهما الرياضية؟",
    answer: `<strong>قوانين فاراداي للتحليل الكهربائي:</strong><br/>
    1. <strong>القانون الأول:</strong> تتناسب كتلة المادة المترسبة أو المتصاعدة عند أي قطب تناسباً طردياً مع كمية الكهرباء المارة في المحلول الإلكتروليتي (\(m \propto Q\)).<br/>
    2. <strong>القانون الثاني:</strong> عند مرور نفس كمية الكهرباء في عدة محاليل إلكتروليتية متصلة على التوالي، فإن كتل المواد المترسبة تتناسب طردياً مع كتلها المكافئة الجرامية.<br/><br/>
    <strong>الصيغة الرياضية الموحدة لحل المسائل:</strong><br/>
    <code class="bg-[#0f2d24] text-emerald-300 px-3 py-1.5 rounded-lg block text-center border border-emerald-700/50 my-2 font-mono text-sm font-bold dir-ltr">
      Q (كولوم) = I (أمبير) × t (ثواني) | m = (M × I × t) / (z × 96500)
    </code>`,
    unitId: "1"
  }
];

function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/[أإآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function cleanTtsText(str: string): string {
  return (str || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[*#_`~\[\]]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\\[\(\)\[\]]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Simple Markdown / LaTeX to HTML parser for Chemistry
function renderFormattedContent(content: string): string {
  if (!content) return "";
  let html = content;

  // Code blocks / equations
  html = html.replace(/```(?:chemistry|chem|math|latex)?([\s\S]*?)```/g, (_match, code) => {
    return `<pre class="bg-[#06241b] border border-emerald-700/60 text-emerald-300 p-3 rounded-xl overflow-x-auto my-2.5 font-mono text-xs sm:text-sm dir-ltr"><code>${code.trim()}</code></pre>`;
  });

  // LaTeX Display Math \[ ... \]
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_match, eq) => {
    return `<div class="bg-[#072a20] border border-emerald-600/40 text-emerald-200 py-2 px-3 rounded-xl my-2 text-center font-mono text-sm sm:text-base font-bold dir-ltr overflow-x-auto">${eq.trim()}</div>`;
  });

  // LaTeX Inline Math \( ... \)
  html = html.replace(/\\\((.*?)\\\)/g, (_match, eq) => {
    return `<code class="bg-[#072a20] text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono font-semibold dir-ltr">${eq.trim()}</code>`;
  });

  // Chemical sub/super notation replacement for common tags
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#093529] text-emerald-300 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h4 class="text-emerald-300 font-bold text-sm sm:text-base mt-3 mb-1">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 class="text-emerald-200 font-extrabold text-base sm:text-lg mt-4 mb-2 border-b border-emerald-800/60 pb-1">$1</h3>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="border-emerald-800/60 my-3" />');

  // Bullet points
  html = html.replace(/^\s*[-•]\s+(.*$)/gim, '<li class="mr-4 my-1 text-slate-200">$1</li>');

  // Line breaks to <br/>
  html = html.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');

  return html;
}

export const StudentAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionMode, setConnectionMode] = useState<"local" | "cloud" | "offline">("cloud");
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [activeTunnelUrl, setActiveTunnelUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-senior",
      sender: "assistant",
      text: `أهلاً بك يا زميل التميز الأكاديمي وبطل الشهادة السودانية! ⚗️🧪<br/><br/>
أنا <strong>سودان بوت 🤖🇸🇩 (المعلم الكيميائي الأكاديمي الذكي)</strong> لمنصة نَقْـلَة للمناهج الإلكترونية، مدعوم بأحدث خوارزميات التفكير والذكاء الاصطناعي للمرحلة الثانوية.<br/><br/>
جاهز لمساعدتك في استيعاب ومراجعة:
<ul class="list-disc list-inside space-y-1 my-2 text-emerald-200">
  <li>⚡ <strong>الكيمياء الكهربية:</strong> خلايا دانيال، التحليل الكهربائي، وقوانين فاراداي.</li>
  <li>🧪 <strong>الكيمياء التحليلية:</strong> المعايرة الحجمية، أدلة الأحماض والقواعد، وحسابات المولارية.</li>
  <li>🌿 <strong>الكيمياء العضوية:</strong> تسمية مشتقات الهيدروكربونات (IUPAC) وتفاعلات التمييز.</li>
  <li>⚖️ <strong>الاتزان الكيميائي:</strong> قاعدة لوشاتيليه، ثابت الاتزان Kc، وتأثير الضغط والحرارة.</li>
  <li>🔥 <strong>الكيمياء الحرارية:</strong> حسابات المحتوى الحراري ΔH وقانون هس.</li>
</ul>
تفضل بطرح أي مسألة، أو اطلب <em>«اديني الزيت»</em> لأي درس وسأوافيك بالقوانين وشراك امتحانات الشهادة السودانية فوراً! 🚀`,
      timestamp: new Date()
    }
  ]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isLoading]);

  // Check Local Tunnel status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkTunnel() {
      try {
        const res = await fetch(LOCAL_TUNNEL_CHECK_URL, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === "online" && data.tunnel_url) {
            if (isMounted) {
              setActiveTunnelUrl(data.tunnel_url);
              setConnectionMode("local");
            }
            return;
          }
        }
      } catch {
        // Fallback
      }
      if (isMounted) {
        setConnectionMode(navigator.onLine ? "cloud" : "offline");
      }
    }
    checkTunnel();
    return () => {
      isMounted = false;
    };
  }, []);

  // Stop TTS audio when unmounting or closing
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSpeak = async (msgId: string, text: string) => {
    if (playingMessageId === msgId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingMessageId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setPlayingMessageId(msgId);
    const cleanText = cleanTtsText(text);

    try {
      const ttsUrl = `${CLOUD_TTS_ENDPOINT}?text=${encodeURIComponent(cleanText.slice(0, 500))}&voice=ar-EG-ShakirNeural`;
      const audio = new Audio(ttsUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingMessageId(null);
        audioRef.current = null;
      };
      audio.onerror = () => {
        // Try fallback browser SpeechSynthesis
        setPlayingMessageId(null);
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300));
          utterance.lang = "ar-SA";
          window.speechSynthesis.speak(utterance);
        }
      };
      await audio.play();
    } catch {
      setPlayingMessageId(null);
    }
  };

  const handleCopy = (msgId: string, text: string) => {
    const plain = cleanTtsText(text);
    navigator.clipboard.writeText(plain);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSendMessage = async (userPrompt: string) => {
    const trimmed = userPrompt.trim();
    if (!trimmed || isLoading) return;

    const studentMsg: Message = {
      id: Math.random().toString(),
      sender: "student",
      text: trimmed,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, studentMsg]);
    setQuery("");
    setIsLoading(true);

    // Build chat history payload
    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.sender === "student" ? "user" : "assistant",
      content: cleanTtsText(m.text)
    }));

    // Target API endpoint (Try Active Local Tunnel first, then Cloudflare Edge fallback)
    const endpointsToTry = [];
    if (activeTunnelUrl) {
      endpointsToTry.push(`${activeTunnelUrl}/api/mentor/chat`);
    }
    endpointsToTry.push(CLOUD_MENTOR_ENDPOINT);

    let aiSuccess = false;

    for (const endpoint of endpointsToTry) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: trimmed,
            stage: "chemistry-grade-12",
            history: historyPayload,
            host_context: {
              title: "كيمياء الصف الثالث الثانوي - منصة نقلة",
              url: window.location.href,
              resources_count: 5
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && (data.reply || data.response)) {
            const replyText = data.reply || data.response;
            const assistantMsg: Message = {
              id: Math.random().toString(),
              sender: "assistant",
              text: replyText,
              timestamp: new Date(),
              media: data.media || null,
              toolsUsed: data.tools_used || [],
              reference: {
                type: "ai",
                title: "المعلم الأكاديمي الذكي (الشهادة السودانية)"
              }
            };
            setMessages((prev) => [...prev, assistantMsg]);
            aiSuccess = true;
            setConnectionMode(endpoint.includes("pages.dev") ? "cloud" : "local");
            break;
          }
        }
      } catch (err) {
        console.warn(`[AI Mentor] Failed to connect to ${endpoint}:`, err);
      }
    }

    // Offline / Local knowledge base Fallback
    if (!aiSuccess) {
      const fallbackMsg = executeLocalFallbackSearch(trimmed);
      setMessages((prev) => [...prev, fallbackMsg]);
      setConnectionMode("offline");
    }

    setIsLoading(false);
  };

  const executeLocalFallbackSearch = (userQuery: string): Message => {
    const normalizedQuery = normalizeArabic(userQuery);

    // 1. Check custom Q&A
    const foundQA = customQA.find((qa) =>
      qa.keywords.some((kw) => normalizedQuery.includes(normalizeArabic(kw)))
    );
    if (foundQA) {
      return {
        id: Math.random().toString(),
        sender: "assistant",
        text: `<strong>إجابة أكاديمية وافية عن: "${foundQA.question}"</strong><br/><br/>${foundQA.answer}`,
        timestamp: new Date(),
        reference: {
          type: "qa",
          title: foundQA.question,
          unitId: foundQA.unitId
        }
      };
    }

    // 2. Check Glossary
    const foundGlossary = glossaryTerms.find((term) => {
      const normTerm = normalizeArabic(term.term);
      const normEng = term.englishTerm ? normalizeArabic(term.englishTerm) : "";
      return normalizedQuery.includes(normTerm) || (normEng && normalizedQuery.includes(normEng)) || normTerm.includes(normalizedQuery);
    });

    if (foundGlossary) {
      return {
        id: Math.random().toString(),
        sender: "assistant",
        text: `<strong>المصطلح العلمي في القاموس الكيميائي:</strong><br/><br/>
        <strong>المصطلح:</strong> ${foundGlossary.term} ${foundGlossary.englishTerm ? `(${foundGlossary.englishTerm})` : ""}<br/>
        <strong>التعريف الأكاديمي:</strong> ${foundGlossary.definition}<br/>
        <strong>الوحدة الدراسية:</strong> الوحدة ${foundGlossary.unitId}`,
        timestamp: new Date(),
        reference: {
          type: "glossary",
          title: foundGlossary.term,
          unitId: foundGlossary.unitId
        }
      };
    }

    // 3. Curriculum search
    for (const unit of curriculumData) {
      for (const lesson of unit.lessons) {
        if (normalizeArabic(lesson.title).includes(normalizedQuery) || normalizeArabic(lesson.subtitle || "").includes(normalizedQuery)) {
          return {
            id: Math.random().toString(),
            sender: "assistant",
            text: `<strong>خلاصة درس «${lesson.title}» من كتاب الوزارة:</strong><br/><br/>${lesson.content.slice(0, 2).join("<br/><br/>")}`,
            timestamp: new Date(),
            reference: {
              type: "curriculum",
              title: lesson.title,
              unitId: unit.id
            }
          };
        }
      }
    }

    return {
      id: Math.random().toString(),
      sender: "assistant",
      text: `يا رفيق التميز العلمي، يبدو أن هناك انقطاعاً مؤقتاً في شبكة الاتصال، ولم نعثر على تطابق مباشر في قاعدة البيانات الأوفلاين السريعة.<br/><br/>
يرجى التأكد من اتصال الإنترنت لتفعيل المعلم الأكاديمي الذكي السحابي، أو اختيار أحد مواضيع الامتحان الجاهزة أعلاه لمتابعة المراجعة! 💡⚗️`,
      timestamp: new Date()
    };
  };

  const handlePresetClick = (presetQuery: string) => {
    handleSendMessage(presetQuery);
  };

  return (
    <>
      {/* 🌟 Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-20 sm:bottom-6 left-5 sm:left-6 z-50"
            dir="rtl"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-2xl shadow-emerald-950/70 hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-emerald-300/80 cursor-pointer"
              title="تحدث مع سودان بوت - المعلم الكيميائي الذكي"
            >
              {/* Online Green Pulsing Dot Badge */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-sm"></span>
              </span>

              {/* 🇸🇩 Sudan Bot Circular Avatar Icon */}
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img
                  src="/sudan-bot-avatar.png"
                  alt="سودان بوت"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Hover Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-950/95 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/50 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                سودان بوت 🇸🇩
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 Active Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`fixed z-[100] ${
              isMaximized
                ? "inset-2 sm:inset-6 rounded-3xl"
                : "bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:w-[480px] h-[640px] max-h-[90vh] rounded-3xl"
            } bg-[#041a13]/95 backdrop-blur-xl border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/80 flex flex-col overflow-hidden text-slate-100`}
            dir="rtl"
          >
            {/* 🏷️ Header */}
            <div className="bg-gradient-to-r from-[#06241b] via-[#083326] to-[#041a13] px-4 py-3.5 border-b border-emerald-800/70 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-emerald-300/70 shadow-lg bg-white shrink-0 ring-2 ring-emerald-500/40">
                  <img
                    src="/sudan-bot-avatar.png"
                    alt="سودان بوت"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide font-sans">
                      سودان بوت (المعلم الكيميائي)
                    </h3>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.5 rounded">
                      الشهادة السودانية 🇸🇩
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/80">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>
                      {connectionMode === "local" ? "متصل بالنفق المحلي النشط" : connectionMode === "cloud" ? "سحابي 24/7 (منصة نقلة)" : "أوفلاين محلي"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 hover:bg-emerald-800/50 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
                  title={isMaximized ? "تصغير النافذة" : "تكبير لكامل الشاشة"}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setMessages([messages[0]]);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setPlayingMessageId(null);
                    }
                  }}
                  className="p-1.5 hover:bg-emerald-800/50 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
                  title="محادثة جديدة"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setPlayingMessageId(null);
                    }
                  }}
                  className="p-1.5 hover:bg-red-900/40 hover:text-red-300 rounded-xl transition-colors cursor-pointer"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ⚡ High-Yield Quick Chips */}
            <div className="bg-[#02130e] border-b border-emerald-900/60 px-3 py-2 shrink-0 overflow-x-auto no-scrollbar flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-400 whitespace-nowrap flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> أسئلة الشهادة:
              </span>
              {HIGH_YIELD_CHEMISTRY_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(preset.query)}
                  disabled={isLoading}
                  className="text-[11px] whitespace-nowrap bg-emerald-900/30 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/40 px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* 💬 Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans custom-scrollbar">
              {messages.map((msg) => {
                const isUser = msg.sender === "student";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isUser ? "flex-row-reverse items-start" : "flex-row items-start"}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-400/60 bg-white shrink-0 mt-0.5 shadow-md ring-1 ring-emerald-500/40">
                        <img
                          src="/sudan-bot-avatar.png"
                          alt="سودان بوت"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}
                    <div className={`flex flex-col ${isUser ? "items-start" : "items-end"} flex-1`}>
                      <div
                        className={`max-w-[94%] sm:max-w-[88%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs shadow-md mr-auto"
                            : "bg-[#06241b] border border-emerald-700/40 text-slate-100 rounded-tl-xs shadow-md ml-auto"
                        }`}
                    >
                      {/* Formatted HTML/Markdown Body */}
                      <div
                        className="leading-relaxed break-words font-sans space-y-1"
                        dangerouslySetInnerHTML={{ __html: renderFormattedContent(msg.text) }}
                      />

                      {/* 🎬 Attached Media / YouTube Video Card */}
                      {msg.media && (
                        <div className="mt-3 pt-3 border-t border-emerald-800/60">
                          <div className="bg-[#031710] border border-emerald-600/40 rounded-xl p-2.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="text-xl shrink-0">🎬</span>
                              <div className="truncate">
                                <div className="text-xs font-bold text-emerald-200 truncate">
                                  {msg.media.title}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {msg.media.channel || "منصات يوتيوب المعتمدة للمنهج السوداني"}
                                </div>
                              </div>
                            </div>
                            <a
                              href={msg.media.watch_url || msg.media.search_url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 transition-colors"
                            >
                              <span>مشاهدة</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Reference Badge & Action Bar */}
                      {!isUser && (
                        <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-400/80">
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-950/70 border border-emerald-800/50 px-2 py-0.5 rounded text-[10px]">
                              {msg.reference?.title || "معلم كيمياء الشهادة السودانية"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* TTS Button */}
                            <button
                              onClick={() => handleSpeak(msg.id, msg.text)}
                              className={`p-1 rounded hover:bg-emerald-800/40 transition-colors ${
                                playingMessageId === msg.id ? "text-amber-400 animate-pulse" : "text-slate-400 hover:text-white"
                              }`}
                              title={playingMessageId === msg.id ? "إيقاف الصوت" : "استماع للشرح بصوت المعلم"}
                            >
                              {playingMessageId === msg.id ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>

                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="p-1 text-slate-400 hover:text-white rounded hover:bg-emerald-800/40 transition-colors"
                              title="نسخ الشرح"
                            >
                              {copiedMessageId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-slate-400 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-400/60 bg-white shrink-0 shadow-md ring-1 ring-emerald-500/40 animate-pulse">
                    <img
                      src="/sudan-bot-avatar.png"
                      alt="سودان بوت"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="bg-[#06241b] border border-emerald-700/40 rounded-2xl rounded-tl-xs p-3.5 max-w-[80%] flex items-center gap-3 text-emerald-300 text-xs shadow-md">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <span>سودان بوت يزن التفاعلات الكيميائية ويراجع شراك الامتحان... ⚗️</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ✍️ Input Bar */}
            <div className="bg-[#041a13] border-t border-emerald-800/70 p-3 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(query);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="اكتب سؤالك أو مسألتك الكيميائية (مثال: احسب كمية الكهرباء، أو اديني الزيت)..."
                    disabled={isLoading}
                    className="w-full bg-[#072a20] border border-emerald-700/60 rounded-2xl py-2.5 px-4 text-xs sm:text-sm text-white placeholder-emerald-400/60 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white p-2.5 rounded-2xl shadow-lg shadow-emerald-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer shrink-0"
                  title="إرسال"
                >
                  <Send className="w-5 h-5 rotate-180" />
                </button>
              </form>

              <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-emerald-400/70 font-sans">
                <span>💡 نصيحة: اكتب <strong>اديني الزيت في [اسم الدرس]</strong> لتلخيص مباشر لأهم نقاط الامتحان</span>
                <span>منصة نقلة • المناهج السودانية 🇸🇩</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
