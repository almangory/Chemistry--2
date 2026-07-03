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
  Eye
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
    // Auto advance after short delay
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  const markAsNeedsReview = (id: string) => {
    if (!needsReviewIds.includes(id)) {
      setNeedsReviewIds(prev => [...prev, id]);
      setLearnedIds(prev => prev.filter(item => item !== id));
    }
    // Auto advance after short delay
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
    <div className="space-y-6 text-right">
      
      {/* Upper Panel Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-amber-50/20 border border-[#E5E2DE] p-4 rounded-lg">
        
        {/* Toggle Mode */}
        <div className="md:col-span-4 space-y-1">
          <label className="block text-[11px] font-bold text-[#7F8C8D] font-sans">1. نوع المادة التعليمية:</label>
          <div className="grid grid-cols-2 gap-1 bg-[#F9F8F6] p-1 rounded border border-[#E5E2DE]">
            <button
              onClick={() => {
                setDeckType("terms");
                setSelectedFilter("all");
              }}
              className={`py-2 rounded text-xs font-bold font-sans transition-all cursor-pointer ${
                deckType === "terms"
                  ? "bg-[#2C3E50] text-white shadow-sm"
                  : "text-[#7F8C8D] hover:text-[#2C3E50]"
              }`}
            >
              المصطلحات الكيميائية
            </button>
            <button
              onClick={() => {
                setDeckType("elements");
                setSelectedFilter("all");
              }}
              className={`py-2 rounded text-xs font-bold font-sans transition-all cursor-pointer ${
                deckType === "elements"
                  ? "bg-[#2C3E50] text-white shadow-sm"
                  : "text-[#7F8C8D] hover:text-[#2C3E50]"
              }`}
            >
              رموز وتفاعلات العناصر
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="md:col-span-5 space-y-1">
          <label className="block text-[11px] font-bold text-[#7F8C8D] font-sans">2. تصفية النطاق العلمي:</label>
          {deckType === "terms" ? (
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full bg-white border border-[#E5E2DE] text-[#2C3E50] p-2 rounded text-xs font-bold text-right outline-none focus:border-[#E67E22] cursor-pointer"
            >
              <option value="all">جميع وحدات وموضوعات المنهج</option>
              <option value="1">الوحدة الأولى: الترتيب الدوري للعناصر</option>
              <option value="2">الوحدة الثانية: فلزات الأقلاء</option>
              <option value="3">الوحدة الثالثة: الكيمياء العضوية</option>
              <option value="4">الوحدة الرابعة: النيتروجين والغازات</option>
              <option value="5">الوحدة الخامسة: الهالوجينات</option>
            </select>
          ) : (
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full bg-white border border-[#E5E2DE] text-[#2C3E50] p-2 rounded text-xs font-bold text-right outline-none focus:border-[#E67E22] cursor-pointer"
            >
              <option value="all">جميع عائلات وتصنيفات الجدول الدوري</option>
              <option value="alkali">فلزات الأقلاء (المجموعة الأولى)</option>
              <option value="halogen">الهالوجينات (المجموعة السابعة عشر)</option>
              <option value="transition">العناصر الانتقالية الرئيسية (الفئة d)</option>
              <option value="nonmetal">اللافلزات والغازات المقررة</option>
            </select>
          )}
        </div>

        {/* Quick actions & stats */}
        <div className="md:col-span-3 flex justify-end gap-2 pt-4 md:pt-0">
          <button
            onClick={handleShuffle}
            disabled={deck.length <= 1}
            className="px-3 py-2.5 bg-white hover:bg-[#F9F8F6] border border-[#E5E2DE] text-[#2C3E50] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            title="خلط عشوائي للبطاقات"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>خلط البطاقات</span>
          </button>
          
          <button
            onClick={resetProgress}
            className="px-2.5 py-2.5 bg-white hover:bg-[#F9F8F6] border border-[#E5E2DE] text-[#7F8C8D] text-xs font-bold rounded flex items-center justify-center cursor-pointer shadow-sm"
            title="إعادة تصفير الإحصائيات"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Flashcard View */}
      {deck.length > 0 ? (
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Deck status statistics progress bar */}
          <div className="flex justify-between items-center text-xs flex-row-reverse text-[#7F8C8D]">
            <div className="flex gap-3 flex-row-reverse font-sans">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="font-bold">{learnedIds.length}</span> عرفته
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <span className="font-bold">{needsReviewIds.length}</span> يحتاج مراجعة
              </span>
            </div>
            
            <div className="font-mono font-bold">
              البطاقة {currentIndex + 1} من {deck.length}
            </div>
          </div>

          <div className="w-full bg-[#E5E2DE] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#E67E22] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            />
          </div>

          {/* Interactive Card with Perspective & Flip transitions */}
          <div 
            className="relative w-full min-h-[320px] cursor-pointer group"
            style={{ perspective: "1000px" }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div 
              className="absolute inset-0 w-full h-full transition-transform duration-500 transform-style-3d relative"
              style={{ 
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* Front Side of Card */}
              <div 
                className="absolute inset-0 w-full h-full bg-white border-2 border-[#E5E2DE] rounded-xl shadow-md p-6 flex flex-col justify-between text-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex justify-between items-center flex-row-reverse border-b border-[#E5E2DE]/60 pb-3">
                  <span className="text-[10px] bg-amber-50 text-[#E67E22] border border-amber-200/50 px-2 py-0.5 rounded font-bold font-sans">
                    {activeCard.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-[#95A5A6] text-[10px] font-bold font-sans">
                    <Eye className="w-3.5 h-3.5" />
                    <span>انقر لقلب البطاقة ورؤية الإجابة</span>
                  </div>
                </div>

                <div className="my-auto py-8 space-y-4">
                  {/* Big display styling based on type */}
                  {activeCard.type === "element" ? (
                    <div className="space-y-3">
                      <div className="w-24 h-24 bg-slate-900 text-amber-400 rounded-2xl mx-auto flex flex-col justify-center items-center shadow-lg border border-slate-800">
                        <span className="font-mono text-4xl font-extrabold">{activeCard.title}</span>
                      </div>
                      {activeCard.primaryMeta && (
                        <span className="block text-xs text-[#7F8C8D] font-mono bg-[#F9F8F6] py-1 px-2.5 rounded-full border border-[#E5E2DE] inline-block">
                          {activeCard.primaryMeta}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-serif font-extrabold text-[#2C3E50] tracking-tight">
                        {activeCard.title}
                      </h3>
                      {activeCard.subtitle && (
                        <p className="text-xs text-[#7F8C8D] font-mono tracking-wide">
                          {activeCard.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-[#E5E2DE]/60 pt-3 flex justify-center text-[10px] text-[#95A5A6] font-mono font-bold tracking-wide">
                  SUDAN SECONDARY • FLASHCARD PREVIEW
                </div>
              </div>

              {/* Back Side of Card */}
              <div 
                className="absolute inset-0 w-full h-full bg-[#2C3E50] border-2 border-slate-800 rounded-xl shadow-lg p-6 flex flex-col justify-between text-right"
                style={{ 
                  backfaceVisibility: "hidden", 
                  transform: "rotateY(180deg)" 
                }}
              >
                <div className="flex justify-between items-center flex-row-reverse border-b border-slate-700 pb-3">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold font-sans">
                    الإجابة والشرح الكيميائي
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    انقر للعودة للوجه الآخر
                  </span>
                </div>

                <div className="my-auto py-4 space-y-4 text-center px-4">
                  <h4 className="text-base font-bold text-amber-400 font-sans">
                    {activeCard.title} {activeCard.subtitle ? `(${activeCard.subtitle})` : ""}
                  </h4>
                  
                  <p className="text-xs text-slate-200 leading-relaxed font-sans max-w-md mx-auto">
                    {activeCard.description}
                  </p>

                  {/* Optional reactions inside flashcard */}
                  {activeCard.extra && (
                    <div className="p-3 bg-slate-900 rounded border border-slate-800 text-amber-300 font-mono text-xs max-w-sm mx-auto select-all">
                      {activeCard.extra}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-700 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>CHEMISTRY V2.0</span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم التثبيت العلمي</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Navigation and Feedback controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
            
            {/* Learned/Needs Review buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAsNeedsReview(activeCard.id);
                }}
                className={`flex-1 sm:flex-none px-5 py-3 rounded text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  needsReviewIds.includes(activeCard.id)
                    ? "bg-amber-600 border-amber-600 text-white"
                    : "bg-amber-50/50 hover:bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                <span>يحتاج مراجعة ❌</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAsLearned(activeCard.id);
                }}
                className={`flex-1 sm:flex-none px-5 py-3 rounded text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  learnedIds.includes(activeCard.id)
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}
              >
                <span>عرفته كلياً ✓</span>
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
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-[#F9F8F6] border border-[#E5E2DE] text-[#2C3E50] rounded flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 font-bold text-xs"
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={currentIndex === deck.length - 1}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-[#F9F8F6] border border-[#E5E2DE] text-[#2C3E50] rounded flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 font-bold text-xs"
              >
                التالي
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-12 bg-[#F9F8F6] border border-[#E5E2DE] rounded text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-[#BDC3C7] mx-auto" />
          <p className="text-sm font-bold text-[#2C3E50]">لا توجد بطاقات متاحة في النطاق المحدد</p>
          <p className="text-xs text-[#7F8C8D]">
            الرجاء اختيار وحدة أو فئة مختلفة في خيارات التصفية بالأعلى لتعبئة البطاقات التعليمية.
          </p>
        </div>
      )}

    </div>
  );
};
