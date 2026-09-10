import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { curriculumData } from "../data/curriculum";
import { InteractiveDiagram } from "./InteractiveDiagram";
import { 
  BookOpen, 
  CheckSquare, 
  Award, 
  AlertCircle, 
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
  FileText
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

  // Sync when selectedLessonId is passed externally (e.g. from Dashboard or Search)
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
    <div className="space-y-6 text-right" dir="rtl">
      {/* 🧭 Top Navigation: Unit Selector Ribbon (Clean, Sleek & Chemical Themed) */}
      <div className="bg-white dark:bg-[#1E1E24] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 md:p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#047857] dark:text-emerald-400" />
            <h2 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 font-sans">
              وحدات منهج الكيمياء - الصف الثاني الثانوي
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "reader" ? "grid" : "reader")}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{viewMode === "reader" ? "عرض فهرس دروس الوحدة" : "فتح قارئ الدرس"}</span>
            </button>
          </div>
        </div>

        {/* 6 Units Horizontal Scroll / Wrap Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          {curriculumData.map((unit) => {
            const isSelected = selectedUnit.id === unit.id;
            const unitLessonIds = unit.lessons.map(l => l.id);
            const doneCount = completedLessons.filter(id => unitLessonIds.includes(id)).length;
            const isAllDone = doneCount === unit.lessons.length;

            return (
              <button
                key={unit.id}
                onClick={() => selectUnit(unit)}
                className={`shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? "bg-[#047857] text-white border-[#047857] shadow-sm scale-[1.02]"
                    : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100"
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
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block">
                فهرس دروس الوحدة {selectedUnit.number}
              </span>
              <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200 font-serif">
                {selectedUnit.title}
              </h3>
            </div>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono font-bold bg-white dark:bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-700">
              {selectedUnit.lessons.length} دروس رسمية
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isCurrent
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500 shadow-sm"
                      : "bg-white dark:bg-[#1E1E24] border-slate-200 dark:border-slate-800 hover:border-emerald-400 shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        الدرس {idx + 1}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isFav && <span className="text-xs text-rose-500">❤️</span>}
                        {isRead ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            تمت دراسته
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-sans">غير منجز</span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans leading-snug">
                      {lesson.title}
                    </h4>

                    {lesson.subtitle && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans line-clamp-2">
                        {lesson.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToLab(lesson.id);
                      }}
                      className="text-[11px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>المعمل المرتبط</span>
                    </button>

                    <span className="text-[11px] font-bold text-[#047857] dark:text-emerald-400 flex items-center gap-0.5">
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
        <div className="bg-white dark:bg-[#1E1E24] border border-slate-200 dark:border-slate-800 p-5 md:p-8 rounded-2xl space-y-6 shadow-xs w-full">
          {/* Header containing Actions and Lesson Titles */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-4">
            {/* Quick unit pill and back to grid button */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-[#047857] text-white px-2.5 py-1 rounded-lg font-bold font-mono">
                  الوحدة {selectedUnit.number}: {selectedUnit.title}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  الدرس {selectedUnit.lessons.indexOf(selectedLesson) + 1} من {selectedUnit.lessons.length}
                </span>
              </div>

              <button
                onClick={() => setViewMode("grid")}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#047857] dark:hover:text-emerald-400 flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة لقائمة دروس الوحدة</span>
              </button>
            </div>

            {/* Lesson Title & Subtitle */}
            <div className="text-right space-y-1.5">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                {selectedLesson.title}
              </h2>
              {selectedLesson.subtitle && (
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  {selectedLesson.subtitle}
                </p>
              )}
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => toggleLessonComplete(selectedLesson.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLessonRead
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-[#047857] text-white hover:bg-[#036549] shadow-xs"
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>{isLessonRead ? "أتممت دراسة الدرس ✓" : "تحديد الدرس كمنجز ✓"}</span>
              </button>

              <button
                onClick={() => toggleLessonFavorite && toggleLessonFavorite(selectedLesson.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLessonFavorite
                    ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLessonFavorite ? "fill-rose-600 text-rose-600" : "text-slate-400"}`} />
                <span>{isLessonFavorite ? "مفضل" : "حفظ بالمفضلة"}</span>
              </button>

              <button
                onClick={() => onNavigateToLab(selectedLesson.id)}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100/80 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer"
                title="تخطى مباشرة للمعمل التفاعلي لتجربة هذا الدرس"
              >
                <FlaskConical className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>تجربة المعمل الافتراضي 🧪</span>
              </button>

              <button
                onClick={() => setShowSummary(!showSummary)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans border transition-all cursor-pointer ${
                  showSummary
                    ? "bg-[#047857] text-white border-[#047857]"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                {showSummary ? "عرض شرح الدرس كاملاً" : "عرض ملخص النقاط الذهبية"}
              </button>

              <button
                onClick={() => setIsFocusReading && setIsFocusReading(!isFocusReading)}
                className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  isFocusReading
                    ? "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/30 dark:text-amber-400"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
                title="تفعيل وضع ملء الشاشة لإخفاء القوائم الجانبية ومذاكرة مركزة"
              >
                {isFocusReading ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span>{isFocusReading ? "إنهاء التركيز" : "توسيع الشاشة"}</span>
              </button>
            </div>
          </div>

          {/* Lesson Main text OR Summary tab */}
          <AnimatePresence mode="wait">
            {!showSummary ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5 text-slate-800 dark:text-slate-200 leading-relaxed text-sm text-right"
              >
                {/* Paragraphs with Chemical Formatting */}
                {selectedLesson.content.map((para, idx) => (
                  <div
                    key={idx}
                    className="font-sans text-slate-800 dark:text-slate-200 leading-relaxed text-sm md:text-[15px]"
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}

                {/* Render Explanatory Illustrations if defined */}
                {selectedLesson.illustrations && selectedLesson.illustrations.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6 space-y-6">
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                      <span className="text-xs text-[#047857] dark:text-emerald-400 font-bold font-mono">
                        VISUAL CHEMICAL MODELS
                      </span>
                      <h3 className="text-md font-serif font-bold text-slate-900 dark:text-white mt-0.5">
                        الرسومات والأشكال التوضيحية التفاعلية للدرس
                      </h3>
                    </div>

                    {selectedLesson.illustrations.map((ill, idx) => (
                      <div key={idx} className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-sm text-[#047857] dark:text-emerald-400 font-sans block">
                          {ill.title}
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4 text-right"
              >
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <span className="font-bold text-sm text-emerald-900 dark:text-emerald-200 block font-sans">
                      ملخص النقاط الذهبية للدرس
                    </span>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                      ملخص موجز مصمم للمراجعة السريعة وتثبيت القوانين والمعادلات الكيميائية الأساسية قبل الامتحانات.
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                  {selectedLesson.summary.map((point, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-bold text-xs text-slate-700 dark:text-slate-300 font-sans">
                          نقطة تثبيت {idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">{point}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🔄 Next & Previous Lesson Navigation Bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            {prevLesson ? (
              <button
                onClick={() => {
                  setSelectedLesson(prevLesson);
                  setShowSummary(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الدرس السابق: {prevLesson.title.split(":")[0]}</span>
              </button>
            ) : <div />}

            {nextLesson ? (
              <button
                onClick={() => {
                  setSelectedLesson(nextLesson);
                  setShowSummary(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#047857] hover:bg-[#036549] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>الدرس التالي: {nextLesson.title.split(":")[0]}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setViewMode("grid")}
                className="px-4 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5"
              >
                <span>تمت جميع دروس هذه الوحدة 🎉</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
