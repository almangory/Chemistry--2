import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { curriculumData } from "../data/curriculum";
import { InteractiveDiagram } from "./InteractiveDiagram";
import { applySmartHighlights } from "../utils/textHighlighter";
import { 
  BookOpen, 
  CheckSquare, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  FlaskConical, 
  Heart, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Highlighter,
  Sun,
  Moon,
  ScrollText,
  Type
} from "lucide-react";
import { Unit, Lesson } from "../types";

interface SyllabusViewProps {
  completedLessons: string[];
  toggleLessonComplete: (lessonId: string) => void;
  favoriteLessons?: string[];
  toggleLessonFavorite?: (lessonId: string) => void;
  onNavigateToLab: (lessonId: string) => void;
  selectedLessonId?: string | null;
  setSelectedLessonId?: (lessonId: string | null) => void;
  isFocusReading?: boolean;
  setIsFocusReading?: (val: boolean) => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  completedLessons,
  toggleLessonComplete,
  favoriteLessons = [],
  toggleLessonFavorite,
  onNavigateToLab,
  selectedLessonId,
  setSelectedLessonId,
  isFocusReading = false,
  setIsFocusReading
}) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit>(curriculumData[0]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(curriculumData[0].lessons[0]);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"reader" | "grid">("reader");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [readingTheme, setReadingTheme] = useState<"warm" | "day" | "night">("warm");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [isSmartHighlight, setIsSmartHighlight] = useState<boolean>(true);

  // Sync when selectedLessonId is passed externally (e.g. from Dashboard)
  useEffect(() => {
    if (selectedLessonId) {
      const unit = curriculumData.find((u) => u.lessons.some((l) => l.id === selectedLessonId));
      if (unit) {
        setSelectedUnit(unit);
        const lesson = unit.lessons.find((l) => l.id === selectedLessonId);
        if (lesson) {
          setSelectedLesson(lesson);
          setViewMode("reader");
          setShowSummary(false);
        }
      }
      if (setSelectedLessonId) {
        setSelectedLessonId(null);
      }
    }
  }, [selectedLessonId, setSelectedLessonId]);

  const selectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setSelectedLesson(unit.lessons[0]);
    setShowSummary(false);
  };

  const isLessonRead = completedLessons.includes(selectedLesson.id);
  const isLessonFavorite = favoriteLessons.includes(selectedLesson.id);

  // Unit icons mapping
  const unitIcons: Record<string, string> = {
    "1": "⚛️",
    "2": "⚡",
    "3": "🌿",
    "4": "💨",
    "5": "🧂",
    "6": "🔩"
  };

  // Next / Previous lesson logic
  const currentLessonIndex = selectedUnit.lessons.findIndex(l => l.id === selectedLesson.id);
  const prevLesson = currentLessonIndex > 0 ? selectedUnit.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < selectedUnit.lessons.length - 1 ? selectedUnit.lessons[currentLessonIndex + 1] : null;

  return (
    <div className="space-y-4 sm:space-y-6 text-right" dir="rtl">
      {/* 🧭 Top Navigation: Unit Selector Ribbon */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#047857]" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 font-sans">
              وحدات منهج الكيمياء - الصف الثاني الثانوي
            </h2>
          </div>

          <button
            onClick={() => setViewMode(viewMode === "reader" ? "grid" : "reader")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-[#047857]" />
            <span>{viewMode === "reader" ? "عرض فهرس دروس الوحدة" : "فتح قارئ الدرس"}</span>
          </button>
        </div>

        {/* 6 Units Horizontal Scroll Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          {curriculumData.map((unit) => {
            const isSelected = selectedUnit.id === unit.id;
            const unitLessonIds = unit.lessons.map(l => l.id);
            const doneCount = completedLessons.filter(id => unitLessonIds.includes(id)).length;
            const isAllDone = doneCount === unit.lessons.length;

            return (
              <button
                key={unit.id}
                onClick={() => selectUnit(unit)}
                className={`shrink-0 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? "bg-[#047857] text-white border-[#047857] shadow-xs scale-[1.01]"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span className="text-sm">{unitIcons[unit.id] || "🧪"}</span>
                <span className="font-sans whitespace-nowrap">
                  الوحدة {unit.number}: {unit.title.split(" ")[0]}...
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : isAllDone
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {doneCount}/{unit.lessons.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📚 View Mode: Lessons Grid of the Current Unit */}
      {viewMode === "grid" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3.5"
        >
          <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-emerald-800 block">
                فهرس دروس الوحدة {selectedUnit.number}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950 font-serif">
                {selectedUnit.title}
              </h3>
            </div>
            <span className="text-xs text-emerald-800 font-mono font-bold bg-white px-2.5 py-1 rounded-xl border border-emerald-200 shadow-xs">
              {selectedUnit.lessons.length} دروس
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedUnit.lessons.map((lesson, idx) => {
              const isRead = completedLessons.includes(lesson.id);
              const isFav = favoriteLessons.includes(lesson.id);
              const isCurrent = selectedLesson.id === lesson.id;

              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setViewMode("reader");
                  }}
                  className={`group p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                    isCurrent
                      ? "bg-emerald-50/40 border-emerald-500 shadow-xs ring-1 ring-emerald-500"
                      : "bg-white border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Lesson Image Thumbnail (Nano Banana generated) */}
                    {lesson.image && (
                      <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                        <img
                          src={lesson.image}
                          alt={lesson.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-800 backdrop-blur-sm shadow-xs flex items-center gap-1">
                          <span>🔬</span>
                          <span>شكل توضيحي</span>
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                        الدرس {idx + 1}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isFav && <span className="text-xs text-rose-500">❤️</span>}
                        {isRead ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            تمت دراسته
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-sans">غير منجز</span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 font-sans leading-snug group-hover:text-emerald-800 transition-colors">
                      {lesson.title}
                    </h4>

                    {lesson.subtitle && (
                      <p className="text-[11px] text-slate-500 font-sans line-clamp-2 leading-relaxed">
                        {lesson.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToLab(lesson.id);
                      }}
                      className="text-[10px] sm:text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                      <span>المعمل المرتبط</span>
                    </button>

                    <span className="text-[10px] sm:text-[11px] font-bold text-[#047857] flex items-center gap-0.5">
                      <span>فتح الدرس</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 📖 View Mode: Distraction-Free Lesson Reader */}
      {viewMode === "reader" && (
        <div className={`border p-4 sm:p-6 md:p-8 rounded-2xl space-y-5 shadow-xs w-full transition-all duration-300 ${
          readingTheme === "warm" 
            ? "reading-theme-warm bg-[#FAF7F0] border-[#E7E0D3] text-[#292524]" 
            : readingTheme === "night" 
            ? "bg-slate-900 border-slate-800 text-slate-100" 
            : "bg-white border-slate-200 text-slate-800"
        }`}>
          {/* Header containing Actions and Lesson Titles */}
          <div className={`border-b pb-4 space-y-3.5 ${readingTheme === "warm" ? "border-amber-200/60" : readingTheme === "night" ? "border-slate-800" : "border-slate-100"}`}>
            {/* Quick unit pill and back to grid button */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] bg-[#047857] text-white px-2.5 py-1 rounded-lg font-bold font-mono">
                  الوحدة {selectedUnit.number}: {selectedUnit.title}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  الدرس {selectedUnit.lessons.indexOf(selectedLesson) + 1} من {selectedUnit.lessons.length}
                </span>
              </div>

              <button
                onClick={() => setViewMode("grid")}
                className="text-xs font-bold text-slate-600 hover:text-[#047857] flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>فهرس دروس الوحدة</span>
              </button>
            </div>

            {/* Lesson Title & Subtitle */}
            <div className="text-right space-y-1">
              <h2 className={`text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-tight leading-snug ${
                readingTheme === "warm" ? "text-[#292524]" : readingTheme === "night" ? "text-slate-100" : "text-slate-800"
              }`}>
                {selectedLesson.title}
              </h2>
              {selectedLesson.subtitle && (
                <p className={`text-xs sm:text-sm font-sans leading-relaxed ${
                  readingTheme === "warm" ? "text-[#78716c]" : readingTheme === "night" ? "text-slate-400" : "text-slate-500"
                }`}>
                  {selectedLesson.subtitle}
                </p>
              )}
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              <button
                onClick={() => toggleLessonComplete(selectedLesson.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLessonRead
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-[#047857] text-white hover:bg-[#036549] shadow-xs"
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{isLessonRead ? "أتممت دراسة الدرس ✓" : "تحديد الدرس كمنجز ✓"}</span>
              </button>

              <button
                onClick={() => toggleLessonFavorite && toggleLessonFavorite(selectedLesson.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLessonFavorite
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLessonFavorite ? "fill-rose-600 text-rose-600" : "text-slate-400"}`} />
                <span>{isLessonFavorite ? "مفضل" : "حفظ"}</span>
              </button>

              <button
                onClick={() => onNavigateToLab(selectedLesson.id)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer"
                title="تخطى مباشرة للمعمل التفاعلي ثلاثي الأبعاد لتجربة هذا الدرس"
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                <span>المعمل الافتراضي 3D 🧪</span>
              </button>

              <button
                onClick={() => setShowSummary(!showSummary)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans border transition-all cursor-pointer ${
                  showSummary
                    ? "bg-[#047857] text-white border-[#047857]"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {showSummary ? "عرض شرح الدرس" : "ملخص النقاط الذهبية"}
              </button>

              <button
                onClick={() => setIsFocusReading && setIsFocusReading(!isFocusReading)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1 cursor-pointer hidden sm:flex ${
                  isFocusReading
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
                title="تفعيل وضع ملء الشاشة لإخفاء القوائم الجانبية ومذاكرة مركزة"
              >
                {isFocusReading ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFocusReading ? "إنهاء التركيز" : "توسيع الشاشة"}</span>
              </button>
            </div>

            {/* 🎨 شريط أدوات وضع القراءة المريح والتظليل الذكي للأشياء الهامة */}
            <div className={`p-3 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
              readingTheme === "warm" 
                ? "bg-amber-50/70 border-amber-200/80 text-amber-950" 
                : readingTheme === "night" 
                ? "bg-slate-800/80 border-slate-700 text-slate-200" 
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}>
              {/* Right: Theme Selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold ml-1 font-sans flex items-center gap-1">
                  <ScrollText className="w-3.5 h-3.5 text-amber-700" />
                  <span>وضع القراءة:</span>
                </span>
                <button
                  onClick={() => setReadingTheme("warm")}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    readingTheme === "warm"
                      ? "bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs"
                      : "hover:bg-amber-100/50 text-slate-600 border border-transparent"
                  }`}
                  title="نمط ورقي دافئ مريح للعينين ومخصص للمذاكرة الممتدة"
                >
                  <span>📜</span>
                  <span>ورقي مريح</span>
                </button>
                <button
                  onClick={() => setReadingTheme("day")}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    readingTheme === "day"
                      ? "bg-white text-slate-900 border border-slate-300 shadow-2xs"
                      : "hover:bg-slate-200/50 text-slate-600 border border-transparent"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>نهاري</span>
                </button>
                <button
                  onClick={() => setReadingTheme("night")}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    readingTheme === "night"
                      ? "bg-slate-950 text-slate-100 border border-slate-600 shadow-2xs"
                      : "hover:bg-slate-200/50 text-slate-600 border border-transparent"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ليلي هادئ</span>
                </button>
              </div>

              {/* Center: Font Size Controls */}
              <div className="flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-slate-500 ml-1" />
                <button
                  onClick={() => setFontSize("sm")}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${fontSize === "sm" ? "bg-white border border-slate-300 shadow-2xs text-[#047857]" : "text-slate-500 hover:text-slate-800"}`}
                  title="خط صغير"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize("base")}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${fontSize === "base" ? "bg-white border border-slate-300 shadow-2xs text-[#047857]" : "text-slate-500 hover:text-slate-800"}`}
                  title="خط قياسي مريح"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize("lg")}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${fontSize === "lg" ? "bg-white border border-slate-300 shadow-2xs text-[#047857]" : "text-slate-500 hover:text-slate-800"}`}
                  title="خط كبير وواضح"
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize("xl")}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${fontSize === "xl" ? "bg-white border border-slate-300 shadow-2xs text-[#047857]" : "text-slate-500 hover:text-slate-800"}`}
                  title="خط فسيح جداً"
                >
                  A++
                </button>
              </div>

              {/* Left: Smart Highlighter Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSmartHighlight(!isSmartHighlight)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isSmartHighlight
                      ? "bg-amber-400 text-amber-950 ring-2 ring-amber-300 font-extrabold"
                      : "bg-slate-200/80 text-slate-600 hover:bg-slate-300"
                  }`}
                  title="تظليل المفاهيم الأساسية، التعليلات الوزارية، والمعادلات بأقلام التمييز الجامعية"
                >
                  <Highlighter className="w-3.5 h-3.5" />
                  <span>{isSmartHighlight ? "التظليل الذكي (مفعّل ✓)" : "تفعيل التظليل الذكي 🖍️"}</span>
                </button>
              </div>
            </div>

            {/* 💡 دليل أقلام التظليل الذكية (Highlighter Legend) */}
            {isSmartHighlight && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 px-3.5 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[11px]"
              >
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span>🖍️ دليل التظليل والتركيز الوزاري:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="flex items-center gap-1 text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    <span>مفاهيم وقوانين أساسية</span>
                  </span>
                  <span className="flex items-center gap-1 text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                    <span>تعليلات وزارية (علل)</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span>معادلات وشروط التفاعل</span>
                  </span>
                  <span className="flex items-center gap-1 text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                    <span>تنبيهات وملاحظات امتحانية</span>
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* 🔬 Featured Educational Diagram (Nano Banana Generated) */}
          {selectedLesson.image && (
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>رسم علمي توضيحي معتمد (نانو بنانا)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedImage(selectedLesson.image || null)}
                  className="text-[11px] font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                  title="تكبير الرسم التوضيحي بالدقة الكاملة"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تكبير الرسم التوضيحي 🔍</span>
                </button>
              </div>

              <div
                className="relative cursor-pointer group bg-slate-50/60 flex items-center justify-center p-2 sm:p-4 overflow-hidden"
                onClick={() => setExpandedImage(selectedLesson.image || null)}
              >
                <img
                  src={selectedLesson.image}
                  alt={selectedLesson.title}
                  className="w-full max-h-[380px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 border border-slate-200">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>انقر لتكبير المخطط بالدقة الكاملة 🔍</span>
                  </span>
                </div>
              </div>

              <div className="px-3.5 py-2.5 bg-emerald-50/40 border-t border-slate-100 flex items-center justify-between text-right text-xs text-slate-700 leading-relaxed font-sans">
                <div>
                  <span className="font-bold text-emerald-900 ml-1">موضوع الشكل:</span>
                  <span>{selectedLesson.subtitle || selectedLesson.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">NANO BANANA • 16:9 HD</span>
              </div>
            </div>
          )}

          {/* Lesson Main text OR Summary tab */}
          <AnimatePresence mode="wait">
            {!showSummary ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-4 text-slate-800 leading-relaxed text-sm text-right"
              >
                {/* Paragraphs with Chemical Formatting & Smart Highlighting */}
                {selectedLesson.content.map((para, idx) => (
                  <div
                    key={idx}
                    className={`font-sans transition-all duration-200 ${
                      fontSize === "sm"
                        ? "text-sm leading-relaxed"
                        : fontSize === "base"
                        ? "text-[15px] sm:text-[16px] leading-[1.85]"
                        : fontSize === "lg"
                        ? "text-[17px] sm:text-[18px] leading-[1.95]"
                        : "text-[19px] sm:text-[21px] leading-[2.15]"
                    } ${readingTheme === "warm" ? "text-[#292524]" : readingTheme === "night" ? "text-slate-100" : "text-slate-800"}`}
                    dangerouslySetInnerHTML={{ __html: applySmartHighlights(para, isSmartHighlight) }}
                  />
                ))}

                {/* Render Explanatory Illustrations if defined */}
                {selectedLesson.illustrations && selectedLesson.illustrations.length > 0 && (
                  <div className={`border-t pt-5 mt-5 space-y-4 ${readingTheme === "warm" ? "border-amber-200/60" : readingTheme === "night" ? "border-slate-800" : "border-slate-100"}`}>
                    <div className={`border-b pb-2 mb-3 ${readingTheme === "warm" ? "border-amber-200/60" : readingTheme === "night" ? "border-slate-800" : "border-slate-100"}`}>
                      <span className="text-[10px] text-[#047857] font-bold font-mono uppercase tracking-wider">
                        VISUAL CHEMICAL MODELS
                      </span>
                      <h3 className={`text-sm sm:text-base font-serif font-bold mt-0.5 ${readingTheme === "warm" ? "text-[#292524]" : readingTheme === "night" ? "text-slate-100" : "text-slate-800"}`}>
                        الرسومات والأشكال التوضيحية التفاعلية للدرس
                      </h3>
                    </div>

                    {selectedLesson.illustrations.map((ill, idx) => (
                      <div key={idx} className={`space-y-2.5 p-4 rounded-2xl border ${
                        readingTheme === "warm"
                          ? "bg-amber-50/40 border-amber-200/70"
                          : readingTheme === "night"
                          ? "bg-slate-800/60 border-slate-700"
                          : "bg-slate-50/80 border-slate-200"
                      }`}>
                        <span className="font-bold text-xs sm:text-sm text-[#047857] font-sans block">
                          {ill.title}
                        </span>
                        <p className={`text-[11px] sm:text-xs leading-relaxed max-w-2xl ${
                          readingTheme === "warm" ? "text-[#78716c]" : readingTheme === "night" ? "text-slate-400" : "text-slate-600"
                        }`}>
                          {ill.description}
                        </p>
                        <InteractiveDiagram type={ill.svgType} />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3.5 text-right"
              >
                <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-2.5">
                  <div className="flex-1 space-y-0.5">
                    <span className="font-bold text-xs sm:text-sm text-emerald-950 block font-sans">
                      ملخص النقاط الذهبية للدرس (مع التظليل الذكي)
                    </span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      ملخص موجز مصمم للمراجعة السريعة وتثبيت القوانين والمعادلات الكيميائية الأساسية قبل الامتحانات.
                    </p>
                  </div>
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {selectedLesson.summary.map((point, idx) => (
                    <div key={idx} className={`p-3.5 border rounded-xl space-y-1 ${
                      readingTheme === "warm"
                        ? "bg-white/80 border-amber-200/70 text-[#292524]"
                        : readingTheme === "night"
                        ? "bg-slate-800 border-slate-700 text-slate-100"
                        : "bg-slate-50 border-slate-200/80 text-slate-700"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-bold text-xs text-slate-700 font-sans">
                          نقطة تثبيت {idx + 1}
                        </span>
                      </div>
                      <p 
                        className={`text-xs leading-relaxed font-sans ${readingTheme === "warm" ? "text-[#292524]" : readingTheme === "night" ? "text-slate-200" : "text-slate-700"}`}
                        dangerouslySetInnerHTML={{ __html: applySmartHighlights(point, isSmartHighlight) }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🔄 Next & Previous Lesson Navigation Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            {prevLesson ? (
              <button
                onClick={() => {
                  setSelectedLesson(prevLesson);
                  setShowSummary(false);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">الدرس السابق:</span>
                <span>{prevLesson.title.split(":")[0]}</span>
              </button>
            ) : <div />}

            {nextLesson ? (
              <button
                onClick={() => {
                  setSelectedLesson(nextLesson);
                  setShowSummary(false);
                }}
                className="px-3 py-2 rounded-xl bg-[#047857] hover:bg-[#036549] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <span className="hidden sm:inline">الدرس التالي:</span>
                <span>{nextLesson.title.split(":")[0]}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setViewMode("grid")}
                className="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1"
              >
                <span>تمت جميع دروس الوحدة 🎉</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🖼️ High-Res Diagram Lightbox Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setExpandedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-right">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{selectedLesson.title}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                    رسم علمي معتمد
                  </span>
                </div>
                <button
                  onClick={() => setExpandedImage(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 sm:p-5 overflow-auto flex items-center justify-center bg-slate-100/50 max-h-[75vh]">
                <img
                  src={expandedImage}
                  alt={selectedLesson.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-sm border border-slate-200"
                />
              </div>

              <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>{selectedLesson.subtitle || selectedLesson.title}</span>
                <button
                  onClick={() => setExpandedImage(null)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  إغلاق النافذة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
