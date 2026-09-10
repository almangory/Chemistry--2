import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { curriculumData } from "../data/curriculum";
import { InteractiveDiagram } from "./InteractiveDiagram";
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
  ArrowRight
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
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                    isCurrent
                      ? "bg-emerald-50/40 border-emerald-500 shadow-xs"
                      : "bg-white border-slate-200 hover:border-emerald-400 shadow-xs"
                  }`}
                >
                  <div className="space-y-1.5">
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

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 font-sans leading-snug">
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
        <div className="bg-white border border-slate-200 p-4 sm:p-6 md:p-8 rounded-2xl space-y-5 shadow-xs w-full">
          {/* Header containing Actions and Lesson Titles */}
          <div className="border-b border-slate-100 pb-4 space-y-3.5">
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
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-slate-800 tracking-tight leading-snug">
                {selectedLesson.title}
              </h2>
              {selectedLesson.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
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
                title="تخطى مباشرة للمعمل التفاعلي لتجربة هذا الدرس"
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                <span>المعمل الافتراضي 🧪</span>
              </button>

              <button
                onClick={() => setShowSummary(!showSummary)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans border transition-all cursor-pointer ${
                  showSummary
                    ? "bg-[#047857] text-white border-[#047857]"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
          </div>

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
                {/* Paragraphs with Chemical Formatting */}
                {selectedLesson.content.map((para, idx) => (
                  <div
                    key={idx}
                    className="font-sans text-slate-800 leading-relaxed text-sm sm:text-[15px]"
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}

                {/* Render Explanatory Illustrations if defined */}
                {selectedLesson.illustrations && selectedLesson.illustrations.length > 0 && (
                  <div className="border-t border-slate-100 pt-5 mt-5 space-y-4">
                    <div className="border-b border-slate-100 pb-2 mb-3">
                      <span className="text-[10px] text-[#047857] font-bold font-mono uppercase tracking-wider">
                        VISUAL CHEMICAL MODELS
                      </span>
                      <h3 className="text-sm sm:text-base font-serif font-bold text-slate-800 mt-0.5">
                        الرسومات والأشكال التوضيحية التفاعلية للدرس
                      </h3>
                    </div>

                    {selectedLesson.illustrations.map((ill, idx) => (
                      <div key={idx} className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                        <span className="font-bold text-xs sm:text-sm text-[#047857] font-sans block">
                          {ill.title}
                        </span>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed max-w-2xl">
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
                      ملخص النقاط الذهبية للدرس
                    </span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      ملخص موجز مصمم للمراجعة السريعة وتثبيت القوانين والمعادلات الكيميائية الأساسية قبل الامتحانات.
                    </p>
                  </div>
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {selectedLesson.summary.map((point, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-bold text-xs text-slate-700 font-sans">
                          نقطة تثبيت {idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">{point}</p>
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
    </div>
  );
};
