import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { glossaryTerms } from "../data/glossary";
import { chemicalElements } from "../data/elements";
import { 
  RotateCw, 
  ChevronRight, 
  ChevronLeft, 
  Shuffle, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Bookmark, 
  Award,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  X
} from "lucide-react";

interface FlashcardItem {
  id: string;
  type: "term" | "element";
  title: string;          // Term name or Symbol
  subtitle?: string;       // English term or English name
  categoryLabel?: string;  // e.g. "الوحدة 1" or "فلز قلوي"
  primaryMeta?: string;   // e.g. "العدد الذري: 11"
  description: string;    // Definition or properties
  extra?: string;         // Reaction equation if any
}

export const FlashcardsView: React.FC = () => {
  // Mode Selection
  const [deckType, setDeckType] = useState<"terms" | "elements">("terms");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  
  // Flashcard Deck States
  const [deck, setDeck] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  
  // Learning Status Trackers (stored locally per session)
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>([]);

  // Generate the card deck whenever configuration parameters change
  useEffect(() => {
    let items: FlashcardItem[] = [];

    if (deckType === "terms") {
      const filtered = selectedFilter === "all" 
        ? glossaryTerms 
        : glossaryTerms.filter(t => t.unitId === selectedFilter);
      
      items = filtered.map((t, idx) => ({
        id: `t_${idx}_${t.term}`,
        type: "term",
        title: t.term,
        subtitle: t.englishTerm,
        categoryLabel: `الوحدة ${t.unitId}`,
        description: t.definition
      }));
    } else {
      const filtered = selectedFilter === "all"
        ? chemicalElements
        : chemicalElements.filter(e => e.category === selectedFilter);

      items = filtered.map((e) => ({
        id: `e_${e.symbol}`,
        type: "element",
        title: e.symbol,
        subtitle: `${e.nameAr} (${e.nameEn})`,
        categoryLabel: e.categoryLabel,
        primaryMeta: `العدد الذري: ${e.atomicNumber} • الكتلة: ${e.atomicMass}`,
        description: e.description,
        extra: e.reactions[0] ? `أبرز تفاعل: ${e.reactions[0].equation}` : undefined
      }));
    }

    setDeck(items);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [deckType, selectedFilter]);

  // Handle deck shuffling
  const handleShuffle = () => {
    if (deck.length <= 1) return;
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  // Mark status
  const markAsLearned = (id: string) => {
    if (!learnedIds.includes(id)) {
      setLearnedIds(prev => [...prev, id]);
      setNeedsReviewIds(prev => prev.filter(item => item !== id));
    }
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  const markAsNeedsReview = (id: string) => {
    if (!needsReviewIds.includes(id)) {
      setNeedsReviewIds(prev => [...prev, id]);
      setLearnedIds(prev => prev.filter(item => item !== id));
    }
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  const resetProgress = () => {
    setLearnedIds([]);
    setNeedsReviewIds([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const activeCard = deck[currentIndex];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* 🧭 Upper Panel Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs">
        
        {/* Toggle Mode */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-sans">
            1. نوع المادة التعليمية:
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setDeckType("terms");
                setSelectedFilter("all");
              }}
              className={`py-2 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                deckType === "terms"
                  ? "bg-[#047857] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              المصطلحات والمفاهيم
            </button>
            <button
              onClick={() => {
                setDeckType("elements");
                setSelectedFilter("all");
              }}
              className={`py-2 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                deckType === "elements"
                  ? "bg-[#047857] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              رموز وتفاعلات العناصر
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-sans">
            2. تصفية النطاق العلمي:
          </label>
          {deckType === "terms" ? (
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 p-2.5 rounded-xl text-xs font-bold text-right outline-none focus:border-[#047857] dark:focus:border-emerald-500 cursor-pointer transition-colors"
            >
              <option value="all">جميع وحدات وموضوعات المنهج الستة</option>
              <option value="1">الوحدة الأولى: الترتيب الدوري للعناصر</option>
              <option value="2">الوحدة الثانية: فلزات الأقلاء (المجموعة الأولى)</option>
              <option value="3">الوحدة الثالثة: الكيمياء العضوية والهيدروكربونات</option>
              <option value="4">الوحدة الرابعة: النيتروجين والمجموعة الخامسة</option>
              <option value="5">الوحدة الخامسة: الهالوجينات والكلور</option>
              <option value="6">الوحدة السادسة: العناصر الانتقالية والحديد</option>
            </select>
          ) : (
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 p-2.5 rounded-xl text-xs font-bold text-right outline-none focus:border-[#047857] dark:focus:border-emerald-500 cursor-pointer transition-colors"
            >
              <option value="all">جميع عائلات وتصنيفات الجدول الدوري</option>
              <option value="alkali">فلزات الأقلاء (المجموعة الأولى)</option>
              <option value="halogen">الهالوجينات (المجموعة السابعة)</option>
              <option value="transition">العناصر الانتقالية الرئيسية (الفئة d)</option>
              <option value="nonmetal">اللافلزات والغازات المقررة</option>
            </select>
          )}
        </div>

        {/* Quick actions & stats */}
        <div className="md:col-span-3 flex justify-end gap-2 pt-2 md:pt-0">
          <button
            onClick={handleShuffle}
            disabled={deck.length <= 1}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
            title="خلط عشوائي للبطاقات"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#047857] dark:text-emerald-400" />
            <span>خلط البطاقات</span>
          </button>
          
          <button
            onClick={resetProgress}
            className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center cursor-pointer shadow-xs transition-colors"
            title="إعادة تصفير الإحصائيات"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 🎴 Main Flashcard View */}
      {deck.length > 0 ? (
        <div className="max-w-2xl mx-auto space-y-5">
          
          {/* Deck status statistics progress bar */}
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
            <div className="flex gap-3 font-sans">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>عرفته: {learnedIds.length}</span>
              </span>
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 font-bold">
                <X className="w-3.5 h-3.5" />
                <span>يحتاج مراجعة: {needsReviewIds.length}</span>
              </span>
            </div>
            
            <div className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              البطاقة {currentIndex + 1} من {deck.length}
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#047857] h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            />
          </div>

          {/* 🔄 Clean, Robust Card Flip via AnimatePresence (No Ghosting, Perfect Contrast) */}
          <div 
            className="w-full cursor-pointer select-none"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!isFlipped ? (
                /* ================= FRONT SIDE (السؤال / المصطلح) ================= */
                <motion.div
                  key="front"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full min-h-[340px] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700/80 hover:border-[#047857] dark:hover:border-emerald-500 rounded-3xl shadow-md hover:shadow-xl p-6 sm:p-8 flex flex-col justify-between text-center transition-colors group"
                >
                  {/* Top Bar of Front */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/80 text-[#047857] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded-xl font-bold font-sans">
                      {activeCard.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 group-hover:text-[#047857] dark:group-hover:text-emerald-400 text-xs font-bold font-sans transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>انقر لقلب البطاقة ورؤية الشرح ↺</span>
                    </div>
                  </div>

                  {/* Body of Front */}
                  <div className="my-auto py-8 space-y-4">
                    {activeCard.type === "element" ? (
                      <div className="space-y-3">
                        <div className="w-24 h-24 bg-[#064E3B] dark:bg-[#047857] text-white rounded-2xl mx-auto flex flex-col justify-center items-center shadow-lg border-2 border-emerald-400/40 group-hover:scale-105 transition-transform">
                          <span className="font-mono text-4xl font-extrabold">{activeCard.title}</span>
                        </div>
                        {activeCard.subtitle && (
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">
                            {activeCard.subtitle}
                          </h3>
                        )}
                        {activeCard.primaryMeta && (
                          <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-bold bg-slate-100 dark:bg-slate-800 py-1 px-3 rounded-full border border-slate-200 dark:border-slate-700 inline-block">
                            {activeCard.primaryMeta}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                          {activeCard.title}
                        </h3>
                        {activeCard.subtitle && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-sans font-medium">
                            {activeCard.subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom of Front */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-center items-center text-[11px] text-slate-400 dark:text-slate-500 font-sans font-bold">
                    <span>منهاج كيمياء الصف الثاني ثانوي • بطاقة تفاعلية</span>
                  </div>
                </motion.div>
              ) : (
                /* ================= BACK SIDE (الإجابة والشرح الكيميائي المعتمد) ================= */
                <motion.div
                  key="back"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full min-h-[340px] bg-gradient-to-b from-emerald-50/70 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-2 border-[#047857] dark:border-emerald-500 rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col justify-between text-right"
                >
                  {/* Top Bar of Back */}
                  <div className="flex justify-between items-center pb-3 border-b border-emerald-200 dark:border-slate-800">
                    <span className="text-[11px] bg-[#047857] text-white px-3 py-1 rounded-xl font-bold font-sans flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>الإجابة والشرح الكيميائي المعتمد</span>
                    </span>
                    <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold font-sans flex items-center gap-1 hover:underline cursor-pointer">
                      <span>انقر للعودة للسؤال</span>
                      <RotateCw className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Body of Back - High Contrast, 100% Legible */}
                  <div className="my-auto py-5 space-y-4 text-center px-2 sm:px-4">
                    <h4 className="text-base sm:text-lg font-bold text-[#064E3B] dark:text-emerald-300 font-sans">
                      {activeCard.title} {activeCard.subtitle ? `(${activeCard.subtitle})` : ""}
                    </h4>
                    
                    <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed font-sans max-w-xl mx-auto bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-emerald-100 dark:border-slate-700/80 shadow-xs">
                      {activeCard.description}
                    </p>

                    {/* Optional chemical equation / extra */}
                    {activeCard.extra && (
                      <div className="p-3 bg-slate-900 dark:bg-slate-950 rounded-xl border border-emerald-700/60 text-emerald-300 font-mono text-xs sm:text-sm max-w-md mx-auto select-all shadow-inner dir-ltr font-bold">
                        {activeCard.extra}
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer of Back */}
                  <div className="pt-3 border-t border-emerald-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 font-sans">
                    <span className="font-bold text-[#047857] dark:text-emerald-400">كيمياء الثاني ثانوي 🇸🇩</span>
                    <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>موثق حسب كتاب الوزارة</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 🎯 Navigation and Feedback controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
            
            {/* Learned/Needs Review buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAsNeedsReview(activeCard.id);
                }}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  needsReviewIds.includes(activeCard.id)
                    ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                    : "bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>يحتاج مراجعة</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAsLearned(activeCard.id);
                }}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  learnedIds.includes(activeCard.id)
                    ? "bg-[#047857] border-[#047857] text-white shadow-xs"
                    : "bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800 text-[#047857] dark:text-emerald-300"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>عرفته كلياً</span>
              </button>
            </div>

            {/* Slider back/next */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                disabled={currentIndex === 0}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 font-bold text-xs transition-colors shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={currentIndex === deck.length - 1}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-[#047857] hover:bg-[#064E3B] text-white rounded-xl flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 font-bold text-xs transition-colors shadow-xs"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3 shadow-xs">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">لا توجد بطاقات متاحة في النطاق المحدد</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            الرجاء اختيار وحدة أو فئة مختلفة في خيارات التصفية بالأعلى لتعبئة البطاقات التعليمية.
          </p>
        </div>
      )}

    </div>
  );
};
